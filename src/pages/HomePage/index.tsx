// Dependencies
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./HomePage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import NewBrands from "./partials/NewBrands";
import TrendBrands from "./partials/TrendBrands";
import AllBrands from "./partials/AllBrands";
import TabNavigator from "@/components/TabNavigator";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import BrandHeader from "@/shared/components/BrandHeader";
import TimePeriodFilter, {
  BrandTimePeriod,
} from "@/shared/components/TimePeriodFilter";

function HomePage(): React.ReactNode {
  const [selectedPeriod, setSelectedPeriod] = useState<BrandTimePeriod>("all");

  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <BrandHeader showBackButton={false} />

          <div className={styles.tabs}>
            <TabNavigator
              tabs={[
                {
                  label: "Top",
                  path: "/",
                },
                {
                  label: "New",
                  path: "/new",
                },
                {
                  label: "All",
                  path: "/all",
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.periodFilter}>
          <TimePeriodFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        <Routes>
          <Route path="/" element={<TrendBrands period={selectedPeriod} />} />
          <Route path="/new" element={<NewBrands period={selectedPeriod} />} />
          <Route path="/all" element={<AllBrands period={selectedPeriod} />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(HomePage, "only-connected");
