// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Services
import { voteBrands } from "@/services/brands";

export const useVoteBrands = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { ids: number[] }) => {
      // Your API call here
      return voteBrands(data);
    },
    onSuccess: () => {
      console.log("✅ [useVoteBrands] Vote successful, invalidating queries");

      // Invalidate auth to get fresh user data with todaysVote
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      // Invalidate other related queries
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["userBrands"] });

      // Optional: Add a small delay to ensure backend has processed the vote
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }, 500);
    },
    onError: (error) => {
      console.error("❌ [useVoteBrands] Vote failed:", error);
    },
  });
};
