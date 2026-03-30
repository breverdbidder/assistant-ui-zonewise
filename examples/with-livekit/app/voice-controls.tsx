"use client";

import { useVoiceState, useVoiceControls } from "@assistant-ui/react";
import { MicIcon, MicOffIcon, PhoneIcon, PhoneOffIcon } from "lucide-react";

export function VoiceControls() {
  const voiceState = useVoiceState();
  const { connect, disconnect, mute, unmute } = useVoiceControls();

  const isConnected = voiceState?.status.type === "running";
  const isConnecting = voiceState?.status.type === "starting";
  const isMuted = voiceState?.isMuted ?? false;

  return (
    <div className="flex items-center gap-2 border-b px-4 py-2">
      <span className="mr-2 text-muted-foreground text-sm">
        Voice:{" "}
        {isConnecting
          ? "Connecting..."
          : isConnected
            ? "Connected"
            : "Disconnected"}
      </span>

      {!isConnected && !isConnecting && (
        <button
          type="button"
          onClick={() => connect()}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-primary-foreground text-sm hover:bg-primary/90"
        >
          <PhoneIcon className="size-4" />
          Connect
        </button>
      )}

      {(isConnected || isConnecting) && (
        <>
          <button
            type="button"
            onClick={() => (isMuted ? unmute() : mute())}
            disabled={!isConnected}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
          >
            {isMuted ? (
              <MicOffIcon className="size-4" />
            ) : (
              <MicIcon className="size-4" />
            )}
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            onClick={() => disconnect()}
            className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-sm text-white hover:bg-destructive/90"
          >
            <PhoneOffIcon className="size-4" />
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
