// API Dependency
import { request } from "./api";

// Configuration
import { AUTH_SERVICE } from "@/config/api";

// Types
import { User } from "../shared/hooks/user";

/**
 * Retrieves the current user's information from the authentication service.
 *
 * This function calls the /me endpoint which handles:
 * - QuickAuth token verification
 * - Automatic user creation for first-time users
 * - Profile updates when user data has changed
 * - Daily voting status calculation
 *
 * The endpoint replaces traditional login flows since Farcaster miniapps
 * have implicit authentication through the platform.
 *
 * @returns A promise that resolves with the user's complete profile data
 */
export const getMe = async (): Promise<
  User & {
    hasVotedToday: boolean;
    isNewUser: boolean;
  }
> =>
  await request<User & { hasVotedToday: boolean; isNewUser: boolean }>(
    `${AUTH_SERVICE}/me`,
    {
      method: "GET",
    }
  );

/**
 * Updates user profile information.
 *
 * This function sends profile updates to the /me endpoint which will
 * update the user's information in the database.
 *
 * @param profileData - Updated profile information (username, photoUrl)
 * @returns Promise resolving to updated user profile
 */
export const updateProfile = async (profileData: {
  username?: string;
  photoUrl?: string;
}): Promise<User & { hasVotedToday: boolean; isNewUser: boolean }> =>
  await request<User & { hasVotedToday: boolean; isNewUser: boolean }>(
    `${AUTH_SERVICE}/me`,
    {
      method: "GET",
      body: profileData,
    }
  );
