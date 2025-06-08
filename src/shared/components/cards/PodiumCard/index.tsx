// /src/components/cards/PodiumCard/index.tsx

// Dependencies
import React from "react";
import classNames from "clsx";

// Components
import Typography from "@/components/Typography";

// StyleSheet
import styles from "./PodiumCard.module.scss";

// Types
import { BrandStateScoreType } from "@/hooks/brands";

interface PodiumCardProps {
  position: number;
  name: string;
  photoUrl: string;
  score: number;
  variation: BrandStateScoreType;
  onClick?: () => void;
  className?: string;
}

const PodiumCard: React.FC<PodiumCardProps> = ({
  position,
  name,
  photoUrl,
  score,
  variation,
  onClick,
  className,
}) => {
  const getPositionIcon = () => {
    switch (position) {
      case 1:
        return (
          <div className={styles.firstPlace}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FFD700" />
              <path
                d="M12 7L13.5 10.5L17 10.5L14.25 12.75L15.5 16.5L12 14.25L8.5 16.5L9.75 12.75L7 10.5L10.5 10.5L12 7Z"
                fill="#FFA500"
              />
            </svg>
          </div>
        );
      case 2:
        return (
          <div className={styles.secondPlace}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#C0C0C0" />
              <path
                d="M12 7L13.5 10.5L17 10.5L14.25 12.75L15.5 16.5L12 14.25L8.5 16.5L9.75 12.75L7 10.5L10.5 10.5L12 7Z"
                fill="#A0A0A0"
              />
            </svg>
          </div>
        );
      case 3:
        return (
          <div className={styles.thirdPlace}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#CD7F32" />
              <path
                d="M12 7L13.5 10.5L17 10.5L14.25 12.75L15.5 16.5L12 14.25L8.5 16.5L9.75 12.75L7 10.5L10.5 10.5L12 7Z"
                fill="#B8860B"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getVariationIcon = () => {
    if (variation === "up") {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2L10 8H2L6 2Z" fill="#22c55e" />
        </svg>
      );
    }
    if (variation === "down") {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 10L2 4H10L6 10Z" fill="#ef4444" />
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="2" y="5" width="8" height="2" fill="#6b7280" />
      </svg>
    );
  };

  return (
    <button className={classNames(styles.card, className)} onClick={onClick}>
      <div className={styles.header}>
        {getPositionIcon()}
        <div className={styles.scoreContainer}>
          <Typography size={14} weight="bold" className={styles.score}>
            {score}
          </Typography>
          <div className={styles.variation}>{getVariationIcon()}</div>
        </div>
      </div>

      <div className={styles.brandImage}>
        <img src={photoUrl} alt={name} className={styles.image} />
      </div>

      <div className={styles.footer}>
        <Typography size={12} weight="medium" className={styles.name}>
          {name}
        </Typography>
      </div>
    </button>
  );
};

export default PodiumCard;
