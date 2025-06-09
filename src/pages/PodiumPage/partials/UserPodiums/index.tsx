// Dependencies
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import BrandCard from "@/components/cards/BrandCard";
import Typography from "@/components/Typography";

// Assets
import ShareIcon from "@/assets/icons/share-icon.svg?react";

// StyleSheet
import styles from "./RankPodiums.module.scss";

// Hook
import { Brand, useBrandList } from "@/hooks/brands";
import useDisableScrollBody from "@/hooks/ui/useDisableScrollBody";

// Utils
import { getBrandScoreVariation } from "@/utils/brand";

interface RankPodiumsProps {
  period: "week" | "month" | "all";
}

function UserPodiums({ period }: RankPodiumsProps) {
  const navigate = useNavigate();
  const [podiumHistory, setPodiumHistory] = useState<
    Array<{
      date: string;
      brands: Brand[];
      timeAgo: string;
    }>
  >([]);

  // Get current top brands based on period
  const orderType =
    period === "week" ? "top" : period === "month" ? "all" : "all";
  const { data, refetch } = useBrandList(orderType, "", 1, 20);

  useDisableScrollBody();

  useEffect(() => {
    refetch();
  }, [period]);

  useEffect(() => {
    // Simulate historical podium data - in real app this would come from API
    const mockHistory = [
      {
        date: "Today",
        brands: data?.brands?.slice(0, 3) || [],
        timeAgo: "",
      },
      {
        date: "1 day ago",
        brands: data?.brands?.slice(1, 4) || [],
        timeAgo: "1 day",
      },
      {
        date: "2 days ago",
        brands: data?.brands?.slice(2, 5) || [],
        timeAgo: "2 days ago",
      },
      {
        date: "3 days ago",
        brands: data?.brands?.slice(3, 6) || [],
        timeAgo: "3 days ago",
      },
    ];

    setPodiumHistory(mockHistory);
  }, [data]);

  /**
   * Handles the click event on a brand card and navigates to the brand's page.
   */
  const handleClickCard = useCallback(
    (id: Brand["id"]) => {
      navigate(`/brand/${id}`);
    },
    [navigate]
  );

  /**
   * Handles sharing a podium result
   */
  const handleShare = useCallback((podiumIndex: number) => {
    // Implement share functionality
    console.log("Share podium:", podiumIndex);
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.podiumsList}>
        {podiumHistory.map((podium, index) => (
          <div key={`podium-${index}`} className={styles.podiumItem}>
            {/* Time label for non-current podiums */}

            <div className={styles.podiumRow}>
              {/* Left section - 80% width */}
              <div className={styles.podiumContent}>
                <div className={styles.podiumGrid}>
                  {podium.brands.slice(0, 3).map((brand, brandIndex) => (
                    <BrandCard
                      key={`podium-${index}-brand-${brandIndex}`}
                      name={brand.name}
                      photoUrl={brand.imageUrl}
                      orientation={
                        brandIndex % 3 === 0
                          ? "left"
                          : brandIndex % 3 === 1
                          ? "center"
                          : "right"
                      }
                      score={period === "week" ? brand.scoreWeek : brand.score}
                      variation={getBrandScoreVariation(
                        period === "week"
                          ? brand.stateScoreWeek
                          : brand.stateScore
                      )}
                      size="s"
                      onClick={() => handleClickCard(brand.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Right section - 20% width */}
              <div className={styles.rightSection}>
                <button
                  className={styles.shareButton}
                  onClick={() => handleShare(index)}
                  aria-label={`Share podium ${index + 1}`}
                >
                  <div className={styles.shareIcon}>
                    <ShareIcon />
                  </div>
                </button>

                {/* Time ago text in the right section */}
                {podium.timeAgo && (
                  <Typography
                    size={10}
                    weight="medium"
                    className={styles.timeAgoText}
                  >
                    {podium.timeAgo}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPodiums;
