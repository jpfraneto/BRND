import React from "react";
import Button from "@/shared/components/Button";
import Typography from "@/shared/components/Typography";
import { NotificationPromptProps } from "@/shared/components/NotificationPrompt/types";
import { useNotificationPrompt } from "@/shared/hooks/notifications/useNotificationPrompt";
import styles from "./NotificationPrompt.module.scss";
import sdk from "@farcaster/frame-sdk";

const NotificationPrompt: React.FC<NotificationPromptProps> = ({
  onComplete,
  points = 0,
  userFid,
}) => {
  const { state, actions } = useNotificationPrompt(userFid, onComplete);

  // Determine if this is being shown on app load vs after voting
  const isAppLoadContext = points === 0;

  if (state.isAdded) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <div className={styles.successIcon}>🎉</div>
          <Typography
            variant="druk"
            weight="wide"
            size={20}
            className={styles.successTitle}
          >
            You're all set!
          </Typography>
          <Typography size={14} className={styles.successText}>
            {isAppLoadContext
              ? "Welcome to BRND! We'll keep you updated with the latest."
              : "We'll remind you to vote daily so you never miss earning points"}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🔔</div>

        <Typography
          variant="druk"
          weight="wide"
          size={18}
          className={styles.title}
        >
          {isAppLoadContext
            ? "Get the best BRND experience!"
            : "Never miss earning points!"}
        </Typography>

        <Typography size={14} className={styles.description}>
          {isAppLoadContext
            ? "Add BRND to your apps to get daily vote reminders and stay competitive on the leaderboard."
            : `You just earned ${points} points! Get daily reminders to vote and keep climbing the leaderboard.`}
        </Typography>

        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>📅</span>
            <Typography size={12}>Daily vote reminders</Typography>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>🏆</span>
            <Typography size={12}>Monthly brand champions</Typography>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>💎</span>
            <Typography size={12}>Never miss earning points</Typography>
          </div>
        </div>

        {state.error && (
          <Typography size={12} className={styles.error}>
            {state.error}
          </Typography>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          caption="Later"
          onClick={() => {
            sdk.haptics.selectionChanged();
            actions.skip();
          }}
          className={styles.skipButton}
        />
        <Button
          variant="primary"
          caption={state.isLoading ? "Adding..." : "Add BRND"}
          onClick={actions.addMiniapp}
          className={styles.addButton}
        />
      </div>
    </div>
  );
};

export default NotificationPrompt;
