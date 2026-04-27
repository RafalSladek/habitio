// @ts-check
const { test, expect, STORAGE_VERSION } = require("./test-helpers");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function cloneResponse(response) {
  return response ? response.clone() : undefined;
}

function createServiceWorkerHarness({
  cacheEntries = {},
  fetchImpl = async () => {
    throw new Error("Unexpected fetch");
  },
} = {}) {
  /** @type {Record<string, Function[]>} */
  const listeners = {};
  /** @type {Map<string, Map<string, Response>>} */
  const cacheBuckets = new Map();

  const defaultCache = new Map(
    Object.entries(cacheEntries).map(([url, body]) => [
      url,
      new Response(body, { status: 200, headers: { "Content-Type": "text/plain" } }),
    ])
  );
  cacheBuckets.set(STORAGE_VERSION, defaultCache);

  const cachesApi = {
    async open(name) {
      if (!cacheBuckets.has(name)) cacheBuckets.set(name, new Map());
      const bucket = cacheBuckets.get(name);
      return {
        async match(request) {
          return cloneResponse(bucket.get(request.url));
        },
        async put(request, response) {
          bucket.set(request.url, response.clone());
        },
        async addAll(entries) {
          for (const entry of entries) {
            const url = new URL(entry, "https://example.com/").toString();
            bucket.set(url, new Response(`precached:${entry}`, { status: 200 }));
          }
        },
      };
    },
    async match(request) {
      for (const bucket of cacheBuckets.values()) {
        if (bucket.has(request.url)) return cloneResponse(bucket.get(request.url));
      }
      return undefined;
    },
    async keys() {
      return Array.from(cacheBuckets.keys());
    },
    async delete(name) {
      return cacheBuckets.delete(name);
    },
  };

  const sandbox = {
    URL,
    Response,
    Promise,
    caches: cachesApi,
    location: { origin: "https://example.com" },
    fetch(request) {
      const promise = Promise.resolve().then(() => fetchImpl(request));
      promise.catch(() => {});
      return promise;
    },
    addEventListener(type, handler) {
      listeners[type] = listeners[type] || [];
      listeners[type].push(handler);
    },
    skipWaiting() {},
    clients: { claim() {} },
    console,
  };
  sandbox.globalThis = sandbox;

  const source = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
  vm.runInNewContext(source, sandbox);

  return {
    async dispatchFetch(url, init = {}) {
      const request = {
        url,
        method: init.method || "GET",
        mode: init.mode || "same-origin",
      };
      /** @type {Promise<unknown>[]} */
      const waitUntilPromises = [];
      /** @type {Promise<Response> | undefined} */
      let responsePromise;
      const event = {
        request,
        respondWith(promise) {
          responsePromise = Promise.resolve(promise);
        },
        waitUntil(promise) {
          waitUntilPromises.push(Promise.resolve(promise));
        },
      };

      for (const handler of listeners.fetch || []) {
        handler(event);
      }

      const response = await responsePromise;
      await Promise.allSettled(waitUntilPromises);
      return response;
    },
    async readCachedText(url, cacheName = STORAGE_VERSION) {
      const bucket = cacheBuckets.get(cacheName);
      const response = bucket?.get(url);
      return response ? response.clone().text() : undefined;
    },
  };
}

test.describe("service worker app shell caching", () => {
  const onlineCases = [
    {
      name: "navigation requests prefer the network response when online",
      url: "https://example.com/",
      mode: "navigate",
      cached: "<html>old</html>",
      fresh: "<html>new</html>",
    },
    {
      name: "translation assets prefer the network response when online",
      url: "https://example.com/i18n.js",
      mode: "same-origin",
      cached: "const T = { en: { welcome: 'old' } };",
      fresh: "const T = { en: { welcome: 'new' } };",
    },
  ];

  for (const scenario of onlineCases) {
    test(scenario.name, async () => {
      const harness = createServiceWorkerHarness({
        cacheEntries: {
          [scenario.url]: scenario.cached,
        },
        fetchImpl: async (request) =>
          new Response(request.url === scenario.url ? scenario.fresh : "unexpected", {
            status: 200,
            headers: { "Content-Type": "text/plain" },
          }),
      });

      const response = await harness.dispatchFetch(scenario.url, { mode: scenario.mode });

      await expect(response.text()).resolves.toBe(scenario.fresh);
      await expect(harness.readCachedText(scenario.url)).resolves.toBe(scenario.fresh);
    });
  }

  test("app shell falls back to cache when offline", async () => {
    const url = "https://example.com/app.js";
    const harness = createServiceWorkerHarness({
      cacheEntries: {
        [url]: "console.log('cached');",
      },
      fetchImpl: async () => {
        throw new Error("offline");
      },
    });

    const response = await harness.dispatchFetch(url, { mode: "same-origin" });

    await expect(response.text()).resolves.toBe("console.log('cached');");
  });
});
