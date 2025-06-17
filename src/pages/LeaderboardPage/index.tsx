import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./LeaderboardPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import TabNavigator from "@/components/TabNavigator";
import LeaderboardFeed from "./partials/LeaderboardFeed";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import BrandHeader from "@/shared/components/BrandHeader";
import Typography from "@/shared/components/Typography";

function LeaderboardPage(): React.ReactNode {
  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <BrandHeader showBackButton={true} />

          <div className={styles.tabs}>
            <TabNavigator
              tabs={[
                {
                  label: "Leaderboard",
                  path: "/leaderboard",
                },
              ]}
            />
          </div>
          <div className={styles.description}>
            <Typography
              variant="geist"
              weight="regular"
              size={15}
              textAlign="left"
              lineHeight={0}
            >
              Your rank:
            </Typography>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<LeaderboardFeed />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(LeaderboardPage, "only-connected");
