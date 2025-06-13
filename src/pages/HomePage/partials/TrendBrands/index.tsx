// /src/pages/HomePage/partials/TrendBrands/index.tsx

// Dependencies
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Components
import BrandCard from "@/components/cards/BrandCard";
import { BrandListItem } from "@/components/BrandListItem";

// StyleSheet
import styles from "./TrendBrands.module.scss";

// Hook
import { Brand, useBrandList } from "@/hooks/brands";
import useDisableScrollBody from "@/hooks/ui/useDisableScrollBody";

// Utils
import { getBrandScoreVariation } from "@/utils/brand";

// Assets
import FeatureFarcasterBrand from "@/assets/images/feature-farcaster-brand.svg?react";
import { BrandTimePeriod } from "@/shared/components/TimePeriodFilter";

interface TrendBrandsProps {
  period: BrandTimePeriod;
}

function TrendBrands({ period }: TrendBrandsProps) {
  const navigate = useNavigate();
  const { data, refetch } = useBrandList("top", "", 1, 10, period);
  useDisableScrollBody();

  useEffect(() => {
    refetch();
  }, [period]);

  const getScoreForPeriod = useCallback(
    (brand: Brand): number => {
      switch (period) {
        case "week":
          return brand.scoreWeek;
        case "month":
          return brand.scoreMonth || brand.scoreWeek;
        case "all":
        default:
          return brand.score;
      }
    },
    [period]
  );

  const getStateScoreForPeriod = useCallback(
    (brand: Brand): number => {
      switch (period) {
        case "week":
          return brand.stateScoreWeek;
        case "month":
          return brand.stateScoreMonth || brand.stateScoreWeek;
        case "all":
        default:
          return brand.stateScore;
      }
    },
    [period]
  );

  /**
   * Memoized computation to get the main brand from the list of brands.
   *
   * @constant
   * @type {Brand | undefined}
   * @default undefined
   * @returns {Brand | undefined} The main brand or undefined if no brands are available.
   */
  const mainBrand = useMemo<Brand | undefined>(
    () => data?.brands?.[0],
    [data?.brands]
  );

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
      {mainBrand && (
        <div className={styles.inner}>
          <div className={styles.feature}>
            <div className={styles.image}>
              <FeatureFarcasterBrand />
            </div>
            <div className={styles.brand}>
              <BrandCard
                size={"l"}
                selected={true}
                orientation={"center"}
                className={styles.brandCard}
                name={mainBrand.name}
                photoUrl={mainBrand.imageUrl}
                score={getScoreForPeriod(mainBrand)}
                onClick={() => handleClickCard(mainBrand.id)}
                variation={getBrandScoreVariation(
                  getStateScoreForPeriod(mainBrand)
                )}
              />
            </div>
          </div>
        </div>
      )}

      {data.brands && data.brands.length > 1 && (
        <ul className={styles.grid}>
          {data.brands.map((brand, index) => (
            <li key={`--brand-item-${index.toString()}`}>
              <BrandListItem
                position={index + 1}
                name={brand.name}
                photoUrl={brand.imageUrl}
                score={getScoreForPeriod(brand)}
                variation={getBrandScoreVariation(
                  getStateScoreForPeriod(brand)
                )}
                onClick={() => handleClickCard(brand.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TrendBrands;
