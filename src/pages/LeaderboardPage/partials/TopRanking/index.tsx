// /src/pages/RankingPage/partials/TopRanking/index.tsx

// Dependencies
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { BrandListItem } from "@/components/BrandListItem";

// StyleSheet
import styles from "./TopRanking.module.scss";

// Hook
import { Brand, useBrandList } from "@/hooks/brands";
import useDisableScrollBody from "@/hooks/ui/useDisableScrollBody";

// Utils
import { getBrandScoreVariation } from "@/utils/brand";

function TopRanking() {
  const navigate = useNavigate();
  const { data, refetch } = useBrandList("top", "", 1, 50);
  useDisableScrollBody();

  useEffect(() => {
    refetch();
  }, []);

  /**
   * Handles the click event on a brand card and navigates to the brand's page.
   *
   * @param {Brand['id']} id - The ID of the brand.
   */
  const handleClickCard = useCallback((id: Brand["id"]) => {
    navigate(`/brand/${id}`);
  }, []);

  return (
    <div className={styles.layout}>
      {data.brands && data.brands.length > 0 && (
        <ul className={styles.grid}>
          {data.brands.map((brand, index) => (
            <li key={`--brand-item-${index.toString()}`}>
              <BrandListItem
                position={index + 1}
                name={brand.name}
                photoUrl={brand.imageUrl}
                score={brand.score}
                variation={getBrandScoreVariation(brand.stateScore)}
                onClick={() => handleClickCard(brand.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TopRanking;
