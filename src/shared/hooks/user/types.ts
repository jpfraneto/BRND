import { Brand } from "../brands";

export type User = {
  fid: number; // String to match backend
  username: string;
  photoUrl: string;
  createdAt: string; // String to match backend
  points: number;
  hasVotedToday: boolean;
  todaysVote?: UserVote | null;
  isNewUser: boolean;
  notificationsEnabled?: boolean;
  hasSharedToday?: boolean;
};

export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}

export interface UserVoteHistory {
  length: number;
  map(
    arg0: (brand: any, index: any) => import("react/jsx-runtime").JSX.Element
  ): import("react").ReactNode;
  id: string;
  date: string;
  brand1: Brand;
  brand2: Brand;
  brand3: Brand;
}

export interface UserVote {
  id: string;
  date: string;
  brand1: Brand;
  brand2: Brand;
  brand3: Brand;
}

export interface UserBrand {
  brand: Brand;
  points: number;
}

export interface UserBrand {
  brand: Brand;
  points: number; // Total points this user gave this brand
  voteCount: number; // How many times user voted for this brand
  lastVoted: string; // When they last voted for this brand
  position: number; // User's personal ranking (1st, 2nd, 3rd, etc.)
}
