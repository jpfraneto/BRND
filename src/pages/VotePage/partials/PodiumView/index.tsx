// Dependencies
import { useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// Hooks
import { Brand, useVoteBrands } from "@/hooks/brands";
import { useAuth } from "@/shared/hooks/auth";

// Components
import Podium from "@/components/Podium";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";

// Types
import { VotingViewProps } from "../../types";

// StyleSheet
import styles from "./PodiumView.module.scss";

// Assets
import Logo from "@/assets/images/logo.svg";
import GoBackIcon from "@/assets/icons/go-back-icon.svg?react";

// Hooks
import { ModalsIds, useModal } from "@/hooks/ui";
import sdk from "@farcaster/frame-sdk";

interface PodiumViewProps extends VotingViewProps {}

export default function PodiumView({}: PodiumViewProps) {
  const voteBrands = useVoteBrands();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const { data: authData } = useAuth();

  /**
   * Validates the selected brands before submitting vote.
   *
   * @param {Brand[]} brands - Array of selected brands
   * @returns {boolean} Whether the brands are valid for voting
   */
  const validateBrands = useCallback(
    (brands: Brand[]): boolean => {
      // Check if we have exactly 3 brands
      if (brands.length !== 3) {
        openModal(ModalsIds.BOTTOM_ALERT, {
          title: "Invalid Selection",
          content: (
            <Typography>
              Please select exactly 3 brands for your podium.
            </Typography>
          ),
        });
        return false;
      }

      // Check if all brands are different
      const brandIds = brands.map((brand) => brand.id);
      const uniqueIds = new Set(brandIds);
      if (uniqueIds.size !== 3) {
        openModal(ModalsIds.BOTTOM_ALERT, {
          title: "Duplicate Selection",
          content: (
            <Typography>
              Please select 3 different brands for your podium.
            </Typography>
          ),
        });
        return false;
      }

      // Check if user has already voted today
      if (authData?.hasVotedToday) {
        openModal(ModalsIds.BOTTOM_ALERT, {
          title: "Already Voted",
          content: (
            <Typography>
              You have already voted today. Come back tomorrow to vote again!
            </Typography>
          ),
        });
        return false;
      }

      return true;
    },
    [openModal, authData]
  );

  /**
   * Handles the submission of votes for the selected brands.
   * Brands array is expected to be in order: [1st place, 2nd place, 3rd place]
   *
   * @param {Brand[]} brands - An array of selected brands in podium order
   */
  const handleSubmitVote = useCallback(
    (brands: Brand[]) => {
      console.log("🗳️ [PodiumView] Submitting vote for brands:", brands);

      // Validate brands before submission
      if (!validateBrands(brands)) {
        return;
      }

      // Add haptic feedback
      sdk.haptics.selectionChanged();

      // Submit vote with correct order: 1st, 2nd, 3rd place
      voteBrands.mutate(
        {
          ids: [brands[1].id, brands[0].id, brands[2].id], // Correct order for backend
        },
        {
          onSuccess: (response) => {
            console.log(
              "✅ [PodiumView] Vote submitted successfully:",
              response
            );

            // Invalidate auth cache to update hasVotedToday status and get todaysVote
            queryClient.invalidateQueries({ queryKey: ["auth"] });

            // Show success feedback
            sdk.haptics.selectionChanged();

            // OPTION 1: Use internal navigation (stay on same page)
            // This works if the parent VotePage can handle the view switch
            // navigateToView(VotingViewEnum.SHARE, brands, response.id);

            // OPTION 2: Navigate to dedicated URL (RECOMMENDED)
            // This ensures URL reflects the vote and refreshes auth data
            const todayUnix = Math.floor(Date.now() / 1000);
            navigate(`/vote/${todayUnix}?success`);

            console.log(
              "🗳️ [PodiumView] Navigating to:",
              `/vote/${todayUnix}?success`
            );
          },
          onError: (error) => {
            console.error("❌ [PodiumView] Voting error:", error);

            // Show error feedback
            sdk.haptics.selectionChanged();

            openModal(ModalsIds.BOTTOM_ALERT, {
              title: "Voting Failed",
              content: (
                <Typography>
                  {error.message ||
                    "Failed to submit your vote. Please try again."}
                </Typography>
              ),
            });
          },
        }
      );
    },
    [voteBrands, navigate, validateBrands, queryClient, openModal]
  );

  /**
   * Handles the click event for the "How to Score" button.
   */
  const handleClickHowToScore = useCallback(() => {
    sdk.haptics.selectionChanged();
    openModal(ModalsIds.BOTTOM_ALERT, {
      title: "How to score",
      content: (
        <div className={styles.list}>
          <Typography size={14} lineHeight={18}>
            You have 100 points to build your first podium brands:
          </Typography>
          <Typography size={16} weight={"regular"} lineHeight={20}>
            🥇 60 points (1st place)
          </Typography>
          <Typography size={16} weight={"regular"} lineHeight={20}>
            🥈 30 points (2nd place)
          </Typography>
          <Typography size={16} weight={"regular"} lineHeight={20}>
            🥉 10 points (3rd place)
          </Typography>
        </div>
      ),
    });
  }, [openModal]);

  return (
    <div className={styles.body}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <IconButton
          variant={"solid"}
          icon={<GoBackIcon />}
          onClick={() => navigate("/")}
          className={styles.backBtn}
        />
        <div className={styles.center}>
          <img src={Logo} className={styles.logo} alt="Logo" />
          <Typography
            size={18}
            lineHeight={24}
            variant={"druk"}
            weight={"text-wide"}
          >
            Add your top brands on this podium
          </Typography>
          <div className={styles.actions}>
            <Button
              variant={"underline"}
              className={styles.howToScore}
              onClick={handleClickHowToScore}
              caption={"How to score"}
            />
          </div>
        </div>
      </motion.div>
      <Podium onVote={handleSubmitVote} />
    </div>
  );
}
