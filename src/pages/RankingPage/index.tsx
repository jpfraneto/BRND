// /src/pages/RankingPage/index.tsx

// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./RankingPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import TopRanking from "./partials/TopRanking";
import RankPodiums from "./partials/RankPodiums";
import TabNavigator from "@/components/TabNavigator";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import PointsHeader from "@/shared/components/PointsHeader";

function RankingPage(): React.ReactNode {
  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <PointsHeader />

          <div className={styles.tabs}>
            <TabNavigator
              tabs={[
                {
                  label: "Rank",
                  path: "/ranking",
                },
                {
                  label: "Podiums",
                  path: "/ranking/podiums",
                },
              ]}
            />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<TopRanking />} />
          <Route path="/podiums" element={<RankPodiums />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(RankingPage, "only-connected");
