// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Services
import { logIn } from "@/services/auth";

// Hooks
import { ModalsIds, useModal } from "../ui/useModal";

/**
 * Custom hook to perform a login operation using Farcaster miniapp context.
 * This is only used within Farcaster miniapps.
 *
 * @returns A mutation object that can be used to track the status of the login request.
 */
export const useLogIn = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  return useMutation({
    mutationFn: (params: {
      fid: number;
      domain: string;
      username: string;
      token: string;
      photoUrl: string;
    }) => logIn(params),
    onSuccess(data) {
      if (data) {
        const { user } = data;
        queryClient.setQueryData(["auth"], user);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      openModal(ModalsIds.ERROR, {
        title: "Unable to connect to the platform.",
        message: "The service is probably down, try again later.",
      });
    },
  });
};
