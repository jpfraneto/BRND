import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const FRAME_URL = import.meta.env.VITE_APP_FRAME_URL;

// Components
import Podium from "@/components/Podium";
import Typography from "@/components/Typography";
import Button from "@/components/Button";

import { useShareFrame } from "@/hooks/user";

// Types
import { VotingViewProps } from "../../types";

interface Place {
  icon: string;
  name: string;
}

// StyleSheet
import styles from "./ShareView.module.scss";

// Assets
import ShareIcon from "@/assets/icons/share-icon.svg?react";
import sdk from "@farcaster/frame-sdk";

interface ShareViewProps extends VotingViewProps {}

export default function ShareView({
  currentBrands,
  currentVoteId,
}: ShareViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const shareFrame = useShareFrame();

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
   * Handles the click event for the "Share now" button.
   */
  const handleClickShare = useCallback(async () => {
    try {
      // Safely extract profile/channel info
      const getProfileOrChannel = (brand: any) => {
        return brand?.profile || brand?.channel || brand?.name || "Unknown";
      };

      const profile1 = getProfileOrChannel(currentBrands[1]);
      const profile2 = getProfileOrChannel(currentBrands[0]);
      const profile3 = getProfileOrChannel(currentBrands[2]);

      const newCast = await sdk.actions.composeCast({
        text: `I just created my /brnd podium of today:\n\n🥇${
          currentBrands[1]?.name || "Brand 1"
        } - ${profile1}\n🥈${
          currentBrands[0]?.name || "Brand 2"
        } - ${profile2}\n🥉${
          currentBrands[2]?.name || "Brand 3"
        } - ${profile3}`,
        embeds: [`https://poiesis.anky.app/embeds/podium/${currentVoteId}`],
      });

      console.log("📤 [ShareView] Cast created:", newCast);

      shareFrame.mutate(undefined, {
        onSuccess: (result) => {
          if (result) {
            if (location.pathname === "/vote") {
              navigate(
                `${location.pathname}/${Math.floor(Date.now() / 1000)}?success`
              );
            } else {
              navigate(location.pathname + "?success");
            }
          }
        },
        onError: (error) => {
          console.error("📤 [ShareView] Share frame error:", error);
        },
      });
    } catch (error) {
      console.error("📤 [ShareView] Share error:", error);
    }
  }, [shareFrame, currentBrands, currentVoteId, navigate, location]);

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
              You will earn 3 BRND points for sharing
            </Typography>
            <Button
              caption={"Share now"}
              className={styles.button}
              iconLeft={<ShareIcon />}
              onClick={handleClickShare}
            />
          </div>
        </div>
      </div>
      <div className={styles.action}>
        <Button
          variant={"underline"}
          caption="Skip"
          onClick={handleClickSkip}
        />
      </div>
    </div>
  );
}
