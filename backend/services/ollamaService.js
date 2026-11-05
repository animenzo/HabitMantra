/**
 * Shared Ollama Client Service
 * Fully supports Ollama Cloud (https://ollama.com/v1) with Bearer API Key authentication
 * as well as local Ollama instances (http://localhost:11434).
 */

function getOllamaConfig() {
  const url = (process.env.OLLAMA_URL || "https://ollama.com/v1").trim().replace(/\/+$/, "");
  // Default to gemma4:31b for Ollama Cloud, or qwen2.5:1.5b for local
  const isCloud = url.includes("ollama.com") || url.includes("/v1");
  const model = (process.env.OLLAMA_MODEL || (isCloud ? "gemma4:31b" : "qwen2.5:1.5b")).trim();
  const apiKey = (process.env.OLLAMA_API_KEY || "").trim();

  return { url, isCloud, model, apiKey };
}

/**
 * Call Ollama Chat (Cloud or Local)
 * @param {Object} options
 * @param {Array} options.messages - Array of { role, content } objects
 * @param {string} [options.format] - "json" if structured JSON output is required
 * @param {number} [options.temperature=0.4]
 * @param {number} [options.top_p=0.9]
 * @param {number} [options.max_tokens]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<string>} The assistant's text reply
 */
async function callOllamaChat({
  messages,
  format = null,
  temperature = 0.4,
  top_p = 0.9,
  max_tokens = null,
  signal = null,
}) {
  const { url, isCloud, model, apiKey } = getOllamaConfig();

  // Construct target endpoint
  let endpoint = url;
  if (isCloud) {
    if (!endpoint.endsWith("/chat/completions")) {
      endpoint = `${endpoint}/chat/completions`;
    }
  } else {
    endpoint = `${endpoint}/api/chat`;
  }

  // Construct headers
  const headers = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  // Construct payload based on protocol
  const payload = isCloud
    ? {
        model,
        messages,
        temperature,
        top_p,
        stream: false,
        ...(max_tokens ? { max_tokens } : {}),
        ...(format === "json" ? { response_format: { type: "json_object" } } : {}),
      }
    : {
        model,
        messages,
        stream: false,
        ...(format ? { format } : {}),
        options: {
          temperature,
          top_p,
          ...(max_tokens ? { num_predict: max_tokens } : {}),
        },
      };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    signal,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama Cloud request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Extract reply from either OpenAI chat completion format or Ollama native format
  const content =
    data?.choices?.[0]?.message?.content ??
    data?.message?.content ??
    "";

  return typeof content === "string" ? content.trim() : "";
}

module.exports = {
  getOllamaConfig,
  callOllamaChat,
};

