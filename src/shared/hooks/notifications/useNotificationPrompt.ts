// src/components/NotificationPrompt/hooks.ts

import { useState, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { NotificationPromptState } from "@/shared/components/NotificationPrompt/types";
import { markUserPrompted } from "@/shared/utils/notifications";

/**
 * Custom hook for managing notification prompt state and actions
 */
export const useNotificationPrompt = (
  userFid: number,
  onComplete?: (added: boolean) => void
) => {
  const [state, setState] = useState<NotificationPromptState>({
    isLoading: false,
    isAdded: false,
    error: null,
  });

  const handleAddMiniapp = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      await sdk.actions.addMiniApp();

      setState((prev) => ({ ...prev, isAdded: true, isLoading: false }));
      markUserPrompted(userFid, true);

      // Show success state briefly, then complete
      setTimeout(() => {
        onComplete?.(true);
      }, 2000);
    } catch (error) {
      console.error("Failed to add miniapp:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to add miniapp",
      }));

      // Still mark as prompted and complete (user might have already added it)
      markUserPrompted(userFid, false);
      onComplete?.(false);
    }
  }, [userFid, onComplete]);

  const handleSkip = useCallback((): void => {
    markUserPrompted(userFid, false);
    onComplete?.(false);
  }, [userFid, onComplete]);

  return {
    state,
    actions: {
      addMiniapp: handleAddMiniapp,
      skip: handleSkip,
    },
  };
};
