// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./PodiumPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import RankPodiums from "./partials/RankPodiums";
import TabNavigator from "@/components/TabNavigator";

// Assets
import Logo from "@/assets/images/logo.svg";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";

function PodiumPage(): React.ReactNode {
  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <img src={Logo} className={styles.logo} alt="Logo" />

          <div className={styles.tabs}>
            <TabNavigator
              tabs={[
                {
                  label: "This week",
                  path: "/podium",
                },
                {
                  label: "This month",
                  path: "/podium/month",
                },
                {
                  label: "All time",
                  path: "/podium/all-time",
                },
              ]}
            />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<RankPodiums period="week" />} />
          <Route path="/month" element={<RankPodiums period="month" />} />
          <Route path="/all-time" element={<RankPodiums period="all" />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(PodiumPage, "only-connected");
