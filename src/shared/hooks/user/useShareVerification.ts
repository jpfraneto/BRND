// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Services
import {
  verifyShare,
  ShareVerificationData,
  ShareVerificationResponse,
} from "@/services/user";

/**
 * Hook for verifying shared casts and awarding points.
 *
 * This hook handles the process of:
 * 1. Sending cast hash and vote ID to backend for verification
 * 2. Invalidating auth cache to refresh user points
 * 3. Providing loading and error states for UI feedback
 */
export const useShareVerification = () => {
  const queryClient = useQueryClient();

  return useMutation<ShareVerificationResponse, Error, ShareVerificationData>({
    mutationFn: verifyShare,
    onSuccess: (data) => {
      console.log("✅ [ShareVerification] Share verified successfully:", data);

      // Invalidate auth cache to refresh user points
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      // Optionally invalidate other relevant queries
      queryClient.invalidateQueries({ queryKey: ["user-brands"] });
    },
    onError: (error) => {
      console.error("❌ [ShareVerification] Verification failed:", error);
    },
  });
};

// Export types for use in components
export type { ShareVerificationData, ShareVerificationResponse };
