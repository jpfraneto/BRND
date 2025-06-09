// Dependencies
import React, { useCallback } from "react";
import classNames from "clsx";
import { useNavigate, useLocation } from "react-router-dom";

// StyleSheet
import styles from "./NavigationBar.module.scss";

// Assets
import HomeIcon from "@/assets/icons/home.svg?react";
import PodiumIcon from "@/assets/icons/podium-icon.svg?react";
import CreateIcon from "@/assets/icons/create-icon.svg?react";
import RankingIcon from "@/assets/icons/ranking-icon.svg?react";
import LeadersIcon from "@/assets/icons/leaders-icon.svg?react";

// Components
import Typography from "../Typography";

// Hooks
import { useAuth } from "@/hooks/auth";
import sdk from "@farcaster/frame-sdk";

interface NavigationBarProps {}

const NavigationBar: React.FC<NavigationBarProps> = () => {
  const { data } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles navigation to home page
   */
  const handleClickHome = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/");
  }, [navigate]);

  /**
   * Handles navigation to podium page
   */
  const handleClickPodium = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/podium");
  }, [navigate]);

  /**
   * Handles the main create/vote action
   */
  const handleClickCreate = useCallback(() => {
    sdk.haptics.selectionChanged();
    const currentUnixDate = Math.floor(new Date().getTime() / 1000);
    navigate(data?.hasVotedToday ? `/vote/${currentUnixDate}` : "/vote");
  }, [data, navigate]);

  /**
   * Handles navigation to ranking page
   */
  const handleClickRanking = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/ranking");
  }, [navigate]);

  /**
   * Handles navigation to leaders page
   */
  const handleClickLeaders = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/leaderboard");
  }, [navigate]);

  /**
   * Determines if a tab is active based on current route
   */
  const isActive = useCallback(
    (path: string) => {
      if (path === "/" && location.pathname === "/") return true;
      if (path !== "/" && location.pathname.startsWith(path)) return true;
      return false;
    },
    [location.pathname]
  );

  return (
    <div className={classNames(styles.layout)}>
      {/* Home Tab */}
      <button
        className={classNames(styles.tab, { [styles.active]: isActive("/") })}
        onClick={handleClickHome}
      >
        <div className={styles.iconWrapper}>
          <HomeIcon className={styles.icon} />
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Home
        </Typography>
      </button>

      {/* Podium Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/podium"),
        })}
        onClick={handleClickPodium}
      >
        <div className={styles.iconWrapper}>
          <PodiumIcon className={styles.icon} />
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Podium
        </Typography>
      </button>

      {/* Create Tab (Center with special styling) */}
      <button
        className={classNames(styles.tab, styles.createTab, {
          [styles.active]: isActive("/vote"),
        })}
        onClick={handleClickCreate}
      >
        <div className={styles.createIconWrapper}>
          <CreateIcon className={styles.createIcon} />
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Create
        </Typography>
      </button>

      {/* Ranking Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/ranking"),
        })}
        onClick={handleClickRanking}
      >
        <div className={styles.iconWrapper}>
          <RankingIcon className={styles.icon} />
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Ranking
        </Typography>
      </button>

      {/* Leaders Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/leaderboard"),
        })}
        onClick={handleClickLeaders}
      >
        <div className={styles.iconWrapper}>
          <LeadersIcon className={styles.icon} />
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Leaders
        </Typography>
      </button>
    </div>
  );
};

export default NavigationBar;
