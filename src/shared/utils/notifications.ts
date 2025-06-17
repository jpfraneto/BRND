import { NotificationSettings } from "@/shared/components/NotificationPrompt/types";

const STORAGE_KEY_PREFIX = "brnd_notification_";
const PROMPT_COOLDOWN_DAYS = 3; // Don't prompt again for 3 days if dismissed

/**
 * Gets notification settings from localStorage for a specific user
 */
export const getNotificationSettings = (
  userFid: number
): NotificationSettings => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userFid}`);
    if (!stored) {
      return {
        hasBeenPrompted: false,
        lastPromptDate: "",
        isEnabled: false,
      };
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading notification settings:", error);
    return {
      hasBeenPrompted: false,
      lastPromptDate: "",
      isEnabled: false,
    };
  }
};

/**
 * Saves notification settings to localStorage for a specific user
 */
export const saveNotificationSettings = (
  userFid: number,
  settings: NotificationSettings
): void => {
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${userFid}`,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error("Error saving notification settings:", error);
  }
};

/**
 * Checks if we should show the notification prompt based on:
 * 1. User has notifications disabled in backend
 * 2. User hasn't been prompted recently (cooldown period)
 * 3. User hasn't dismissed it recently
 */
export const shouldShowNotificationPrompt = (
  userFid: number,
  backendNotificationsEnabled: boolean
): boolean => {
  // Don't show if backend notifications are already enabled
  if (backendNotificationsEnabled) {
    return false;
  }

  const settings = getNotificationSettings(userFid);

  // If never prompted, show it
  if (!settings.hasBeenPrompted) {
    return true;
  }

  // If prompted before, check cooldown period
  if (settings.lastPromptDate) {
    const lastPrompt = new Date(settings.lastPromptDate);
    const now = new Date();
    const daysSincePrompt = Math.floor(
      (now.getTime() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Show again if cooldown period has passed
    return daysSincePrompt >= PROMPT_COOLDOWN_DAYS;
  }

  return false;
};

/**
 * Marks that the user has been prompted (whether they accepted or dismissed)
 */
export const markUserPrompted = (userFid: number, accepted: boolean): void => {
  const settings: NotificationSettings = {
    hasBeenPrompted: true,
    lastPromptDate: new Date().toISOString(),
    isEnabled: accepted,
  };

  saveNotificationSettings(userFid, settings);
};

/**
 * Marks that notifications are now enabled (called when backend confirms)
 */
export const markNotificationsEnabled = (userFid: number): void => {
  const currentSettings = getNotificationSettings(userFid);
  const updatedSettings: NotificationSettings = {
    ...currentSettings,
    isEnabled: true,
  };

  saveNotificationSettings(userFid, updatedSettings);
};
