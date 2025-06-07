// Dependencies
import { useQuery } from "@tanstack/react-query";

// Services
import { getMe } from "@/services/auth";

// Context
import { AuthContext } from "@/shared/providers/AppProvider";
import { useContext } from "react";

/**
 * Custom hook for authentication state management in Farcaster miniapps.
 *
 * This hook automatically handles user authentication by calling the /me endpoint
 * when a QuickAuth token is available. The endpoint handles:
 * - Token verification
 * - User creation for first-time users
 * - Profile updates and voting status
 *
 * The hook only executes when both the QuickAuth token and miniapp context
 * are available, ensuring proper initialization order.
 *
 * @returns Query object containing user data, loading state, and error information
 */
export const useAuth = () => {
  const { token, miniappContext, isInitialized } = useContext(AuthContext);

  return useQuery({
    queryKey: ["auth"],
    queryFn: getMe,
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    // Only fetch when we have both token and context, and miniapp is initialized
    enabled: !!token && !!miniappContext && isInitialized,
  });
};
