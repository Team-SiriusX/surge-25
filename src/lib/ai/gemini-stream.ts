const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn("[gemini-stream] Missing GOOGLE_GEMINI_API_KEY env value");
  }
}

const GEMINI_API_ENDPOINT = process.env.GOOGLE_GEMINI_API_ENDPOINT || "https://generativelanguage.googleapis.com/v1";

export const GEMINI_CHAT_MODEL = "gemini-2.5-flash";

export const GEMINI_CHAT_MODEL_CANDIDATES = [
  "gemini-2.5-flash"
];

type GeminiStreamParams = {
  model: string;
  messages: { role: "user" | "assistant"; content: string }[];
  systemInstruction?: string;
};

export async function streamGeminiChat({ model, messages, systemInstruction }: GeminiStreamParams): Promise<ReadableStream> {
  if (!apiKey) {
    throw Object.assign(new Error("Missing GOOGLE_GEMINI_API_KEY"), { status: 500 });
  }

  const url = `${GEMINI_API_ENDPOINT}/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;

  // Convert messages to Gemini format
  let contents = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  // If system instruction is provided, prepend it as the first user message
  if (systemInstruction) {
    contents = [
      {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will act as your career advisor and provide personalized profile advice based on the information you've shared." }],
      },
      ...contents,
    ];
  }

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail: any = null;
    try {
      detail = await response.json();
    } catch (err) {
      detail = null;
    }

    const message =
      detail?.error?.message || detail?.message || `${response.statusText} (model: ${model})`;

    throw Object.assign(new Error(message), {
      status: response.status,
      detail,
    });
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  // Transform SSE stream to plain text stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(new TextEncoder().encode(text));
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
