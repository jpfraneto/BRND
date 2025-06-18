import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

// Components
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

// Hooks
import { useAuth } from "@/hooks/auth";
import { useShareVerification } from "@/hooks/user/useShareVerification";

// StyleSheet
import styles from "./CongratsView.module.scss";

// Assets
import Logo from "@/assets/images/logo.svg";

type VerificationState = "verifying" | "success" | "error" | "skipped";

export default function CongratsView() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const { data: user } = useAuth();
  const shareVerification = useShareVerification();

  const [verificationState, setVerificationState] =
    useState<VerificationState>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Monitor share verification status
  useEffect(() => {
    if (shareVerification.isSuccess) {
      setVerificationState("success");
    } else if (shareVerification.isError) {
      setVerificationState("error");
      setErrorMessage(
        shareVerification.error?.message ||
          "Verification failed. Please try sharing again."
      );
    }
  }, [
    shareVerification.isSuccess,
    shareVerification.isError,
    shareVerification.error,
  ]);

  /**
   * Handle navigation to home
   */
  const handleClickContinue = useCallback(() => {
    navigate("/");
  }, [navigate]);

  /**
   * Handle retry sharing - navigate back to share view
   */
  const handleRetryShare = useCallback(() => {
    // Navigate back to today's vote to show share screen
    const todayUnix = Math.floor(Date.now() / 1000);
    navigate(`/vote/${todayUnix}`, { replace: true });
  }, [navigate]);

  /**
   * Skip verification and mark as complete
   */
  const handleSkipVerification = useCallback(() => {
    setVerificationState("skipped");
  }, []);

  const renderContent = () => {
    switch (verificationState) {
      case "verifying":
        return (
          <>
            <Typography
              variant={"druk"}
              weight={"wide"}
              size={28}
              lineHeight={36}
              textAlign={"center"}
              className={styles.title}
            >
              Congrats! You won 3 BRND points
            </Typography>
            <div className={styles.verifyingSection}>
              <LoaderIndicator size={24} />
              <Typography
                variant={"geist"}
                weight={"medium"}
                size={16}
                lineHeight={20}
                textAlign={"center"}
                className={styles.verifyingMessage}
              >
                Verifying your share to award 3 more points...
              </Typography>
            </div>
            <div className={styles.action}>
              <Button
                variant={"underline"}
                caption="Skip verification"
                onClick={handleSkipVerification}
              />
            </div>
          </>
        );

      case "success":
        return (
          <>
            <Typography
              variant={"druk"}
              weight={"wide"}
              size={28}
              lineHeight={36}
              textAlign={"center"}
              className={styles.title}
            >
              Amazing! You won 6 BRND points
            </Typography>
            <Typography
              variant={"geist"}
              weight={"regular"}
              size={20}
              lineHeight={36}
              textAlign={"center"}
              className={styles.subtitle}
            >
              3 points for voting + 3 points for sharing!
            </Typography>
            {user && (
              <Typography
                variant={"geist"}
                weight={"semiBold"}
                size={16}
                lineHeight={20}
                textAlign={"center"}
                className={styles.successMessage}
              >
                Total points: {user.points}
              </Typography>
            )}
            <div className={styles.action}>
              <Button
                variant={"primary"}
                caption="Continue"
                onClick={handleClickContinue}
              />
            </div>
          </>
        );

      case "error":
        return (
          <>
            <Typography
              variant={"druk"}
              weight={"wide"}
              size={28}
              lineHeight={36}
              textAlign={"center"}
              className={styles.title}
            >
              You won 3 BRND points
            </Typography>
            <Typography
              variant={"geist"}
              weight={"regular"}
              size={16}
              lineHeight={20}
              textAlign={"center"}
              className={styles.errorMessage}
            >
              Share verification failed: {errorMessage}
            </Typography>
            <div className={styles.actionGroup}>
              <Button
                variant={"primary"}
                caption="Try sharing again"
                onClick={handleRetryShare}
              />
              <Button
                variant={"underline"}
                caption="Continue anyway"
                onClick={handleClickContinue}
              />
            </div>
          </>
        );

      case "skipped":
        return (
          <>
            <Typography
              variant={"druk"}
              weight={"wide"}
              size={28}
              lineHeight={36}
              textAlign={"center"}
              className={styles.title}
            >
              You won 3 BRND points
            </Typography>
            <Typography
              variant={"geist"}
              weight={"regular"}
              size={20}
              lineHeight={36}
              textAlign={"center"}
              className={styles.subtitle}
            >
              Share verification was skipped. You can try sharing again later
              for 3 more points!
            </Typography>
            <div className={styles.actionGroup}>
              <Button
                variant={"primary"}
                caption="Try sharing"
                onClick={handleRetryShare}
              />
              <Button
                variant={"underline"}
                caption="Continue"
                onClick={handleClickContinue}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.body}>
      {/* Only show confetti on success */}
      {verificationState === "success" && (
        <div className={styles.effect}>
          <Confetti width={width} height={height} />
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.center}>
          <img src={Logo} className={styles.logo} alt="Logo" />
        </div>
      </div>

      <div className={styles.confirmation}>{renderContent()}</div>
    </div>
  );
}
