// Dependencies
import React from "react";
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

function HomePage(): React.ReactNode {
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
        <Routes>
          <Route path="/" element={<TrendBrands />} />
          <Route path="/new" element={<NewBrands />} />
          <Route path="/all" element={<AllBrands />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(HomePage, "only-connected");
