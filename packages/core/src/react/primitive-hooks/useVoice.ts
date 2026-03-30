import { useAui, useAuiState } from "@assistant-ui/store";
import type { VoiceSessionState } from "../../runtime/interfaces/thread-runtime-core";

export const useVoiceState = (): VoiceSessionState | undefined => {
  return useAuiState((s) => s.thread.voice);
};

export const useVoiceControls = () => {
  const aui = useAui();

  return {
    connect: () => {
      aui.thread().connectVoice();
    },
    disconnect: () => {
      aui.thread().disconnectVoice();
    },
    mute: () => {
      aui.thread().muteVoice();
    },
    unmute: () => {
      aui.thread().unmuteVoice();
    },
  };
};
