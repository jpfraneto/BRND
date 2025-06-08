// Dependencies
import { createBrowserRouter } from "react-router-dom";

// Pages
import NotFoundPage from "../pages/NotFoundPage";
import VotePage from "../pages/VotePage";
import HomePage from "../pages/HomePage";
import WelcomePage from "../pages/WelcomePage";
import ProfilePage from "../pages/ProfilePage";
import BrandPage from "../pages/BrandPage";
import ClaimedPage from "../pages/ClaimedPage";

// Providers
import { AppProvider } from "../shared/providers/AppProvider";

/**
 * Router configuration for Farcaster miniapp.
 *
 * Note: LoginPage has been removed since authentication is handled
 * automatically through Farcaster's QuickAuth system. Users are
 * implicitly authenticated when accessing the miniapp.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppProvider />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          { path: "top", element: <HomePage /> },
          { path: "new", element: <HomePage /> },
          { path: "all", element: <HomePage /> },
        ],
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        children: [
          { path: "", element: <ProfilePage /> },
          { path: "podium", element: <ProfilePage /> },
        ],
      },
      {
        path: "/brand/:id",
        element: <BrandPage />,
      },
      { path: "/welcome", element: <WelcomePage /> },
      { path: "/vote/:unixDate?", element: <VotePage /> },
      // { path: "/podium", element: <PodiumPage /> },
      { path: "/claimed", element: <ClaimedPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
