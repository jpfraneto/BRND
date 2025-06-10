import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./PodiumPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import TabNavigator from "@/components/TabNavigator";
import PointsHeader from "@/shared/components/PointsHeader";
import PublicPodiumsFeed from "./partials/PublicPodiumsFeed";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";

function PodiumPage(): React.ReactNode {
  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <PointsHeader />

          <div className={styles.tabs}>
            <TabNavigator
              tabs={[
                {
                  label: "Podiums",
                  path: "/podium",
                },
              ]}
            />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<PublicPodiumsFeed />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(PodiumPage, "only-connected");
