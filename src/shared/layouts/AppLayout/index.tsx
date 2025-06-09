// src/shared/layouts/AppLayout/index.tsx

import React from "react";

// Components
import NavigationBar from "@/components/NavigationBar";

// StyleSheet
import styles from "./AppLayout.module.scss";

// Hooks
import { useAuth } from "@/hooks/auth";

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { data: user } = useAuth();

  return (
    <div className={styles.layout}>
      <div className={styles.content}>{children}</div>

      {user && (
        <div className={styles.bar}>
          <NavigationBar />
        </div>
      )}
    </div>
  );
};

export default AppLayout;
