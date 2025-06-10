import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import BrandCard from "@/components/cards/BrandCard";
import Typography from "@/components/Typography";

// StyleSheet
import styles from "./PublicPodiumsFeed.module.scss";

// Hooks
import { useRecentPodiums } from "@/hooks/brands";
import { Brand } from "@/hooks/brands";

// Utils
import { getBrandScoreVariation } from "@/utils/brand";

function PublicPodiumsFeed() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useRecentPodiums(
    currentPage,
    limit
  );

  /**
   * Handles clicking on a brand card
   */
  const handleClickCard = useCallback(
    (id: Brand["id"]) => {
      navigate(`/brand/${id}`);
    },
    [navigate]
  );

  /**
   * Handles pagination
   */
  const handleLoadMore = useCallback(() => {
    if (data?.pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [data?.pagination.hasNextPage]);

  /**
   * Format time ago display
   */
  const getTimeAgo = useCallback((createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return created.toLocaleDateString();
  }, []);

  if (isLoading && currentPage === 1) {
    return (
      <div className={styles.layout}>
        <div className={styles.loading}>
          <Typography>Loading community podiums...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.layout}>
        <div className={styles.error}>
          <Typography>Failed to load podiums</Typography>
          <button onClick={() => refetch()} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.podiums.length) {
    return (
      <div className={styles.layout}>
        <div className={styles.empty}>
          <Typography>No podiums yet!</Typography>
          <Typography size={14} className={styles.emptySubtext}>
            Be the first to vote and create a podium.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.podiumsList}>
        {data?.podiums.map((podium) => (
          <div key={podium.id} className={styles.podiumItem}>
            {/* User info header */}
            <div className={styles.podiumHeader}>
              <div className={styles.userInfo}>
                {podium.user.photoUrl && (
                  <img
                    src={podium.user.photoUrl}
                    alt={podium.user.username}
                    className={styles.userAvatar}
                  />
                )}
                <div className={styles.userDetails}>
                  <Typography size={14} weight="medium">
                    {podium.user.username}
                  </Typography>
                  <Typography size={12} className={styles.timeAgo}>
                    {getTimeAgo(podium.createdAt)}
                  </Typography>
                </div>
              </div>
              <div className={styles.points}>
                <Typography size={12} weight="medium">
                  +{podium.pointsAwarded} pts
                </Typography>
              </div>
            </div>

            {/* Podium content */}
            <div className={styles.podiumRow}>
              <div className={styles.podiumContent}>
                <div className={styles.podiumGrid}>
                  {podium.brands.map((brand, index) => (
                    <BrandCard
                      key={`${podium.id}-brand-${index}`}
                      name={brand.name}
                      photoUrl={brand.imageUrl}
                      orientation={
                        index === 0 ? "left" : index === 1 ? "center" : "right"
                      }
                      score={brand.score}
                      variation={getBrandScoreVariation(brand.score)}
                      size="s"
                      onClick={() => handleClickCard(brand.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Load more button */}
        {data?.pagination.hasNextPage && (
          <div className={styles.loadMore}>
            <button
              onClick={handleLoadMore}
              className={styles.loadMoreButton}
              disabled={isLoading}
            >
              <Typography>
                {isLoading ? "Loading..." : "Load More Podiums"}
              </Typography>
            </button>
          </div>
        )}

        {/* Pagination info */}
        <div className={styles.paginationInfo}>
          <Typography size={12} className={styles.paginationText}>
            Showing {data?.podiums.length} of {data?.pagination.total} podiums
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default PublicPodiumsFeed;
