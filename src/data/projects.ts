export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  idx: string;
  name: string;
  kicker: string;
  tagline: string;
  url?: string;
  urlLabel?: string;
  status: "Live" | "Live · Internal" | "Live · Public Beta" | "Archive";
  year: string;
  role: string;
  stack: string[];
  /** One paragraph. What it is, for whom, why it exists. */
  summary: string;
  /** The business problem before the system existed. */
  problem: string;
  /** Ordered architecture / decision notes — the part senior reviewers read. */
  approach: { title: string; body: string }[];
  outcomes: Metric[];
  /** Production judgment calls. This section is the differentiator. */
  judgment?: string[];
  shot?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "swiggy-analytics",
    idx: "01",
    name: "Swiggy Analytics Platform",
    kicker: "Client-facing data infrastructure",
    tagline: "Daily partner metrics for 70+ outlets, collected while everyone sleeps.",
    url: "https://os.platefulconsulting.com/Swiggy",
    urlLabel: "os.platefulconsulting.com/Swiggy",
    status: "Live",
    year: "2026",
    role: "Architecture · Build · Deploy · Ops",
    stack: ["Playwright", "GitHub Actions", "Supabase", "Cron", "Next.js"],
    summary:
      "An unattended collection pipeline that logs into roughly 30 Swiggy partner accounts every day, pulls performance metrics for 70+ restaurant outlets, upserts them into Supabase, and renders self-updating dashboards that clients and internal teams open every morning.",
    problem:
      "Client performance reporting was manual. Someone had to log into each partner account, read the numbers off the dashboard, and paste them into a deck — every account, every reporting cycle. It scaled linearly with the client list, which meant it did not scale at all.",
    approach: [
      {
        title: "Headless collection on a schedule",
        body: "Playwright drives authenticated sessions against the Swiggy partner portal. GitHub Actions runs it on cron, so there is no server to babysit and every run leaves an auditable log.",
      },
      {
        title: "Encrypted session reuse over repeated login",
        body: "Logging in with credentials on every run is fragile and trips protection systems. Sessions are captured once and stored AES-256-GCM encrypted, then replayed — which is also what made OTP-gated logins tractable when the architecture was replicated for Zomato.",
      },
      {
        title: "Idempotent upserts, not appends",
        body: "Every row is keyed by outlet and date and upserted into Supabase. A re-run repairs a bad day instead of duplicating it, which matters when a collection job fails at 3am and retries.",
      },
      {
        title: "Dashboards read straight from the source of truth",
        body: "No export step and no intermediate spreadsheet. The hosted dashboard queries Supabase directly, so what the client sees is exactly what was collected.",
      },
    ],
    outcomes: [
      { value: "70+", label: "Outlets covered daily" },
      { value: "~30", label: "Client accounts automated" },
      { value: "0", label: "Manual reports written" },
      { value: "Daily", label: "Client-facing refresh" },
    ],
    judgment: [
      "AES-256-GCM encrypted session storage for authenticated scraping.",
      "Architecture generalised on purpose — replicated for Zomato rather than rebuilt.",
    ],
    shot: "/shots/swiggy-analytics.png",
    featured: true,
  },
  {
    slug: "propalate-os",
    idx: "02",
    name: "Propalate OS",
    kicker: "Internal operations platform",
    tagline: "One command center for a company that was running on six spreadsheets.",
    url: "https://os.platefulconsulting.com",
    urlLabel: "os.platefulconsulting.com",
    status: "Live · Internal",
    year: "2026",
    role: "Sole engineer — product to production",
    stack: ["Next.js", "Supabase", "Firebase Auth", "RBAC", "PostgreSQL"],
    summary:
      "A company-wide operations platform unifying CRM and sales pipeline, revenue and payments, HR including salary slips and full-and-final settlement, task management and aggregator analytics — behind role-based access and audit logging. Used daily by 10 to 15 people across four departments.",
    problem:
      "Sales, HR, Finance and Operations each kept their own records. Nothing reconciled, nobody could answer a cross-department question without pulling three people into a thread, and sensitive payroll data lived wherever it was last pasted.",
    approach: [
      {
        title: "RBAC designed before features",
        body: "Payroll and revenue sit in the same system as the sales pipeline, so role-based access was the first design constraint rather than a retrofit. Finance sees settlements; sales does not.",
      },
      {
        title: "Audit logging as a product requirement",
        body: "Every mutation on money or employment data is logged. When a salary slip is questioned three months later, the answer is in the system instead of in someone's memory.",
      },
      {
        title: "Built with the users in the room",
        body: "Requirements came from watching sales, HR and ops actually work. There was no PM and no spec, so discovery was the job. Modules shipped incrementally to the people who asked for them.",
      },
      {
        title: "Adoption measured by daily use",
        body: "Non-technical staff were trained to run it themselves. The success metric was whether people opened it the following week without being asked — not whether it was delivered.",
      },
    ],
    outcomes: [
      { value: "10–15", label: "Daily active users" },
      { value: "4", label: "Departments unified" },
      { value: "RBAC", label: "Plus full audit trail" },
    ],
    judgment: [
      "Sensitive HR and revenue data isolated behind role checks at the data layer, not only in the UI.",
    ],
    shot: "/shots/propalate-os.png",
    featured: true,
  },
  {
    slug: "replyji",
    idx: "03",
    name: "ReplyJi",
    kicker: "WhatsApp AI auto-reply SaaS",
    tagline: "Replies in the language and tone the customer actually used.",
    url: "https://replyji.com",
    urlLabel: "replyji.com",
    status: "Live · Public Beta",
    year: "2026",
    role: "Architecture · Full-stack · Infrastructure",
    stack: ["Next.js", "Node.js", "Baileys", "LLM APIs", "Microservices"],
    summary:
      "A SaaS product that answers WhatsApp messages automatically with context-aware replies in Hindi, Hinglish, English, Tamil or Bengali across configurable tones, plus scheduled messaging. The WhatsApp connection layer runs as its own persistent microservice, deployed separately from the web app.",
    problem:
      "WhatsApp is where Indian SMB customer conversations actually happen, and the response burden never stops. Generic autoresponders fail because real threads switch language and register mid-conversation.",
    approach: [
      {
        title: "The connection layer is its own service",
        body: "A Baileys WhatsApp session has to stay connected for days. Coupling that to the web app would mean every frontend deploy drops every customer session, so the messaging microservice is deployed and scaled independently.",
      },
      {
        title: "Tone and language as first-class inputs",
        body: "Replies are conditioned on the detected language and a configured tone rather than a single fixed system prompt. That is what makes Hinglish threads read as natural instead of translated.",
      },
      {
        title: "Scheduling on the same spine as live replies",
        body: "Scheduled sends and reactive auto-replies share one messaging path, so rate limiting and send windows are enforced in a single place rather than duplicated.",
      },
    ],
    outcomes: [
      { value: "5", label: "Languages incl. Hinglish" },
      { value: "24/7", label: "Persistent session uptime" },
      { value: "2", label: "Independently deployed services" },
    ],
    judgment: [
      "Hard rate caps and send windows to protect messaging accounts from being flagged.",
    ],
    shot: "/shots/replyji.png",
    featured: true,
  },
  {
    slug: "agent-fleet",
    idx: "04",
    name: "Production Agent Fleet",
    kicker: "Four agents, all human-gated",
    urlLabel: "n8n · auto-posting workflow",
    tagline: "Autonomous where it is safe. Approval-gated where it is public.",
    status: "Live",
    year: "2026",
    role: "Agent design · Evaluation · Safeguards",
    stack: ["Claude API", "OpenAI", "Gemini", "n8n", "Telegram", "RAG"],
    summary:
      "Four AI agents running in production against real customers and real messaging accounts: outbound WhatsApp outreach with Telegram hot-lead alerts, a Hinglish lead-nurture drip engine, a Reddit lead-generation agent, and a RAG assistant that answers with citations. With 10+ supporting workflows they remove roughly five hours of manual work per day.",
    problem:
      "Lead generation, nurture and research were manual and inconsistent. The obvious fix — letting an LLM post and message on its own — is also the fastest way to burn a brand's account and its reputation.",
    approach: [
      {
        title: "Outbound WhatsApp with Telegram hot-lead alerts",
        body: "The agent runs outreach and escalates only genuinely warm replies into a Telegram channel, so a human spends attention on the leads that justify it rather than on triage.",
      },
      {
        title: "Hinglish lead-nurture drip engine",
        body: "Nurture sequences written in the code-switched register the audience actually replies to, rather than formal English that reads as a broadcast.",
      },
      {
        title: "Reddit lead-gen with 100% human approval",
        body: "The agent drafts and queues; nothing reaches a public subreddit without a person approving it. On a platform that punishes automated posting, full autonomy was the wrong call, and gating it was a deliberate product decision rather than a limitation.",
      },
      {
        title: "Approval wired into the graph, not bolted on",
        body: "The publishing workflow runs discovery, drafting and image generation automatically, then halts on a Telegram approval step. A human taps approve or decline, and only the approved branch reaches Instagram and Facebook — the gate is a structural part of the workflow rather than a policy someone is trusted to remember.",
      },
      {
        title: "RAG assistant with citation-backed answers",
        body: "Embeddings and vector search over internal knowledge, with every answer carrying its source. An uncited answer is not usable by a team that has to act on it.",
      },
    ],
    outcomes: [
      { value: "4", label: "Agents in production" },
      { value: "100%", label: "Human approval on public output" },
      { value: "~5 hrs", label: "Manual work removed daily" },
      { value: "10+", label: "Supporting workflows" },
    ],
    judgment: [
      "Mandatory human approval on every public-facing AI output.",
      "Hard rate caps and send windows protecting messaging accounts.",
      "A seven-gate ad-policy compliance check before any creative ships.",
    ],
    shot: "/shots/agent-fleet.png",
    featured: true,
  },
  {
    slug: "plateful-technologies",
    idx: "05",
    name: "Plateful Technologies",
    kicker: "3D marketing site",
    tagline: "WebGL used as a sales instrument, not as decoration.",
    url: "https://platefultechnologies.com",
    urlLabel: "platefultechnologies.com",
    status: "Live",
    year: "2026",
    role: "Design · Frontend · Performance",
    stack: ["Three.js", "WebGL", "GLSL", "Lead Capture"],
    summary:
      "An interactive 3D marketing site for Plateful Technologies, built to make an enterprise sales conversation easier to start. Performance-optimised animation with lead capture wired into the sales motion.",
    problem:
      "An AI services company whose website looks like a template loses the room before the first call. The site had to demonstrate technical capability rather than assert it.",
    approach: [
      {
        title: "The medium is the argument",
        body: "A hand-built WebGL scene is evidence of engineering ability in a way that a claim on a slide is not. The site is itself the work sample.",
      },
      {
        title: "Performance budget held on mid-range devices",
        body: "Animation tuned so that prospects on ordinary laptops and phones get the effect rather than a fan spinning up. The audience is founders, not GPU owners.",
      },
      {
        title: "Lead capture built into the journey",
        body: "Capture placed where interest peaks in the scroll rather than bolted onto the footer.",
      },
    ],
    outcomes: [
      { value: "60 fps", label: "Target on mid-range hardware" },
      { value: "3D", label: "Hand-built, not templated" },
    ],
    shot: "/shots/plateful-technologies.png",
    featured: true,
  },
  {
    slug: "reel-pipeline",
    idx: "06",
    name: "Automated Reel Pipeline",
    kicker: "Script to published vertical video",
    urlLabel: "HeyGen · project library",
    tagline: "A script goes in. A finished 9:16 reel comes out.",
    status: "Live",
    year: "2026",
    role: "Pipeline architecture · Tooling",
    stack: ["HeyGen", "Hyperframes", "FFmpeg", "Node.js", "Cron"],
    summary:
      "A repeatable content pipeline that turns a written script into a rendered, subtitled, brand-consistent 9:16 reel — avatar and voice synthesis, frame composition, subtitle burn-in and render — driven from config rather than from a manual edit session.",
    problem:
      "Social publishing was a per-video manual effort: record, edit, subtitle, export, repeat. The bottleneck was never the idea, it was the forty minutes of editing after it.",
    approach: [
      {
        title: "Deterministic config, not a timeline",
        body: "Every reel is described by a config and a script file, so the same input always renders the same output and a revision is a diff rather than a re-edit.",
      },
      {
        title: "Pinned avatar and voice identity",
        body: "Avatar and voice IDs are fixed so the brand's on-screen presenter stays consistent across every reel without rediscovery on each run.",
      },
      {
        title: "Subtitles derived from the source script",
        body: "Timing is computed from the synthesised audio against the script that produced it, so captions cannot drift out of sync with the voice track.",
      },
    ],
    outcomes: [
      { value: "9:16", label: "Publish-ready output" },
      { value: "Config", label: "Driven and fully repeatable" },
    ],
    shot: "/shots/reel-pipeline.png",
    featured: false,
  },
  {
    slug: "talentscout",
    idx: "07",
    name: "TalentScout",
    kicker: "AI hiring assistant",
    tagline: "First-pass screening, automated to the point a human is worth involving.",
    status: "Live",
    year: "2026",
    role: "Build",
    stack: ["Python", "LLM APIs", "Prompt Engineering"],
    summary:
      "A conversational screening assistant that gathers candidate information and runs first-pass technical questioning, so hiring time goes to candidates who have already cleared the basics.",
    problem:
      "Early-stage screening is repetitive, high-volume and low-signal, and it consumed hours of the week that should have gone to actual evaluation.",
    approach: [
      {
        title: "Structured intake before open questioning",
        body: "Deterministic fields are collected first and the model handles only the conversational layer, which keeps the output parseable instead of free text.",
      },
      {
        title: "Questioning scoped to the declared stack",
        body: "Technical questions are generated against what the candidate actually claims, so the screen is relevant rather than generic.",
      },
    ],
    outcomes: [{ value: "1st pass", label: "Screening automated" }],
    featured: false,
  },
  {
    slug: "vision-systems",
    idx: "08",
    name: "Vision & Gesture Systems",
    kicker: "Real-time computer vision",
    tagline: "Hand tracking, gesture recognition and image classification at frame rate.",
    status: "Archive",
    year: "2025",
    role: "Build",
    stack: ["Python", "OpenCV", "MediaPipe", "NumPy"],
    summary:
      "A set of real-time computer vision builds — hand tracking driving gesture-controlled interaction, a recorded-sequence gesture recogniser, and image recognition work. The perception-side grounding behind the automation work, from an automation and robotics background.",
    problem:
      "Interactive systems that read the physical world have to run at frame rate on ordinary webcams, which puts hard constraints on model choice and per-frame cost.",
    approach: [
      {
        title: "Landmark tracking over raw classification",
        body: "Tracking hand landmarks and reasoning about their geometry is far cheaper per frame than classifying whole images, which is what makes real-time interaction possible on a laptop webcam.",
      },
      {
        title: "Recorded sequences as the gesture vocabulary",
        body: "Gestures are recorded into a config rather than hard-coded, so the vocabulary extends without touching the recognition loop.",
      },
    ],
    outcomes: [{ value: "Real-time", label: "Webcam-rate inference" }],
    featured: false,
  },
];

export const featured = projects.filter((p) => p.featured);
export const archive = projects.filter((p) => !p.featured);
export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
