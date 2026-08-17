import type { ResumeData } from "../types/resume";

export const defaultResumeData: ResumeData = {
  basics: {
    fullName: "Mira Shah",
    headline: "Senior Product & Strategy Lead",
    photo: "/assets/mira-shah-profile.webp",
    email: "mira.shah@example.com",
    phone: "+1 646 555 0184",
    location: "New York, NY",
    website: "mirashah.work",
    linkedin: "linkedin.com/in/mirashah",
    github: "github.com/mirashah",
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
      details: "Dean's Leadership Fellow",
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
      description: "An open collection of product discovery prompts for early-stage teams.",
      link: "signallibrary.org",
      highlights: ["Designed the content model and grew the resource to 4,000 monthly readers."],
    },
    {
      id: "project-2",
      name: "Product Office Hours",
      description: "A volunteer coaching circle for first-time product managers.",
      link: "producthours.community",
      highlights: ["Facilitated 40+ portfolio reviews and practical career workshops."],
    },
  ],
  skillGroups: [
    {
      id: "skills-1",
      name: "Product",
      skills: ["Product strategy", "Portfolio planning", "Discovery", "Go-to-market"],
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
    linkedin: "linkedin.com/in/aaravmehta",
    github: "github.com/aarav-builds",
    website: "aaravmehta.dev",
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
      details: "CGPA: 8.7/10 · Relevant coursework: Data Structures, Databases, Web Engineering",
    },
  ],
  projects: [
    {
      id: "fresher-project-1",
      name: "Campus Connect",
      description: "A responsive event-discovery platform for student organizations.",
      link: "github.com/aarav-builds/campus-connect",
      highlights: [
        "Built 12 reusable React components and reduced repeat UI code by 35%.",
        "Tested navigation with 24 students and improved task completion by 28%.",
      ],
    },
    {
      id: "fresher-project-2",
      name: "Budget Lens",
      description: "A TypeScript expense dashboard with categorized insights and CSV import.",
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
      linkedin: "",
      github: "",
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

export function calculateResumeStrength(data: ResumeData, options: { fresher?: boolean } = {}) {
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
          [item.description, ...item.highlights].some((text) => /\d/.test(text))
        ),
      ]
    : [
        data.experience.length > 0 && data.experience.some((item) => item.highlights.some(Boolean)),
        data.experience.some((item) => item.highlights.some((highlight) => /\d/.test(highlight))),
      ];
  const checks = [...sharedChecks, ...evidenceChecks];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
