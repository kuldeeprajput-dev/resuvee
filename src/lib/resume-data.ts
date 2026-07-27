import type {
  BuilderSection,
  ResumeData,
  ResumeTemplate,
} from "@/types/resume";

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "nova",
    name: "Meridian",
    eyebrow: "Fresh",
    description: "A friendly portrait layout with a focused content rail.",
    accent: "#28785b",
    background: "#e7f2eb",
    suitableFor: "Product, people & operations",
    layout: "sidebar",
  },
  {
    id: "classic",
    name: "Editorial",
    eyebrow: "Timeless",
    description: "A formal, typography-first document with balanced rules.",
    accent: "#424242",
    background: "#f2f0eb",
    suitableFor: "Academia, law & consulting",
    layout: "single",
  },
  {
    id: "executive",
    name: "Summit",
    eyebrow: "Leadership",
    description: "A confident executive document with a deep profile panel.",
    accent: "#203b57",
    background: "#e6ecf2",
    suitableFor: "Leadership & management",
    layout: "sidebar",
  },
  {
    id: "minimal",
    name: "Column",
    eyebrow: "Minimal",
    description: "A crisp information-led layout with restrained typography.",
    accent: "#222222",
    background: "#efefec",
    suitableFor: "Any ATS-first application",
    layout: "single",
  },
  {
    id: "studio",
    name: "Horizon",
    eyebrow: "Contemporary",
    description: "An airy portrait layout with an original curved masthead.",
    accent: "#347fb7",
    background: "#e8f2fa",
    suitableFor: "Education, research & creative",
    layout: "single",
  },
  {
    id: "terminal",
    name: "Blueprint",
    eyebrow: "Technical",
    description: "A structured document with a subtle technical grid rail.",
    accent: "#244b44",
    background: "#e6eeeb",
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
    fullName: "Mira Shah",
    headline: "Senior Product & Strategy Lead",
    photo: "/assets/mira-shah-profile.webp",
    email: "mira.shah@example.com",
    phone: "+1 646 555 0184",
    location: "New York, NY",
    website: "mirashah.work",
    summary:
      "Product and strategy leader with 8+ years of experience turning complex customer needs into focused digital products. I partner with design, engineering, and commercial teams to launch useful experiences, build strong operating systems, and deliver measurable growth.",
  },
  experience: [
    {
      id: "experience-1",
      role: "Senior Product & Strategy Lead",
      company: "Arbor Systems",
      location: "New York, NY",
      startDate: "2022",
      endDate: "Present",
      current: true,
      highlights: [
        "Set product direction for a B2B analytics suite used by more than 65,000 operations teams.",
        "Launched a new planning workspace that increased weekly active use by 31% in two quarters.",
        "Built a cross-functional discovery practice that reduced roadmap rework by 24%.",
      ],
    },
    {
      id: "experience-2",
      role: "Product Manager",
      company: "Juniper Works",
      location: "Brooklyn, NY",
      startDate: "2019",
      endDate: "2022",
      current: false,
      highlights: [
        "Led a portfolio of collaboration tools from early research through global release.",
        "Improved trial-to-paid conversion by 18% through onboarding and pricing experiments.",
        "Introduced monthly customer councils that shaped three major product investments.",
      ],
    },
    {
      id: "experience-3",
      role: "Associate Product Manager",
      company: "Luma Collective",
      location: "Boston, MA",
      startDate: "2017",
      endDate: "2019",
      current: false,
      highlights: [
        "Coordinated research, launch planning, and performance reporting for a two-sided marketplace.",
        "Automated weekly reporting and saved the operations team more than 12 hours each month.",
      ],
    },
  ],
  education: [
    {
      id: "education-1",
      degree: "MBA, Strategy & Innovation",
      school: "Northeastern University",
      location: "Boston, MA",
      startDate: "2019",
      endDate: "2021",
      details: "Dean’s Leadership Fellow",
    },
    {
      id: "education-2",
      degree: "BA, Economics",
      school: "Rutgers University",
      location: "New Brunswick, NJ",
      startDate: "2013",
      endDate: "2017",
      details: "Magna cum laude",
    },
  ],
  projects: [
    {
      id: "project-1",
      name: "Signal Library",
      description:
        "An open collection of product discovery prompts for early-stage teams.",
      link: "signallibrary.org",
      highlights: [
        "Designed the content model and grew the resource to 4,000 monthly readers.",
      ],
    },
    {
      id: "project-2",
      name: "Product Office Hours",
      description:
        "A volunteer coaching circle for first-time product managers.",
      link: "producthours.community",
      highlights: [
        "Facilitated 40+ portfolio reviews and practical career workshops.",
      ],
    },
  ],
  skillGroups: [
    {
      id: "skills-1",
      name: "Product",
      skills: [
        "Product strategy",
        "Portfolio planning",
        "Discovery",
        "Go-to-market",
      ],
    },
    {
      id: "skills-2",
      name: "Leadership",
      skills: ["Team coaching", "Executive alignment", "Workshops", "Hiring"],
    },
    {
      id: "skills-3",
      name: "Tools",
      skills: ["Figma", "Amplitude", "SQL", "Notion", "Jira"],
    },
  ],
};

export function createBlankResumeData(): ResumeData {
  return {
    basics: {
      fullName: "",
      headline: "",
      photo: "",
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
