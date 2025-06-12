// /src/components/UserListItem/index.tsx

// Dependencies
import React from "react";
import classNames from "clsx";

// Components
import Typography from "@/components/Typography";

// StyleSheet
import styles from "./UserListItem.module.scss";
import { User } from "@/shared/hooks/user";
import sdk from "@farcaster/frame-sdk";
import BPointIcon from "@/assets/icons/point-b.svg?react";

// Types
interface UserListItemProps {
  user: User;
  position: number;
}

function UserListItem({ user, position }: UserListItemProps): React.ReactNode {
  const handleClick = () => {
    sdk.actions.viewProfile({ fid: user.fid });
  };

  return (
    <button onClick={handleClick} className={styles.layout}>
      <Typography size={14} lineHeight={14} className={styles.position}>
        {position}
      </Typography>
      <div className={styles.row}>
        <div className={styles.avatarContainer}>
          <img
            className={styles.img}
            src={user.photoUrl}
            width={32}
            height={32}
            alt={`${user.username} profile picture`}
          />
        </div>
        <Typography size={14} lineHeight={18}>
          {user.username}
        </Typography>
      </div>
      <div className={classNames(styles.row, styles.score)}>
        <Typography size={14} lineHeight={14} className={styles.scoreText}>
          {user.points}
        </Typography>
      </div>
      <BPointIcon width={15} height={12} color="#fff" />
    </button>
  );
}

export default UserListItem;
