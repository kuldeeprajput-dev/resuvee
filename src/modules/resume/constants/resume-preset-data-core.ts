import type { ResumeData, ResumeTemplateId } from "../types/resume";

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
  experienceHighlights: [string[], string[]];
  projectHighlights: string[];
  secondaryProject: {
    name: string;
    description: string;
    highlight: string;
  };
  skills: [string[], string[], string[]];
}

export function professionalPreset(seed: ProfessionalSeed): ResumeData {
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
        highlights: seed.experienceHighlights[0],
      },
      {
        id: `${seed.name}-experience-2`,
        role: seed.previousRole,
        company: seed.previousCompany,
        location: seed.location,
        startDate: "2017",
        endDate: "2021",
        current: false,
        highlights: seed.experienceHighlights[1],
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
        highlights: seed.projectHighlights,
      },
      {
        id: `${seed.name}-project-2`,
        name: seed.secondaryProject.name,
        description: seed.secondaryProject.description,
        link: "",
        highlights: [seed.secondaryProject.highlight],
      },
    ],
    skillGroups: [
      { id: `${seed.name}-skills-1`, name: "Core expertise", skills: seed.skills[0] },
      { id: `${seed.name}-skills-2`, name: "Leadership", skills: seed.skills[1] },
      { id: `${seed.name}-skills-3`, name: "Tools", skills: seed.skills[2] },
    ],
  };
}

export const meridianData = professionalPreset({
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
  experienceHighlights: [
    [
      "Rebuilt quarterly planning across six product squads, reducing committed-work carryover by 31%.",
      "Standardized launch readiness reviews and improved on-time releases from 76% to 92%.",
      "Connected product analytics with customer evidence to retire 14 low-value roadmap requests.",
    ],
    [
      "Automated portfolio reporting and returned 18 hours each month to program leads.",
      "Facilitated discovery and prioritization for a platform used by 22,000 small businesses.",
    ],
  ],
  projectHighlights: [
    "Piloted the toolkit with three teams before company-wide adoption.",
    "Raised planning-confidence scores by 24% in one quarter.",
  ],
  secondaryProject: {
    name: "Customer Signal Library",
    description: "A tagged research repository connecting customer evidence to roadmap decisions.",
    highlight: "Consolidated 480 interviews and support themes into one searchable source.",
  },
  skills: [
    ["Product operations", "Roadmaps", "Research synthesis", "Analytics"],
    ["Team facilitation", "Executive updates", "Change management"],
    ["SQL", "Amplitude", "Jira", "Notion", "Figma"],
  ],
});

export const editorialData = professionalPreset({
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
  experienceHighlights: [
    [
      "Authored 85+ legal memoranda used by counsel in matters spanning 12 jurisdictions.",
      "Built an evidence matrix that shortened senior-attorney review cycles by 30%.",
      "Tracked regulatory developments and briefed policy leaders on material operational risk.",
    ],
    [
      "Synthesized case law and public comments into concise recommendations for advocacy teams.",
      "Created citation and peer-review standards adopted by a 16-person research group.",
    ],
  ],
  projectHighlights: [
    "Indexed 1,200 decisions with verified citations and issue tags.",
    "Reduced duplicate research requests by 26% during the first semester.",
  ],
  secondaryProject: {
    name: "Public Interest Research Clinic",
    description: "A supervised research program pairing analysts with nonprofit counsel.",
    highlight: "Mentored nine fellows through client-ready research and writing.",
  },
  skills: [
    ["Legal research", "Regulatory analysis", "Case synthesis", "Writing"],
    ["Counsel collaboration", "Peer review", "Stakeholder interviews"],
    ["Westlaw", "LexisNexis", "Excel", "Zotero"],
  ],
});

export const summitData = professionalPreset({
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
  experienceHighlights: [
    [
      "Integrated four regional operating teams while improving contribution margin by 8 points.",
      "Introduced weekly business reviews that cut unresolved executive actions by 42%.",
      "Coached 11 directors and established succession plans for every critical leadership role.",
    ],
    [
      "Redesigned fulfillment capacity planning and reduced peak-period overtime by 21%.",
      "Built the operating playbook used to launch three markets within approved budgets.",
    ],
  ],
  projectHighlights: [
    "Defined staffing, service, and risk thresholds for each launch stage.",
    "Reached target unit economics two quarters earlier than forecast.",
  ],
  secondaryProject: {
    name: "Frontline Leader Academy",
    description: "A practical management program for newly promoted operations leaders.",
    highlight: "Graduated 68 managers with a 94% completion rate.",
  },
  skills: [
    ["Operating strategy", "P&L management", "Capacity planning", "Risk"],
    ["Executive leadership", "Board reporting", "Org design", "Coaching"],
    ["Tableau", "Salesforce", "Workday", "Excel"],
  ],
});

export const columnData = professionalPreset({
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
  experienceHighlights: [
    [
      "Coordinated 14 teams through an $8M platform migration delivered within the approved window.",
      "Established dependency reviews that reduced late-stage delivery blockers by 37%.",
      "Launched portfolio dashboards used by executives to prioritize capacity across 40 initiatives.",
    ],
    [
      "Managed three concurrent product programs with distributed engineering partners.",
      "Improved milestone forecast accuracy from 71% to 91% through common planning standards.",
    ],
  ],
  projectHighlights: [
    "Mapped ownership and handoffs across 26 critical delivery steps.",
    "Reduced average decision latency from nine days to four.",
  ],
  secondaryProject: {
    name: "Program Manager Community",
    description: "A monthly practice group for templates, retrospectives, and peer coaching.",
    highlight: "Scaled participation from 12 to 55 program managers.",
  },
  skills: [
    ["Program management", "Roadmapping", "Risk management", "Planning"],
    ["Cross-functional leadership", "Facilitation", "Vendor management"],
    ["Jira", "Asana", "Smartsheet", "Looker"],
  ],
});

export const horizonData = professionalPreset({
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
  experienceHighlights: [
    [
      "Designed a blended manager curriculum completed by 1,600 learners across five regions.",
      "Raised six-month skill application by 23% through practice labs and manager reinforcement.",
      "Introduced accessible content standards aligned with WCAG 2.2 AA.",
    ],
    [
      "Built 18 instructor-led and asynchronous modules from learner and subject-matter research.",
      "Improved course completion from 72% to 89% after simplifying navigation and assessment.",
    ],
  ],
  projectHighlights: [
    "Validated the curriculum through two pilot cohorts and 46 learner interviews.",
    "Earned a 4.7/5 usefulness rating in the first full launch.",
  ],
  secondaryProject: {
    name: "Facilitator Field Guide",
    description: "A modular guide for inclusive workshops in hybrid environments.",
    highlight: "Adopted by 34 facilitators across eight learning programs.",
  },
  skills: [
    ["Curriculum design", "Adult learning", "Research", "Assessment"],
    ["Workshop facilitation", "Coaching", "Inclusive design"],
    ["Articulate 360", "Miro", "Figma", "LMS administration"],
  ],
});

export const blueprintData = professionalPreset({
  name: "Caleb Stone",
  headline: "Senior Software Engineer",
  email: "caleb.stone@example.com",
  phone: "+1 303 555 0124",
  location: "Denver, CO",
  website: "github.com/calebstone",
  summary:
    "Senior software engineer with 9+ years of experience building reliable web platforms and developer tooling. Focused on pragmatic architecture, observability, and effective technical leadership.",
  role: "Senior Software Engineer",
  company: "Granite Cloud",
  previousRole: "Software Engineer",
  previousCompany: "Beacon Commerce",
  degree: "BS, Computer Science",
  school: "Colorado State University",
  project: "Platform Reliability Console",
  projectDescription:
    "An internal observability workspace for service owners and incident response.",
  experienceHighlights: [
    [
      "Led reliability work that raised customer-facing availability from 99.82% to 99.97%.",
      "Cut median CI duration by 41% while increasing automated coverage of critical workflows.",
      "Established architecture reviews for 28 services and mentored six senior engineers.",
    ],
    [
      "Decomposed a high-traffic checkout service with no customer-visible migration downtime.",
      "Reduced mean time to recovery by 35% through service ownership and runbook standards.",
    ],
  ],
  projectHighlights: [
    "Unified alerts, service objectives, deployments, and ownership in one interface.",
    "Reduced incident triage time by 32% across the platform group.",
  ],
  secondaryProject: {
    name: "Engineering Decision Records",
    description: "A lightweight repository for durable architecture context and tradeoffs.",
    highlight: "Reached 90% adoption across seven engineering teams.",
  },
  skills: [
    ["TypeScript", "React", "Node.js", "Distributed systems"],
    ["Technical leadership", "Architecture", "Mentoring", "Code review"],
    ["AWS", "PostgreSQL", "Docker", "Kubernetes", "Grafana"],
  ],
});

export const standardData = professionalPreset({
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
  experienceHighlights: [
    [
      "Delivered a nine-workstream modernization program three weeks ahead of the committed date.",
      "Introduced outcome-based governance that reduced escalated decisions by 34%.",
      "Led adoption planning for 620 employees and achieved 88% active use in eight weeks.",
    ],
    [
      "Managed a portfolio of customer-service improvements with a $4.2M annual budget.",
      "Automated executive reporting and reduced preparation time by 16 hours each month.",
    ],
  ],
  projectHighlights: [
    "Mapped 42 service journeys and prioritized six high-friction handoffs.",
    "Reduced average case resolution time by 19% after launch.",
  ],
  secondaryProject: {
    name: "Program Governance Playbook",
    description: "A reusable framework for decisions, risks, and executive communication.",
    highlight: "Adopted by five enterprise programs in its first year.",
  },
  skills: [
    ["Program delivery", "Process improvement", "Planning", "Analytics"],
    ["Stakeholder management", "Team leadership", "Communication"],
    ["Jira", "Power BI", "Salesforce", "Excel"],
  ],
});

export const compactData = professionalPreset({
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
  experienceHighlights: [
    [
      "Designed a multi-region platform sustaining 99.99% availability for 140 business services.",
      "Reduced annual infrastructure spend by 23% through workload rightsizing and capacity controls.",
      "Set technical strategy and reliability standards for a 32-person platform organization.",
    ],
    [
      "Migrated 70% of production workloads to infrastructure as code without a priority incident.",
      "Created incident review practices that cut repeat failure modes by 38%.",
    ],
  ],
  projectHighlights: [
    "Defined measurable service tiers, recovery objectives, and launch controls.",
    "Passed all production-readiness audits in the first two release cycles.",
  ],
  secondaryProject: {
    name: "Principal Engineer Forum",
    description: "A cross-domain architecture group for high-impact technical decisions.",
    highlight: "Resolved 17 organization-wide design questions in six months.",
  },
  skills: [
    ["Systems architecture", "Reliability", "Security", "Performance"],
    ["Technical strategy", "Mentoring", "Incident leadership"],
    ["Go", "AWS", "Terraform", "Kubernetes", "Datadog"],
  ],
});

