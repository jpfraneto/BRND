// src/components/NotificationPrompt/types.ts

export interface NotificationPromptProps {
  onComplete?: (added: boolean) => void;
  points?: number;
  userFid: number;
}

export interface NotificationPromptState {
  isLoading: boolean;
  isAdded: boolean;
  error: string | null;
}

export interface NotificationSettings {
  hasBeenPrompted: boolean;
  lastPromptDate: string;
  isEnabled: boolean;
}
