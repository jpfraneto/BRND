import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";

// Components
import PodiumView from "./partials/PodiumView";
import ShareView from "./partials/ShareView";
import CongratsView from "./partials/CongratsView";

// Types
import { VotingViewEnum } from "./types";

// Hooks
import { Brand } from "@/hooks/brands";
import { useAuth } from "@/hooks/auth";
import { useUserVotes } from "@/hooks/user/useUserVotes";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import LoaderIndicator from "../../shared/components/LoaderIndicator";

function VotePage(): React.ReactNode {
  const { unixDate } = useParams<{ unixDate?: string }>();
  const { search } = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading: authLoading } = useAuth();

  // Use fallback only if we have unixDate but no todaysVote in user data
  const shouldUseFallback = unixDate && user && !user.todaysVote;
  const { data: fallbackVotes, isFetching: fallbackLoading } = useUserVotes(
    shouldUseFallback ? Number(unixDate) : undefined
  );

  const votes = user?.todaysVote || fallbackVotes || null;
  const isLoading = authLoading || (shouldUseFallback && fallbackLoading);

  const [view, setView] = useState<[VotingViewEnum, Brand[], string]>([
    VotingViewEnum.PODIUM,
    [],
    "",
  ]);

  console.log("🗳️ [VotePage] User data:", user);
  console.log("🗳️ [VotePage] Today's vote:", user?.todaysVote);
  console.log("🗳️ [VotePage] Has shared today:", user?.hasSharedToday);
  console.log("🗳️ [VotePage] UnixDate param:", unixDate);
  console.log("🗳️ [VotePage] Final votes used:", votes);

  /**
   * Determines if the voting process was successful based on the URL search parameters.
   */
  const isSuccess = useMemo<boolean>(
    () => new URLSearchParams(search).get("success") === "",
    [search]
  );

  /**
   * Navigates to a different view based on the provided id and selection.
   */
  const navigateToView = useCallback(
    (id: VotingViewEnum, selection: Brand[], voteId: string) =>
      setView([id, selection, voteId]),
    [setView]
  );

  /**
   * Object containing the properties to be passed to the child components.
   */
  const mapToProps = {
    navigateToView,
    currentView: view[0],
    currentBrands: view[1],
    currentVoteId: view[2],
  };

  /**
   * Renders the appropriate view based on the current state.
   */
  const renderView = (): React.ReactNode => {
    switch (view[0]) {
      case VotingViewEnum.PODIUM:
        return <PodiumView {...mapToProps} />;
      case VotingViewEnum.SHARE:
        return <ShareView {...mapToProps} />;
      case VotingViewEnum.CONGRATS:
        return <CongratsView />;
    }
  };

  // Auto-redirect: If user has voted today but no unixDate, redirect to today's vote
  useEffect(() => {
    if (
      !isLoading &&
      user?.hasVotedToday &&
      !unixDate &&
      user?.todaysVote?.id
    ) {
      const todayUnix = Math.floor(Date.now() / 1000);
      console.log(
        "🗳️ [VotePage] User has voted, redirecting to today's vote:",
        todayUnix
      );
      navigate(`/vote/${todayUnix}`, { replace: true });
      return;
    }
  }, [isLoading, user, unixDate, navigate]);

  // Set up the view when we have vote data
  useEffect(() => {
    if (!isLoading && votes?.id) {
      console.log("🗳️ [VotePage] Setting up view with votes:", votes);

      // Check if we have all required brand data
      if (votes.brand1 && votes.brand2 && votes.brand3) {
        const brandOrder = [votes.brand2, votes.brand1, votes.brand3]; // UI order: 2nd, 1st, 3rd

        if (isSuccess) {
          // User just voted successfully - always show ShareView first
          console.log("🗳️ [VotePage] Just voted - showing ShareView");
          navigateToView(VotingViewEnum.SHARE, brandOrder, votes.id);
        } else {
          // User is viewing a previous vote - check sharing status
          if (user?.hasSharedToday) {
            // User has already shared today's vote - show CongratsView
            console.log("🗳️ [VotePage] Already shared - showing CongratsView");
            navigateToView(VotingViewEnum.CONGRATS, brandOrder, votes.id);
          } else {
            // User has voted but not shared - show ShareView
            console.log("🗳️ [VotePage] Not shared yet - showing ShareView");
            navigateToView(VotingViewEnum.SHARE, brandOrder, votes.id);
          }
        }
      } else {
        console.warn(
          "🗳️ [VotePage] Vote data missing brand information:",
          votes
        );
      }
    }
  }, [isLoading, votes, isSuccess, user?.hasSharedToday, navigateToView]);

  // Simplified redirect logic - only redirect if we can't find the requested vote
  if (!isLoading && unixDate && !votes?.id) {
    console.log(
      "🗳️ [VotePage] Unix date provided but no vote found, redirecting to home"
    );
    return <Navigate to={"/"} />;
  }

  return isLoading ? (
    <LoaderIndicator size={30} variant={"fullscreen"} />
  ) : (
    renderView()
  );
}

export default withProtectionRoute(VotePage, "only-connected");
