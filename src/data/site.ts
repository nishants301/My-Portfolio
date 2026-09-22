export const site = {
  name: "Nishant Shekhar",
  role: "AI Systems Engineer",
  disciplines: ["AI Agents", "LLM Applications", "Automation"],
  location: "Delhi, India",
  email: "nshekhar301@gmail.com",
  phone: "+91 8586970615",
  linkedin: "https://linkedin.com/in/nishant301",
  resume: "/Nishant_Shekhar_AI_Systems_Engineer.pdf",

  // The one sentence that has to land in under three seconds.
  headline: ["I ship production AI", "end-to-end. Solo."],
  subhead:
    "Sole engineer at a 150+ client consultancy — from problem discovery with founders through architecture, deployment, and training the team that runs it.",

  // Numbers quoted verbatim from the resume. Swap only if a figure changes.
  stats: [
    { value: "70+", label: "Restaurant outlets live", detail: "Daily automated metric collection" },
    { value: "~5 hrs", label: "Manual work removed / day", detail: "Across hiring, lead-gen, reporting" },
    { value: "4", label: "Production AI agents", detail: "All human-in-the-loop gated" },
    { value: "10+", label: "Automation workflows", detail: "Shipped and in daily use" },
  ],

  capabilities: [
    "Agent Design", "RAG", "Claude API", "OpenAI", "Gemini", "Vector Search",
    "LangChain", "Playwright", "n8n", "Next.js", "Supabase", "GitHub Actions",
    "Three.js / WebGL", "Node.js", "Python", "Human-in-the-Loop Evaluation",
    "Chrome Extensions (MV3)", "WhatsApp Cloud API", "Prompt Engineering", "CI/CD",
  ],
} as const;

export const skillGroups = [
  {
    label: "AI & LLM",
    items: ["Claude API", "OpenAI", "Gemini", "RAG", "Embeddings", "Vector Search (Pinecone, FAISS)", "LangChain", "Prompt Engineering", "Agent Design", "Human-in-the-Loop Evaluation"],
  },
  {
    label: "Automation",
    items: ["n8n", "Playwright", "GitHub Actions", "WhatsApp Cloud API / Baileys", "Webhooks", "REST APIs", "Cron Scheduling"],
  },
  {
    label: "Engineering",
    items: ["Python", "Node.js", "JavaScript", "SQL", "Supabase", "Firebase", "React", "Next.js", "Chrome Extensions (MV3)"],
  },
  {
    label: "Infrastructure",
    items: ["Oracle Cloud", "Hostinger", "Git", "CI/CD"],
  },
] as const;

export const experience = [
  {
    role: "AI Systems Engineer — Sole Engineer",
    org: "Plateful Consulting",
    period: "Feb 2026 — Present",
    place: "New Delhi",
    context:
      "Restaurant-growth consultancy serving 150+ clients across India. Sister company Plateful Technologies builds AI products.",
    points: [
      "Own the entire engineering function — work directly with founders, sales, HR and operations to find bottlenecks, then scope, architect, build, deploy and iterate on production systems solo. No PM, no spec.",
      "Shipped 10+ production automation workflows and 4 production AI agents on Claude, OpenAI and Gemini APIs — removing roughly five hours of manual work per day across hiring, lead generation, reporting and social publishing.",
      "Built client-facing analytics infrastructure auto-collecting Swiggy partner metrics daily across ~30 client accounts and 70+ outlets, rendered as live self-updating dashboards. Manual reporting eliminated.",
      "Trained founders and non-technical staff across sales, HR and operations to run the dashboards, agents and workflows independently — adoption measured by daily use, not by delivery.",
    ],
  },
] as const;

export const education = [
  {
    title: "Guru Gobind Singh Indraprastha University",
    detail: "University School of Automation and Robotics — New Delhi",
  },
  {
    title: "Siemens Certified Trainee",
    detail: "CNC Operations & PLC Programming (TIA Portal) — Punjab Engineering College",
  },
] as const;
