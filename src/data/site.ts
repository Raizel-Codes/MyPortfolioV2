// Site copy. Keep every claim here checkable against a real project, repo, or timeline entry —
// no self-rated percentages or unverifiable outcome numbers.
import type { BrandSlug } from "@/data/icons";

export const siteData = {
  name: { first: "ADRIAN S.", last: "GARCIA" },
  roles: ["Backend Engineer", "Applied ML Builder", "Systems Thinker", "Lifelong Learner"],
  description:
    "Every system I build is a commitment — to the people who depend on it and the problem it was made to solve.",
  githubUser: "CodeForChange853",
  // Email + Facebook go through /api/go/* (rate limited, address kept server-side; set in .env.local).
  // Leave a url empty to hide that link everywhere.
  social: [
    { key: "github", label: "GitHub", url: "https://github.com/CodeForChange853" },
    { key: "email", label: "Gmail", url: "/api/go/email" },
    { key: "facebook", label: "Facebook", url: "/api/go/facebook" },
    { key: "linkedin", label: "LinkedIn", url: "" }
  ] as { key: "github" | "email" | "facebook" | "linkedin"; label: string; url: string }[]
};

export const aboutContent = {
  title: "Backend-minded, shipped full-stack.",
  paragraphs: [
    "I started out drawn to the parts of software most people never see — the data models, the query plans, the systems that quietly have to be right. That instinct hasn't changed, but a few real projects taught me that",
    "So I build both ends: APIs that hold their shape under load, and the interface that makes them feel simple. I'm a Computer Science student at Northwest Samar State University, and outside coursework I keep building — an enrollment system, a billing platform, a mobile game — because that's how I actually learn a new tool or model, not by reading about it."
  ],
  emphasis: "a well-built backend only matters if someone can actually use what's built on top of it.",
  facts: [
    { label: "Based in", value: "Calbayog City, Philippines" },
    { label: "Studying", value: "B.S. Computer Science, NwSSU" },
    { label: "Standing", value: "3rd → 4th year" },
    { label: "Focus", value: "Backend systems & applied ML" }
  ]
};

export const stackContent = {
  title: "Tools I reach for without thinking.",
  lede: "Not ranked by how good I claim to be with each — this is what's actually running in NexEnroll, NOBS, and Animind Duel.",
  // Self-assessed practice frequency, not a mastery score — "core" means it's in daily use, not that it's mastered.
  skills: [
    { name: "Backend & APIs", level: "core" },
    { name: "Databases", level: "core" },
    { name: "Applied ML", level: "working" },
    { name: "Frontend Engineering", level: "working" },
    { name: "Mobile Development", level: "learning" }
  ] as { name: string; level: "core" | "working" | "learning" }[],
  areas: [
    {
      name: "Backend & APIs",
      tools: [
        { name: "Python", slug: "python" },
        { name: "FastAPI", slug: "fastapi" },
        { name: "Gemini API", slug: "gemini" },
        { name: "Docker", slug: "docker" },
        { name: "Git", slug: "git" }
      ]
    },
    {
      name: "Databases",
      tools: [{ name: "PostgreSQL", slug: "postgresql" }]
    },
    {
      name: "Frontend",
      tools: [
        { name: "React", slug: "react" },
        { name: "Next.js", slug: "nextjs" },
        { name: "TypeScript", slug: "typescript" },
        { name: "Tailwind CSS", slug: "tailwindcss" }
      ]
    },
    {
      name: "Mobile",
      tools: [
        { name: "Kotlin", slug: "kotlin" },
        { name: "Jetpack Compose", slug: "jetpackcompose" }
      ]
    }
  ] as { name: string; tools: { name: string; slug: BrandSlug }[] }[],
  philosophy: [
    "Probabilistic Thinking",
    "Data-First Architecture",
    "Robustness to Drift",
    "Continuous Experimentation & Evaluation"
  ]
};

export const experienceContent = {
  title: "The story so far.",
  items: [
    {
      years: "2025 – 2026",
      kind: "Coursework" as const,
      title: "Coursework: CI/CD, security, data science",
      body: "Rounding out core computer science training with production-oriented topics — deployment pipelines, systems hardening, and the fundamentals of data science."
    },
    {
      years: "2024 – 2026",
      kind: "Freelance" as const,
      title: "Student commissions — capstone fixes & applied ML",
      body: "Freelance work for other students: debugging capstone-level projects and training small ML models on commission, including a document scanner and a forecasting tool."
    },
    {
      years: "2025",
      kind: "Project" as const,
      title: "Animind Duel — Android trivia game",
      body: "A turn-based battler built solo in Kotlin and Jetpack Compose, with custom OpenGL rendering for real-time effects."
    },
    {
      years: "2025",
      kind: "Project" as const,
      title: "NexEnroll — AI-assisted enrollment system",
      body: "Thesis project for Northwest Samar State University: automating eligibility checks and routing with Gemini."
    },
    {
      years: "2024",
      kind: "Project" as const,
      title: "NOBS — online billing system",
      body: "Built with Code for Change, a student developer group, for Napocor, the National Power Corporation — billing that ran entirely on paper before."
    },
    {
      years: "2024",
      kind: "Freelance" as const,
      title: "Freelance — rebuilt a healthcare company's website",
      body: "Independent commission, without touching the live deployment: reverse-engineered the site's design from its own meta tags, then rebuilt it from scratch with the same visual identity, optimized."
    },
    {
      years: "2024",
      kind: "Milestone" as const,
      title: "Recognized for programming coursework",
      body: "Northwest Samar State University, 2nd year."
    },
    {
      years: "2023 – 2024",
      kind: "Milestone" as const,
      title: "B.S. Computer Science, Northwest Samar State University",
      body: "Enrolled in 2023; built the fundamentals in Java, object-oriented programming, and MySQL."
    }
  ]
};

export const faqContent = {
  title: "Questions I get asked a lot.",
  lede: "If yours isn't here, ask me directly — the contact links are just below.",
  items: [
    {
      question: "What are you working on right now?",
      answer: "Finishing my CS degree at Northwest Samar State University while building NexEnroll, an AI-assisted enrollment system, as my thesis project. Outside coursework I'm picking up production practices — CI/CD, security, and the fundamentals of data science."
    },
    {
      question: "Are these solo projects, or team work?",
      answer: "A mix. NexEnroll is a solo thesis project, NOBS was built with Code for Change (a student developer group) for Napocor, the National Power Corporation, and Animind Duel was a solo build for a mobile development course."
    },
    {
      question: "What kind of roles or collaborations are you looking for?",
      answer: "Backend and applied-ML work — internships, research collaborations, or entry-level engineering roles where the reasoning behind a system matters as much as shipping it."
    },
    {
      question: "How do you approach a tool or model you haven't used before?",
      answer: "I build something small with it before deciding whether it belongs in a real system. That's how Gemini ended up inside NexEnroll, and how OpenGL ended up rendering effects in Animind Duel."
    },
    {
      question: "Can you join an existing codebase, or only greenfield builds?",
      answer: "Happy to do either. Reading someone else's schema and figuring out why a query is slow is a skill I enjoy using as much as starting fresh."
    }
  ]
};

export const contactContent = {
  title: "Have a project in mind?",
  tagline: "Let's build something that needs to work.",
  lede: "Open to internships, research collaborations, and full-time roles — especially where the data model and the reasoning behind a system matter as much as shipping it."
};

export const activeSocial = siteData.social.filter((s) => s.url);
