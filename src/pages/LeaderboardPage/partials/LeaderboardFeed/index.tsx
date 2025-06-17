import React, { useCallback, useState, useEffect } from "react";

// StyleSheet
import styles from "./LeaderboardFeed.module.scss";

// Components
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import UserListItem from "@/shared/components/UserListItem";

// Hooks
import { useUserLeaderboard } from "@/shared/hooks/user/useUserLeaderboard";

// Components
import LoaderIndicator from "@/shared/components/LoaderIndicator";

// SDK
import sdk from "@farcaster/frame-sdk";

function LeaderboardFeed() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 50;

  const { data, isLoading, isFetching, error, refetch } = useUserLeaderboard(
    currentPage,
    limit
  );

  /**
   * Handles sharing user's leaderboard position
   */
  const handleShareLeaderboard = useCallback(async () => {
    if (data?.currentUser) {
      try {
        await sdk.actions.composeCast({
          text: `I'm #${data.currentUser.position} on the BRND leaderboard with ${data.currentUser.points} points! 🏆`,
          embeds: ["https://brnd.lat"],
        });

        // Add haptic feedback
        sdk.haptics.selectionChanged();
      } catch (error) {
        console.error("❌ [LeaderboardFeed] Share error:", error);
      }
    }
  }, [data?.currentUser]);

  /**
   * Accumulate users from all pages
   */
  useEffect(() => {
    if (data?.users) {
      if (currentPage === 1) {
        // First page - replace all users
        console.log(
          "🏆 [LeaderboardFeed] Setting initial users:",
          data.users.length
        );
        setAllUsers(data.users);
      } else {
        // Subsequent pages - append new users
        console.log(
          "🏆 [LeaderboardFeed] Appending users from page",
          currentPage,
          ":",
          data.users.length
        );
        setAllUsers((prev) => {
          // Filter out duplicates by FID
          const existingFids = new Set(prev.map((u) => u.fid));
          const newUsers = data.users.filter((u) => !existingFids.has(u.fid));
          return [...prev, ...newUsers];
        });
      }
      setIsLoadingMore(false);
    }
  }, [data, currentPage]);

  /**
   * Handles the scroll event for automatic loading.
   * When user scrolls near the bottom, loads the next page automatically.
   */
  const handleScrollList = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const calc = scrollTop + clientHeight + 50; // 50px buffer before bottom

      if (
        calc >= scrollHeight &&
        !isFetching &&
        !isLoadingMore &&
        data?.pagination.hasNextPage
      ) {
        console.log("🏆 [LeaderboardFeed] Loading next page:", currentPage + 1);
        setIsLoadingMore(true);
        setCurrentPage((prev) => prev + 1);
      }
    },
    [isFetching, isLoadingMore, data?.pagination.hasNextPage, currentPage]
  );

  // Disable body scroll when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Check if we have data to show
  const hasData = allUsers.length > 0;
  const hasNextPage = data?.pagination.hasNextPage;

  if (isLoading && currentPage === 1) {
    return (
      <div className={styles.layout}>
        <LoaderIndicator size={30} variant={"fullscreen"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.layout}>
        <div className={styles.error}>
          <Typography>Failed to load leaderboard</Typography>
          <button
            onClick={() => {
              setCurrentPage(1);
              setAllUsers([]);
              refetch();
            }}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hasData && !isLoading) {
    return (
      <div className={styles.layout}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏆</div>
          <Typography size={18} weight="medium">
            No users yet!
          </Typography>
          <Typography size={14} className={styles.emptySubtext}>
            Be the first to vote and appear on the leaderboard!
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Updated user rank card design */}
      {data?.currentUser && (
        <div className={styles.userRankSection}>
          <div className={styles.userRankCard}>
            <div className={styles.userRankContent}>
              {/* User avatar and rank */}
              <div className={styles.userRankInfo}>
                {data.currentUser.user?.photoUrl && (
                  <img
                    src={data.currentUser.user.photoUrl}
                    alt={data.currentUser.user.username || "User"}
                    className={styles.userRankAvatar}
                  />
                )}
                <Typography
                  size={40}
                  weight="bold"
                  className={styles.userRankPosition}
                >
                  #{data.currentUser.position}
                </Typography>
              </div>
            </div>
          </div>

          {/* Share button */}
          <div className={styles.shareSection}>
            <Button
              caption="Share"
              variant="primary"
              onClick={handleShareLeaderboard}
            />
          </div>
        </div>
      )}

      {/* Scrollable container with automatic loading */}
      <div className={styles.scrollContainer} onScroll={handleScrollList}>
        <div className={styles.usersList}>
          {allUsers.map((user, index) => {
            // Calculate actual position based on accumulated index
            const position = index + 1;
            return (
              <div key={`user-${user.fid}`} className={styles.userItem}>
                <UserListItem user={user} position={position} />
              </div>
            );
          })}

          {/* Loading indicator when fetching more */}
          {(isFetching || isLoadingMore) && currentPage > 1 && (
            <div className={styles.loadingMore}>
              <LoaderIndicator size={24} />
              <Typography size={12} className={styles.loadingText}>
                Loading more users...
              </Typography>
            </div>
          )}

          {/* End of list indicator */}
          {!hasNextPage && allUsers.length > 0 && !isLoadingMore && (
            <div className={styles.endOfList}>
              <Typography size={12} className={styles.endText}>
                You've reached the end! 🎉
              </Typography>
              <Typography size={12} className={styles.totalText}>
                Total: {data?.pagination.total || allUsers.length} users
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardFeed;
