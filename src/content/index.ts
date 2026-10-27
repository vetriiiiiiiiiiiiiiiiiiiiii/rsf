/**
 * All site content lives here. The site is fully static: edit this file,
 * rebuild (`npm run build`), and upload the `out/` folder.
 *
 * Only publish verified information. Empty strings are shown on the site as
 * understated "forthcoming" notes.
 */

export type SiteImage = { src: string; alt: string; width: number; height: number };

/* ─── Site-wide text and contact details ─────────────────────────── */

export const SITE = {
  "hero.eyebrow": "R Shivakumar Foundation / Innovation & Incubation",
  "hero.headline": "Ideas are\nonly the\n*beginning.*",
  "hero.body":
    "RS Foundation is an innovation and incubation centre that works alongside founders, students and researchers — helping them question an idea, test it, build it and shape it into a venture that can stand on its own.",
  "about.intro":
    "RS Foundation exists to give early ideas the structure they need to become real ventures: space to experiment, people who have built before, and a deliberate path from first question to first customer.",
  "about.vision":
    "To establish the R. Shivakumar Foundation as a collaborative platform driving innovation, entrepreneurship, and societal impact.",
  "about.mission":
    "To connect academia, industry, government, investors, and global networks to accelerate research, entrepreneurship, and commercialisation across SRM Group of Institutions.",
  "closing.headline": "Your next chapter\nstarts with a\n*conversation.*",
  "institution.association":
    "An incubation centre associated with Dr. R. Shivakumar, Chairman of SRM Group of Institutions, Chennai – Ramapuram & Tiruchirappalli Campus.",
  "contact.email": "",
  "contact.phone": "",
  "contact.address": "",
  "contact.hours": "",
  "contact.mapUrl": "",
  "social.linkedin": "",
  "social.instagram": "",
  "social.x": "",
  "social.youtube": "",
};
export type SiteSettings = typeof SITE;

/** Set to true when incubation applications open; until then /apply shows "Coming soon". */
export const APPLICATIONS_OPEN = false;

/* ─── Programmes ─────────────────────────────────────────────────── */

export type Program = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  audience: string | null;
  duration: string | null;
  format: string | null;
  illustration: string;
  /** True while the programme is a proposed category awaiting confirmation. */
  provisional: boolean;
  acceptingApplications: boolean;
  image: SiteImage | null;
};

const photo = (slug: string, alt: string, height = 1067): SiteImage => ({ src: `/images/programmes/${slug}.jpg`, alt, width: 1600, height });

export const PROGRAMS: Program[] = [
  {
    slug: "idea-validation",
    name: "Idea validation",
    illustration: "validation",
    summary: "For people with an idea and a question: is this problem real, and is it worth solving? Structured methods to find out quickly.",
    description:
      "Idea validation is the first, deliberately small step. Participants define the problem they believe exists, identify who experiences it, and design simple tests — interviews, observation, rough prototypes — to gather evidence before investing significant time or money.\n\nThe outcome is a clear decision: pursue, reshape, or set aside the idea, based on what was learned.",
    image: photo("idea-validation", "Two people sketching ideas on a whiteboard"),
  },
  {
    slug: "pre-incubation",
    name: "Pre-incubation",
    illustration: "pre-incubation",
    summary: "A preparatory track for early teams turning a validated problem into a first prototype and a working plan.",
    description:
      "Pre-incubation supports teams who have evidence of a real problem and want to build their first response to it. The focus is on forming the team, defining a minimum viable product, and preparing the groundwork for incubation.",
    image: photo("pre-incubation", "A founder planning with sticky notes", 1068),
  },
  {
    slug: "startup-incubation",
    name: "Startup incubation",
    illustration: "incubation",
    summary: "Sustained support for ventures building a product, a team and a business — with mentorship, structure and review.",
    description:
      "Startup incubation is the core programme: a structured period of support for ventures that are ready to build. It combines mentorship, regular progress reviews, and access to the foundation's network to help ventures reach meaningful milestones.",
    image: photo("startup-incubation", "A startup team working together on laptops"),
  },
  {
    slug: "product-development",
    name: "Product development",
    illustration: "product",
    summary: "From prototype to product: design, engineering and testing practices for building something people can rely on.",
    description:
      "Product development support helps ventures move from a prototype that demonstrates an idea to a product that real users can depend on — covering design decisions, technical architecture, testing with users and iteration.",
    image: photo("product-development", "A 3D printer producing a prototype part"),
  },
  {
    slug: "business-model-development",
    name: "Business model development",
    illustration: "business-model",
    summary: "Working out who pays, why, and how the venture sustains itself — tested against reality, not spreadsheets alone.",
    description:
      "Business model development helps founders articulate and test how their venture creates, delivers and captures value: customer segments, pricing, channels, costs and partnerships.",
    image: photo("business-model-development", "A whiteboard covered in planning notes"),
  },
  {
    slug: "mentorship",
    name: "Mentorship",
    illustration: "mentorship",
    summary: "Regular time with practitioners who have built, operated or invested — matched to the questions a venture is facing.",
    description:
      "Mentorship pairs founders with experienced practitioners. Sessions focus on the specific decisions a venture is facing, from early customer discovery to hiring and fundraising.",
    image: photo("mentorship", "A mentor advising a founder in a meeting"),
  },
  {
    slug: "investor-readiness",
    name: "Investor readiness",
    illustration: "investor",
    summary: "Preparing ventures to meet capital: the story, the numbers, the diligence and the judgement of when to raise.",
    description:
      "Investor readiness helps ventures understand whether and when external investment is appropriate, and prepares them for conversations with investors — narrative, financial model, documentation and diligence.",
    image: photo("investor-readiness", "A founder presenting a pitch to a small group", 1200),
  },
  {
    slug: "industry-collaboration",
    name: "Industry collaboration",
    illustration: "industry",
    summary: "Connecting ventures with companies that have real problems, real data and real routes to market.",
    description:
      "Industry collaboration creates working relationships between ventures and established organisations — problem statements, pilots, data access and market access — where both sides benefit.",
    image: photo("industry-collaboration", "Engineers working on a factory floor", 2399),
  },
].map((p) => ({ ...p, audience: null, duration: null, format: null, provisional: true, acceptingApplications: false }));

/* ─── Events ─────────────────────────────────────────────────────── */

export type Event = {
  slug: string;
  title: string;
  category: "HACKATHON" | "WORKSHOP" | "FOUNDER_SESSION" | "DEMO_DAY" | "DEADLINE" | "TALK" | "OTHER";
  summary: string;
  body: string;
  /** ISO date (YYYY-MM-DD), or null when not yet announced. */
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  /** Official event website, where registration and full details live. */
  url: string;
  facts: { k: string; v: string }[];
  image: SiteImage | null;
};

export const EVENTS: Event[] = [
  {
    slug: "medaithon-2026",
    title: "MEDAITHON'26",
    category: "HACKATHON",
    summary: "A 50-hour Medical AI Innovation Hackathon where engineering and healthcare meet to build AI-powered healthcare solutions.",
    body: [
      "MEDAITHON'26 is where medicine meets technology in a 50-hour sprint of innovation from 26 to 28 October 2026. Teams build AI-powered healthcare solutions across diagnostics, medical technology and digital health — mentored by experts from both technical and medical backgrounds.",
      "Tracks: AI / Software, Hardware / IoT, HealthTech / Interoperability, Advanced / Hybrid, and an open innovation track for anything that improves healthcare.",
      "Who can participate: engineering students passionate about healthcare innovation. Teams register exactly three engineering students online (one team leader and two members). On site, one MBBS student and one nursing student are assigned to each team by the organisers. No prior medical knowledge is required.",
      "Participation is free; meals, Wi-Fi, power and sleeping arrangements are provided, and hardware kits are available for IoT and embedded projects. All code must be written during the hackathon.",
      "Judging: Innovation (30%), Technical Execution (25%), Impact & Feasibility (25%) and Presentation (20%). Each team presents a five-minute demo followed by three minutes of questions.",
      "Online registrations have closed. Shortlisted teams and results will be announced on the official website.",
    ].join("\n\n"),
    startDate: "2026-10-26",
    endDate: "2026-10-28",
    location: "SRM Trichy campus, Tiruchirappalli",
    url: "https://www.medaithon.com/",
    facts: [
      { k: "Format", v: "50-hour hackathon" },
      { k: "Team", v: "3 engineering students + 1 MBBS and 1 nursing student assigned on site" },
      { k: "Prizes", v: "₹1 lakh+" },
      { k: "Fee", v: "Free" },
      { k: "Registration", v: "Closed" },
    ],
    image: null,
  },
  {
    slug: "horizonxt-2026",
    title: "HorizonXT",
    category: "HACKATHON",
    summary: "A 36-hour national-level college hackathon hosted at SRM Institute of Science and Technology, Tiruchirappalli.",
    body: [
      "HorizonXT is a 36-hour national-level college hackathon hosted at SRM Institute of Science and Technology, Tiruchirappalli, taking place from 26 to 28 October 2026.",
      "Teams work on problem statements in electric vehicles (EVs), Industry 4.0, and AI & Healthcare.",
      "Registration opened on 5 October and the abstract submission deadline was 15 October. Full problem statements and updates are on the official website.",
    ].join("\n\n"),
    startDate: "2026-10-26",
    endDate: "2026-10-28",
    location: "SRM Institute of Science and Technology, Tiruchirappalli",
    url: "https://horizonxt.rsfhub.com/",
    facts: [
      { k: "Format", v: "36-hour national-level hackathon" },
      { k: "Themes", v: "EVs · Industry 4.0 · AI & Healthcare" },
      { k: "Registration opened", v: "5 October 2026" },
      { k: "Abstract deadline", v: "15 October 2026" },
    ],
    image: null,
  },
  {
    slug: "launchpad",
    title: "Launchpad",
    category: "OTHER",
    summary: "An RS Foundation programme on 28 October 2026. Full details are published on the Launchpad website.",
    body: "Launchpad takes place on 28 October 2026. Details — including eligibility and how to take part — are published on the official Launchpad website.",
    startDate: "2026-10-28",
    endDate: "2026-10-28",
    location: null,
    url: "https://launchpad.rsfhub.com",
    facts: [],
    image: null,
  },
];

/* ─── People ─────────────────────────────────────────────────────── */

export type Person = {
  slug: string;
  name: string;
  role: string;
  kind: "LEADERSHIP" | "MENTOR";
  bio: string | null;
  expertise: string | null;
  linkedinUrl: string | null;
  image: SiteImage | null;
};

export const PEOPLE: Person[] = [
  {
    slug: "dr-r-shivakumar",
    name: "Dr. R. Shivakumar",
    role: "Chairman – SRM Group of Institutions, Chennai – Ramapuram & Tiruchirappalli Campus",
    kind: "LEADERSHIP",
    bio: null,
    expertise: null,
    linkedinUrl: null,
    image: { src: "/images/people/dr-r-shivakumar.jpg", alt: "Portrait of Dr. R. Shivakumar", width: 1280, height: 1600 },
  },
];

/* ─── Startups, news and partners (publish verified entries only) ── */

export type Startup = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  founders: string | null;
  category: { name: string; slug: string } | null;
  stage: string | null;
  foundedYear: number | null;
  location: string | null;
  website: string | null;
  featured: boolean;
  image: SiteImage | null;
};
export const STARTUPS: Startup[] = [];

export type NewsPost = { slug: string; title: string; excerpt: string; body: string; publishedAt: string; image: SiteImage | null };
export const NEWS: NewsPost[] = [];

export type Partner = { slug: string; name: string; kind: "INDUSTRY" | "MENTORSHIP" | "INVESTOR" | "INSTITUTIONAL"; url: string | null; logo: SiteImage | null };
export const PARTNERS: Partner[] = [];
