import type {
  BuilderSection,
  ResumeData,
  ResumeTemplate,
} from "@/types/resume";

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "nova",
    renderer: "meridian",
    name: "Meridian",
    eyebrow: "Fresh",
    description: "A friendly portrait layout with a focused content rail.",
    accent: "#28785b",
    background: "#e7f2eb",
    suitableFor: "Product, people & operations",
    layout: "sidebar",
    supportsPhoto: true,
    photoShape: "rounded",
    sections: ["basics", "summary", "experience", "projects", "skills", "education"],
    sidebarSections: ["projects", "skills", "education"],
    previewImage: "/assets/template-previews/meridian.webp",
    audience: "experienced",
    popular: true,
  },
  {
    id: "classic",
    renderer: "editorial",
    name: "Editorial",
    eyebrow: "Timeless",
    description: "A formal, typography-first document with balanced rules.",
    accent: "#424242",
    background: "#f2f0eb",
    suitableFor: "Academia, law & consulting",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "education", "projects", "skills"],
    sidebarSections: [],
    previewImage: "/assets/template-previews/editorial.webp",
    audience: "experienced",
    popular: true,
  },
  {
    id: "executive",
    renderer: "summit",
    name: "Summit",
    eyebrow: "Leadership",
    description: "A confident executive document with a deep profile panel.",
    accent: "#203b57",
    background: "#e6ecf2",
    suitableFor: "Leadership & management",
    layout: "sidebar",
    supportsPhoto: true,
    photoShape: "circle",
    sections: ["basics", "summary", "experience", "education", "projects", "skills"],
    sidebarSections: ["projects", "skills"],
    previewImage: "/assets/template-previews/summit.webp",
    audience: "experienced",
  },
  {
    id: "minimal",
    renderer: "column",
    name: "Column",
    eyebrow: "Minimal",
    description: "A crisp information-led layout with restrained typography.",
    accent: "#222222",
    background: "#efefec",
    suitableFor: "Any ATS-first application",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "skills", "education", "projects", "experience"],
    sidebarSections: ["skills", "education", "projects"],
    previewImage: "/assets/template-previews/column.webp",
    audience: "experienced",
    popular: true,
  },
  {
    id: "studio",
    renderer: "horizon",
    name: "Horizon",
    eyebrow: "Contemporary",
    description: "An airy portrait layout with an original curved masthead.",
    accent: "#347fb7",
    background: "#e8f2fa",
    suitableFor: "Education, research & creative",
    layout: "single",
    supportsPhoto: true,
    photoShape: "rounded",
    sections: ["basics", "summary", "experience", "projects", "skills", "education"],
    sidebarSections: ["projects", "skills", "education"],
    previewImage: "/assets/template-previews/horizon.webp",
    audience: "experienced",
  },
  {
    id: "terminal",
    renderer: "blueprint",
    name: "Blueprint",
    eyebrow: "Technical",
    description: "A structured document with a subtle technical grid rail.",
    accent: "#244b44",
    background: "#e6eeeb",
    suitableFor: "Software & data roles",
    layout: "sidebar",
    supportsPhoto: true,
    photoShape: "square",
    sections: ["basics", "summary", "experience", "education", "projects", "skills"],
    sidebarSections: ["projects", "skills"],
    previewImage: "/assets/template-previews/blueprint.webp",
    audience: "experienced",
  },
  {
    id: "standard",
    renderer: "chronological",
    name: "Standard",
    eyebrow: "Most used",
    description:
      "A familiar reverse-chronological format with conventional headings.",
    accent: "#263a34",
    background: "#eceeea",
    suitableFor: "Most roles & ATS-first applications",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "education", "skills", "projects"],
    sidebarSections: [],
    previewImage: "/assets/template-previews/standard.webp",
    audience: "experienced",
    popular: true,
  },
  {
    id: "compact",
    renderer: "compact",
    name: "Compact",
    eyebrow: "Space smart",
    description:
      "A dense one-page format for candidates with substantial experience.",
    accent: "#315f54",
    background: "#eceeea",
    suitableFor: "Experienced specialists",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "experience", "projects", "skills", "education"],
    sidebarSections: ["skills", "education"],
    previewImage: "/assets/template-previews/compact.webp",
    audience: "experienced",
    popular: true,
  },
  {
    id: "hybrid",
    renderer: "hybrid",
    name: "Bridge",
    eyebrow: "Hybrid",
    description:
      "Skills and achievements lead before a concise career timeline.",
    accent: "#5a516d",
    background: "#eceeea",
    suitableFor: "Specialists & career transitions",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "skills", "projects", "experience", "education"],
    sidebarSections: [],
    previewImage: "/assets/template-previews/bridge.webp",
    audience: "career-change",
    popular: true,
  },
  {
    id: "fresher",
    renderer: "fresher",
    name: "Launchpad",
    eyebrow: "Fresher",
    description:
      "Education, projects, and skills take priority—with no experience block.",
    accent: "#326b57",
    background: "#eceeea",
    suitableFor: "Graduates with no work experience",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "education", "projects", "skills"],
    sidebarSections: [],
    previewImage: "/assets/template-previews/launchpad.webp",
    audience: "fresher",
    popular: true,
  },
  {
    id: "internship",
    renderer: "first-step",
    name: "First Step",
    eyebrow: "Internship",
    description:
      "A clean student format for coursework, projects, and campus leadership.",
    accent: "#3f6591",
    background: "#eceeea",
    suitableFor: "Students & internship seekers",
    layout: "single",
    supportsPhoto: false,
    sections: ["basics", "summary", "education", "skills", "projects"],
    sidebarSections: ["education", "skills"],
    previewImage: "/assets/template-previews/first-step.webp",
    audience: "fresher",
  },
  {
    id: "career-change",
    renderer: "pivot",
    name: "Pivot",
    eyebrow: "Career change",
    description:
      "Transferable strengths and relevant proof lead before work history.",
    accent: "#79515e",
    background: "#eceeea",
    suitableFor: "Career changers & returners",
    layout: "sidebar",
    supportsPhoto: false,
    sections: ["basics", "summary", "skills", "projects", "experience", "education"],
    sidebarSections: ["skills", "education"],
    previewImage: "/assets/template-previews/pivot.webp",
    audience: "career-change",
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
