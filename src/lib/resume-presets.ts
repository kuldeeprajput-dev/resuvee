import type { ResumeData, ResumeTemplateId } from "@/types/resume";

interface ProfessionalSeed {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photo?: string;
  summary: string;
  role: string;
  company: string;
  previousRole: string;
  previousCompany: string;
  degree: string;
  school: string;
  project: string;
  projectDescription: string;
  skills: [string[], string[], string[]];
}

function professionalPreset(seed: ProfessionalSeed): ResumeData {
  return {
    basics: {
      fullName: seed.name,
      headline: seed.headline,
      photo: seed.photo ?? "",
      email: seed.email,
      phone: seed.phone,
      location: seed.location,
      website: seed.website,
      summary: seed.summary,
    },
    experience: [
      {
        id: `${seed.name}-experience-1`,
        role: seed.role,
        company: seed.company,
        location: seed.location,
        startDate: "2021",
        endDate: "Present",
        current: true,
        highlights: [
          "Led a cross-functional program that improved delivery speed by 28% while maintaining quality targets.",
          "Built a quarterly planning system used by more than 40 stakeholders across product and operations.",
          "Introduced measurable success criteria that reduced avoidable rework by 21% in one year.",
        ],
      },
      {
        id: `${seed.name}-experience-2`,
        role: seed.previousRole,
        company: seed.previousCompany,
        location: seed.location,
        startDate: "2017",
        endDate: "2021",
        current: false,
        highlights: [
          "Delivered customer-focused improvements that increased adoption by 19% across two releases.",
          "Created repeatable reporting and documentation that saved the team 10 hours each month.",
        ],
      },
    ],
    education: [
      {
        id: `${seed.name}-education-1`,
        degree: seed.degree,
        school: seed.school,
        location: seed.location,
        startDate: "2013",
        endDate: "2017",
        details: "Graduated with distinction · Leadership society member",
      },
    ],
    projects: [
      {
        id: `${seed.name}-project-1`,
        name: seed.project,
        description: seed.projectDescription,
        link: seed.website,
        highlights: [
          "Designed the operating model and delivered the first release in twelve weeks.",
          "Measured a 24% improvement in the team’s primary success metric.",
        ],
      },
      {
        id: `${seed.name}-project-2`,
        name: "Community Mentoring Circle",
        description: "A practical monthly coaching program for early-career professionals.",
        link: "",
        highlights: ["Supported 35 participants through portfolio and career reviews."],
      },
    ],
    skillGroups: [
      { id: `${seed.name}-skills-1`, name: "Core expertise", skills: seed.skills[0] },
      { id: `${seed.name}-skills-2`, name: "Leadership", skills: seed.skills[1] },
      { id: `${seed.name}-skills-3`, name: "Tools", skills: seed.skills[2] },
    ],
  };
}

const meridianData = professionalPreset({
  name: "Adrian Cole",
  headline: "Product Operations Lead",
  email: "adrian.cole@example.com",
  phone: "+1 415 555 0138",
  location: "Austin, TX",
  website: "adriancole.work",
  photo: "/assets/template-portraits/adrian-cole.webp",
  summary:
    "Product operations leader with 8+ years of experience creating focused systems for growing teams. Known for connecting customer insight, delivery planning, and measurable business outcomes.",
  role: "Product Operations Lead",
  company: "Northline Labs",
  previousRole: "Senior Program Manager",
  previousCompany: "Fieldstone Digital",
  degree: "BBA, Operations & Information Systems",
  school: "University of Texas at Austin",
  project: "Operating Rhythm Toolkit",
  projectDescription: "A reusable planning toolkit for product and delivery teams.",
  skills: [
    ["Product operations", "Roadmaps", "Research synthesis", "Analytics"],
    ["Team facilitation", "Executive updates", "Change management"],
    ["SQL", "Amplitude", "Jira", "Notion", "Figma"],
  ],
});

const editorialData = professionalPreset({
  name: "Julian Hart",
  headline: "Legal Research Analyst",
  email: "julian.hart@example.com",
  phone: "+1 312 555 0162",
  location: "Chicago, IL",
  website: "julianhart.org",
  summary:
    "Legal research analyst with seven years of experience translating complex regulatory questions into clear, well-supported recommendations for counsel and policy teams.",
  role: "Senior Legal Research Analyst",
  company: "Marlowe & Finch",
  previousRole: "Policy Research Associate",
  previousCompany: "Civic Law Institute",
  degree: "JD, Public Interest Law",
  school: "Northwestern University",
  project: "Regulatory Evidence Index",
  projectDescription: "A searchable reference system for multi-state regulatory decisions.",
  skills: [
    ["Legal research", "Regulatory analysis", "Case synthesis", "Writing"],
    ["Counsel collaboration", "Peer review", "Stakeholder interviews"],
    ["Westlaw", "LexisNexis", "Excel", "Zotero"],
  ],
});

const summitData = professionalPreset({
  name: "Marcus Reed",
  headline: "Vice President of Operations",
  email: "marcus.reed@example.com",
  phone: "+1 206 555 0187",
  location: "Seattle, WA",
  website: "marcusreed.co",
  photo: "/assets/template-portraits/marcus-reed.webp",
  summary:
    "Operations executive with 14+ years of experience scaling distributed organizations, improving unit economics, and building accountable leadership teams through periods of rapid growth.",
  role: "Vice President of Operations",
  company: "Cascade Mobility",
  previousRole: "Director of Business Operations",
  previousCompany: "Harbor Systems",
  degree: "MBA, Strategy & Finance",
  school: "University of Washington",
  project: "Regional Scale Program",
  projectDescription: "A multi-market operating model supporting three new regional launches.",
  skills: [
    ["Operating strategy", "P&L management", "Capacity planning", "Risk"],
    ["Executive leadership", "Board reporting", "Org design", "Coaching"],
    ["Tableau", "Salesforce", "Workday", "Excel"],
  ],
});

const columnData = professionalPreset({
  name: "Leo Martin",
  headline: "Program Manager",
  email: "leo.martin@example.com",
  phone: "+1 415 555 0198",
  location: "San Francisco, CA",
  website: "leomartin.work",
  summary:
    "Program manager with 7+ years of experience coordinating complex initiatives across engineering, design, and operations with a practical focus on clarity and delivery.",
  role: "Senior Program Manager",
  company: "Verge Software",
  previousRole: "Technical Program Manager",
  previousCompany: "Bridgeton Technologies",
  degree: "BS, Business Administration",
  school: "University of California, Berkeley",
  project: "Delivery Efficiency Program",
  projectDescription: "A cross-team workflow for planning dependencies and delivery risks.",
  skills: [
    ["Program management", "Roadmapping", "Risk management", "Planning"],
    ["Cross-functional leadership", "Facilitation", "Vendor management"],
    ["Jira", "Asana", "Smartsheet", "Looker"],
  ],
});

const horizonData = professionalPreset({
  name: "Owen Brooks",
  headline: "Learning Experience Designer",
  email: "owen.brooks@example.com",
  phone: "+1 919 555 0147",
  location: "Raleigh, NC",
  website: "owenbrooks.design",
  photo: "/assets/template-portraits/owen-brooks.webp",
  summary:
    "Learning experience designer who turns complex subjects into clear, inclusive programs. Combines curriculum strategy, facilitation, and research to improve learner confidence and outcomes.",
  role: "Senior Learning Experience Designer",
  company: "Brightpath Learning",
  previousRole: "Instructional Designer",
  previousCompany: "Oak & River Education",
  degree: "MEd, Learning Design & Technology",
  school: "North Carolina State University",
  project: "Manager Learning Lab",
  projectDescription: "A cohort-based leadership curriculum for first-time managers.",
  skills: [
    ["Curriculum design", "Adult learning", "Research", "Assessment"],
    ["Workshop facilitation", "Coaching", "Inclusive design"],
    ["Articulate 360", "Miro", "Figma", "LMS administration"],
  ],
});

const blueprintData = professionalPreset({
  name: "Caleb Stone",
  headline: "Senior Software Engineer",
  email: "caleb.stone@example.com",
  phone: "+1 303 555 0124",
  location: "Denver, CO",
  website: "github.com/calebstone",
  photo: "/assets/template-portraits/caleb-stone.webp",
  summary:
    "Senior software engineer with 9+ years of experience building reliable web platforms and developer tooling. Focused on pragmatic architecture, observability, and effective technical leadership.",
  role: "Senior Software Engineer",
  company: "Granite Cloud",
  previousRole: "Software Engineer",
  previousCompany: "Beacon Commerce",
  degree: "BS, Computer Science",
  school: "Colorado State University",
  project: "Platform Reliability Console",
  projectDescription: "An internal observability workspace for service owners and incident response.",
  skills: [
    ["TypeScript", "React", "Node.js", "Distributed systems"],
    ["Technical leadership", "Architecture", "Mentoring", "Code review"],
    ["AWS", "PostgreSQL", "Docker", "Kubernetes", "Grafana"],
  ],
});

const standardData = professionalPreset({
  name: "Nathan Grant",
  headline: "Senior Program Manager",
  email: "nathan.grant@example.com",
  phone: "+1 617 555 0181",
  location: "Boston, MA",
  website: "nathangrant.work",
  summary:
    "Senior program manager with 10+ years of experience delivering business-critical initiatives across technology, operations, and customer experience.",
  role: "Senior Program Manager",
  company: "Redwood Services",
  previousRole: "Program Manager",
  previousCompany: "Atlas Group",
  degree: "BS, Management Information Systems",
  school: "Boston University",
  project: "Customer Operations Modernization",
  projectDescription: "A service redesign spanning workflow, reporting, and team enablement.",
  skills: [
    ["Program delivery", "Process improvement", "Planning", "Analytics"],
    ["Stakeholder management", "Team leadership", "Communication"],
    ["Jira", "Power BI", "Salesforce", "Excel"],
  ],
});

const compactData = professionalPreset({
  name: "Elias Ford",
  headline: "Principal Systems Engineer",
  email: "elias.ford@example.com",
  phone: "+1 512 555 0156",
  location: "Austin, TX",
  website: "eliasford.dev",
  summary:
    "Principal systems engineer with 12+ years of experience designing secure, high-availability platforms and guiding engineering teams through complex modernization programs.",
  role: "Principal Systems Engineer",
  company: "Vector Infrastructure",
  previousRole: "Senior Platform Engineer",
  previousCompany: "Ironwood Networks",
  degree: "MS, Computer Engineering",
  school: "Georgia Institute of Technology",
  project: "Service Resilience Framework",
  projectDescription: "A platform standard for reliability reviews and production readiness.",
  skills: [
    ["Systems architecture", "Reliability", "Security", "Performance"],
    ["Technical strategy", "Mentoring", "Incident leadership"],
    ["Go", "AWS", "Terraform", "Kubernetes", "Datadog"],
  ],
});

const bridgeData = professionalPreset({
  name: "Samuel Ortiz",
  headline: "Cybersecurity Specialist",
  email: "samuel.ortiz@example.com",
  phone: "+1 202 555 0119",
  location: "Washington, DC",
  website: "samuelortiz.security",
  summary:
    "Cybersecurity specialist bridging technical risk, security operations, and business priorities. Experienced in incident readiness, control design, and practical security education.",
  role: "Cybersecurity Specialist",
  company: "CivicGrid",
  previousRole: "Security Operations Analyst",
  previousCompany: "Sentinel Harbor",
  degree: "BS, Cybersecurity",
  school: "George Mason University",
  project: "Incident Readiness Playbook",
  projectDescription: "A role-based response system for high-priority security events.",
  skills: [
    ["Threat analysis", "Incident response", "Risk assessment", "IAM"],
    ["Security training", "Cross-team response", "Policy design"],
    ["Splunk", "CrowdStrike", "AWS", "Python", "NIST CSF"],
  ],
});

const launchpadData: ResumeData = {
  basics: {
    fullName: "Arjun Rao",
    headline: "Computer Science Graduate · Frontend Developer",
    photo: "",
    email: "arjun.rao@example.com",
    phone: "+91 98765 43120",
    location: "Bengaluru, India",
    website: "github.com/arjunrao",
    summary:
      "Computer Science graduate with practical experience building accessible web applications using React, TypeScript, and REST APIs. Strong foundations in data structures, testing, and collaborative development demonstrated through academic and independent projects.",
  },
  experience: [],
  education: [
    {
      id: "arjun-education-1",
      degree: "BTech, Computer Science & Engineering",
      school: "National Institute of Technology",
      location: "Bengaluru, India",
      startDate: "2022",
      endDate: "2026",
      details: "CGPA: 8.8/10 · Coursework: Data Structures, Databases, Web Engineering",
    },
  ],
  projects: [
    {
      id: "arjun-project-1",
      name: "Campus Connect",
      description: "An accessible event-discovery platform for student organizations.",
      link: "github.com/arjunrao/campus-connect",
      highlights: [
        "Built 14 reusable React components and reduced repeated UI code by 38%.",
        "Improved task completion by 27% after testing with 22 students.",
      ],
    },
    {
      id: "arjun-project-2",
      name: "Budget Lens",
      description: "A TypeScript expense dashboard with CSV import and categorized insights.",
      link: "github.com/arjunrao/budget-lens",
      highlights: ["Processed 5,000 transaction rows in under two seconds."],
    },
  ],
  skillGroups: [
    { id: "arjun-skills-1", name: "Development", skills: ["TypeScript", "React", "JavaScript", "HTML", "CSS"] },
    { id: "arjun-skills-2", name: "Data & tools", skills: ["SQL", "Git", "REST APIs", "Vitest", "Figma"] },
    { id: "arjun-skills-3", name: "Foundations", skills: ["Data structures", "OOP", "Accessibility", "Agile"] },
  ],
};

const firstStepData: ResumeData = {
  ...launchpadData,
  basics: {
    ...launchpadData.basics,
    fullName: "Finn Carter",
    headline: "Business Analytics Student · Operations Intern",
    email: "finn.carter@example.com",
    phone: "+1 617 555 0140",
    location: "Boston, MA",
    website: "finncarter.work",
    summary:
      "Business analytics student combining quantitative coursework, campus leadership, and hands-on reporting projects. Interested in operations roles where careful analysis can improve everyday decisions.",
  },
  education: [
    {
      id: "finn-education-1",
      degree: "BS, Business Analytics",
      school: "Northeastern University",
      location: "Boston, MA",
      startDate: "2023",
      endDate: "2027",
      details: "Dean’s List · Coursework: Statistics, SQL, Operations Management",
    },
  ],
  projects: [
    {
      id: "finn-project-1",
      name: "Campus Dining Forecast",
      description: "A demand forecast built from anonymized dining-hall transaction data.",
      link: "finncarter.work/forecast",
      highlights: ["Improved weekly forecast accuracy by 18% across six locations."],
    },
    {
      id: "finn-project-2",
      name: "Student Consulting Challenge",
      description: "A four-person team project for a local community organization.",
      link: "",
      highlights: ["Presented three recommendations adopted for the fall campaign."],
    },
  ],
  skillGroups: [
    { id: "finn-skills-1", name: "Analysis", skills: ["Excel", "SQL", "Tableau", "Forecasting"] },
    { id: "finn-skills-2", name: "Collaboration", skills: ["Presentations", "Research", "Teamwork"] },
    { id: "finn-skills-3", name: "Coursework", skills: ["Statistics", "Economics", "Operations"] },
  ],
};

const pivotData = professionalPreset({
  name: "Ryan Lewis",
  headline: "Customer Success Leader · Product Management",
  email: "ryan.lewis@example.com",
  phone: "+1 646 555 0192",
  location: "New York, NY",
  website: "ryanlewis.work",
  summary:
    "Customer success leader transitioning into product management after eight years translating customer needs into onboarding, retention, and workflow improvements. Brings strong discovery, prioritization, and cross-functional delivery skills.",
  role: "Senior Customer Success Manager",
  company: "Relay Software",
  previousRole: "Customer Success Manager",
  previousCompany: "Marketlane",
  degree: "BA, Communications",
  school: "Fordham University",
  project: "Customer Insight Repository",
  projectDescription: "A structured research library connecting customer evidence to product decisions.",
  skills: [
    ["Customer discovery", "Product strategy", "Prioritization", "Analytics"],
    ["Stakeholder management", "Facilitation", "Change leadership"],
    ["Salesforce", "Productboard", "Amplitude", "Figma"],
  ],
});

export const templateStarterData: Record<ResumeTemplateId, ResumeData> = {
  nova: meridianData,
  classic: editorialData,
  executive: summitData,
  minimal: columnData,
  studio: horizonData,
  terminal: blueprintData,
  standard: standardData,
  compact: compactData,
  hybrid: bridgeData,
  fresher: launchpadData,
  internship: firstStepData,
  "career-change": pivotData,
};

export function cloneResumeData(data: ResumeData): ResumeData {
  return {
    basics: { ...data.basics },
    experience: data.experience.map((item) => ({ ...item, highlights: [...item.highlights] })),
    education: data.education.map((item) => ({ ...item })),
    projects: data.projects.map((item) => ({ ...item, highlights: [...item.highlights] })),
    skillGroups: data.skillGroups.map((group) => ({ ...group, skills: [...group.skills] })),
  };
}

function hasText(values: string[]) {
  return values.some((value) => value.trim().length > 0);
}

export function mergeResumeWithStarter(current: ResumeData, starter: ResumeData): ResumeData {
  const basics = Object.fromEntries(
    Object.entries(starter.basics).map(([key, sampleValue]) => {
      const currentValue = current.basics[key as keyof ResumeData["basics"]];
      return [key, currentValue?.trim() ? currentValue : sampleValue];
    }),
  ) as unknown as ResumeData["basics"];

  const hasExperience = current.experience.some((item) =>
    hasText([item.role, item.company, ...item.highlights]),
  );
  const hasEducation = current.education.some((item) =>
    hasText([item.degree, item.school, item.details]),
  );
  const hasProjects = current.projects.some((item) =>
    hasText([item.name, item.description, ...item.highlights]),
  );
  const hasSkills = current.skillGroups.some((group) =>
    hasText([group.name, ...group.skills]),
  );

  return {
    basics,
    experience: hasExperience ? current.experience : cloneResumeData(starter).experience,
    education: hasEducation ? current.education : cloneResumeData(starter).education,
    projects: hasProjects ? current.projects : cloneResumeData(starter).projects,
    skillGroups: hasSkills ? current.skillGroups : cloneResumeData(starter).skillGroups,
  };
}

export function getTemplateStarterData(templateId: ResumeTemplateId) {
  return cloneResumeData(templateStarterData[templateId]);
}
