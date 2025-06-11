// src/shared/components/BrandHeader/index.tsx

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "clsx";

// StyleSheet
import styles from "./BrandHeader.module.scss";

// Components
import Typography from "@/components/Typography";
import IconButton from "@/components/IconButton";

// Assets
import Logo from "@/assets/images/logo.svg";
import BPointIcon from "@/assets/icons/point-b.svg?react";
import GoBackIcon from "@/assets/icons/go-back-icon.svg?react";

// Hooks
import { useAuth } from "@/hooks/auth";
import sdk from "@farcaster/frame-sdk";

interface BrandHeaderProps {
  className?: string;
  showBackButton?: boolean;
  backButtonPath?: string;
  onBackClick?: () => void;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({
  className,
  showBackButton = true,
  backButtonPath = "/",
  onBackClick,
}) => {
  const navigate = useNavigate();
  const { data } = useAuth();

  const handleClickProfile = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/profile");
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

      <img src={Logo} className={styles.logo} alt="BRND Logo" />

      <button className={styles.profileButton} onClick={handleClickProfile}>
        <div className={styles.points}>
          <Typography weight="regular" size={14} lineHeight={18}>
            {data?.points}
          </Typography>
          <BPointIcon width={15} height={12} />
        </div>
        <img
          alt={data?.username}
          className={styles.avatar}
          src={data?.photoUrl}
          width={32}
          height={32}
        />
      </button>
    </div>
  );
};

export default BrandHeader;
