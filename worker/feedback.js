const REPO = "RafalSladek/habitio";
const MIN_LEN = 10;
const MAX_LEN = 2000;
const VALID_TYPES = new Set(["bug", "wish", "feature"]);
const ALLOWED_ORIGINS = new Set([
  "https://habitio.rafal-sladek.com",
  "https://rafalsladek.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const COACH_DEVICE_RE = /^[a-zA-Z0-9_-]{8,64}$/;
const MODEL_DEFAULT = "@cf/meta/llama-3.1-8b-instruct-fast";
const budgetCache = new Map();

function getOrigin(request) {
  return request.headers.get("Origin") || "";
}

function corsHeaders(request) {
  const origin = getOrigin(request);
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://habitio.rafal-sladek.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getCoachConfig(env) {
  return {
    model: env.COACH_MODEL || MODEL_DEFAULT,
    maxDailyRequests: parsePositiveInt(env.COACH_MAX_DAILY_REQUESTS, 5),
    maxDailyEstimatedTokens: parsePositiveInt(env.COACH_MAX_DAILY_ESTIMATED_TOKENS, 4500),
    maxInputChars: parsePositiveInt(env.COACH_MAX_INPUT_CHARS, 4000),
    maxOutputTokens: parsePositiveInt(env.COACH_MAX_OUTPUT_TOKENS, 220),
  };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function budgetKey(deviceId) {
  return `coach:${todayKey()}:${deviceId}`;
}

async function readBudget(env, key) {
  if (env.COACH_BUDGETS && typeof env.COACH_BUDGETS.get === "function") {
    const raw = await env.COACH_BUDGETS.get(key);
    if (!raw) return { requests: 0, estimatedTokens: 0 };
    try {
      const parsed = JSON.parse(raw);
      return {
        requests: Number(parsed.requests) || 0,
        estimatedTokens: Number(parsed.estimatedTokens) || 0,
      };
    } catch {
      return { requests: 0, estimatedTokens: 0 };
    }
  }
  return budgetCache.get(key) || { requests: 0, estimatedTokens: 0 };
}

async function writeBudget(env, key, value) {
  if (env.COACH_BUDGETS && typeof env.COACH_BUDGETS.put === "function") {
    await env.COACH_BUDGETS.put(key, JSON.stringify(value), {
      expirationTtl: 60 * 60 * 30,
    });
    return;
  }
  budgetCache.set(key, value);
}

function estimateTokensFromText(text) {
  return Math.max(1, Math.ceil(String(text || "").length / 4));
}

function coachLanguageLabel(summary) {
  const explicit = String(summary?.reply_language || "").trim();
  if (explicit) return explicit;

  const labels = {
    en: "English",
    de: "German",
    pl: "Polish",
    pt: "Portuguese",
    ru: "Russian",
    fr: "French",
    hi: "Hindi",
    uk: "Ukrainian",
    ar: "Arabic",
    sq: "Albanian",
    sr: "Serbian",
    bar: "Bavarian",
  };
  return labels[String(summary?.ui_language || "").trim()] || "English";
}

function normalizeCoachResponse(payload) {
  const raw =
    payload?.response && typeof payload.response === "object" ? payload.response : payload;
  const encouragement = String(raw?.encouragement || "").trim();
  const candidFeedback = String(raw?.candid_feedback || raw?.candidFeedback || "").trim();
  const nextSteps = Array.isArray(raw?.next_steps || raw?.nextSteps)
    ? (raw.next_steps || raw.nextSteps)
        .map((step) => String(step || "").trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];
  if (!encouragement || !candidFeedback || nextSteps.length === 0) {
    return null;
  }
  return { encouragement, candid_feedback: candidFeedback, next_steps: nextSteps };
}

async function handleFeedback(request, env, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, cors);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse({ error: "Invalid request body" }, 400, cors);
  }

  const { type, message, rating, version, lang, name, buildSha } = body;

  if (!message || typeof message !== "string") {
    return jsonResponse({ error: "Message is required" }, 400, cors);
  }
  const text = message.trim();
  if (text.length < MIN_LEN) {
    return jsonResponse({ error: "Message too short" }, 400, cors);
  }
  if (text.length > MAX_LEN) {
    return jsonResponse({ error: "Message too long" }, 400, cors);
  }

  // Detect and reject test requests to prevent creating GitHub issues from test runs
  const userAgent = request.headers.get("User-Agent") || "";
  const isPlaywright = userAgent.includes("Playwright") || userAgent.includes("HeadlessChrome");
  const isTestMessage = /^This is a test/i.test(text) || text.includes("[PLAYWRIGHT_TEST]");
  
  if (isPlaywright || isTestMessage) {
    // Pretend success for tests but don't create an issue
    return jsonResponse({ url: "https://github.com/RafalSladek/habitio/issues/1", number: 1 }, 201, cors);
  }

  const issueType = VALID_TYPES.has(type) ? type : "feedback";
  const title = `[${issueType}] ${text.slice(0, 72)}${text.length > 72 ? "…" : ""}`;
  const issueBody = [
    `**Type:** ${issueType}`,
    "",
    "**Message:**",
    text,
    "",
    "---",
    rating
      ? `**Rating:** ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)`
      : "**Rating:** not rated",
    `**App version:** ${version || "unknown"}`,
    `**Build:** ${typeof buildSha === "string" && buildSha.trim() && !buildSha.startsWith("__") ? buildSha : "dev"}`,
    `**Language:** ${lang || "unknown"}`,
    `**User:** ${typeof name === "string" && name.trim() ? name.trim().slice(0, 100) : "anonymous"}`,
    "_Submitted via in-app feedback_",
  ].join("\n");

  const labels = ["feedback", issueType];
  if (rating) labels.push("rating-" + rating + "⭐");

  const ghRes = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "habitio-feedback-worker/1.0",
    },
    body: JSON.stringify({ title, body: issueBody, labels, assignees: ["RafalSladek"] }),
  });

  if (!ghRes.ok) {
    const err = await ghRes.text();
    console.error("GitHub API error:", ghRes.status, err);
    return jsonResponse({ error: "Failed to create issue" }, 502, cors);
  }

  const issue = await ghRes.json();
  return jsonResponse({ url: issue.html_url, number: issue.number }, 201, cors);
}

async function handleCoach(request, env, cors) {
  if (!env.AI || typeof env.AI.run !== "function") {
    return jsonResponse({ error: "AI binding is not configured" }, 503, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, cors);
  }

  const { deviceId, focus, summary } = body || {};
  if (!deviceId || typeof deviceId !== "string" || !COACH_DEVICE_RE.test(deviceId)) {
    return jsonResponse({ error: "Invalid device identifier" }, 400, cors);
  }
  if (!summary || typeof summary !== "object") {
    return jsonResponse({ error: "Summary is required" }, 400, cors);
  }
  if (focus !== undefined && typeof focus !== "string") {
    return jsonResponse({ error: "Focus must be a string" }, 400, cors);
  }

  const config = getCoachConfig(env);
  const summaryText = JSON.stringify(summary);
  const focusText = typeof focus === "string" ? focus.trim().slice(0, 280) : "";

  if (summaryText.length > config.maxInputChars) {
    return jsonResponse({ error: "Summary is too large" }, 413, cors);
  }

  const recordKey = budgetKey(deviceId);
  const budget = await readBudget(env, recordKey);
  const estimatedPromptTokens =
    estimateTokensFromText(summaryText) + estimateTokensFromText(focusText) + 180;
  const estimatedTotalTokens = estimatedPromptTokens + config.maxOutputTokens;

  if (budget.requests >= config.maxDailyRequests) {
    return jsonResponse(
      {
        error: "Daily request limit reached",
        code: "daily_request_limit",
        budget: {
          requestsUsed: budget.requests,
          requestsLimit: config.maxDailyRequests,
          estimatedTokensUsed: budget.estimatedTokens,
          estimatedTokensLimit: config.maxDailyEstimatedTokens,
        },
      },
      429,
      cors
    );
  }

  if (budget.estimatedTokens + estimatedTotalTokens > config.maxDailyEstimatedTokens) {
    return jsonResponse(
      {
        error: "Daily token budget reached",
        code: "daily_token_limit",
        budget: {
          requestsUsed: budget.requests,
          requestsLimit: config.maxDailyRequests,
          estimatedTokensUsed: budget.estimatedTokens,
          estimatedTokensLimit: config.maxDailyEstimatedTokens,
        },
      },
      429,
      cors
    );
  }

  const replyLanguage = coachLanguageLabel(summary);
  const systemPrompt = [
    "You are an encouraging but candid habit coach inside a privacy-first habit tracker.",
    `Reply only in ${replyLanguage}.`,
    "Be warm, honest, specific, and concise.",
    "Use evidence-based habit coaching principles such as consistency, small steps, cue design, friction reduction, recovery after missed days, and environment design.",
    "Praise real progress without exaggerating.",
    "Point out the single most important pattern that is holding the user back, but do not shame them.",
    "Make the advice habit-specific and grounded only in the provided summary.",
    "Give at most 3 concrete next steps that are small enough to act on today or this week.",
    "Keep encouragement and candid_feedback short: no fluff, no repetition, no long preambles.",
    "Do not invent studies, statistics, or personal facts that are not present in the input.",
    "Do not give medical, legal, or crisis advice.",
  ].join(" ");
  const userPrompt = JSON.stringify({
    request: focusText || "Give me encouraging but candid feedback about my habit progress.",
    summary,
  });

  let result;
  try {
    result = await env.AI.run(config.model, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: config.maxOutputTokens,
      response_format: {
        type: "json_schema",
        json_schema: {
          type: "object",
          properties: {
            encouragement: { type: "string", maxLength: 320 },
            candid_feedback: { type: "string", maxLength: 360 },
            next_steps: {
              type: "array",
              items: { type: "string", maxLength: 120 },
              minItems: 1,
              maxItems: 3,
            },
          },
          required: ["encouragement", "candid_feedback", "next_steps"],
        },
      },
    });
  } catch (error) {
    console.error("Workers AI error:", error);
    return jsonResponse({ error: "Failed to generate coach feedback" }, 502, cors);
  }

  const feedback = normalizeCoachResponse(result);
  if (!feedback) {
    console.error("Unexpected coach payload:", JSON.stringify(result));
    return jsonResponse({ error: "Invalid coach response" }, 502, cors);
  }

  const updatedBudget = {
    requests: budget.requests + 1,
    estimatedTokens: budget.estimatedTokens + estimatedTotalTokens,
  };
  await writeBudget(env, recordKey, updatedBudget);

  return jsonResponse(
    {
      feedback,
      budget: {
        requestsUsed: updatedBudget.requests,
        requestsLimit: config.maxDailyRequests,
        estimatedTokensUsed: updatedBudget.estimatedTokens,
        estimatedTokensLimit: config.maxDailyEstimatedTokens,
      },
      model: config.model,
    },
    200,
    cors
  );
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request);
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, cors);
    }
    if (getOrigin(request) && !ALLOWED_ORIGINS.has(getOrigin(request))) {
      return jsonResponse({ error: "Origin not allowed" }, 403, cors);
    }

    if (pathname === "/coach") return handleCoach(request, env, cors);
    if (pathname === "/" || pathname === "/feedback") return handleFeedback(request, env, cors);
    return jsonResponse({ error: "Not found" }, 404, cors);
  },
};
