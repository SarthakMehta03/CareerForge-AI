/**
 * Comprehensive Domain-Aware ATS Evaluation Engine
 * Evaluates resumes using multi-pillar recruiter & ATS algorithms:
 * 1. Structure & Contact Parseability (25 pts)
 * 2. Content Impact & Quantifiable Metrics (25 pts)
 * 3. Action Verb Strength & Executive Tone (25 pts)
 * 4. Domain-Specific Skill & Keyword Density (25 pts)
 */

const DOMAIN_KEYWORDS = {
  mobile: {
    name: "Mobile App Development",
    triggers: ["flutter", "dart", "react native", "swift", "kotlin", "ios", "android", "mobile developer", "app developer"],
    coreKeywords: [
      "State Management",
      "RESTful APIs",
      "Unit & Widget Testing",
      "Clean Architecture",
      "App Store & Google Play",
      "Performance Optimization",
      "Local Storage (SQLite/Hive)",
      "Git Version Control",
      "Push Notifications",
      "CI/CD (Fastlane/GitHub Actions)",
    ],
  },
  frontend: {
    name: "Frontend Web Development",
    triggers: ["frontend", "react", "vue", "angular", "next.js", "javascript", "typescript", "html", "css", "tailwind", "ui developer", "web developer"],
    coreKeywords: [
      "TypeScript",
      "Responsive UI Design",
      "State Management (Redux/Zustand)",
      "REST & GraphQL Integration",
      "Web Performance (Core Web Vitals)",
      "Unit Testing (Jest/RTL)",
      "Cross-Browser Compatibility",
      "Git & GitHub Workflow",
      "Accessibility (WCAG)",
      "Build Tools (Vite/Webpack)",
    ],
  },
  backend: {
    name: "Backend & Systems Engineering",
    triggers: ["backend", "node", "express", "fastapi", "django", "flask", "spring", "java", "golang", "microservices", "sql", "postgresql", "mongodb", "database"],
    coreKeywords: [
      "API Security & Authentication (JWT/OAuth)",
      "Database Indexing & Optimization",
      "Microservices Architecture",
      "Caching (Redis/Memcached)",
      "Docker & Containerization",
      "Unit & Integration Testing",
      "Message Queues (Kafka/RabbitMQ)",
      "System Scalability & Reliability",
      "CI/CD Automation",
      "Cloud Deployment (AWS/GCP)",
    ],
  },
  fullstack: {
    name: "Full Stack Development",
    triggers: ["full stack", "fullstack", "mern", "mean", "software engineer", "software developer"],
    coreKeywords: [
      "End-to-End Feature Delivery",
      "TypeScript / Modern JavaScript",
      "RESTful API Architecture",
      "Database Modeling (SQL & NoSQL)",
      "Authentication & Authorization",
      "State Management",
      "Docker & Cloud Deployment",
      "Automated Testing (Unit & E2E)",
      "Performance Tuning",
      "Agile & Version Control",
    ],
  },
  data: {
    name: "Data Science & AI/ML",
    triggers: ["data science", "machine learning", "ai", "deep learning", "python", "pandas", "numpy", "pytorch", "tensorflow", "data engineer", "analytics", "nlp"],
    coreKeywords: [
      "Exploratory Data Analysis (EDA)",
      "Machine Learning Algorithms",
      "Feature Engineering",
      "SQL Query Optimization",
      "Model Evaluation & Metrics",
      "Data Pipelines (ETL)",
      "Data Visualization",
      "Version Control (Git)",
      "Statistical Modeling",
      "Model Deployment (Docker/FastAPI)",
    ],
  },
  devops: {
    name: "DevOps & Cloud Infrastructure",
    triggers: ["devops", "cloud", "aws", "azure", "gcp", "kubernetes", "k8s", "terraform", "ci/cd", "infrastructure", "linux"],
    coreKeywords: [
      "Infrastructure as Code (Terraform)",
      "Container Orchestration (Kubernetes)",
      "CI/CD Pipeline Automation",
      "Cloud Security & IAM",
      "Monitoring & Observability (Prometheus/Grafana)",
      "Docker Containerization",
      "Linux System Administration",
      "Zero-Downtime Deployments",
      "High Availability Architecture",
      "Cost Optimization",
    ],
  },
  general: {
    name: "Professional & Technical Roles",
    triggers: [],
    coreKeywords: [
      "Cross-Functional Collaboration",
      "Project Lifecycle Management",
      "Strategic Problem Solving",
      "Agile / Scrum Methodologies",
      "Stakeholder Communication",
      "Process Optimization",
      "Quality Assurance & Testing",
      "Performance Metrics & KPI Tracking",
      "Documentation & Reporting",
      "Continuous Improvement",
    ],
  },
};

const POWER_VERBS = [
  "architected", "engineered", "spearheaded", "orchestrated", "implemented",
  "accelerated", "designed", "automated", "streamlined", "optimized",
  "pioneered", "revamped", "scaled", "transformed", "delivered",
  "developed", "built", "constructed", "launched", "championed",
  "established", "reduced", "increased", "boosted", "integrated",
  "mentored", "directed", "formulated", "executed", "authored"
];

const WEAK_PHRASES = [
  "responsible for", "worked on", "helped with", "assisted in",
  "handled", "tasked with", "did", "was involved in", "helped to",
  "duties included", "part of a team that", "participated in"
];

// Regex to detect quantifiable metrics in bullet points
const METRICS_REGEX = /(?:\b\d+[\d,.]*(?:\s*(?:%|percent|k|m|million|billion|users|customers|downloads|clients|x|fold|\+))|\$\s*\d+[\d,.]*|\b(?:increased|decreased|reduced|boosted|saved|scaled|improved|generated|cut)\s+(?:by\s+)?\d+)/i;

/**
 * Detect the candidate's professional domain
 */
function detectDomain(resumeData) {
  const title = (resumeData.personalInfo?.jobTitle || "").toLowerCase();
  const skillNames = (resumeData.skills || []).map((s) => (typeof s === "object" ? s.name || "" : String(s || "")).toLowerCase());
  const expText = (resumeData.experience || []).map((e) => `${e.jobTitle || ""} ${e.description || ""}`).join(" ").toLowerCase();
  const allText = `${title} ${skillNames.join(" ")} ${expText}`;

  let bestDomain = "general";
  let maxMatches = 0;

  for (const [key, domain] of Object.entries(DOMAIN_KEYWORDS)) {
    if (key === "general") continue;
    let matches = 0;
    for (const trigger of domain.triggers) {
      if (title.includes(trigger)) {
        matches += 10; // Prioritize stated job title!
      } else if (allText.includes(trigger)) {
        matches += 2;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestDomain = key;
    }
  }

  return DOMAIN_KEYWORDS[bestDomain] || DOMAIN_KEYWORDS.general;
}

/**
 * Main ATS Evaluation Function
 */
export function calculateClientATS(resumeData = {}) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];
  const formattingIssues = [];

  const domain = detectDomain(resumeData);
  const targetDomainName = domain.name;

  // ─────────────────────────────────────────
  // Pillar 1: Structure & Parseability (25 pts)
  // ─────────────────────────────────────────
  let structureScore = 0;
  const personalInfo = resumeData.personalInfo || {};

  // Name
  if (personalInfo.fullName && personalInfo.fullName.trim().length > 2) {
    structureScore += 4;
  } else {
    weaknesses.push("Missing full candidate name.");
  }

  // Email
  if (personalInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
    structureScore += 4;
    strengths.push("Professional contact email verified for automated parsing.");
  } else {
    weaknesses.push("Invalid or missing email address.");
    recommendations.push("Provide a standard professional email (e.g. name@domain.com).");
  }

  // Phone
  if (personalInfo.phone && personalInfo.phone.trim().length >= 7) {
    structureScore += 4;
  } else {
    weaknesses.push("Missing phone number for recruiter phone screenings.");
    recommendations.push("Add a direct phone number with area/country code.");
  }

  // Location
  if (personalInfo.location && personalInfo.location.trim().length > 2) {
    structureScore += 3;
    strengths.push("Geographic location included for location-based ATS filters.");
  } else {
    weaknesses.push("Missing location (City, State/Country).");
    recommendations.push("Add your general location (e.g. 'Austin, TX' or 'Remote') to satisfy ATS geography filters.");
  }

  // LinkedIn / Portfolio link
  if (personalInfo.linkedin || personalInfo.github || personalInfo.website) {
    structureScore += 4;
    strengths.push("Online profile / portfolio link included for background verification.");
  } else {
    weaknesses.push("Missing LinkedIn, GitHub, or portfolio link.");
    recommendations.push("Add your LinkedIn or GitHub profile link to provide verification proof.");
  }

  // Target Job Title / Headline
  if (personalInfo.jobTitle && personalInfo.jobTitle.trim().length > 2) {
    structureScore += 3;
    strengths.push(`Clear target title specified: "${personalInfo.jobTitle}".`);
  } else {
    weaknesses.push("Missing target job title / headline.");
    recommendations.push("Include your desired job title under your name so ATS categorizes your application accurately.");
  }

  // Summary
  if (resumeData.summary && resumeData.summary.trim().length >= 40) {
    structureScore += 3;
    strengths.push("Professional summary present to hook recruiter attention.");
  } else {
    weaknesses.push("Summary section is empty or too short.");
    recommendations.push("Add a 2-3 sentence executive summary showcasing your core expertise and value proposition.");
  }

  structureScore = Math.min(structureScore, 25);

  // ─────────────────────────────────────────
  // Pillar 2: Content Impact & Quantifiable Metrics (25 pts)
  // ─────────────────────────────────────────
  let impactScore = 0;
  const experiences = resumeData.experience || [];
  const projects = resumeData.projects || [];
  const allBulletTexts = [];

  experiences.forEach((exp) => {
    if (exp.description) {
      exp.description.split(/[\n•\r]+/).forEach((b) => {
        const trimmed = b.trim();
        if (trimmed.length > 10) allBulletTexts.push(trimmed);
      });
    }
  });

  projects.forEach((proj) => {
    if (proj.description) {
      proj.description.split(/[\n•\r]+/).forEach((b) => {
        const trimmed = b.trim();
        if (trimmed.length > 10) allBulletTexts.push(trimmed);
      });
    }
  });

  const quantifiedBullets = [];
  const metricsFound = [];

  allBulletTexts.forEach((bullet) => {
    const match = bullet.match(METRICS_REGEX);
    if (match) {
      quantifiedBullets.push(bullet);
      metricsFound.push(match[0].trim());
    }
  });

  if (experiences.length === 0) {
    impactScore = 6;
    weaknesses.push("No work experience entries documented.");
    recommendations.push("Add your professional experience, internships, or relevant leadership roles.");
  } else if (allBulletTexts.length === 0) {
    impactScore = 8;
    weaknesses.push("Experience entries have no detailed bullet points.");
    recommendations.push("Add detailed bullet points describing your technical contributions and achievements.");
  } else {
    const quantRatio = quantifiedBullets.length / Math.max(allBulletTexts.length, 1);
    if (quantifiedBullets.length >= 5 || quantRatio >= 0.5) {
      impactScore = 25;
      strengths.push(`Exceptional quantifiable impact! Found numbers/percentages in ${quantifiedBullets.length} bullet points.`);
    } else if (quantifiedBullets.length >= 3 || quantRatio >= 0.3) {
      impactScore = 20;
      strengths.push(`Good measurable metrics found in ${quantifiedBullets.length} achievements.`);
    } else if (quantifiedBullets.length >= 1) {
      impactScore = 14;
      weaknesses.push(`Only ${quantifiedBullets.length} bullet point(s) contain measurable numbers or metrics.`);
      recommendations.push("Quantify your achievements using the XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]' (e.g. 'improved latency by 30%', 'scaled to 10k users').");
    } else {
      impactScore = 7;
      weaknesses.push("Zero quantifiable metrics found in your experience descriptions.");
      recommendations.push("ATS algorithms prioritize candidates with measurable impact. Add numbers, percentages, user counts, or revenue metrics to at least 3-4 bullet points.");
    }
  }

  // ─────────────────────────────────────────
  // Pillar 3: Action Verb Strength & Executive Tone (25 pts)
  // ─────────────────────────────────────────
  let verbScore = 0;
  const weakPhrasesFound = [];
  let strongVerbCount = 0;

  allBulletTexts.forEach((bullet) => {
    const lower = bullet.toLowerCase();

    // Check weak phrases
    for (const weak of WEAK_PHRASES) {
      if (lower.includes(weak) && !weakPhrasesFound.includes(weak)) {
        weakPhrasesFound.push(weak);
      }
    }

    // Check strong verbs at start of bullet
    const firstWord = lower.split(/[^a-zA-Z]/)[0];
    if (POWER_VERBS.includes(firstWord)) {
      strongVerbCount++;
    }
  });

  if (allBulletTexts.length > 0) {
    const strongRatio = strongVerbCount / allBulletTexts.length;
    if (strongRatio >= 0.6) {
      verbScore += 22;
      strengths.push(`Strong active tone: ${strongVerbCount} bullet points start with executive power verbs.`);
    } else if (strongRatio >= 0.3) {
      verbScore += 16;
      strengths.push(`Found ${strongVerbCount} strong action verbs introducing your accomplishments.`);
    } else {
      verbScore += 10;
      weaknesses.push("Few bullets begin with strong action verbs.");
      recommendations.push("Start every bullet with past-tense power verbs (e.g. Engineered, Spearheaded, Accelerated, Automated, Architected).");
    }

    // Deduct for weak passive phrases
    if (weakPhrasesFound.length > 0) {
      const deduction = Math.min(weakPhrasesFound.length * 3, 9);
      verbScore = Math.max(verbScore - deduction, 5);
      weaknesses.push(`Detected passive phrases: ${weakPhrasesFound.map((p) => `"${p}"`).join(", ")}.`);
      recommendations.push(`Replace passive phrases like ${weakPhrasesFound.slice(0, 2).map((p) => `"${p}"`).join(" and ")} with direct action verbs.`);
    } else {
      verbScore += 3; // bonus for clean active tone
    }
  } else {
    verbScore = 8;
  }

  verbScore = Math.min(verbScore, 25);

  // ─────────────────────────────────────────
  // Pillar 4: Domain-Specific Skills & Keywords (25 pts)
  // ─────────────────────────────────────────
  let skillScore = 0;
  const rawSkills = resumeData.skills || [];
  const skillNames = rawSkills.map((s) => (typeof s === "object" ? s.name || "" : String(s || "")).toLowerCase());
  const allResumeText = `${(resumeData.summary || "")} ${skillNames.join(" ")} ${allBulletTexts.join(" ")}`.toLowerCase();

  // Find matched vs missing domain keywords
  const matchedDomainKeywords = [];
  const missingDomainKeywords = [];

  domain.coreKeywords.forEach((kw) => {
    const kwLower = kw.toLowerCase();
    // Split combined keywords like "RESTful APIs" -> check "rest" or "api"
    const words = kwLower.split(/[\s/()&]+/);
    const isMatched = words.some((w) => w.length > 2 && allResumeText.includes(w));

    if (isMatched) {
      matchedDomainKeywords.push(kw);
    } else {
      missingDomainKeywords.push(kw);
    }
  });

  // Score skill quantity and organization
  if (rawSkills.length >= 8) {
    skillScore += 12;
    strengths.push(`Robust skills inventory with ${rawSkills.length} competencies documented.`);
  } else if (rawSkills.length >= 4) {
    skillScore += 8;
    recommendations.push("Expand your skills list to 8-15 core competencies covering technical stack and tools.");
  } else {
    skillScore += 4;
    weaknesses.push("Skills section is critically sparse (fewer than 4 items).");
    recommendations.push("Add at least 8-10 technical skills, frameworks, and developer tools.");
  }

  // Bonus for categorized skills
  const isCategorized = resumeData.theme?.skillGrouping === "categorized" || resumeData.theme?.groupSkillsByCategory;
  if (isCategorized) {
    skillScore += 3;
    strengths.push("Skills are structured into clean categories for enhanced readability.");
  }

  // Score domain keyword alignment
  const keywordRatio = matchedDomainKeywords.length / Math.max(domain.coreKeywords.length, 1);
  if (keywordRatio >= 0.7) {
    skillScore += 10;
    strengths.push(`Strong alignment with core industry competencies (${matchedDomainKeywords.length} core keywords matched).`);
  } else if (keywordRatio >= 0.4) {
    skillScore += 7;
    recommendations.push(`Incorporate high-value technical competencies: ${missingDomainKeywords.slice(0, 3).join(", ")}.`);
  } else {
    skillScore += 3;
    weaknesses.push(`Low density of target industry competencies.`);
    recommendations.push(`ATS scanners check for industry-standard competencies. Add relevant skills: ${missingDomainKeywords.slice(0, 4).join(", ")}.`);
  }

  skillScore = Math.min(skillScore, 25);

  // ─────────────────────────────────────────
  // Total ATS Score Calculation (Truthful 0-100)
  // ─────────────────────────────────────────
  const totalScore = Math.min(Math.max(structureScore + impactScore + verbScore + skillScore, 35), 98);

  let rating = "Critical";
  if (totalScore >= 85) rating = "Excellent";
  else if (totalScore >= 70) rating = "Good";
  else if (totalScore >= 55) rating = "Needs Improvement";

  // Formatting Advice
  formattingIssues.push("Use standard chronological section layout: Summary → Experience → Education → Skills → Projects.");
  formattingIssues.push("Ensure font size is between 10pt and 12pt for optimal readability across standard ATS scanners.");
  if (weakPhrasesFound.length > 0) {
    formattingIssues.push("Avoid passive filler phrases in bullet descriptions; start sentences directly with strong action verbs.");
  }

  return {
    success: true,
    atsScore: totalScore,
    rating,
    targetDomain: targetDomainName,
    subScores: {
      structure: { score: structureScore, max: 25, label: "Structure & Contact", percentage: Math.round((structureScore / 25) * 100) },
      impact: { score: impactScore, max: 25, label: "Measurable Impact (Metrics)", percentage: Math.round((impactScore / 25) * 100) },
      actionVerbs: { score: verbScore, max: 25, label: "Action Verbs & Tone", percentage: Math.round((verbScore / 25) * 100) },
      skills: { score: skillScore, max: 25, label: "Domain Keywords & Skills", percentage: Math.round((skillScore / 25) * 100) },
    },
    metricsFound: metricsFound.slice(0, 8),
    quantifiedBulletsCount: quantifiedBullets.length,
    totalBulletsCount: allBulletTexts.length,
    weakPhrasesFound,
    strengths,
    weaknesses,
    recommendations,
    missingKeywords: missingDomainKeywords.slice(0, 6),
    matchedKeywords: matchedDomainKeywords,
    formattingIssues,
  };
}

export default calculateClientATS;
