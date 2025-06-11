// API Dependency
import { request } from "./api";

// Configuration
import { USER_SERVICE } from "@/config/api";

// Types
import {
  User,
  UserVoteHistory,
  UserVote,
  UserBrand,
} from "../shared/hooks/user";
import { UserLeaderboardResponse } from "@/shared/hooks/user/useUserLeaderboard";

/**
 * Retrieves the vote history of a user from the user service.
 *
 * @param id - The ID of the user whose vote history is being retrieved.
 * @param pageId - The page number for paginated vote history.
 * @returns A promise that resolves with an object containing the count of votes and the user's vote history data.
 */
export const getUserVotesHistory = async (id: User["id"], pageId: number) =>
  await request<{ count: number; data: Record<string, UserVoteHistory> }>(
    `${USER_SERVICE}/user/${id}/vote-history`,
    {
      method: "GET",
      params: {
        pageId: String(pageId),
        limit: String(3 * 10),
      },
    }
  );

/**
 * Retrieves the current user's vote history using authentication.
 * No user ID required - uses the auth token to identify the user.
 *
 * @param pageId - The page number for paginated vote history.
 * @param limit - Number of records per page (default: 15).
 * @returns A promise that resolves with an object containing the count of votes and the user's vote history data.
 */
export const getMyVoteHistory = async (
  pageId: number = 1,
  limit: number = 15
) =>
  await request<{ count: number; data: Record<string, UserVoteHistory> }>(
    `${USER_SERVICE}/my-vote-history`,
    {
      method: "GET",
      params: {
        pageId: String(pageId),
        limit: String(limit),
      },
    }
  );

/**
 * Retrieves the user leaderboard with ranking and pagination.
 *
 * @param page - The page number for pagination (default: 1).
 * @param limit - The number of users per page (default: 50).
 * @param timeframe - The timeframe for scoring: "all" | "week" | "month" (default: "all").
 * @returns A promise that resolves with the leaderboard data including users, pagination, and current user context.
 */
export const getUserLeaderboard = async (
  page: number = 1,
  limit: number = 50,
  timeframe: string = "all"
) =>
  await request<UserLeaderboardResponse>(`${USER_SERVICE}/leaderboard`, {
    method: "GET",
    params: {
      page: String(page),
      limit: String(limit),
      timeframe,
    },
  });

/**
 * Retrieves the user votes for a specific date.
 *
 * @param unixDate - The Unix timestamp representing the date for which to retrieve the votes.
 * @returns A promise that resolves with an object containing the count of votes and the user's vote history data.
 */
export const getUserVotes = async (unixDate: number) =>
  await request<UserVote>(`${USER_SERVICE}/votes/${unixDate}`, {
    method: "GET",
  });

export const getUserBrands = async () =>
  await request<UserBrand[]>(`${USER_SERVICE}/brands`, {
    method: "GET",
  });

export const shareFrame = async (): Promise<boolean> =>
  await request(`${USER_SERVICE}/share-frame`, {
    method: "POST",
  });
