// /src/pages/HomePage/partials/NewBrands/index.tsx

// Components
import BrandsList from "@/components/BrandsList";

// Services
import { BrandTimePeriod } from "@/services/brands";

// StyleSheet
import styles from "./NewBrands.module.scss";

interface NewBrandsProps {
  period: BrandTimePeriod;
}

function NewBrands({ period }: NewBrandsProps) {
  return (
    <div className={styles.layout}>
      <BrandsList
        isFinderEnabled={false}
        config={{
          order: "new",
          limit: 9,
          period,
        }}
      />
    </div>
  );
}

export default NewBrands;
