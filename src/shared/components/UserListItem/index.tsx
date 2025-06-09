// /src/components/UserListItem/index.tsx

// Dependencies
import React from "react";

// Components
import Typography from "@/components/Typography";

// StyleSheet
import styles from "./UserListItem.module.scss";

// Types
interface UserListItemProps {
  position: number;
  name: string;
  photoUrl: string;
  score: number;
  onClick?: () => void;
}

function UserListItem({
  position,
  name,
  photoUrl,
  score,
  onClick,
}: UserListItemProps): React.ReactNode {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getPositionString = (pos: number): string => {
    return pos.toString().padStart(2, "0");
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.position}>
        <Typography size={14} weight="medium" className={styles.positionText}>
          {getPositionString(position)}
        </Typography>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <img
            src={photoUrl}
            alt={name}
            className={styles.avatarImage}
            onError={(e) => {
              // Fallback to a default avatar if image fails to load
              (e.target as HTMLImageElement).src = "/default-avatar.png";
            }}
          />
        </div>

        <div className={styles.details}>
          <Typography size={16} weight="medium" className={styles.name}>
            {name}
          </Typography>
        </div>
      </div>

      <div className={styles.score}>
        <Typography size={16} weight="bold" className={styles.scoreText}>
          {score}
        </Typography>
        <div className={styles.scoreIcon}>🏁</div>
      </div>
    </div>
  );
}

export default UserListItem;
