import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Podium from "@/components/Podium";
import Typography from "@/components/Typography";
import Button from "@/components/Button";

// Types
import { VotingViewProps } from "../../types";

// StyleSheet
import styles from "./AlreadySharedView.module.scss";

// Assets
import sdk from "@farcaster/frame-sdk";

interface Place {
  icon: string;
  name: string;
}

interface AlreadySharedViewProps extends VotingViewProps {}

export default function AlreadySharedView({
  currentBrands,
  currentVoteId,
}: AlreadySharedViewProps) {
  const navigate = useNavigate();

  console.log("✅ [AlreadySharedView] Current brands:", currentBrands);
  console.log("✅ [AlreadySharedView] Current vote ID:", currentVoteId);

  /**
   * Handles the click event for the "Continue" button.
   */
  const handleClickContinue = useCallback(() => {
    sdk.haptics.impactOccurred("medium");
    if (!currentVoteId || currentVoteId === "") {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [currentVoteId, navigate]);

  // Safely create places array
  const places: Place[] =
    currentBrands && currentBrands.length >= 3
      ? [
          {
            icon: "🥇",
            name:
              currentBrands[1]?.profile ||
              currentBrands[1]?.channel ||
              currentBrands[1]?.name,
          },
          {
            icon: "🥈",
            name:
              currentBrands[0]?.profile ||
              currentBrands[0]?.channel ||
              currentBrands[0]?.name,
          },
          {
            icon: "🥉",
            name:
              currentBrands[2]?.profile ||
              currentBrands[2]?.channel ||
              currentBrands[2]?.name,
          },
        ]
      : [];

  // Show loading state if data is missing
  if (!currentBrands || currentBrands.length < 3 || !currentVoteId) {
    return (
      <div className={styles.body}>
        <div className={styles.container}>
          <Typography>Loading vote data...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <div className={styles.successMessage}>
        <Typography
          variant={"geist"}
          weight={"medium"}
          size={16}
          lineHeight={20}
          textAlign={"center"}
        >
          Your vote has been shared successfully.
        </Typography>
        <Typography
          variant={"geist"}
          weight={"regular"}
          size={14}
          lineHeight={18}
          textAlign={"center"}
          className={styles.pointsText}
        >
          You earned 6 BRND points today (3 for voting + 3 for sharing)
        </Typography>
      </div>

      <div className={styles.box}>
        <Typography
          variant={"geist"}
          weight={"regular"}
          size={16}
          lineHeight={20}
        >
          Your BRND podium of today:
        </Typography>
        <div className={styles.places}>
          {places.map((place, index) => (
            <Typography
              key={`--place-${index.toString()}`}
              variant={"geist"}
              weight={"regular"}
              size={16}
              lineHeight={20}
            >
              {place.icon} {place.name}
            </Typography>
          ))}
        </div>

        <div className={styles.podium}>
          <Podium
            isAnimated={false}
            variant={"readonly"}
            initial={currentBrands}
          />
        </div>
      </div>

      <div className={styles.actionGroup}>
        <Button
          variant={"primary"}
          caption="Continue"
          onClick={handleClickContinue}
        />
      </div>
    </div>
  );
}
