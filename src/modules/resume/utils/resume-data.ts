import type {
  BuilderSection,
  ResumeData,
  ResumeTemplate,
} from "../types/resume";

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "standard",
    renderer: "chronological",
    name: "Professional",
    eyebrow: "Reverse chronological",
    description:
      "A conventional one-page format with experience presented newest first.",
    accent: "#243d36",
    background: "#e9eeeb",
    suitableFor: "Most roles and ATS applications",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "education", "skills", "projects"],
    sidebarSections: [],
    audience: "experienced",
    popular: true,
  },
  {
    id: "minimal",
    renderer: "column",
    name: "Modern ATS",
    eyebrow: "Structured",
    description:
      "A restrained two-column format with clear hierarchy and readable sections.",
    accent: "#242a29",
    background: "#eceeeb",
    suitableFor: "Business, operations and product",
    layout: "sidebar",
    supportsPhoto: false,
    sections: ["basics", "summary", "skills", "education", "projects", "experience"],
    sidebarSections: ["skills", "education", "projects"],
    audience: "experienced",
    popular: true,
  },
  {
    id: "terminal",
    renderer: "blueprint",
    name: "Technical",
    eyebrow: "Engineering",
    description:
      "A skills-forward technical resume with room for impact, systems, and projects.",
    accent: "#244b44",
    background: "#e6eeeb",
    suitableFor: "Software, data and infrastructure",
    layout: "sidebar",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "education", "projects", "skills"],
    sidebarSections: ["projects", "skills"],
    audience: "experienced",
    popular: true,
  },
  {
    id: "analyst",
    renderer: "analyst",
    name: "Data Analyst",
    eyebrow: "Project led",
    description:
      "A dense, evidence-led format for analytics skills, projects, certifications, and early experience.",
    accent: "#202020",
    background: "#efefec",
    suitableFor: "Data, business intelligence and analytics",
    layout: "single",
    supportsPhoto: false,
    sections: [
      "basics",
      "summary",
      "skills",
      "experience",
      "projects",
      "certifications",
      "education",
    ],
    sidebarSections: [],
    audience: "fresher",
    popular: true,
  },
  {
    id: "compact",
    renderer: "compact",
    name: "Compact Pro",
    eyebrow: "Dense one page",
    description:
      "A space-efficient format for a substantial career without visual clutter.",
    accent: "#315f54",
    background: "#eceeea",
    suitableFor: "Senior specialists and consultants",
    layout: "sidebar",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "projects", "skills", "education"],
    sidebarSections: ["skills", "education"],
    audience: "experienced",
    popular: true,
  },
  {
    id: "finance",
    renderer: "finance",
    name: "Finance",
    eyebrow: "Metrics led",
    description:
      "A conservative finance format built around scope, decisions, and measurable results.",
    accent: "#254d45",
    background: "#e9eeeb",
    suitableFor: "Finance, accounting and investment",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "skills", "projects", "education"],
    sidebarSections: [],
    audience: "experienced",
  },
  {
    id: "healthcare",
    renderer: "healthcare",
    name: "Healthcare",
    eyebrow: "Clinical operations",
    description:
      "A calm, structured resume for patient care, quality, and health operations.",
    accent: "#24706b",
    background: "#e6f0ee",
    suitableFor: "Healthcare, clinical and public health",
    layout: "sidebar",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "projects", "skills", "education"],
    sidebarSections: ["skills", "education"],
    audience: "experienced",
  },
  {
    id: "sales",
    renderer: "sales",
    name: "Sales Impact",
    eyebrow: "Revenue",
    description:
      "A commercial resume that gives targets, growth, and customer wins clear priority.",
    accent: "#8a4d2e",
    background: "#f1ebe7",
    suitableFor: "Sales, partnerships and revenue",
    layout: "sidebar",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "projects", "skills", "education"],
    sidebarSections: ["projects", "skills", "education"],
    audience: "experienced",
  },
  {
    id: "executive",
    renderer: "summit",
    name: "Executive",
    eyebrow: "Leadership",
    description:
      "A leadership-focused document with an optional professional portrait rail.",
    accent: "#203b57",
    background: "#e6ecf2",
    suitableFor: "Directors, executives and global roles",
    layout: "sidebar",
    supportsPhoto: true,
    photoShape: "circle",
    sections: ["basics", "summary", "experience", "education", "projects", "skills"],
    sidebarSections: ["projects", "skills"],
    audience: "experienced",
  },
  {
    id: "classic",
    renderer: "editorial",
    name: "Academic",
    eyebrow: "Formal",
    description:
      "A typography-led format for research, policy, legal, and academic work.",
    accent: "#424242",
    background: "#f2f0eb",
    suitableFor: "Academia, research, law and policy",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "education", "projects", "skills"],
    sidebarSections: [],
    audience: "experienced",
  },
  {
    id: "hybrid",
    renderer: "hybrid",
    name: "Skills First",
    eyebrow: "Functional hybrid",
    description:
      "Transferable skills and selected proof lead before work history.",
    accent: "#5a516d",
    background: "#eceeea",
    suitableFor: "Specialists and career transitions",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "skills", "projects", "experience", "education"],
    sidebarSections: [],
    audience: "career-change",
  },
  {
    id: "career-change",
    renderer: "pivot",
    name: "Career Pivot",
    eyebrow: "Transferable impact",
    description:
      "Relevant capabilities and evidence reframe an established work history.",
    accent: "#79515e",
    background: "#eceeea",
    suitableFor: "Career changers and returners",
    layout: "sidebar",
    supportsPhoto: false,
    sections: ["basics", "summary", "skills", "projects", "experience", "education"],
    sidebarSections: ["skills", "education"],
    audience: "career-change",
  },
  {
    id: "fresher",
    renderer: "fresher",
    name: "Graduate",
    eyebrow: "No experience needed",
    description:
      "Education, projects, and practical skills lead with no experience section.",
    accent: "#326b57",
    background: "#e9eeeb",
    suitableFor: "Graduates and entry-level candidates",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "education", "projects", "skills"],
    sidebarSections: [],
    audience: "fresher",
    popular: true,
  },
  {
    id: "internship",
    renderer: "first-step",
    name: "Internship",
    eyebrow: "Student",
    description:
      "Coursework, projects, and campus leadership form a credible first resume.",
    accent: "#3f6591",
    background: "#eceeea",
    suitableFor: "Students and internship seekers",
    layout: "sidebar",
    supportsPhoto: false,
    sections: ["basics", "summary", "education", "skills", "projects"],
    sidebarSections: ["education", "skills"],
    audience: "fresher",
  },
  {
    id: "nova",
    renderer: "meridian",
    name: "International",
    eyebrow: "Photo optional",
    description:
      "A modern international CV with a portrait, profile, and supporting detail rail.",
    accent: "#28785b",
    background: "#e7f2eb",
    suitableFor: "Global markets where photos are expected",
    layout: "sidebar",
    supportsPhoto: true,
    photoShape: "rounded",
    sections: ["basics", "summary", "experience", "projects", "skills", "education"],
    sidebarSections: ["projects", "skills", "education"],
    audience: "experienced",
  },
  {
    id: "studio",
    renderer: "horizon",
    name: "Contemporary",
    eyebrow: "Photo optional",
    description:
      "An airy, polished CV with a portrait and an original curved masthead.",
    accent: "#347fb7",
    background: "#e8f2fa",
    suitableFor: "Education, research and creative roles",
    layout: "sidebar",
    supportsPhoto: true,
    photoShape: "rounded",
    sections: ["basics", "summary", "experience", "projects", "skills", "education"],
    sidebarSections: ["projects", "skills", "education"],
    audience: "experienced",
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
  {
    id: "certifications",
    label: "Awards & certifications",
    shortLabel: "Awards",
  },
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
  certifications: [],
};

export const fresherResumeData: ResumeData = {
  basics: {
    fullName: "Aarav Mehta",
    headline: "Computer Science Graduate · Frontend Developer",
    photo: "",
    email: "aarav.mehta@example.com",
    phone: "+91 98765 43210",
    location: "Pune, India",
    website: "github.com/aarav-builds",
    summary:
      "Computer Science graduate with hands-on experience building accessible web applications using React, TypeScript, and REST APIs. Strong foundation in data structures, collaborative development, and user-centered problem solving, demonstrated through academic and independent projects.",
  },
  experience: [],
  education: [
    {
      id: "fresher-education-1",
      degree: "BTech, Computer Science & Engineering",
      school: "Western Institute of Technology",
      location: "Pune, India",
      startDate: "2022",
      endDate: "2026",
      details:
        "CGPA: 8.7/10 · Relevant coursework: Data Structures, Databases, Web Engineering",
    },
  ],
  projects: [
    {
      id: "fresher-project-1",
      name: "Campus Connect",
      description:
        "A responsive event-discovery platform for student organizations.",
      link: "github.com/aarav-builds/campus-connect",
      highlights: [
        "Built 12 reusable React components and reduced repeat UI code by 35%.",
        "Tested navigation with 24 students and improved task completion by 28%.",
      ],
    },
    {
      id: "fresher-project-2",
      name: "Budget Lens",
      description:
        "A TypeScript expense dashboard with categorized insights and CSV import.",
      link: "github.com/aarav-builds/budget-lens",
      highlights: [
        "Processed 5,000+ transaction rows in under two seconds using client-side parsing.",
        "Added keyboard navigation and achieved a 96 Lighthouse accessibility score.",
      ],
    },
  ],
  skillGroups: [
    {
      id: "fresher-skills-1",
      name: "Development",
      skills: ["TypeScript", "React", "JavaScript", "HTML", "CSS"],
    },
    {
      id: "fresher-skills-2",
      name: "Data & tools",
      skills: ["SQL", "Git", "REST APIs", "Figma", "Vitest"],
    },
    {
      id: "fresher-skills-3",
      name: "Foundations",
      skills: ["Data structures", "OOP", "Accessibility", "Agile"],
    },
  ],
  certifications: [],
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
    certifications: [],
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
    date: "",
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

export function getEmptyCertification(index: number) {
  return {
    id: `certification-${Date.now()}-${index}`,
    title: "",
    issuer: "",
    date: "",
    description: "",
  };
}

export function calculateResumeStrength(
  data: ResumeData,
  options: { fresher?: boolean } = {},
) {
  const sharedChecks = [
    Boolean(data.basics.fullName.trim()),
    Boolean(data.basics.headline.trim()),
    Boolean(data.basics.email.trim()),
    Boolean(data.basics.phone.trim()),
    data.basics.summary.trim().length >= 80,
    data.education.length > 0,
    data.skillGroups.some((group) => group.skills.length >= 3),
    data.projects.length > 0,
  ];
  const evidenceChecks = options.fresher
    ? [
        data.projects.some((item) => item.highlights.some(Boolean)),
        data.projects.some((item) =>
          [item.description, ...item.highlights].some((text) =>
            /\d/.test(text),
          ),
        ),
      ]
    : [
        data.experience.length > 0 &&
          data.experience.some((item) => item.highlights.some(Boolean)),
        data.experience.some((item) =>
          item.highlights.some((highlight) => /\d/.test(highlight)),
        ),
      ];
  const checks = [...sharedChecks, ...evidenceChecks];

  return Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );
}
