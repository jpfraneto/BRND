// Dependencies
import { useMemo, useContext } from "react";
import { useProfile } from "@farcaster/auth-kit";
import { motion } from "framer-motion";
import { AuthContext } from "@/shared/providers/AppProvider";

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

// Components
import Typography from "@/components/Typography";

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
  const { isAuthenticated } = useProfile();
  const { miniappContext, isInitialized } = useContext(AuthContext);

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

  // Determine what to show based on different states
  const renderFooterContent = () => {
    // If miniapp hasn't been initialized or no user context, show "Open Miniapp" button
    if (!isInitialized || !miniappContext?.user?.fid) {
      return (
        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            href="https://farcaster.xyz/brnd-miniapp"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryButton}
          >
            <span>
              <Typography>Open Miniapp</Typography>
            </span>
          </a>
        </motion.div>
      );
    }

    // If we have user context but there's an auth error (server communication issue)
    if (!isAuthenticated && miniappContext?.user?.fid) {
      return (
        <>
          <motion.div
            className={styles.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a
              href={`https://farcaster.xyz/~/inbox/create/16098?text=${encodeURIComponent(
                "hey jp, there is an error with the BRND miniapp"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              <span>
                <Typography>DM @jpfraneto.eth</Typography>
              </span>
            </a>
            <div className={styles.errorMessage}>
              <Typography weight="light" textAlign="center">
                There was a problem communicating with the server. Please
                contact the dev to fix it.
              </Typography>
            </div>
          </motion.div>
        </>
      );
    }

    // Default fallback
    return null;
  };

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

        {renderFooterContent()}
      </div>

      {renderDecoration}
    </div>
  );
}

export default withProtectionRoute(LoginPage, "only-disconnected");
