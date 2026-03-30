import type { Unsubscribe } from "../types/unsubscribe";

// =============================================================================
// Realtime Voice Adapter
// =============================================================================

export namespace RealtimeVoiceAdapter {
  export type Status =
    | {
        type: "starting" | "running";
      }
    | {
        type: "ended";
        reason: "finished" | "cancelled" | "error";
        error?: unknown;
      };

  export type TranscriptItem = {
    role: "user" | "assistant";
    text: string;
    isFinal?: boolean;
  };

  export type Session = {
    status: Status;

    isMuted: boolean;

    disconnect: () => void;

    mute: () => void;
    unmute: () => void;

    onStatusChange: (callback: (status: Status) => void) => Unsubscribe;
    onTranscript: (
      callback: (transcript: TranscriptItem) => void,
    ) => Unsubscribe;
  };
}

export type RealtimeVoiceAdapter = {
  connect: (options: {
    abortSignal?: AbortSignal;
  }) => RealtimeVoiceAdapter.Session;
};
