// Dependencies
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// Services
import { getRecentPodiums } from "@/services/brands";

/**
 * Hook for fetching recent podiums with pagination
 */
export const useRecentPodiums = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["recent-podiums", page, limit],
    queryFn: () => getRecentPodiums(page, limit),
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    placeholderData: keepPreviousData, // Keep previous data while loading new page
  });
};
