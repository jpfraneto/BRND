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

function LeaderboardPage(): React.ReactNode {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useUserLeaderboard(
    currentPage,
    50
  );

  useDisableScrollBody();

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  /**
   * Handle loading more users (pagination)
   */
  const handleLoadMore = () => {
    if (data?.pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
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
            <Typography>Loading leaderboard...</Typography>
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

        <div className={styles.content}>
          {data?.users && data.users.length > 0 && (
            <>
              <ul className={styles.grid}>
                {data.users.map((user, index) => {
                  // Calculate actual position based on pagination
                  const position = (currentPage - 1) * 50 + index + 1;
                  return (
                    <li key={`--user-item-${user.id}`}>
                      <UserListItem user={user} position={position} />
                    </li>
                  );
                })}
              </ul>

              {/* Load more button */}
              {data.pagination.hasNextPage && (
                <div className={styles.loadMore}>
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className={styles.loadMoreButton}
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}

              {/* Pagination info */}
              <div className={styles.paginationInfo}>
                <Typography size={12} className={styles.paginationText}>
                  Showing {(currentPage - 1) * 50 + 1}-
                  {Math.min(currentPage * 50, data.pagination.total)} of{" "}
                  {data.pagination.total} users
                </Typography>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(LeaderboardPage, "only-connected");
