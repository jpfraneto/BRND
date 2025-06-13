// src/components/NotificationPrompt/index.tsx

import React from "react";
import Button from "@/shared/components/Button";
import Typography from "@/shared/components/Typography";
import { NotificationPromptProps } from "@/shared/components/NotificationPrompt/types";
import { useNotificationPrompt } from "@/shared/hooks/notifications/useNotificationPrompt";
import styles from "./NotificationPrompt.module.scss";

const NotificationPrompt: React.FC<NotificationPromptProps> = ({
  onComplete,
  points = 100,
  userFid,
}) => {
  const { state, actions } = useNotificationPrompt(userFid, onComplete);

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
            We'll remind you to vote daily so you never miss earning points
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
          Never miss earning points!
        </Typography>

        <Typography size={14} className={styles.description}>
          You just earned {points} points! Get daily reminders to vote and keep
          climbing the leaderboard.
        </Typography>

        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>📅</span>
            <Typography size={12}>Daily vote reminders</Typography>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>🏆</span>
            <Typography size={12}>Stay competitive</Typography>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>💎</span>
            <Typography size={12}>Never miss points</Typography>
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
          caption="Maybe later"
          onClick={actions.skip}
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
