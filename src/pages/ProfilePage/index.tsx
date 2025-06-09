// src/pages/ProfilePage/index.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./ProfilePage.module.scss";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import MyPodium from "./partials/MyPodium";
import MyBrands from "./partials/MyBrands";
import TabNavigator from "@/components/TabNavigator";
import PointsHeader from "@/shared/components/PointsHeader";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";

function ProfilePage(): React.ReactNode {
  return (
    <AppLayout>
      <div className={styles.body}>
        <PointsHeader />

        <div className={styles.tabs}>
          <TabNavigator
            tabs={[
              {
                label: "Rank",
                path: "/profile",
              },
              {
                label: "Podiums",
                path: "/profile/podium",
              },
            ]}
          />
        </div>

        <Routes>
          <Route path="/" element={<MyBrands />} />
          <Route path="/podium" element={<MyPodium />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(ProfilePage, "only-connected");
