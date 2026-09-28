import { GitBranch } from "lucide-react";

export type ProjectKind = "Web" | "Mobile";
// Which mockup frame the screenshot sits in — picked per image, not per `kind`,
// since e.g. NOBS is a "Web" project but its screenshot is a phone-shaped capture.
export type ProjectFrame = "browser" | "phone" | "plain";

export const projectsData = {
  title: "Real problems, real systems.",
  lede: "Not portfolio exercises — each one was built to solve something specific, with more added as they ship.",
  items: [
    {
      title: "NexEnroll",
      kind: "Web" as ProjectKind,
      kindLabel: "Web platform",
      frame: "browser" as ProjectFrame,
      role: "Thesis project · Solo",
      status: "In development",
      image: "/assets/nexenroll.png",
      description: "An AI-assisted enrollment engine for Northwest Samar State University — automating eligibility checks and routing with Gemini, backed by a schema built to survive enrollment-week traffic spikes.",
      tags: ["React", "FastAPI", "Gemini", "PostgreSQL"],
      links: [
        { url: "https://github.com/CodeForChange853", icon: GitBranch, label: "GitHub" }
      ]
    },
    {
      title: "Sto. Niño NOBS",
      kind: "Web" as ProjectKind,
      kindLabel: "Web platform",
      frame: "phone" as ProjectFrame,
      role: "Code for Change · Team project",
      status: "Live",
      image: "/assets/nobs.jpg",
      description: "An online billing system built with Code for Change, a student developer group, for Napocor (the National Power Corporation) — digitizing meter readings, invoice generation, and payment tracking that used to live entirely on paper ledgers.",
      tags: ["React", "FastAPI", "PostgreSQL"],
      links: [
        { url: "https://github.com/CodeForChange853", icon: GitBranch, label: "GitHub" }
      ]
    },
    {
      title: "Animind Duel",
      kind: "Mobile" as ProjectKind,
      kindLabel: "Android game",
      frame: "plain" as ProjectFrame,
      role: "Coursework · Solo",
      status: "Complete",
      image: "/assets/animind.png",
      description: "A turn-based trivia game for Android, built to learn OpenGL rendering under Jetpack Compose — real-time duels with custom-rendered characters and effects.",
      tags: ["Kotlin", "Jetpack Compose", "OpenGL"],
      links: [
        { url: "https://github.com/CodeForChange853", icon: GitBranch, label: "GitHub" }
      ]
    }
  ]
};
