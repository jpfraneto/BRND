import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";

// Components
import Podium from "@/components/Podium";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

// Hooks
import { useShareVerification } from "@/hooks/user/useShareVerification";

// Types
import { VotingViewProps, VotingViewEnum } from "../../types";

// Assets
import ShareIcon from "@/assets/icons/share-icon.svg?react";

// StyleSheet
import styles from "./ShareView.module.scss";

interface Place {
  icon: string;
  name: string;
}

interface ShareViewProps extends VotingViewProps {}

export default function ShareView({
  currentBrands,
  currentVoteId,
  navigateToView,
}: ShareViewProps) {
  const navigate = useNavigate();
  const shareVerification = useShareVerification();

  const [isSharing, setIsSharing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  console.log("📤 [ShareView] Current brands:", currentBrands);
  console.log("📤 [ShareView] Current vote ID:", currentVoteId);

  /**
   * Handles the click event for the "Skip" button.
   */
  const handleClickSkip = useCallback(() => {
    if (!currentVoteId || currentVoteId === "") {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [currentVoteId, navigate]);

  /**
   * Handles the unified sharing logic with verification.
   */
  const handleClickShare = useCallback(async () => {
    console.log(
      "🔍 [ShareView] Starting share process with vote ID:",
      currentVoteId
    );

    if (isSharing || isVerifying) return; // Prevent double-clicks

    setIsSharing(true);
    setShareError(null);

    try {
      // Safely extract profile/channel info
      const getProfileOrChannel = (brand: any) => {
        return brand?.profile || brand?.channel || brand?.name || "Unknown";
      };

      const profile1 = getProfileOrChannel(currentBrands[1]);
      const profile2 = getProfileOrChannel(currentBrands[0]);
      const profile3 = getProfileOrChannel(currentBrands[2]);

      const castText = `I just created my /brnd podium of today:\n\n🥇${
        currentBrands[1]?.name || "Brand 1"
      } - ${profile1}\n🥈${
        currentBrands[0]?.name || "Brand 2"
      } - ${profile2}\n🥉${currentBrands[2]?.name || "Brand 3"} - ${profile3}`;

      // Use the correct embed URL that matches backend expectation
      const embedUrl = `https://brnd.lat?voteId=${currentVoteId}`;

      console.log("📤 [ShareView] Sharing with embed URL:", embedUrl);

      // Compose cast with standardized text and embed
      const castResponse = await sdk.actions.composeCast({
        text: castText,
        embeds: [embedUrl],
      });

      console.log("📤 [ShareView] Cast created:", castResponse);

      // If cast was successful and we have a hash, verify it
      if (castResponse && castResponse.cast?.hash) {
        console.log(
          "🔍 [ShareView] Verifying cast hash:",
          castResponse.cast.hash
        );

        // Update state to show verification is happening
        setIsSharing(false);
        setIsVerifying(true);

        // Verify the share and wait for result
        shareVerification.mutate(
          {
            castHash: castResponse.cast?.hash,
            voteId: currentVoteId,
          },
          {
            onSuccess: (data) => {
              console.log("✅ [ShareView] Share verified successfully:", data);
              setIsVerifying(false);

              // Navigate to congrats view only after successful verification
              navigateToView?.(
                VotingViewEnum.CONGRATS,
                currentBrands,
                currentVoteId
              );
            },
            onError: (error) => {
              console.error("❌ [ShareView] Verification failed:", error);
              setIsVerifying(false);
              setShareError(
                error.message || "Failed to verify share. Please try again."
              );
              // Stay on share view to show error and allow retry
            },
          }
        );
      } else {
        console.warn(
          "📤 [ShareView] Cast response missing hash:",
          castResponse
        );
        setShareError("Share was not completed. Please try again.");
        setIsSharing(false);
      }
    } catch (error) {
      console.error("📤 [ShareView] Share error:", error);
      setShareError("Failed to share cast. Please try again.");
      setIsSharing(false);
    }
  }, [
    currentBrands,
    currentVoteId,
    navigateToView,
    shareVerification,
    isSharing,
    isVerifying,
  ]);

  // Safely create places array
  const places = useMemo<Place[]>(() => {
    if (!currentBrands || currentBrands.length < 3) {
      return [];
    }

    return [
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
    ];
  }, [currentBrands]);

  // Show loading or error state if data is missing
  if (!currentBrands || currentBrands.length < 3 || !currentVoteId) {
    return (
      <div className={styles.body}>
        <div className={styles.container}>
          <Typography>Loading vote data...</Typography>
        </div>
      </div>
    );
  }

  // Determine the current state for UI feedback
  const getButtonState = () => {
    if (isSharing) return "Sharing...";
    if (isVerifying) return "Verifying...";
    return "Share now";
  };

  const isLoading = isSharing || isVerifying;

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <Typography
          size={18}
          lineHeight={24}
          variant={"druk"}
          weight={"wide"}
          className={styles.title}
        >
          Share on farcaster
        </Typography>
      </div>

      {/* Show error message if share verification failed */}
      {shareError && (
        <div className={styles.errorMessage}>
          <Typography
            variant={"geist"}
            weight={"medium"}
            size={14}
            lineHeight={18}
            textAlign={"center"}
          >
            {shareError}
          </Typography>
        </div>
      )}

      {/* Show verification status */}
      {isVerifying && (
        <div className={styles.verificationMessage}>
          <Typography
            variant={"geist"}
            weight={"medium"}
            size={14}
            lineHeight={18}
            textAlign={"center"}
          >
            🔍 Verifying your share to award 3 more points...
          </Typography>
        </div>
      )}

      <div className={styles.box}>
        <Typography
          variant={"geist"}
          weight={"regular"}
          size={16}
          lineHeight={20}
        >
          I've just created my BRND podium of today:
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

          <div className={styles.action}>
            <Typography
              variant={"geist"}
              weight={"semiBold"}
              textAlign={"center"}
              size={14}
              lineHeight={10}
            >
              {isVerifying
                ? "Verifying share to award 3 points..."
                : "You will earn 3 BRND points for sharing"}
            </Typography>
            <Button
              caption={getButtonState()}
              className={styles.button}
              iconLeft={
                isLoading ? <LoaderIndicator size={16} /> : <ShareIcon />
              }
              onClick={handleClickShare}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      <div className={styles.action}>
        <Button
          variant={"underline"}
          caption="Skip"
          onClick={handleClickSkip}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
