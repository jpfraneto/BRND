// Dependencies
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

// Components
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import NotificationPrompt from "@/shared/components/NotificationPrompt";
import {
  shouldShowNotificationPrompt,
  markNotificationsEnabled,
} from "@/shared/utils/notifications";

// Hooks
import { useAuth } from "@/hooks/auth";

// StyleSheet
import styles from "./CongratsView.module.scss";

// Assets
import Logo from "@/assets/images/logo.svg";

export default function CongratsView() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const { data: user } = useAuth();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  /**
   * Handle click event for the continue button.
   * Navigates to the home page.
   */
  const handleClickContinue = useCallback(() => {
    navigate("/");
  }, [navigate]);

  /**
   * Handle completion of notification prompt flow
   */
  const handleNotificationComplete = useCallback(
    (added: boolean): void => {
      setShowNotificationPrompt(false);

      if (added && user) {
        // Mark as enabled in localStorage for future reference
        markNotificationsEnabled(user.fid);
        console.log("User successfully added BRND to their apps!");
      }
    },
    [user]
  );

  /**
   * Check if we should show notification prompt after congrats settles
   */
  useEffect(() => {
    if (!user) return;

    // Check if we should show the prompt using our smart logic
    const shouldShow = shouldShowNotificationPrompt(
      user.fid,
      user.notificationsEnabled || false // Backend notification state
    );

    if (shouldShow) {
      // Show notification prompt after confetti and celebration
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 2000); // 2 seconds to let the celebration sink in

      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <div className={styles.body}>
      <div className={styles.effect}>
        <Confetti width={width} height={height} />
      </div>

      <div className={styles.container}>
        <div className={styles.center}>
          <img src={Logo} className={styles.logo} alt="Logo" />
        </div>
      </div>

      <div className={styles.confirmation}>
        <Typography
          variant={"druk"}
          weight={"wide"}
          size={28}
          lineHeight={36}
          textAlign={"center"}
          className={styles.title}
        >
          Congrats! you have won 100 BRND points
        </Typography>

        {/* Conditional notification prompt */}
        {showNotificationPrompt && user && (
          <NotificationPrompt
            userFid={user.fid}
            onComplete={handleNotificationComplete}
            points={100}
          />
        )}

        <Button caption={"Discover new brands"} onClick={handleClickContinue} />
      </div>
    </div>
  );
}
