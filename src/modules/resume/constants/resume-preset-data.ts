import type { ResumeData } from "../types/resume";
import { professionalPreset } from "./resume-preset-data-core";

export const bridgeData = professionalPreset({
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
  experienceHighlights: [
    [
      "Raised NIST CSF control maturity across identity, detection, and response workstreams.",
      "Reduced mean time to contain priority incidents by 36% through clear roles and automation.",
      "Ran tabletop exercises for 350 employees and briefed executives on remediation priorities.",
    ],
    [
      "Triaged cloud and endpoint alerts while maintaining a 98% service-level response rate.",
      "Built repeatable investigation guides that reduced analyst onboarding time by four weeks.",
    ],
  ],
  projectHighlights: [
    "Mapped response actions to six realistic threat scenarios and named accountable owners.",
    "Validated the playbook through two cross-functional simulations.",
  ],
  secondaryProject: {
    name: "Security Champions Network",
    description: "A practical enablement program embedded in product and engineering teams.",
    highlight: "Recruited 28 champions and increased early risk reviews by 45%.",
  },
  skills: [
    ["Threat analysis", "Incident response", "Risk assessment", "IAM"],
    ["Security training", "Cross-team response", "Policy design"],
    ["Splunk", "CrowdStrike", "AWS", "Python", "NIST CSF"],
  ],
});

export const financeData = professionalPreset({
  name: "Rohan Mehta",
  headline: "Financial Planning & Analysis Manager",
  email: "rohan.mehta@example.com",
  phone: "+1 312 555 0135",
  location: "Chicago, IL",
  website: "rohanmehta.finance",
  summary:
    "FP&A leader with nine years of experience turning operating data into clear forecasts, investment choices, and executive decisions across multi-site businesses.",
  role: "FP&A Manager",
  company: "Arbor Foods",
  previousRole: "Senior Financial Analyst",
  previousCompany: "Northlake Consumer",
  degree: "MBA, Finance & Strategy",
  school: "Indiana University",
  project: "Rolling Forecast Model",
  projectDescription: "A driver-based planning model connecting demand, labor, and margin.",
  experienceHighlights: [
    [
      "Led annual planning for a $480M business and aligned 14 department owners on investment priorities.",
      "Built scenario models that identified $6.2M in cost actions without reducing growth capacity.",
      "Shortened monthly performance reporting from eight days to four through automated data flows.",
    ],
    [
      "Produced revenue and margin forecasts within 2% of actuals across six consecutive quarters.",
      "Partnered with commercial teams on pricing decisions that added 1.8 points of gross margin.",
    ],
  ],
  projectHighlights: [
    "Replaced 19 disconnected spreadsheets with one governed planning model.",
    "Improved forecast-cycle completion by five business days.",
  ],
  secondaryProject: {
    name: "Executive Margin Bridge",
    description: "A concise monthly view of price, volume, mix, and cost movement.",
    highlight: "Adopted as the standard performance view for board reporting.",
  },
  skills: [
    ["Financial modeling", "Forecasting", "Variance analysis", "Business cases"],
    ["Executive partnering", "Planning leadership", "Decision support"],
    ["Excel", "Power BI", "Anaplan", "SQL", "NetSuite"],
  ],
});

export const healthcareData = professionalPreset({
  name: "Jordan Lee",
  headline: "Clinical Operations Manager",
  email: "jordan.lee@example.com",
  phone: "+1 206 555 0174",
  location: "Seattle, WA",
  website: "jordanlee.health",
  summary:
    "Clinical operations manager with eight years of experience improving patient access, care-team workflows, and quality performance in multi-site ambulatory settings.",
  role: "Clinical Operations Manager",
  company: "Evergreen Health Partners",
  previousRole: "Practice Operations Lead",
  previousCompany: "Harborview Clinics",
  degree: "BS, Health Informatics",
  school: "University of Washington",
  project: "Care Coordination Dashboard",
  projectDescription: "A daily view of referral, scheduling, and follow-up risk across clinics.",
  experienceHighlights: [
    [
      "Improved new-patient access by 22% across nine clinics while maintaining quality targets.",
      "Redesigned referral handoffs and reduced incomplete specialist follow-ups by 31%.",
      "Led 45 clinical and administrative staff through a new scheduling and triage workflow.",
    ],
    [
      "Standardized staffing plans for four practices and reduced premium labor spend by 18%.",
      "Prepared quality evidence for two successful accreditation review cycles.",
    ],
  ],
  projectHighlights: [
    "Combined EHR work queues and operational measures into one role-based view.",
    "Reduced manual status checking by 14 hours per clinic each month.",
  ],
  secondaryProject: {
    name: "Patient Access Huddle",
    description: "A structured daily review for urgent demand, capacity, and escalation.",
    highlight: "Raised same-week resolution of access issues from 68% to 91%.",
  },
  skills: [
    ["Clinical operations", "Patient access", "Quality improvement", "Capacity"],
    ["Change leadership", "Care-team facilitation", "Compliance"],
    ["Epic", "Tableau", "Excel", "Lean", "HIPAA"],
  ],
});

export const salesData = professionalPreset({
  name: "Diego Alvarez",
  headline: "Enterprise Sales Director",
  email: "diego.alvarez@example.com",
  phone: "+1 720 555 0191",
  location: "Denver, CO",
  website: "diegoalvarez.co",
  summary:
    "Enterprise sales leader with 11+ years of experience building durable customer relationships, developing high-performing teams, and growing complex software accounts.",
  role: "Enterprise Sales Director",
  company: "Northstar Cloud",
  previousRole: "Regional Sales Manager",
  previousCompany: "Bluepeak Systems",
  degree: "BBA, Marketing",
  school: "University of Colorado Denver",
  project: "Enterprise Discovery Playbook",
  projectDescription:
    "A repeatable discovery and account-planning system for strategic opportunities.",
  experienceHighlights: [
    [
      "Led a 12-person team to 118% of a $24M annual target while improving forecast accuracy.",
      "Expanded revenue in the top 20 accounts by 27% through multi-threaded account plans.",
      "Coached four first-time managers and promoted seven sellers into larger territories.",
    ],
    [
      "Grew regional recurring revenue from $8.1M to $13.6M across three years.",
      "Won the company’s largest new logo through a nine-month executive buying process.",
    ],
  ],
  projectHighlights: [
    "Standardized qualification, value mapping, mutual plans, and executive alignment.",
    "Improved late-stage win rate by 12 points in two quarters.",
  ],
  secondaryProject: {
    name: "Partner Growth Program",
    description: "A joint-pipeline motion with consulting and technology partners.",
    highlight: "Sourced $4.8M in qualified pipeline during the first year.",
  },
  skills: [
    ["Enterprise sales", "Account strategy", "Forecasting", "Negotiation"],
    ["Team coaching", "Executive relationships", "Partner development"],
    ["Salesforce", "Clari", "Gong", "LinkedIn Sales Navigator"],
  ],
});

export const analystData: ResumeData = {
  basics: {
    fullName: "Kabir Malhotra",
    headline: "Data Analyst",
    photo: "",
    email: "kabir.malhotra@example.com",
    phone: "+91 98765 41028",
    location: "New Delhi, India",
    linkedin: "linkedin.com/in/kabirmalhotra",
    github: "github.com/kabirmalhotra",
    website: "kabirmalhotra.dev",
    summary:
      "Data analyst with practical experience using SQL, Python, Excel, and Power BI to clean complex datasets, build decision-ready dashboards, and explain performance trends to business teams.",
  },
  experience: [
    {
      id: "kabir-experience-1",
      role: "Data Analyst Intern",
      company: "PulseMetrics Analytics",
      location: "Remote · Excel, SQL, Power BI",
      startDate: "Apr 2025",
      endDate: "Jun 2025",
      current: false,
      highlights: [
        "Standardized 120,000+ transaction rows across five regions for weekly revenue and retention reporting.",
        "Built reusable Excel templates with lookup and pivot logic, reducing reporting preparation by 42%.",
        "Developed four Power BI pages covering revenue, product mix, returns, and monthly performance.",
        "Partnered with six analysts and managers to define seven KPI rules and improve report consistency.",
      ],
    },
  ],
  education: [
    {
      id: "kabir-education-1",
      degree: "BSc, Statistics & Data Science",
      school: "University of Delhi",
      location: "New Delhi, India",
      startDate: "2022",
      endDate: "2025",
      details: "CGPA: 8.4/10 · Final-year analytics distinction",
    },
  ],
  projects: [
    {
      id: "kabir-project-1",
      name: "Subscription Churn Analysis",
      description: "Python · pandas · seaborn",
      link: "github.com/kabir-data/churn",
      date: "Mar 2025 – Apr 2025",
      highlights: [
        "Analyzed 8,240 customer records to identify churn patterns by tenure, plan, and monthly spend.",
        "Engineered tenure bands and engagement features to improve segment comparison.",
        "Produced 12 visualizations and identified a 35% churn concentration among new monthly subscribers.",
      ],
    },
    {
      id: "kabir-project-2",
      name: "Regional Sales Performance Dashboard",
      description: "SQL · Power BI",
      link: "github.com/kabir-data/sales",
      date: "Jan 2025 – Feb 2025",
      highlights: [
        "Joined four sales tables covering 32,000 rows and 18 months using documented SQL transformations.",
        "Built 11 dynamic measures with drilldowns for region, category, channel, and time.",
        "Found a 16% post-campaign decline in one region and presented a recovery opportunity.",
      ],
    },
  ],
  skillGroups: [
    {
      id: "kabir-skills-1",
      name: "Programming & querying",
      skills: ["SQL", "Python", "pandas"],
    },
    {
      id: "kabir-skills-2",
      name: "Visualization tools",
      skills: ["Advanced Excel", "Power BI", "Tableau"],
    },
    {
      id: "kabir-skills-3",
      name: "Analytical methods",
      skills: ["Data cleaning", "EDA", "Descriptive statistics", "Insight generation"],
    },
  ],
  certifications: [
    {
      id: "kabir-certification-1",
      title: "Power BI Data Analyst Associate",
      issuer: "Microsoft",
      date: "2025",
      description:
        "Completed practical assessments in data preparation, modeling, visualization, and analysis.",
    },
    {
      id: "kabir-certification-2",
      title: "Advanced SQL Skills Certification",
      issuer: "HackerRank",
      date: "2024",
      description:
        "Demonstrated advanced joins, window functions, aggregation, and query optimization.",
    },
    {
      id: "kabir-certification-3",
      title: "University Analytics Challenge — Finalist",
      issuer: "Delhi Data Society",
      date: "2025",
      description:
        "Built a forecasting dashboard and placed among the top eight of 140 participating teams.",
    },
  ],
};

export const launchpadData: ResumeData = {
  basics: {
    fullName: "Arjun Rao",
    headline: "Computer Science Graduate · Frontend Developer",
    photo: "",
    email: "arjun.rao@example.com",
    phone: "+91 98765 43120",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/arjunrao",
    github: "github.com/arjunrao",
    website: "arjunrao.dev",
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
    {
      id: "arjun-skills-1",
      name: "Development",
      skills: ["TypeScript", "React", "JavaScript", "HTML", "CSS"],
    },
    {
      id: "arjun-skills-2",
      name: "Data & tools",
      skills: ["SQL", "Git", "REST APIs", "Vitest", "Figma"],
    },
    {
      id: "arjun-skills-3",
      name: "Foundations",
      skills: ["Data structures", "OOP", "Accessibility", "Agile"],
    },
  ],
};

export const firstStepData: ResumeData = {
  ...launchpadData,
  basics: {
    ...launchpadData.basics,
    fullName: "Finn Carter",
    headline: "Business Analytics Student · Operations Intern",
    email: "finn.carter@example.com",
    phone: "+1 617 555 0140",
    location: "Boston, MA",
    linkedin: "linkedin.com/in/finncarter",
    github: "github.com/finncarter",
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
    {
      id: "finn-skills-2",
      name: "Collaboration",
      skills: ["Presentations", "Research", "Teamwork"],
    },
    { id: "finn-skills-3", name: "Coursework", skills: ["Statistics", "Economics", "Operations"] },
  ],
};

export const pivotData = professionalPreset({
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
  projectDescription:
    "A structured research library connecting customer evidence to product decisions.",
  experienceHighlights: [
    [
      "Reduced preventable churn by 18% through a risk model combining usage and customer signals.",
      "Led 60 customer interviews and translated recurring needs into prioritized product proposals.",
      "Partnered with product on an onboarding redesign that improved activation by 14%.",
    ],
    [
      "Managed a $3.8M customer portfolio and maintained 96% gross retention.",
      "Built executive business reviews that surfaced expansion and workflow opportunities.",
    ],
  ],
  projectHighlights: [
    "Defined a common taxonomy for needs, severity, segment, and supporting evidence.",
    "Connected 220 research notes to 34 product decisions in six months.",
  ],
  secondaryProject: {
    name: "Product Discovery Sprint",
    description: "A cross-functional concept test for a new workflow automation feature.",
    highlight: "Validated the core problem with 17 of 20 target customers.",
  },
  skills: [
    ["Customer discovery", "Product strategy", "Prioritization", "Analytics"],
    ["Stakeholder management", "Facilitation", "Change leadership"],
    ["Salesforce", "Productboard", "Amplitude", "Figma"],
  ],
});

// Re-export core presets for unified access
export {
  meridianData,
  editorialData,
  summitData,
  columnData,
  horizonData,
  blueprintData,
  standardData,
  compactData,
} from "./resume-preset-data-core";
