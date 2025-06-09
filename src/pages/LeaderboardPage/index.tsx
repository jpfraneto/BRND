// src/pages/LeaderboardPage/index.tsx

import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// StyleSheet
import styles from "./LeaderboardPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import Typography from "@/components/Typography";
import UserListItem from "@/shared/components/UserListItem";
import BrandHeader from "@/shared/components/BrandHeader";
import Button from "@/components/Button";

// Assets
// import ShareIcon from "@/assets/icons/share-icon.svg";

// Hooks
import { useUserLeaderboard } from "@/shared/hooks/user/useUserLeaderboard";
import useDisableScrollBody from "@/hooks/ui/useDisableScrollBody";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";
import { User, UserRoleEnum } from "@/shared/hooks/user";
import sdk from "@farcaster/frame-sdk";

const mockLeaderboard: User[] = [
  {
    id: "siim9082wh",
    fid: 1093509,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/fa1bfb71-b41f-4525-9109-54dba841dc00/original",
    username: "sikandar",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 1093509,
    hasVotedToday: false,
  },
  {
    id: "bp8pbslanw",
    fid: 1015455,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/7924e381-4518-4606-26ad-df18d8ab8600/rectcrop3",
    username: "kaufman",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 1015455,
    hasVotedToday: false,
  },
  {
    id: "xc3vrcyoufm",
    fid: 991501,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/86b1d14b-c824-4c2b-a000-787764e4e000/rectcrop3",
    username: "holmes77",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 991501,
    hasVotedToday: false,
  },
  {
    id: "dc5wxfgecq4",
    fid: 979983,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/a092bd1c-636e-4e8c-8eaf-0a12ababbb00/rectcrop3",
    username: "cronnkite.eth",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 979983,
    hasVotedToday: false,
  },
  {
    id: "ahz7st7sx1b",
    fid: 977235,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/2016e7f6-a956-4f69-c3e7-0227215cb400/rectcrop3",
    username: "distrow",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 977235,
    hasVotedToday: false,
  },
  {
    id: "nqms1qhto4q",
    fid: 977233,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/075a54ce-b58e-4ff5-4009-f63b548f4600/rectcrop3",
    username: "jc4p",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 977233,
    hasVotedToday: false,
  },
  {
    id: "9qcsbb0so4p",
    fid: 976959,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/60403190-177e-42ed-ad86-9132856b4a00/rectcrop3",
    username: "liyah",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 976959,
    hasVotedToday: false,
  },
  {
    id: "anx9rmxe2am",
    fid: 864405,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/b0c58c61-1cdb-4eb3-0fe7-7a8905680300/original",
    username: "bertwurst.eth",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 864405,
    hasVotedToday: false,
  },
  {
    id: "6w46sh7hhoi",
    fid: 795542,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/b945a1a3-1f2a-48fd-7406-fa2a2ed31800/rectcrop3",
    username: "caitcavell",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 795542,
    hasVotedToday: false,
  },
  {
    id: "kk0yyiybrbo",
    fid: 791687,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/1483104d-961a-4766-f7a3-65571e4b4500/original",
    username: "thumb",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 791687,
    hasVotedToday: false,
  },
  {
    id: "i770oqhnspf",
    fid: 758919,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/e95b6f64-1d2d-4ac2-1d50-d2c9304e0100/original",
    username: "mazmhussain",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 758919,
    hasVotedToday: false,
  },
  {
    id: "362etcjtnr",
    fid: 654826,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/e3e6db6f-27b9-4c60-0c3a-14521f7b6900/rectcrop3",
    username: "dreez",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 654826,
    hasVotedToday: false,
  },
  {
    id: "pvw7wks3oz",
    fid: 210698,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/e5fce362-9499-4d0d-f786-992daed97b00/original",
    username: "blankspace",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 210698,
    hasVotedToday: false,
  },
  {
    id: "c768hzjvpak",
    fid: 20270,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/fa6a9c8a-ade1-496b-2534-c9b6f7a1cf00/original",
    username: "erica",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 20270,
    hasVotedToday: false,
  },
  {
    id: "xpn0hzrerkl",
    fid: 14520,
    photoUrl: "https://i.imgur.com/oC7H9FH.jpg",
    username: "irfan",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 14520,
    hasVotedToday: false,
  },
  {
    id: "1h9mh0e07ub",
    fid: 11599,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/66dff8f2-535e-49f8-2137-617ced4bbb00/rectcrop3",
    username: "mjc716",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 11599,
    hasVotedToday: false,
  },
  {
    id: "5u9iitffj6g",
    fid: 9933,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/73624966-027e-43f7-82f9-d7ce481dda00/rectcrop3",
    username: "m00npapi.eth",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 9933,
    hasVotedToday: false,
  },
  {
    id: "1anaapztkog",
    fid: 7143,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/6ffb9f9e-4e18-409a-c24b-0b3e97ab3200/original",
    username: "six",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 7143,
    hasVotedToday: false,
  },
  {
    id: "6gs5v8u47v8",
    fid: 4895,
    photoUrl: "https://i.imgur.com/6x4u2Cc.jpg",
    username: "matthewb",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 4895,
    hasVotedToday: false,
  },
  {
    id: "sdbpcljyfz",
    fid: 4407,
    photoUrl: "https://i.imgur.com/kynnpYw.jpg",
    username: "keccers.eth",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 4407,
    hasVotedToday: false,
  },
  {
    id: "v6pi4g3gwa",
    fid: 3449,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/341fc9e8-4dc4-4d0e-44ec-81a5e6a05a00/rectcrop3",
    username: "cherdougie",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 3449,
    hasVotedToday: false,
  },
  {
    id: "8av45sg97lx",
    fid: 2802,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/c131c034-0090-4610-45a4-acda4b805000/rectcrop3",
    username: "garrett",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 2802,
    hasVotedToday: false,
  },
  {
    id: "scj9uvfqen",
    fid: 1189,
    photoUrl:
      "https://lh3.googleusercontent.com/clqRnlYPpoTsTCySVdX73ryYiW7cwmW1MlcdnfwK1sGkXcX-Ln7NYJ7cJccDIvkC3RsjKmTv8Dd2iQByRTlYRTLwRWy4bCrRqiOfcnQ",
    username: "grace",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 1189,
    hasVotedToday: false,
  },
  {
    id: "o25fgsi4x4",
    fid: 1180,
    photoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/e024680a-7980-4837-3907-b45f4fc3a700/rectcrop3",
    username: "triumph",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 1180,
    hasVotedToday: false,
  },
  {
    id: "yo3pr87d6m",
    fid: 557,
    photoUrl:
      "https://i.seadn.io/gae/5hjYfRyqiRJV4EQ7ieSJrmb1LtO_vcAvREXSqnlY4HXXBsvgh1vumOwj5e4GwGhppEU2jLC9qJHEgEkaJ9V_B02jIFY9XmzgK1_F?w=500&auto=format",
    username: "pugson",
    createdAt: new Date("2025-06-09T20:02:07.804Z"),
    role: UserRoleEnum.USER,
    points: 557,
    hasVotedToday: false,
  },
];
function LeaderboardPage(): React.ReactNode {
  const navigate = useNavigate();
  const { data, refetch } = useUserLeaderboard(1, 50);
  useDisableScrollBody();

  useEffect(() => {
    refetch();
  }, []);

  /**
   * Handles the click event on a user item and navigates to the user's profile.
   *
   * @param {User['id']} id - The ID of the user.
   */
  const handleClickUser = useCallback(
    (id: User["id"]) => {
      navigate(`/user/${id}`);
    },
    [navigate]
  );

  /**
   * Handles sharing the leaderboard
   */
  const handleShareLeaderboard = useCallback(() => {
    // Implement share functionality
    console.log("Share leaderboard");
  }, []);

  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <BrandHeader showBackButton={true} />

          <div className={styles.titleSection}>
            <Typography
              variant={"druk"}
              weight={"wide"}
              className={styles.title}
              size={20}
            >
              Leaderboard
            </Typography>
          </div>
        </div>

        <div className={styles.content}>
          {mockLeaderboard && mockLeaderboard.length > 0 && (
            <ul className={styles.grid}>
              {mockLeaderboard.map((user, index) => (
                <li key={`--user-item-${index.toString()}`}>
                  <UserListItem user={user} position={index + 1} />
                </li>
              ))}
            </ul>
          )}

          <div className={styles.footer}>
            <Button
              caption="Share leaderboard"
              variant="primary"
              // iconLeft={<ShareIcon />}
              onClick={handleShareLeaderboard}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(LeaderboardPage, "only-connected");
