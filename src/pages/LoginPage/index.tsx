// Dependencies
import { useCallback, useEffect, useMemo } from "react";
import { SignInButton, UseSignInData, useProfile } from "@farcaster/auth-kit";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";

// Hooks
import { useAuth } from "@/hooks/auth";
import { ModalsIds, useModal } from "@/shared/hooks/ui";

// StyleSheet
import styles from "./LoginPage.module.scss";

// Assets
import Logo from "@/assets/images/logo.svg";
import BRNDImage1 from "@/assets/images/brnd-intro-imgs/png-brnd-brand-page.png";
import BRNDImage2 from "@/assets/images/brnd-intro-imgs/png-brnd-grid.png";
import BRNDImage3 from "@/assets/images/brnd-intro-imgs/png-brnd-indicators.png";
import BRNDImage4 from "@/assets/images/brnd-intro-imgs/png-brnd-podium.png";
import BRNDImage5 from "@/assets/images/brnd-intro-imgs/png-brnd-ui-elements.png";
import BRNDImage6 from "@/assets/images/brnd-intro-imgs/png-brnd-user-rank.png";
import ExportAppIcon from "@/assets/icons/export-app-icon.svg?react";

// Components
import Typography from "@/components/Typography";
import Button from "@/components/Button";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";

const images = [
  BRNDImage1,
  BRNDImage2,
  BRNDImage3,
  BRNDImage4,
  BRNDImage5,
  BRNDImage6,
];

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useProfile();
  const { refetch } = useAuth();
  const { openModal } = useModal();

  const handleSignInSuccess = useCallback(async () => {
    try {
      // Get QuickAuth token
      const { token } = await sdk.actions.quickAuth();

      // Signal that miniapp is ready
      await sdk.actions.ready();

      // Load miniapp context
      await sdk.context;

      // Refresh auth data and get user state
      const result = await refetch();

      // Navigate based on user state
      if (result.data) {
        const { isNewUser, hasVotedToday } = result.data;
        let navigatePath = "/";
        if (isNewUser) {
          navigatePath = "/welcome";
        } else if (!hasVotedToday) {
          navigatePath = "/vote";
        }
        navigate(navigatePath);
      }
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  }, [navigate, refetch]);

  /**
   * Renders a decorative grid of animated squares.
   *
   * This component uses a useMemo hook to optimize performance by memoizing the rendered output.
   * It creates a grid of 14 squares, each with an animation that makes the square visible by changing
   * its opacity and vertical position. The animation for each square is staggered based on its index
   * to create a wave effect.
   *
   * @returns A React component representing the decorative grid.
   */
  const renderDecoration = useMemo(
    () => (
      <div className={styles.decorator}>
        <div className={styles.squareGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`--decoration-key-${i.toString()}`}
              className={styles.square}
            >
              <motion.div
                className={styles.box}
                initial="hidden"
                animate="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 300,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: i / 20,
                      type: "spring",
                      stiffness: 100,
                    },
                  },
                }}
              >
                <img src={images[i]} alt={`Square decorator ${i}`} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    ),
    []
  );

  /**
   * Handles the click event for the "How It Works" button.
   * Opens a modal with instructions on how to add the app to the home screen.
   */
  const handleClickHowToWorks = useCallback(() => {
    openModal(ModalsIds.BOTTOM_ALERT, {
      title: "Add BRND to your home screen",
      content: (
        <div className={styles.list}>
          <Typography size={14} weight={"regular"} lineHeight={18}>
            1. Tap the{" "}
            <span>
              <ExportAppIcon />
            </span>{" "}
            share icon at the bottom of the screen
          </Typography>
          <Typography size={14} weight={"regular"} lineHeight={18}>
            2. Select add to home screen
          </Typography>
          <Typography size={14} weight={"regular"} lineHeight={18}>
            3. Let's go play!
          </Typography>
        </div>
      ),
    });
  }, [openModal]);

  return (
    <div className={styles.body}>
      <div className={styles.inner}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.containerTitle}>
            <div className={styles.header}>
              <img src={Logo} className={styles.logo} alt={"BRND logotype"} />
            </div>

            <div className={styles.field}>
              <Typography
                weight={"light"}
                className={styles.title}
                textAlign={"center"}
              >
                Discover, build, and sync your Farcaster Landscape
              </Typography>
            </div>
          </div>
        </motion.div>
        {!isAuthenticated && (
          <motion.div
            className={styles.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SignInButton hideSignOut={true} onSuccess={handleSignInSuccess} />
            <Button
              caption={"Add to home screen"}
              variant={"underline"}
              onClick={handleClickHowToWorks}
            />
          </motion.div>
        )}
      </div>

      {renderDecoration}
    </div>
  );
}

export default withProtectionRoute(LoginPage, "only-disconnected");
