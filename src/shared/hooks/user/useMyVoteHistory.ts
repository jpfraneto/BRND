import { useRef } from "react";
import { UserVoteHistory } from "./types";
import { getMyVoteHistory } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching the current user's vote history.
 * Uses authentication to identify the user automatically.
 */
export const useMyVoteHistory = (pageId: number = 1, limit: number = 15) => {
  const votesRef = useRef<Record<string, UserVoteHistory>>({});
  const countRef = useRef<number>(0);

  const result = useQuery({
    queryKey: ["myVoteHistory", pageId, limit],
    queryFn: () => getMyVoteHistory(pageId, limit),
    retry: 1,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    // No need for enabled: false since we always want to fetch when user is authenticated
  });

  if (!result.isError && result.data) {
    const votes = result.data.data || {};

    if (pageId === 1) {
      votesRef.current = votes;
    } else {
      votesRef.current = {
        ...votesRef.current,
        ...votes,
      };
    }
    countRef.current = result.data.count ?? 0;
  }

  return {
    ...result,
    data: {
      data: votesRef.current,
      count: countRef.current,
    },
  };
};
