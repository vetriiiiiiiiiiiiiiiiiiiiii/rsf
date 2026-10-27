export const SITE_NAME = "R Shivakumar Foundation";

export const siteUrl = () => (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const NAV = [
  { href: "/about", label: "About", index: "01" },
  { href: "/incubation", label: "Incubation", index: "02" },
  { href: "/startups", label: "Startups", index: "03" },
  { href: "/ecosystem", label: "Ecosystem", index: "04" },
  { href: "/events", label: "Events", index: "05" },
  { href: "/news", label: "News", index: "06" },
  { href: "/contact", label: "Contact", index: "07" },
] as const;

export const EVENT_CATEGORY_LABEL: Record<string, string> = {
  HACKATHON: "Hackathon",
  WORKSHOP: "Workshop",
  FOUNDER_SESSION: "Founder session",
  DEMO_DAY: "Demo day",
  DEADLINE: "Application deadline",
  TALK: "Talk",
  OTHER: "Announcement",
};

export const PARTNER_KIND_LABEL: Record<string, string> = {
  INDUSTRY: "Industry collaboration",
  MENTORSHIP: "Mentorship",
  INVESTOR: "Investor engagement",
  INSTITUTIONAL: "Institutional partnership",
};

export const INQUIRY_TYPE_LABEL: Record<string, string> = {
  GENERAL: "General enquiry",
  FOUNDER: "Startup founder",
  STUDENT: "Student or innovator",
  MENTOR: "Mentor",
  INVESTOR: "Investor",
  INDUSTRY: "Industry partner",
  INSTITUTIONAL: "Institutional partner",
};

export const APPLICATION_STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  WITHDRAWN: "Withdrawn",
};

export const VENTURE_STAGES = ["Idea", "Prototype", "Early users", "Revenue", "Scaling"] as const;
