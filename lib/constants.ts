import type { CareerCategory, CareerStatus, EmotionalTriggerType, FiveThief, OutreachStatus, SimranMode } from "@prisma/client";

export type RoutineMode = "BEGINNER" | "INTERMEDIATE" | "FULL";

export const quoteLine = "Naam Japo. Kirat Karo. Vand Chhako.";

export const routineModeLabels: Record<RoutineMode, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  FULL: "Full"
};

export const routinePaths: Record<RoutineMode, string[]> = {
  BEGINNER: ["Japji Sahib", "Chaupai Sahib", "Waheguru Simran", "Kirtan Sohila"],
  INTERMEDIATE: ["Japji Sahib", "Chaupai Sahib", "Rehras Sahib", "Kirtan Sohila", "15 min Simran"],
  FULL: [
    "Japji Sahib",
    "Jaap Sahib",
    "Tav-Prasad Savaiye",
    "Chaupai Sahib",
    "Anand Sahib",
    "Rehras Sahib",
    "Kirtan Sohila",
    "Ardaas",
    "Mool Mantar",
    "Hukamnama reflection",
    "Waheguru Simran"
  ]
};

export const pathNames = Array.from(
  new Set(Object.values(routinePaths).flat().concat(["Hukamnama reflection"]))
);

export const emotionalChecklist = [
  ["noBegging", "No begging"],
  ["noEmotionalThreat", "No emotional threat"],
  ["noAngryTexting", "No angry texting"],
  ["noCheckingObsessing", "No checking or obsessing"],
  ["noStalking", "No stalking"],
  ["noHookupLustAction", "No hookup or lust-based action"],
  ["noLying", "No lying"],
  ["noManipulation", "No manipulation"],
  ["waitedBeforeReacting", "Waited 30 minutes before reacting"],
  ["acceptedRealityCalmly", "Accepted reality calmly"]
] as const;

export const journalPrompts = [
  "What triggered me today?",
  "Did I react or respond?",
  "What did I want from another person that I should give myself?",
  "What would a disciplined Sikh man do here?",
  "What attachment did I reduce today?"
];

export const emergencyChecklist = [
  "Am I acting from fear?",
  "Will this create respect or pressure?",
  "Have I done Simran first?",
  "Can this wait until tomorrow?"
];

export const careerCategories: { value: CareerCategory; label: string }[] = [
  { value: "CAD_CAM", label: "CAD/CAM" },
  { value: "GD_T", label: "GD&T / drawings" },
  { value: "DEFENCE_RESEARCH", label: "Defence research" },
  { value: "OUTREACH", label: "Client/vendor outreach" },
  { value: "PORTFOLIO", label: "Portfolio/sample project" },
  { value: "EXAM_PREP", label: "Government exam prep" },
  { value: "BUSINESS_DEV", label: "Business development" },
  { value: "READING", label: "Technical reading" }
];

export const careerStatuses: CareerStatus[] = ["PLANNED", "IN_PROGRESS", "DONE", "SKIPPED", "BLOCKED"];

export const simranModes: { value: SimranMode; label: string }[] = [
  { value: "TIMER", label: "Timer" },
  { value: "MALA", label: "Mala 108" },
  { value: "CUSTOM", label: "Custom count" },
  { value: "SILENT", label: "Silent" }
];

export const triggerTypes: EmotionalTriggerType[] = [
  "ATTACHMENT",
  "ANGER",
  "FEAR",
  "LONELINESS",
  "LUST",
  "FAMILY",
  "WORK",
  "CAREER",
  "OTHER"
];

export const fiveThieves: { value: FiveThief; label: string }[] = [
  { value: "KAAM", label: "Kaam" },
  { value: "KRODH", label: "Krodh" },
  { value: "LOBH", label: "Lobh" },
  { value: "MOH", label: "Moh" },
  { value: "AHANKAR", label: "Ahankar" }
];

export const outreachStatuses: OutreachStatus[] = ["PLANNED", "SENT", "FOLLOW_UP", "WON", "LOST", "NO_RESPONSE"];
