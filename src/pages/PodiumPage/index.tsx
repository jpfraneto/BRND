// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./PodiumPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import TabNavigator from "@/components/TabNavigator";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import PointsHeader from "@/shared/components/PointsHeader";
import UserPodiums from "./partials/UserPodiums";

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
                // {
                //   label: "Podiums",
                //   path: "/podium/podium",
                // },
              ]}
            />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<UserPodiums period="week" />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(PodiumPage, "only-connected");
