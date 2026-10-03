import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "khlee dev",
  DESCRIPTION: "웹 프론트엔드에서 풀스택으로, 개발하며 배우고 고민한 내용을 기록합니다.",
  EMAIL: "rudghks7816@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_NOTES_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: SITE.DESCRIPTION,
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const NOTES: Metadata = {
  TITLE: "Notes",
  DESCRIPTION: "A collection of notes on topics I am passionate about.",
};

export const SOCIALS: Socials = [
  {
    NAME: "GitHub",
    HREF: "https://github.com/kwandev",
  },
  // {
  //   NAME: "Website",
  //   HREF: "https://trevortylerlee.com",
  // },
];
