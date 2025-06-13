// /src/pages/HomePage/partials/AllBrands/index.tsx

// Components
import BrandsList from "@/components/BrandsList";

// Services
import { BrandTimePeriod } from "@/services/brands";

// StyleSheet
import styles from "./AllBrands.module.scss";

interface AllBrandsProps {
  period: BrandTimePeriod;
}

function AllBrands({ period }: AllBrandsProps) {
  return (
    <div className={styles.layout}>
      <BrandsList
        isFinderEnabled={true}
        config={{
          order: "all",
          limit: 27,
          period,
        }}
      />
    </div>
  );
}

export default AllBrands;
