// /src/hooks/users/useUserLeaderboard.ts

/*
 * BACKEND IMPLEMENTATION PROMPT:
 *
 * Please create a user leaderboard API endpoint and service that provides the following functionality:
 *
 * ENDPOINT: GET /user-service/leaderboard
 *
 * QUERY PARAMETERS:
 * - page: number (default: 1) - For pagination
 * - limit: number (default: 50) - Number of users per page
 * - timeframe: string (optional: "all" | "week" | "month") - Time period for scoring
 *
 * RESPONSE FORMAT:
 * {
 *   users: Array<{
 *     id: string,              // User ID (primary key)
 *     fid: number,             // Farcaster ID
 *     username: string,        // Display name from Farcaster
 *     photoUrl: string,        // Profile picture URL
 *     points: number,          // Total accumulated voting points
 *     rank: number,            // Current ranking position (1, 2, 3, etc.)
 *     previousRank?: number,   // Previous ranking for comparison (optional)
 *     votingStreak?: number,   // Consecutive days voting (optional)
 *     totalVotes?: number,     // Total number of votes cast (optional)
 *     createdAt: Date,         // When user joined
 *     updatedAt: Date          // Last activity
 *   }>,
 *   pagination: {
 *     currentPage: number,
 *     totalPages: number,
 *     totalUsers: number,
 *     hasNextPage: boolean,
 *     hasPreviousPage: boolean
 *   },
 *   currentUser?: {            // Current authenticated user's position
 *     rank: number,
 *     points: number,
 *     position: "above" | "below" | "in-list"  // Whether user is in current page
 *   }
 * }
 *
 * BUSINESS LOGIC REQUIREMENTS:
 *
 * 1. RANKING CALCULATION:
 *    - Users are ranked by total accumulated points (points field in users table)
 *    - Points are earned through daily voting: 1st place = 60pts, 2nd = 30pts, 3rd = 10pts
 *    - Ties should be broken by most recent voting activity (updatedAt)
 *    - Rankings should be recalculated efficiently when points change
 *
 * 2. QUERY OPTIMIZATION:
 *    - Use proper SQL ORDER BY with LIMIT/OFFSET for pagination
 *    - Consider adding database indexes on points and updatedAt columns
 *    - Cache ranking calculations if performance becomes an issue
 *    - Return results sorted by rank (ascending: 1, 2, 3, ...)
 *
 * 3. CURRENT USER CONTEXT:
 *    - Always include the authenticated user's current rank and points
 *    - Indicate if the user appears in the current page or is above/below
 *    - This helps users understand their position relative to the displayed leaderboard
 *
 * 4. TIMEFRAME FILTERING (Future Enhancement):
 *    - "all": Use total points from users.points field
 *    - "week": Calculate points from votes in last 7 days
 *    - "month": Calculate points from votes in last 30 days
 *    - For now, implement "all" timeframe only
 *
 * 5. DATA INTEGRITY:
 *    - Ensure user.points field is kept in sync with actual voting records
 *    - Consider running periodic jobs to recalculate points if discrepancies occur
 *    - Handle edge cases like deleted users or invalid vote records
 *
 * 6. AUTHENTICATION:
 *    - Endpoint requires authentication (use AuthorizationGuard)
 *    - Get current user from JWT payload to include their ranking context
 *    - Users should only see public profile data of other users
 *
 * SQL QUERY EXAMPLE:
 * ```sql
 * SELECT
 *   id, fid, username, photoUrl, points,
 *   ROW_NUMBER() OVER (ORDER BY points DESC, updatedAt DESC) as rank
 * FROM users
 * WHERE banned = 0
 * ORDER BY points DESC, updatedAt DESC
 * LIMIT ? OFFSET ?
 * ```
 *
 * SERVICE FUNCTION SIGNATURE:
 * ```typescript
 * export async function getUserLeaderboard(
 *   page: number = 1,
 *   limit: number = 50,
 *   timeframe: string = "all"
 * ): Promise<UserLeaderboardResponse>
 * ```
 *
 * ERROR HANDLING:
 * - Return appropriate HTTP status codes (200 for success, 400 for invalid params)
 * - Handle cases where page exceeds available data gracefully
 * - Log any database errors for monitoring
 *
 * TESTING CONSIDERATIONS:
 * - Test with empty database (no users)
 * - Test pagination edge cases (first page, last page, beyond last page)
 * - Test with users having same points (tie-breaking logic)
 * - Test with very large datasets for performance
 *
 * This endpoint will power the main leaderboard view showing all users ranked by their
 * voting activity and accumulated points in the BRND platform.
 */

// Dependencies
import { useQuery } from "@tanstack/react-query";

// Services
import { getUserLeaderboard } from "@/services/user";

// Types
export interface UserLeaderboardEntry {
  id: string;
  fid: number;
  username: string;
  photoUrl: string;
  points: number;
  rank: number;
  previousRank?: number;
  votingStreak?: number;
  totalVotes?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLeaderboardResponse {
  users: UserLeaderboardEntry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  currentUser?: {
    rank: number;
    points: number;
    position: "above" | "below" | "in-list";
  };
}

export const useUserLeaderboard = (
  page: number = 1,
  limit: number = 50,
  timeframe: string = "all"
) => {
  return useQuery({
    queryKey: ["userLeaderboard", page, limit, timeframe],
    queryFn: () => getUserLeaderboard(page, limit, timeframe),
    staleTime: 2 * 60 * 1000, // 2 minutes - leaderboard data can be slightly stale
    retry: 1,
  });
};
