// ZoneWise Dify Adapter for assistant-ui
// Connects assistant-ui chat to Dify Service API on Hetzner
// Used in zonewise-web Sprint 3

import type { ChatModelAdapter } from "@assistant-ui/react";

const DIFY_API_URL = process.env.NEXT_PUBLIC_DIFY_API_URL || "http://87.99.129.125:3100/api";
const DIFY_API_KEY = process.env.DIFY_API_KEY || "";

export const zonewiseDifyAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n");

    const response = await fetch(`${DIFY_API_URL}/v1/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query: userQuery,
        response_mode: "streaming",
        user: "zonewise-user",
      }),
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          if (parsed.event === "message" && parsed.answer) {
            yield {
              content: [{ type: "text" as const, text: parsed.answer }],
            };
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  },
};

// ZoneWise custom tools for assistant-ui
export const ZONEWISE_TOOLS = {
  zoning_lookup: {
    description: "Look up zoning information for a Florida address",
    parameters: {
      address: { type: "string", description: "Street address" },
      city: { type: "string", description: "City name" },
    },
  },
  parcel_info: {
    description: "Get parcel details from BCPAO GIS",
    parameters: {
      parcel_id: { type: "string", description: "Brevard County parcel ID" },
    },
  },
  zoning_report: {
    description: "Generate a PDF zoning report for a property",
    parameters: {
      address: { type: "string", description: "Full property address" },
    },
  },
};
