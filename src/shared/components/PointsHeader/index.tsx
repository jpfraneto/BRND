// src/shared/components/PointsHeader/index.tsx

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "clsx";

// StyleSheet
import styles from "./PointsHeader.module.scss";

// Components
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";

// Assets
import PointBIcon from "@/assets/icons/point-b.svg?react";
import GoBackIcon from "@/assets/icons/go-back-icon.svg?react";

// Hooks
import { useAuth } from "@/hooks/auth";
import sdk from "@farcaster/frame-sdk";

export const URL_HOW_IT_WORKS = import.meta.env.VITE_APP_HOW_IT_WORKS;

interface PointsHeaderProps {
  title?: string;
  showHowItWorks?: boolean;
  showBackButton?: boolean;
  backButtonPath?: string;
  className?: string;
  onBackClick?: () => void;
}

const PointsHeader: React.FC<PointsHeaderProps> = ({
  title = "Total BRND points earned for your contribution",
  showHowItWorks = true,
  showBackButton = true,
  backButtonPath = "/",
  className,
  onBackClick,
}) => {
  const navigate = useNavigate();
  const { data } = useAuth();

  const handleClickProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const handleHowItWorks = useCallback(() => {
    navigate("/welcome");
  }, [navigate]);

  const handleBackClick = useCallback(() => {
    sdk.haptics.selectionChanged();
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(backButtonPath);
    }
  }, [onBackClick, navigate, backButtonPath]);

  return (
    <div className={classNames(styles.header, className)}>
      {showBackButton && (
        <div className={styles.left}>
          <IconButton
            variant="solid"
            icon={<GoBackIcon />}
            onClick={handleBackClick}
            className={styles.backBtn}
          />
        </div>
      )}

      <div className={styles.user}>
        <div className={styles.profile}>
          <div className={styles.image} onClick={handleClickProfile}>
            <img
              src={data?.photoUrl}
              width={40}
              height={40}
              alt={data?.username}
            />
          </div>
          <div className={styles.points}>
            <Typography variant="geist" weight="bold" size={32} lineHeight={40}>
              {data?.points}
            </Typography>
            <PointBIcon />
          </div>
        </div>
        <Typography
          variant="geist"
          weight="regular"
          size={15}
          textAlign="center"
          lineHeight={20}
        >
          {title}
        </Typography>
        {showHowItWorks && (
          <div className={styles.center}>
            <Button
              caption="How it works"
              variant="primary"
              onClick={handleHowItWorks}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsHeader;
