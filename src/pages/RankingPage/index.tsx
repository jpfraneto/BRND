// /src/pages/RankingPage/index.tsx

// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./RankingPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import TopRanking from "./partials/TopRanking";
import TabNavigator from "@/components/TabNavigator";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import Typography from "@/shared/components/Typography";
import BrandHeader from "@/shared/components/BrandHeader";

function RankingPage(): React.ReactNode {
  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <BrandHeader />
          <div className={styles.description}>
            <Typography
              variant="geist"
              weight="regular"
              size={15}
              textAlign="left"
              lineHeight={20}
            >
              Overall ranking of brand scores.
            </Typography>
          </div>

          <div className={styles.tabs}>
            <TabNavigator
              tabs={[
                {
                  label: "Global Ranking",
                  path: "/ranking",
                },
              ]}
            />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<TopRanking />} />
          {/* <Route path="/podiums" element={<RankPodiums />} /> */}
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(RankingPage, "only-connected");
