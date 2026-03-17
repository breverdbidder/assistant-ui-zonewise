import {
  useCallback,
  useDebugValue,
  useRef,
  useSyncExternalStore,
} from "react";
import type { AssistantState } from "./types/client";
import { useAui } from "./useAui";
import { getProxiedAssistantState } from "./utils/proxied-assistant-state";

/**
 * Hook to access a slice of the assistant state with automatic subscription
 *
 * @param selector - Function to select a slice of the state
 * @returns The selected state slice
 *
 * @example
 * ```typescript
 * const aui = useAui({
 *   foo: RootScope({ ... }),
 * });
 *
 * const bar = useAuiState((s) => s.foo.bar);
 * ```
 */
export const useAuiState = <T>(selector: (state: AssistantState) => T): T => {
  const aui = useAui();
  const proxiedState = getProxiedAssistantState(aui);
  const cacheRef = useRef<{
    selector: ((state: AssistantState) => T) | undefined;
    hasValue: boolean;
    value: T | undefined;
  }>({
    selector: undefined,
    hasValue: false,
    value: undefined,
  });

  const getSnapshot = () => {
    if (cacheRef.current.hasValue && cacheRef.current.selector === selector) {
      return cacheRef.current.value as T;
    }

    const nextValue = selector(proxiedState);
    cacheRef.current = {
      selector,
      hasValue: true,
      value: nextValue,
    };
    return nextValue;
  };

  const subscribe = useCallback(
    (callback: () => void) =>
      aui.subscribe(() => {
        cacheRef.current.hasValue = false;
        callback();
      }),
    [aui],
  );

  const slice = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (slice === proxiedState) {
    throw new Error(
      "You tried to return the entire AssistantState. This is not supported due to technical limitations.",
    );
  }

  useDebugValue(slice);

  return slice;
};
