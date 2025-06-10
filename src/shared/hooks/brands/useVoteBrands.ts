// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Services
import {
  VoteBrandsParams,
  VoteBrandsResponse,
  voteBrands,
} from "@/services/brands";

export const useVoteBrands = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids }: VoteBrandsParams) => {
      console.log("Voting with body:", { ids });

      // Additional validation on the frontend
      if (!Array.isArray(ids) || ids.length !== 3) {
        throw new Error("Must select exactly 3 brands");
      }

      // Check for duplicates
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== 3) {
        throw new Error("All brands must be different");
      }

      return voteBrands({ ids });
    },
    onSuccess: async (response: VoteBrandsResponse) => {
      console.log("Vote successful:", response);

      // Invalidate relevant queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      await queryClient.invalidateQueries({ queryKey: ["user-votes"] });
    },
    onError: (error) => {
      console.error("Voting failed:", error);
    },
  });
};
