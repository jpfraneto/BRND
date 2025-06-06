// Dependencies
import { Outlet } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

// Providers
import { BottomSheetProvider } from "./BottomSheetProvider";
import { ModalProvider } from "./ModalProvider";

// Farcaster Miniapp Init
import sdk, { type Context } from "@farcaster/frame-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Services
import { logIn } from "@/services/auth";
import { setFarcasterToken } from "../utils/auth";

export const AuthContext = createContext<{
  token: string | undefined;
  signIn: () => Promise<void>;
  signOut: () => void;
  miniappContext: Context.FrameContext | null;
}>({
  token: undefined,
  signIn: async () => {},
  signOut: () => {},
  miniappContext: null,
});

const queryClient = new QueryClient();

/**
 * AppProvider component that wraps the application with necessary providers.
 *
 * @returns {JSX.Element} The wrapped child components with BottomSheetProvider and ModalProvider.
 */
export function AppProvider(): JSX.Element {
  const [token, setToken] = useState<string>();
  const [miniappContext, setMiniappContext] =
    useState<Context.FrameContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initMiniapp() {
      if (isInitialized) return;

      try {
        console.log("INITIALIZING THE MINIAPP");
        // Init Quick Auth
        const { token: newToken } = await sdk.actions.quickAuth();
        setToken(newToken);
        setFarcasterToken(newToken);
        console.log("TOKEN", newToken);

        // Finish Miniapp Init
        await sdk.actions.ready();

        // Load and store the miniapp context
        const context = await sdk.context;
        console.log("MINIAPP CONTEXT", context);
        setMiniappContext(context);

        // Login to our backend with the miniapp data
        if (context && newToken) {
          const loginResponse = await logIn({
            fid: context.user.fid,
            token: newToken,
            domain: "miniapp.anky.app",
            username: context.user.username || "",
            photoUrl: context.user.pfpUrl || "",
          });

          if (loginResponse) {
            // Update the auth query data with the user
            queryClient.setQueryData(["auth"], loginResponse.user);
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize miniapp:", error);
        setIsInitialized(false);
      }
    }
    initMiniapp();
  }, [isInitialized]);

  const signIn = async () => {
    try {
      const { token: newToken } = await sdk.actions.quickAuth();
      setToken(newToken);

      // Get fresh context
      const context = await sdk.context;
      setMiniappContext(context);

      if (context && newToken) {
        console.log("sending the login request to the backend");
        const loginResponse = await logIn({
          fid: context.user.fid,
          token: newToken,
          domain: "miniapp.anky.app",
          username: context.user.username || "",
          photoUrl: context.user.pfpUrl || "",
        });
        console.log("loginResponse", loginResponse);

        if (loginResponse) {
          queryClient.setQueryData(["auth"], loginResponse.user);
        }
      }
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  const signOut = () => {
    setToken(undefined);
    setMiniappContext(null);
    setIsInitialized(false);
    // Clear the auth data
    queryClient.setQueryData(["auth"], null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ token, signIn, signOut, miniappContext }}>
        <BottomSheetProvider>
          <ModalProvider>
            <Outlet />
          </ModalProvider>
        </BottomSheetProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
