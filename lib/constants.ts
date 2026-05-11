import type { CareerCategory, CareerStatus, EmotionalTriggerType, FiveThief, OutreachStatus, SimranMode } from "@prisma/client";

export type RoutineMode = "BEGINNER" | "INTERMEDIATE" | "FULL";

export const quoteLine = "Naam Japo. Kirat Karo. Vand Chhako.";

export const routineModeLabels: Record<RoutineMode, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  FULL: "Full"
};

export const nitnemPathCatalog = [
  {
    name: "Japji Sahib",
    period: "Amrit vela",
    group: "Morning Nitnem",
    defaultDuration: 20,
    modes: ["BEGINNER", "INTERMEDIATE", "FULL"],
    focus: "Begin the day in hukam and discipline."
  },
  {
    name: "Jaap Sahib",
    period: "Amrit vela",
    group: "Morning Nitnem",
    defaultDuration: 20,
    modes: ["FULL"],
    focus: "Strength, awe, and steady courage."
  },
  {
    name: "Tav-Prasad Savaiye",
    period: "Amrit vela",
    group: "Morning Nitnem",
    defaultDuration: 8,
    modes: ["FULL"],
    focus: "Clarity against ego and empty performance."
  },
  {
    name: "Chaupai Sahib",
    period: "Morning / emergency",
    group: "Protection",
    defaultDuration: 10,
    modes: ["BEGINNER", "INTERMEDIATE", "FULL"],
    focus: "Defence, courage, and inner safety."
  },
  {
    name: "Anand Sahib",
    period: "Morning",
    group: "Morning Nitnem",
    defaultDuration: 12,
    modes: ["FULL"],
    focus: "Gratitude and acceptance."
  },
  {
    name: "Rehras Sahib",
    period: "Evening",
    group: "Evening Nitnem",
    defaultDuration: 20,
    modes: ["INTERMEDIATE", "FULL"],
    focus: "Close work honestly and return to Naam."
  },
  {
    name: "Kirtan Sohila",
    period: "Night",
    group: "Night Nitnem",
    defaultDuration: 8,
    modes: ["BEGINNER", "INTERMEDIATE", "FULL"],
    focus: "End the day without attachment or fear."
  },
  {
    name: "Ardaas",
    period: "Any time",
    group: "Prayer",
    defaultDuration: 5,
    modes: ["FULL"],
    focus: "Ask for strength, humility, and truthful action."
  },
  {
    name: "Mool Mantar",
    period: "Any time",
    group: "Foundation",
    defaultDuration: 5,
    modes: ["FULL"],
    focus: "Return to the foundation before reacting."
  },
  {
    name: "Hukamnama reflection",
    period: "Morning",
    group: "Reflection",
    defaultDuration: 5,
    modes: ["FULL"],
    focus: "Write one line of verified reflection, not invented text."
  },
  {
    name: "Waheguru Simran",
    period: "Any time",
    group: "Naam Simran",
    defaultDuration: 15,
    modes: ["BEGINNER", "INTERMEDIATE", "FULL"],
    focus: "Stabilize attention before career, emotion, or contact."
  }
] as const satisfies readonly {
  name: string;
  period: string;
  group: string;
  defaultDuration: number;
  modes: readonly RoutineMode[];
  focus: string;
}[];

const modeIncludes = (modes: readonly RoutineMode[], mode: RoutineMode) => modes.includes(mode);

export const routinePaths: Record<RoutineMode, string[]> = {
  BEGINNER: nitnemPathCatalog.filter((path) => modeIncludes(path.modes, "BEGINNER")).map((path) => path.name),
  INTERMEDIATE: nitnemPathCatalog.filter((path) => modeIncludes(path.modes, "INTERMEDIATE")).map((path) => path.name),
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

export const pathNames = nitnemPathCatalog.map((path) => path.name);

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
