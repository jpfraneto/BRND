// Dependencies
import { Outlet } from "react-router-dom";
import { useState, useEffect, createContext, useCallback } from "react";

// Providers
import { BottomSheetProvider } from "./BottomSheetProvider";
import { ModalProvider } from "./ModalProvider";

// Components
import NotificationPrompt from "@/shared/components/NotificationPrompt";

// Farcaster Miniapp Init
import sdk, { type Context } from "@farcaster/frame-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Services
import { setFarcasterToken } from "../utils/auth";

// Utils
import {
  shouldShowNotificationPrompt,
  markNotificationsEnabled,
} from "@/shared/utils/notifications";

export const AuthContext = createContext<{
  token: string | undefined;
  signIn: () => Promise<void>;
  signOut: () => void;
  miniappContext: Context.FrameContext | null;
  isInitialized: boolean;
}>({
  token: undefined,
  signIn: async () => {},
  signOut: () => {},
  miniappContext: null,
  isInitialized: false,
});

const queryClient = new QueryClient();

/**
 * AppProvider component that manages Farcaster miniapp authentication and context.
 *
 * This provider handles the complete authentication flow for Farcaster miniapps:
 * 1. Initializes the Farcaster SDK and obtains QuickAuth token
 * 2. Loads miniapp context (user data, etc.)
 * 3. Automatically authenticates with backend via /me endpoint
 * 4. Prompts user to add miniapp if they haven't already
 * 5. Manages authentication state throughout the app lifecycle
 *
 * The provider eliminates the need for explicit login flows since Farcaster
 * miniapps have implicit authentication through the platform.
 */
export function AppProvider(): JSX.Element {
  const [token, setToken] = useState<string>();
  const [miniappContext, setMiniappContext] =
    useState<Context.FrameContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAddMiniappPrompt, setShowAddMiniappPrompt] = useState(false);
  const [userFid, setUserFid] = useState<number | null>(null);

  useEffect(() => {
    async function initMiniapp() {
      if (isInitialized) return;

      try {
        console.log("Initializing Farcaster miniapp...");

        // Obtain QuickAuth token from Farcaster
        const { token: newToken } = await sdk.quickAuth.getToken();
        console.log("THE NEW TOKEN IS", newToken);
        setToken(newToken);
        setFarcasterToken(newToken);
        console.log("QuickAuth token obtained");

        // Signal that miniapp is ready
        await sdk.actions.ready();

        // Load miniapp context (user profile, etc.)
        const context = await sdk.context;
        console.log("Miniapp context loaded:", context.user.username);
        setMiniappContext(context);

        // Store user FID for later use
        if (context.user?.fid) {
          setUserFid(context.user.fid);
        }

        // Backend authentication happens automatically when useAuth calls /me
        // The /me endpoint will create/update user and return profile data
        setIsInitialized(true);

        // Short delay to let the app settle before showing prompt
        setTimeout(() => {
          // Check if user has already added the miniapp via Farcaster context
          if (context.client?.added) {
            console.log("User has already added the miniapp, skipping prompt");
            return;
          }

          checkAndShowAddMiniappPrompt(context.user?.fid);
        }, 1000);
      } catch (error) {
        console.error("Failed to initialize miniapp:", error);
        setIsInitialized(false);
      }
    }

    initMiniapp();
  }, [isInitialized]);

  /**
   * Check if we should show the add miniapp prompt on app load
   */
  const checkAndShowAddMiniappPrompt = useCallback(
    (fid: number | undefined) => {
      if (!fid) return;

      // Use existing notification prompt logic but for initial app load
      // This checks localStorage and other conditions to determine if we should prompt
      const shouldShow = shouldShowNotificationPrompt(
        fid,
        false // We don't have backend state yet, so assume notifications not enabled
      );

      if (shouldShow) {
        console.log("Showing add miniapp prompt on app load");
        setShowAddMiniappPrompt(true);
      } else {
        console.log("Skipping add miniapp prompt - conditions not met");
      }
    },
    []
  );

  /**
   * Handle completion of add miniapp prompt flow
   */
  const handleAddMiniappComplete = useCallback(
    (added: boolean): void => {
      setShowAddMiniappPrompt(false);

      if (added && userFid) {
        // Mark as enabled in localStorage for future reference
        markNotificationsEnabled(userFid);
        console.log(
          "User successfully added BRND to their apps on initial load!"
        );
      }
    },
    [userFid]
  );

  const signIn = async () => {
    try {
      // Get new QuickAuth token
      const { token: newToken } = await sdk.quickAuth.getToken();
      setToken(newToken);
      setFarcasterToken(newToken);

      // Refresh context
      const context = await sdk.context;
      setMiniappContext(context);

      // Clear and refetch auth data - /me will handle user creation/update
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  const signOut = () => {
    setToken(undefined);
    setMiniappContext(null);
    setIsInitialized(false);
    setShowAddMiniappPrompt(false);
    setUserFid(null);
    // Clear all cached data
    queryClient.clear();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          token,
          signIn,
          signOut,
          miniappContext,
          isInitialized,
        }}
      >
        <BottomSheetProvider>
          <ModalProvider>
            {/* Add miniapp prompt overlay - shown on app load if needed */}
            {showAddMiniappPrompt && userFid && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px",
                }}
              >
                <NotificationPrompt
                  userFid={userFid}
                  onComplete={handleAddMiniappComplete}
                  points={0} // No points context on app load
                />
              </div>
            )}
            <Outlet />
          </ModalProvider>
        </BottomSheetProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
