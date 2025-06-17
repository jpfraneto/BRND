// Dependencies
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

// Components
import Typography from "@/components/Typography";
import Button from "@/components/Button";

// StyleSheet
import styles from "./CongratsView.module.scss";

// Assets
import Logo from "@/assets/images/logo.svg";
import sdk from "@farcaster/frame-sdk";

export const FRAME_URL = import.meta.env.VITE_APP_FRAME_URL;

export default function CongratsView() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  /**
   * Handle click event for the share button.
   * Opens the Farcaster compose dialog.
   */
  const handleClickShare = useCallback(async () => {
    try {
      const newCast = await sdk.actions.composeCast({
        text: "I just earned 3 BRND points by voting on my favorite brands! Join me and vote on /brnd to earn points too.",
        embeds: [FRAME_URL],
      });

      console.log("🎉 [CongratsView] Cast created:", newCast);
    } catch (error) {
      console.error("🎉 [CongratsView] Share error:", error);
    }
  }, []);

  const handleClickSkip = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className={styles.body}>
      <div className={styles.effect}>
        <Confetti width={width} height={height} />
      </div>

      <div className={styles.container}>
        <div className={styles.center}>
          <img src={Logo} className={styles.logo} alt="Logo" />
        </div>
      </div>

      <div className={styles.confirmation}>
        <Typography
          variant={"druk"}
          weight={"wide"}
          size={28}
          lineHeight={36}
          textAlign={"center"}
          className={styles.title}
        >
          Congrats! you won 3 BRND points
        </Typography>
        <Typography
          variant={"geist"}
          weight={"regular"}
          size={20}
          lineHeight={36}
          textAlign={"center"}
          className={styles.title}
        >
          Share the miniapp to earn 3 more points.
        </Typography>

        <div className={styles.share}>
          <Button
            variant={"primary"}
            caption={"Share"}
            onClick={handleClickShare}
          />
        </div>

        <div className={styles.action}>
          <Button
            variant={"underline"}
            caption="Skip"
            onClick={handleClickSkip}
          />
        </div>
      </div>
    </div>
  );
}
