import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// StyleSheet
import styles from "./MyBrands.module.scss";

// Hooks
import { useUserBrands } from "@/hooks/user";

// Components
import { BrandListItem } from "@/shared/components/BrandListItem";
import LoaderIndicator from "@/shared/components/LoaderIndicator";
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";

function MyBrands() {
  const navigate = useNavigate();
  const { data: userBrands, isLoading, error, refetch } = useUserBrands();

  /**
   * Handles the click event on a brand card and navigates to the brand's page.
   */
  const handleClickCard = useCallback(
    (id: number) => {
      navigate(`/brand/${id}`);
    },
    [navigate]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.layout}>
        <LoaderIndicator size={30} variant={"fullscreen"} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.layout}>
        <div className={styles.error}>
          Failed to load your brand rankings.
          <button onClick={() => refetch()} className={styles.retryButton}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!userBrands || userBrands.length === 0) {
    return (
      <div className={styles.layout}>
        <div className={styles.empty}>
          <Typography size={16} weight={"regular"} lineHeight={20}>
            No brand rankings yet
          </Typography>
          <Typography size={16} weight={"regular"} lineHeight={20}>
            Start voting to see your personal brand rankings!
          </Typography>
          <div className={styles.center}>
            <Button
              caption="Vote Now"
              variant="primary"
              onClick={() => navigate("/vote")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Simple scrollable grid - just like TrendBrands */}
      <ul className={styles.grid}>
        {userBrands.map((userBrand, index) => (
          <li key={`--user-brand-item-${userBrand.brand.id}`}>
            <BrandListItem
              position={index + 1}
              name={userBrand.brand.name}
              photoUrl={userBrand.brand.imageUrl}
              score={userBrand.points}
              // No variation for personal rankings
              variation={"hide"}
              onClick={() => handleClickCard(userBrand.brand.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBrands;
