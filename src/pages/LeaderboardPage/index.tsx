// Dependencies
import React, { useEffect, useState } from "react";

// StyleSheet
import styles from "./LeaderboardPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import Typography from "@/components/Typography";
import UserListItem from "@/shared/components/UserListItem";
import BrandHeader from "@/shared/components/BrandHeader";

// Hooks
import { useUserLeaderboard } from "@/shared/hooks/user/useUserLeaderboard";
import useDisableScrollBody from "@/hooks/ui/useDisableScrollBody";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

function LeaderboardPage(): React.ReactNode {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isFetching, error, refetch } = useUserLeaderboard(
    currentPage,
    50
  );

  useDisableScrollBody();

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  /**
   * Handles the scroll event for the leaderboard list.
   * If the user scrolls to the bottom of the list, it fetches the next page of users.
   * @param {React.UIEvent<HTMLDivElement>} e - The scroll event.
   */
  const handleScrollList = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const calc = scrollTop + clientHeight + 50;
    if (calc >= scrollHeight && !isFetching) {
      if (data?.pagination?.hasNextPage) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  // Loading state
  if (isLoading && currentPage === 1) {
    return (
      <AppLayout>
        <div className={styles.body}>
          <div className={styles.header}>
            <BrandHeader showBackButton={true} />
            <div className={styles.titleSection}>
              <Typography
                variant="druk"
                weight="wide"
                className={styles.title}
                size={20}
              >
                Leaderboard
              </Typography>
            </div>
          </div>
          <div className={styles.loading}>
            <LoaderIndicator variant="default" size={24} />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className={styles.body}>
          <div className={styles.header}>
            <BrandHeader showBackButton={true} />
            <div className={styles.titleSection}>
              <Typography
                variant="druk"
                weight="wide"
                className={styles.title}
                size={20}
              >
                Leaderboard
              </Typography>
            </div>
          </div>
          <div className={styles.error}>
            <Typography>Failed to load leaderboard</Typography>
            <button onClick={() => refetch()} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Empty state
  if (data && data.users.length === 0) {
    return (
      <AppLayout>
        <div className={styles.body}>
          <div className={styles.header}>
            <BrandHeader showBackButton={true} />
            <div className={styles.titleSection}>
              <Typography
                variant="druk"
                weight="wide"
                className={styles.title}
                size={20}
              >
                Leaderboard
              </Typography>
            </div>
          </div>
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
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <BrandHeader showBackButton={true} />

          <div className={styles.titleSection}>
            <Typography
              variant={"druk"}
              weight={"wide"}
              className={styles.title}
              size={20}
            >
              Leaderboard
            </Typography>

            {/* Show current user position */}
            {data?.currentUser && (
              <Typography size={14} className={styles.userPosition}>
                Your rank: #{data.currentUser.position} (
                {data.currentUser.points} points)
              </Typography>
            )}
          </div>
        </div>

        {/* Scrollable content container */}
        <div className={styles.content} onScroll={handleScrollList}>
          {data?.users && data.users.length > 0 && (
            <ul className={styles.grid}>
              {data.users.map((user, index) => {
                // Calculate actual position based on pagination
                const position = (currentPage - 1) * 50 + index + 1;
                return (
                  <li key={`--user-item-${user.fid}`}>
                    <UserListItem user={user} position={position} />
                  </li>
                );
              })}
            </ul>
          )}

          {/* Loading indicator for infinite scroll */}
          {isFetching && currentPage > 1 && (
            <div className={styles.loadingMore}>
              <LoaderIndicator variant="default" size={24} />
            </div>
          )}

          {/* End indicator */}
          {data && !data.pagination.hasNextPage && data.users.length > 0 && (
            <div className={styles.endIndicator}>
              <Typography size={12} className={styles.endText}>
                You've reached the end! 🎉
              </Typography>
              <Typography size={12} className={styles.totalText}>
                Total: {data.pagination.total} users
              </Typography>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(LeaderboardPage, "only-connected");
