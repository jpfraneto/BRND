// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Services
import { updateProfile } from "@/services/auth";

// Hooks
import { ModalsIds, useModal } from "../ui/useModal";

/**
 * Custom hook for updating user profile information.
 *
 * This hook provides a mutation for updating user profile data (username, photoUrl)
 * through the /me endpoint. It automatically updates the cached auth data
 * when the update is successful.
 *
 * @returns Mutation object for profile updates with loading state and error handling
 */
export const useProfileUpdate = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  return useMutation({
    mutationFn: (profileData: { username?: string; photoUrl?: string }) =>
      updateProfile(profileData),

    onSuccess: (data) => {
      // Update the cached auth data with the new profile information
      queryClient.setQueryData(["auth"], data);

      // Optionally show success message
      console.log("Profile updated successfully");
    },

    onError: (error) => {
      console.error("Profile update error:", error);
      openModal(ModalsIds.ERROR, {
        title: "Unable to update profile",
        message: "Failed to save your profile changes. Please try again.",
      });
    },
  });
};
