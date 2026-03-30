import type { RealtimeVoiceAdapter } from "@assistant-ui/react";
import type { Unsubscribe } from "@assistant-ui/react";
import { VoiceConversation } from "@elevenlabs/client";

export type ElevenLabsVoiceAdapterOptions = {
  agentId: string;
};

/**
 * ElevenLabs Conversational AI adapter for assistant-ui.
 *
 * Uses the ElevenLabs VoiceConversation SDK for real-time
 * bidirectional voice with an ElevenLabs Agent.
 *
 * @see https://elevenlabs.io/docs/agents-platform/libraries/java-script
 */
export class ElevenLabsVoiceAdapter implements RealtimeVoiceAdapter {
  private _agentId: string;

  constructor(options: ElevenLabsVoiceAdapterOptions) {
    this._agentId = options.agentId;
  }

  connect(options: {
    abortSignal?: AbortSignal;
  }): RealtimeVoiceAdapter.Session {
    const statusCallbacks = new Set<
      (status: RealtimeVoiceAdapter.Status) => void
    >();
    const transcriptCallbacks = new Set<
      (transcript: RealtimeVoiceAdapter.TranscriptItem) => void
    >();

    let currentStatus: RealtimeVoiceAdapter.Status = { type: "starting" };
    let isMuted = false;
    let conversation: VoiceConversation | null = null;
    let disposed = false;

    const updateStatus = (status: RealtimeVoiceAdapter.Status) => {
      if (disposed) return;
      currentStatus = status;
      for (const cb of statusCallbacks) cb(status);
    };

    const cleanup = () => {
      disposed = true;
      conversation = null;
      statusCallbacks.clear();
      transcriptCallbacks.clear();
    };

    const session: RealtimeVoiceAdapter.Session = {
      get status() {
        return currentStatus;
      },
      get isMuted() {
        return isMuted;
      },

      disconnect: () => {
        conversation?.endSession();
        cleanup();
      },

      mute: () => {
        conversation?.setMicMuted(true);
        isMuted = true;
      },

      unmute: () => {
        conversation?.setMicMuted(false);
        isMuted = false;
      },

      onStatusChange: (
        callback: (status: RealtimeVoiceAdapter.Status) => void,
      ): Unsubscribe => {
        statusCallbacks.add(callback);
        return () => {
          statusCallbacks.delete(callback);
        };
      },

      onTranscript: (
        callback: (transcript: RealtimeVoiceAdapter.TranscriptItem) => void,
      ): Unsubscribe => {
        transcriptCallbacks.add(callback);
        return () => {
          transcriptCallbacks.delete(callback);
        };
      },
    };

    // Handle abort signal
    const abortHandler = () => {
      conversation?.endSession();
      cleanup();
    };
    if (options.abortSignal) {
      options.abortSignal.addEventListener("abort", abortHandler, {
        once: true,
      });
    }

    // Start session asynchronously
    const doConnect = async () => {
      try {
        if (disposed) return;

        conversation = await VoiceConversation.startSession({
          agentId: this._agentId,
          onConnect: () => {
            updateStatus({ type: "running" });
          },
          onDisconnect: () => {
            updateStatus({
              type: "ended",
              reason: "finished",
            });
            cleanup();
          },
          onError: (message, context) => {
            console.error("ElevenLabs voice error:", message, context);
            updateStatus({
              type: "ended",
              reason: "error",
              error: new Error(message),
            });
            cleanup();
          },
          onMessage: (message) => {
            if (disposed) return;
            const role = message.role === "user" ? "user" : "assistant";
            for (const cb of transcriptCallbacks) {
              cb({
                role,
                text: message.message,
                isFinal: true,
              });
            }
          },
        });
      } catch (error) {
        updateStatus({
          type: "ended",
          reason: "error",
          error,
        });
        cleanup();
      }
    };

    doConnect();

    return session;
  }
}
