import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Seeds only what is known to be true or explicitly provisional:
 *  - programme categories, all marked `provisional` until confirmed;
 *  - the one verified leadership fact supplied in the brief;
 *  - the first administrator, from environment variables.
 * No startups, events, partners, mentors, statistics or submissions are invented.
 */
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 }) });

const PROGRAMS = [
  {
    slug: "idea-validation",
    name: "Idea validation",
    illustration: "validation",
    summary: "For people with an idea and a question: is this problem real, and is it worth solving? Structured methods to find out quickly.",
    description:
      "Idea validation is the first, deliberately small step. Participants define the problem they believe exists, identify who experiences it, and design simple tests — interviews, observation, rough prototypes — to gather evidence before investing significant time or money.\n\nThe outcome is a clear decision: pursue, reshape, or set aside the idea, based on what was learned.",
  },
  {
    slug: "pre-incubation",
    name: "Pre-incubation",
    illustration: "pre-incubation",
    summary: "A preparatory track for early teams turning a validated problem into a first prototype and a working plan.",
    description:
      "Pre-incubation supports teams who have evidence of a real problem and want to build their first response to it. The focus is on forming the team, defining a minimum viable product, and preparing the groundwork for incubation.",
  },
  {
    slug: "startup-incubation",
    name: "Startup incubation",
    illustration: "incubation",
    summary: "Sustained support for ventures building a product, a team and a business — with mentorship, structure and review.",
    description:
      "Startup incubation is the core programme: a structured period of support for ventures that are ready to build. It combines mentorship, regular progress reviews, and access to the foundation's network to help ventures reach meaningful milestones.",
  },
  {
    slug: "product-development",
    name: "Product development",
    illustration: "product",
    summary: "From prototype to product: design, engineering and testing practices for building something people can rely on.",
    description:
      "Product development support helps ventures move from a prototype that demonstrates an idea to a product that real users can depend on — covering design decisions, technical architecture, testing with users and iteration.",
  },
  {
    slug: "business-model-development",
    name: "Business model development",
    illustration: "business-model",
    summary: "Working out who pays, why, and how the venture sustains itself — tested against reality, not spreadsheets alone.",
    description:
      "Business model development helps founders articulate and test how their venture creates, delivers and captures value: customer segments, pricing, channels, costs and partnerships.",
  },
  {
    slug: "mentorship",
    name: "Mentorship",
    illustration: "mentorship",
    summary: "Regular time with practitioners who have built, operated or invested — matched to the questions a venture is facing.",
    description:
      "Mentorship pairs founders with experienced practitioners. Sessions focus on the specific decisions a venture is facing, from early customer discovery to hiring and fundraising.",
  },
  {
    slug: "investor-readiness",
    name: "Investor readiness",
    illustration: "investor",
    summary: "Preparing ventures to meet capital: the story, the numbers, the diligence and the judgement of when to raise.",
    description:
      "Investor readiness helps ventures understand whether and when external investment is appropriate, and prepares them for conversations with investors — narrative, financial model, documentation and diligence.",
  },
  {
    slug: "industry-collaboration",
    name: "Industry collaboration",
    illustration: "industry",
    summary: "Connecting ventures with companies that have real problems, real data and real routes to market.",
    description:
      "Industry collaboration creates working relationships between ventures and established organisations — problem statements, pilots, data access and market access — where both sides benefit.",
  },
];

async function main() {
  for (const [i, p] of PROGRAMS.entries()) {
    await db.program.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, order: i, provisional: true, acceptingApplications: false, status: "PUBLISHED" },
    });
  }

  await db.person.upsert({
    where: { slug: "r-sivakumar" },
    update: {},
    create: {
      slug: "r-sivakumar",
      name: "R. Sivakumar",
      role: "Chairman, SRM Institute of Science and Technology, Tiruchirappalli",
      kind: "LEADERSHIP",
      bio: null,
      status: "PUBLISHED",
      order: 0,
    },
  });

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
    const exists = await db.adminUser.findUnique({ where: { email } });
    if (!exists) {
      await db.adminUser.create({
        data: { email, name: "Administrator", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
      });
      console.log(`Created administrator ${email}`);
    }
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping administrator creation.");
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
