"use client";

import { Thread } from "@/components/assistant-ui/thread";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { LiveKitVoiceAdapter } from "@/lib/livekit-voice-adapter";
import { VoiceControls } from "./voice-controls";

export default function Home() {
  const runtime = useChatRuntime({
    adapters: {
      voice: new LiveKitVoiceAdapter({
        url: process.env.NEXT_PUBLIC_LIVEKIT_URL ?? "ws://localhost:7880",
        token: async () => {
          const res = await fetch("/api/livekit-token", { method: "POST" });
          const { token } = await res.json();
          return token;
        },
      }),
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full flex-col">
        <VoiceControls />
        <div className="min-h-0 flex-1">
          <Thread />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}
