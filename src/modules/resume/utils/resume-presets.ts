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

const blueprintData = professionalPreset({
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
  projectDescription: "An internal observability workspace for service owners and incident response.",
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

const financeData = professionalPreset({
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

const healthcareData = professionalPreset({
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

const salesData = professionalPreset({
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
  projectDescription: "A repeatable discovery and account-planning system for strategic opportunities.",
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

const analystData: ResumeData = {
  basics: {
    fullName: "Kabir Malhotra",
    headline: "Data Analyst",
    photo: "",
    email: "kabir.malhotra@example.com",
    phone: "+91 98765 41028",
    location: "New Delhi, India",
    website: "linkedin.com/in/kabirmalhotra",
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

export const templateStarterData: Record<ResumeTemplateId, ResumeData> = {
  nova: meridianData,
  classic: editorialData,
  executive: summitData,
  minimal: columnData,
  studio: horizonData,
  terminal: blueprintData,
  standard: standardData,
  compact: compactData,
  finance: financeData,
  healthcare: healthcareData,
  sales: salesData,
  analyst: analystData,
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
    certifications: (data.certifications ?? []).map((item) => ({ ...item })),
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
  const hasCertifications = (current.certifications ?? []).some((item) =>
    hasText([item.title, item.issuer, item.description]),
  );

  return {
    basics,
    experience: hasExperience ? current.experience : cloneResumeData(starter).experience,
    education: hasEducation ? current.education : cloneResumeData(starter).education,
    projects: hasProjects ? current.projects : cloneResumeData(starter).projects,
    skillGroups: hasSkills ? current.skillGroups : cloneResumeData(starter).skillGroups,
    certifications: hasCertifications
      ? current.certifications
      : cloneResumeData(starter).certifications,
  };
}

export function getTemplateStarterData(templateId: ResumeTemplateId) {
  return cloneResumeData(templateStarterData[templateId]);
}
