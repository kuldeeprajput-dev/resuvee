import type {
  BuilderSection,
  ResumeData,
  ResumeTemplate,
} from "@/types/resume";

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "nova",
    name: "Nova",
    eyebrow: "Modern",
    description: "A sharp two-column layout with strong visual hierarchy.",
    accent: "#214e45",
    background: "#f4f0e8",
    suitableFor: "Product, engineering & design",
    layout: "sidebar",
  },
  {
    id: "classic",
    name: "Cambridge",
    eyebrow: "Classic",
    description: "A timeless, typography-led layout built for readability.",
    accent: "#7a2e2e",
    background: "#f7f3ea",
    suitableFor: "Academia, law & consulting",
    layout: "single",
  },
  {
    id: "executive",
    name: "Avenue",
    eyebrow: "Executive",
    description: "A confident layout for experienced leaders and operators.",
    accent: "#23334f",
    background: "#eef1f5",
    suitableFor: "Leadership & management",
    layout: "single",
  },
  {
    id: "minimal",
    name: "Mono",
    eyebrow: "Minimal",
    description: "Quiet, spacious and deliberately distraction-free.",
    accent: "#222222",
    background: "#f2f2ef",
    suitableFor: "Any ATS-first application",
    layout: "single",
  },
  {
    id: "studio",
    name: "Saffron",
    eyebrow: "Creative",
    description: "An expressive editorial layout with a warm accent.",
    accent: "#b34f2d",
    background: "#f7eee4",
    suitableFor: "Brand, media & creative roles",
    layout: "sidebar",
  },
  {
    id: "terminal",
    name: "Kernel",
    eyebrow: "Technical",
    description: "A structured format inspired by technical documentation.",
    accent: "#315f45",
    background: "#edf3ed",
    suitableFor: "Software & data roles",
    layout: "sidebar",
  },
];

export const builderSections: {
  id: BuilderSection;
  label: string;
  shortLabel: string;
}[] = [
  { id: "basics", label: "Personal details", shortLabel: "Details" },
  { id: "summary", label: "Professional summary", shortLabel: "Summary" },
  { id: "experience", label: "Work experience", shortLabel: "Experience" },
  { id: "education", label: "Education", shortLabel: "Education" },
  { id: "projects", label: "Selected projects", shortLabel: "Projects" },
  { id: "skills", label: "Skills & tools", shortLabel: "Skills" },
];

export const defaultResumeData: ResumeData = {
  basics: {
    fullName: "Alex Morgan",
    headline: "Senior Product Designer",
    email: "alex.morgan@example.com",
    phone: "+1 415 555 0142",
    location: "San Francisco, CA",
    website: "alexmorgan.design",
    summary:
      "Product designer with 7+ years of experience turning complex workflows into clear, useful products. I partner closely with engineering and research teams to ship thoughtful experiences that improve customer outcomes.",
  },
  experience: [
    {
      id: "experience-1",
      role: "Senior Product Designer",
      company: "Northstar Labs",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      highlights: [
        "Led the redesign of the core analytics workspace, increasing weekly active use by 28%.",
        "Built and rolled out a shared design system used across four product teams.",
        "Partnered with research to reduce onboarding time from 18 to 11 minutes.",
      ],
    },
    {
      id: "experience-2",
      role: "Product Designer",
      company: "Common Thread",
      location: "New York, NY",
      startDate: "2019",
      endDate: "2022",
      current: false,
      highlights: [
        "Designed collaboration tools used by more than 40,000 distributed teams.",
        "Introduced monthly customer workshops that shaped two major roadmap bets.",
      ],
    },
  ],
  education: [
    {
      id: "education-1",
      degree: "BFA, Interaction Design",
      school: "California College of the Arts",
      location: "San Francisco, CA",
      startDate: "2014",
      endDate: "2018",
      details: "Graduated with distinction",
    },
  ],
  projects: [
    {
      id: "project-1",
      name: "Field Notes",
      description:
        "An open-source research repository for small product teams.",
      link: "fieldnotes.design",
      highlights: [
        "Created the product strategy, visual system and first public release.",
      ],
    },
  ],
  skillGroups: [
    {
      id: "skills-1",
      name: "Design",
      skills: [
        "Product strategy",
        "Interaction design",
        "Prototyping",
        "Design systems",
      ],
    },
    {
      id: "skills-2",
      name: "Tools",
      skills: ["Figma", "FigJam", "Maze", "Notion"],
    },
  ],
};

export function createBlankResumeData(): ResumeData {
  return {
    basics: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      summary: "",
    },
    experience: [],
    education: [],
    projects: [],
    skillGroups: [],
  };
}

export function getEmptyExperience(index: number) {
  return {
    id: `experience-${Date.now()}-${index}`,
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    highlights: [""],
  };
}

export function getEmptyEducation(index: number) {
  return {
    id: `education-${Date.now()}-${index}`,
    degree: "",
    school: "",
    location: "",
    startDate: "",
    endDate: "",
    details: "",
  };
}

export function getEmptyProject(index: number) {
  return {
    id: `project-${Date.now()}-${index}`,
    name: "",
    description: "",
    link: "",
    highlights: [""],
  };
}

export function getEmptySkillGroup(index: number) {
  return {
    id: `skills-${Date.now()}-${index}`,
    name: "",
    skills: [],
  };
}

export function calculateResumeStrength(data: ResumeData) {
  const checks = [
    Boolean(data.basics.fullName.trim()),
    Boolean(data.basics.headline.trim()),
    Boolean(data.basics.email.trim()),
    Boolean(data.basics.phone.trim()),
    data.basics.summary.trim().length >= 80,
    data.experience.length > 0 &&
      data.experience.some((item) => item.highlights.some(Boolean)),
    data.education.length > 0,
    data.skillGroups.some((group) => group.skills.length >= 3),
    data.projects.length > 0,
    data.experience.some((item) =>
      item.highlights.some((highlight) => /\d/.test(highlight)),
    ),
  ];

  return Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );
}
