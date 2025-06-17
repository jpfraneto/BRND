// Dependencies
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useNavigate } from "react-router-dom";

// StyleSheet
import styles from "./MyPodium.module.scss";

// Hooks
import { useMyVoteHistory } from "@/hooks/user"; // Updated import - no longer need useAuth
// Removed: import { useAuth } from '@/hooks/auth';

// Components
import BrandCard from "@/components/cards/BrandCard";
import Typography from "@/components/Typography";

// Utils
import { getBrandScoreVariation } from "@/shared/utils/brand";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

function MyPodium() {
  const navigate = useNavigate();
  const [pageId, setPageId] = useState<number>(1);

  // Updated hook - no user ID needed, uses authentication automatically
  const {
    data: history,
    isFetching,
    refetch,
    isLoading,
    error,
  } = useMyVoteHistory(pageId, 15);
  console.log("THE HISTORY IS", history);

  // Simplified useEffect - no need to check for user.id
  useEffect(() => {
    refetch();
  }, [pageId, refetch]);

  /**
   * Handles the scroll event of the list for infinite loading.
   *
   * @param {React.UIEvent<HTMLDivElement>} e - The scroll event.
   */
  const handleScrollList = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const calc = scrollTop + clientHeight + 50;
    if (calc >= scrollHeight && !isFetching && history) {
      const totalItems = Object.keys(history.data).length;
      if (totalItems < history.count) {
        setPageId((prev) => prev + 1);
      }
    }
  };

  // Loading state for initial load
  if (isLoading && pageId === 1) {
    return (
      <div className={styles.layout}>
        <div className={styles.loading}>
          <Typography>
            <LoaderIndicator />
          </Typography>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.layout}>
        <div className={styles.error}>
          <Typography>Failed to load your podiums</Typography>
          <button onClick={() => refetch()} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state - no podiums yet
  if (history && Object.keys(history.data).length === 0) {
    return (
      <div className={styles.layout}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏆</div>
          <Typography size={18} weight="medium" className={styles.emptyTitle}>
            No podiums yet!
          </Typography>
          <Typography size={14} className={styles.emptySubtext}>
            Start voting to create your first podium and earn points!
          </Typography>
          <button
            onClick={() => navigate("/voting")}
            className={styles.startVotingButton}
          >
            Start Voting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {history && (
        <div className={styles.view} onScroll={handleScrollList}>
          <ul className={styles.list}>
            {Object.keys(history.data).map((date, index) => (
              <li
                key={`--podium-key-${index.toString()}`}
                className={styles.item}
              >
                <div className={styles.brands}>
                  <BrandCard
                    key={"--podium-key-1"}
                    score={history.data[date].brand1.score}
                    variation={getBrandScoreVariation(
                      history.data[date].brand1.stateScore
                    )}
                    name={history.data[date].brand1.name}
                    photoUrl={history.data[date].brand1.imageUrl}
                    onClick={() =>
                      navigate(`/brand/${history.data[date].brand1.id}`)
                    }
                  />
                  <BrandCard
                    key={"--podium-key-2"}
                    score={history.data[date].brand2.score}
                    variation={getBrandScoreVariation(
                      history.data[date].brand2.stateScore
                    )}
                    name={history.data[date].brand2.name}
                    photoUrl={history.data[date].brand2.imageUrl}
                    onClick={() =>
                      navigate(`/brand/${history.data[date].brand2.id}`)
                    }
                  />
                  <BrandCard
                    key={"--podium-key-3"}
                    score={history.data[date].brand3.score}
                    variation={getBrandScoreVariation(
                      history.data[date].brand3.stateScore
                    )}
                    name={history.data[date].brand3.name}
                    photoUrl={history.data[date].brand3.imageUrl}
                    onClick={() =>
                      navigate(`/brand/${history.data[date].brand3.id}`)
                    }
                  />
                </div>
                <div className={styles.data}>
                  <Typography
                    variant={"geist"}
                    size={14}
                    lineHeight={14}
                    weight={"medium"}
                  >
                    {formatDistanceToNow(new Date(date).getTime(), {
                      addSuffix: true,
                    }).includes("hour")
                      ? "today"
                      : formatDistanceToNow(new Date(date).getTime(), {
                          addSuffix: true,
                        })}
                  </Typography>
                </div>
              </li>
            ))}
          </ul>

          {/* Loading indicator for pagination */}
          {isFetching && pageId > 1 && (
            <div className={styles.loadingMore}>
              <Typography size={12} className={styles.loadingText}>
                Loading more podiums...
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyPodium;
