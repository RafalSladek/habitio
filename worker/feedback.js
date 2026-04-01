const REPO = "RafalSladek/habitio";
const ALLOWED_ORIGINS = [
  "https://habitio.rafal-sladek.com",
  "https://rafalsladek.github.io",
];
const MIN_LEN = 10;
const MAX_LEN = 2000;
const VALID_TYPES = new Set(["bug", "wish", "feature"]);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, cors);
    }

    const { type, message, rating, version, lang } = body;

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
      `**Language:** ${lang || "unknown"}`,
      "_Submitted via in-app feedback_",
    ].join("\n");

    const ghRes = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "habitio-feedback-worker/1.0",
      },
      body: JSON.stringify({ title, body: issueBody, labels: ["feedback"] }),
    });

    if (!ghRes.ok) {
      const err = await ghRes.text();
      console.error("GitHub API error:", ghRes.status, err);
      return jsonResponse({ error: "Failed to create issue" }, 502, cors);
    }

    const issue = await ghRes.json();
    return jsonResponse({ url: issue.html_url, number: issue.number }, 201, cors);
  },
};
