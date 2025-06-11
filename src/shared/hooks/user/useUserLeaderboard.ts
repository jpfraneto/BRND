// Dependencies
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// Services
import { getUserLeaderboard, LeaderboardApiResponse } from "@/services/user";

/**
 * Hook for fetching user leaderboard with pagination and current user position.
 * Data is cached on the backend for 15 minutes for performance.
 */
export const useUserLeaderboard = (page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ["leaderboard", page, limit],
    queryFn: () => getUserLeaderboard(page, limit),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes (backend caches for 15)
    placeholderData: keepPreviousData, // Keep previous data while loading new page
  });
};

// Export the response type for use in components
export type { LeaderboardApiResponse };
