"use client";

import { Thread } from "@/components/assistant-ui/thread";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ElevenLabsVoiceAdapter } from "@/lib/elevenlabs-voice-adapter";
import { VoiceControls } from "./voice-controls";

export default function Home() {
  const runtime = useChatRuntime({
    adapters: {
      voice: new ElevenLabsVoiceAdapter({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "",
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
