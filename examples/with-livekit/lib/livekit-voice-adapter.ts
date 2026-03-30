import type { RealtimeVoiceAdapter } from "@assistant-ui/react";
import type { Unsubscribe } from "@assistant-ui/react";
import { Room, RoomEvent, type RoomOptions } from "livekit-client";

export type LiveKitVoiceAdapterOptions = {
  url: string;
  token: string | (() => Promise<string>);
  roomOptions?: RoomOptions;
};

export class LiveKitVoiceAdapter implements RealtimeVoiceAdapter {
  private _url: string;
  private _token: string | (() => Promise<string>);
  private _roomOptions: RoomOptions | undefined;

  constructor(options: LiveKitVoiceAdapterOptions) {
    this._url = options.url;
    this._token = options.token;
    this._roomOptions = options.roomOptions;
  }

  connect(options: {
    abortSignal?: AbortSignal;
  }): RealtimeVoiceAdapter.Session {
    const room = new Room(this._roomOptions);

    const statusCallbacks = new Set<
      (status: RealtimeVoiceAdapter.Status) => void
    >();
    const transcriptCallbacks = new Set<
      (transcript: RealtimeVoiceAdapter.TranscriptItem) => void
    >();

    let currentStatus: RealtimeVoiceAdapter.Status = { type: "starting" };
    let isMuted = false;
    let disposed = false;

    const updateStatus = (status: RealtimeVoiceAdapter.Status) => {
      if (disposed) return;
      currentStatus = status;
      for (const cb of statusCallbacks) cb(status);
    };

    const cleanup = () => {
      disposed = true;
      room.removeAllListeners();
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
        room.disconnect();
        cleanup();
      },

      mute: () => {
        room.localParticipant.setMicrophoneEnabled(false).catch((error) => {
          console.error("LiveKit: failed to mute microphone", error);
        });
        isMuted = true;
      },

      unmute: () => {
        room.localParticipant.setMicrophoneEnabled(true).catch((error) => {
          console.error("LiveKit: failed to unmute microphone", error);
        });
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

    // Wire up room events
    room.on(RoomEvent.Connected, () => {
      updateStatus({ type: "running" });
    });

    room.on(RoomEvent.Disconnected, (reason) => {
      updateStatus({
        type: "ended",
        reason: "finished",
        error: reason,
      });
      cleanup();
    });

    room.on(RoomEvent.MediaDevicesError, (error) => {
      updateStatus({
        type: "ended",
        reason: "error",
        error,
      });
      cleanup();
    });

    room.on(
      RoomEvent.TranscriptionReceived,
      (segments, participant, _publication) => {
        if (disposed) return;
        const role =
          participant === room.localParticipant ? "user" : "assistant";
        for (const segment of segments) {
          for (const cb of transcriptCallbacks) {
            cb({
              role,
              text: segment.text,
              isFinal: segment.final,
            });
          }
        }
      },
    );

    // Handle abort signal
    const abortHandler = () => {
      room.disconnect();
      cleanup();
    };
    if (options.abortSignal) {
      options.abortSignal.addEventListener("abort", abortHandler, {
        once: true,
      });
    }

    // Connect asynchronously
    const doConnect = async () => {
      try {
        const token =
          typeof this._token === "function" ? await this._token() : this._token;

        if (disposed) return;

        await room.connect(this._url, token);

        if (disposed) return;

        await room.localParticipant.setMicrophoneEnabled(true);
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
