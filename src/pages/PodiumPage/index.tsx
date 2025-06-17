import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./PodiumPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import TabNavigator from "@/components/TabNavigator";
import PublicPodiumsFeed from "./partials/PublicPodiumsFeed";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import BrandHeader from "@/shared/components/BrandHeader";
import Typography from "@/shared/components/Typography";

function PodiumPage(): React.ReactNode {
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
              Discover the latest podiums and connect with their creators.
            </Typography>
          </div>

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
