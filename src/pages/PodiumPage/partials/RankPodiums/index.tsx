// /src/pages/PodiumPage/partials/RankPodiums/index.tsx

// Dependencies
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import PodiumCard from "@/components/cards/PodiumCard";
import Typography from "@/components/Typography";

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

function RankPodiums({ period }: RankPodiumsProps) {
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
      <div className={styles.header}>
        <Typography size={24} weight="bold" className={styles.title}>
          RANK PODIUMS
        </Typography>
      </div>

      <div className={styles.podiumsList}>
        {podiumHistory.map((podium, index) => (
          <div key={`podium-${index}`} className={styles.podiumItem}>
            {podium.timeAgo && (
              <div className={styles.timeLabel}>
                <Typography
                  size={12}
                  weight="medium"
                  className={styles.timeText}
                >
                  {podium.timeAgo}
                </Typography>
              </div>
            )}

            <div className={styles.podiumGrid}>
              {podium.brands.slice(0, 3).map((brand, brandIndex) => (
                <PodiumCard
                  key={`podium-${index}-brand-${brandIndex}`}
                  position={brandIndex + 1}
                  name={brand.name}
                  photoUrl={brand.imageUrl}
                  score={period === "week" ? brand.scoreWeek : brand.score}
                  variation={getBrandScoreVariation(
                    period === "week" ? brand.stateScoreWeek : brand.stateScore
                  )}
                  onClick={() => handleClickCard(brand.id)}
                />
              ))}
            </div>

            <button
              className={styles.shareButton}
              onClick={() => handleShare(index)}
            >
              <div className={styles.shareIcon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1L8 11M8 1L4 5M8 1L12 5M3 12L13 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RankPodiums;
