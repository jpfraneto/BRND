// src/pages/LeaderboardPage/index.tsx

import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// StyleSheet
import styles from "./LeaderboardPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import Typography from "@/components/Typography";
import UserListItem from "@/shared/components/UserListItem";
import BrandHeader from "@/shared/components/BrandHeader";

// Assets
import ShareIcon from "@/assets/icons/share-icon.svg";

// Hooks
import { useUserLeaderboard } from "@/shared/hooks/user/useUserLeaderboard";
import useDisableScrollBody from "@/hooks/ui/useDisableScrollBody";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import { User } from "@/shared/hooks/user";

function LeaderboardPage(): React.ReactNode {
  const navigate = useNavigate();
  const { data, refetch } = useUserLeaderboard(1, 50);
  useDisableScrollBody();

  useEffect(() => {
    refetch();
  }, []);

  /**
   * Handles the click event on a user item and navigates to the user's profile.
   *
   * @param {User['id']} id - The ID of the user.
   */
  const handleClickUser = useCallback(
    (id: User["id"]) => {
      navigate(`/user/${id}`);
    },
    [navigate]
  );

  /**
   * Handles sharing the leaderboard
   */
  const handleShareLeaderboard = useCallback(() => {
    // Implement share functionality
    console.log("Share leaderboard");
  }, []);

  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <BrandHeader showBackButton={true} />

          <div className={styles.titleSection}>
            <Typography
              variant={"druk"}
              weight={"wide"}
              className={styles.title}
              size={20}
            >
              Leaderboard
            </Typography>
          </div>
        </div>

        <div className={styles.content}>
          {data?.users && data.users.length > 0 && (
            <ul className={styles.usersList}>
              {data.users.map((user, index) => (
                <li key={`--user-item-${index.toString()}`}>
                  <UserListItem
                    position={index + 1}
                    name={user.username}
                    photoUrl={user.photoUrl}
                    score={user.points}
                    onClick={() => handleClickUser(user.id)}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className={styles.shareSection}>
            <button
              className={styles.shareButton}
              onClick={handleShareLeaderboard}
            >
              <img src={ShareIcon} className={styles.shareIcon} alt="Share" />
              <Typography
                size={16}
                weight="medium"
                className={styles.shareText}
              >
                Share leaderboard
              </Typography>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(LeaderboardPage, "only-connected");
