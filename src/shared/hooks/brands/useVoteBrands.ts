// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Services
import { voteBrands } from "@/services/brands";

export const useVoteBrands = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { ids: number[] }) => {
      return voteBrands(data);
    },
    onSuccess: () => {
      console.log("✅ [useVoteBrands] Vote successful, invalidating queries");

      // Invalidate auth to get fresh user data with todaysVote
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      queryClient.invalidateQueries({
        queryKey: ["brands"],
        exact: false,
      });

      // Also invalidate specific brand list variations
      queryClient.invalidateQueries({
        queryKey: ["brandList"],
        exact: false,
      });

      // Invalidate leaderboard and user data
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["userBrands"] });

      // Invalidate any cached brand data
      queryClient.invalidateQueries({
        queryKey: ["brand"],
        exact: false,
      });

      console.log("🔄 [useVoteBrands] Invalidated all brand-related queries");
    },
    onError: (error) => {
      console.error("❌ [useVoteBrands] Vote failed:", error);
    },
  });
};
