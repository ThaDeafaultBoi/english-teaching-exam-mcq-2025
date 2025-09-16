import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";

/** Minimal, clean, phone-friendly UI
 *  - Light theme only (no dark mode)
 *  - Soft shadows, plenty of whitespace
 *  - Category pills wrap (no horizontal scrollbar)
 *  - Progress bar kept subtle
 *  - Same large question bank and features you liked
 */

// --------- Utils ---------
export function computeScore(questions: any[], answers: any[]) {
  const byId: Record<string, number | null> = Object.fromEntries(
    answers.map((a: any) => [a.id, a.choice])
  );
  return questions.reduce(
    (acc, q) => acc + (byId[q.id] === q.correctIndex ? 1 : 0),
    0
  );
}

function shuffleDeterministic<T>(array: T[], seed: number) {
  const a = [...array];
  const rand = (n: number) =>
    Math.floor(Math.abs(Math.sin(seed * (n + 1))) * n);
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --------- Question Bank ---------
type Q = {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

const QUESTIONS: Q[] = [
  // Learning Theories (10)
  {
    id: "LT-1",
    category: "Learning Theories",
    question:
      "In Vygotsky's theory, the Zone of Proximal Development (ZPD) refers to:",
    options: [
      "Knowledge that is memorized without understanding",
      "Tasks a learner can complete independently without assistance",
      "The range of tasks a learner can accomplish with guidance",
      "The total syllabus to be covered in a term",
    ],
    correctIndex: 2,
    explanation: "ZPD = gap between alone vs with scaffolding.",
  },
  {
    id: "LT-2",
    category: "Learning Theories",
    question:
      "Which statement best captures Krashen's Input Hypothesis (i+1)?",
    options: [
      "Learners acquire language only through output",
      "Acquisition occurs when input is slightly above level and comprehensible",
      "Grammar rules must be mastered before input",
      "Testing is the primary driver of acquisition",
    ],
    correctIndex: 1,
    explanation:
      "Comprehensible input just beyond current level fuels acquisition.",
  },
  {
    id: "LT-3",
    category: "Learning Theories",
    question:
      "According to Long's Interaction Hypothesis, acquisition is facilitated mainly by:",
    options: [
      "Memorizing word lists",
      "Negotiation of meaning during interaction",
      "Silent reading only",
      "Audio-lingual drills without feedback",
    ],
    correctIndex: 1,
    explanation: "Clarification/confirmation moves make input comprehensible.",
  },
  {
    id: "LT-4",
    category: "Learning Theories",
    question: "Schmidt's Noticing Hypothesis implies teachers should:",
    options: [
      "Avoid drawing attention to form",
      "Ensure learners attend to form within meaningful contexts",
      "Teach only prescriptive grammar",
      "Prioritize translation",
    ],
    correctIndex: 1,
    explanation: "Noticing is required for input → intake.",
  },
  {
    id: "LT-5",
    category: "Learning Theories",
    question: "Krashen's Affective Filter hypothesis suggests teachers should:",
    options: [
      "Increase anxiety to motivate",
      "Lower stress and increase motivation",
      "Avoid interesting topics",
      "Focus only on tests",
    ],
    correctIndex: 1,
    explanation: "Lower affective filter → more intake.",
  },
  {
    id: "LT-6",
    category: "Learning Theories",
    question: "Which sequence describes Skill Acquisition Theory?",
    options: [
      "Automatic → declarative → procedural",
      "Declarative → procedural → automatic",
      "Procedural → automatic → declarative",
      "Declarative → automatic → procedural",
    ],
    correctIndex: 1,
    explanation:
      "Declarative knowledge becomes procedural then automatized with practice.",
  },
  {
    id: "LT-7",
    category: "Learning Theories",
    question: "Interlanguage is:",
    options: [
      "A random set of errors",
      "A stable native-like grammar",
      "An evolving learner system that may fossilize",
      "Only vocabulary knowledge",
    ],
    correctIndex: 2,
    explanation:
      "Dynamic system that can fossilize without targeted input/feedback.",
  },
  {
    id: "LT-8",
    category: "Learning Theories",
    question: "Swain's Output Hypothesis claims output:",
    options: [
      "Is unnecessary",
      "Pushes learners to notice gaps and restructure",
      "Only tests memory",
      "Is inferior to translation",
    ],
    correctIndex: 1,
    explanation:
      "Pushed output promotes noticing and syntactic processing.",
  },
  {
    id: "LT-9",
    category: "Learning Theories",
    question: "Multiple Intelligences implies teachers should:",
    options: [
      "Teach only linguistic tasks",
      "Vary modalities and task types",
      "Avoid group work",
      "Grade only exams",
    ],
    correctIndex: 1,
    explanation: "Provide varied pathways to access/express learning.",
  },
  {
    id: "LT-10",
    category: "Learning Theories",
    question: "Metacognitive strategies include:",
    options: [
      "Guessing only",
      "Planning, monitoring, and evaluating learning",
      "Memorizing lists",
      "Copying homework",
    ],
    correctIndex: 1,
    explanation: "Self-regulation strategies boost learning.",
  },

  // Methods & Approaches (12)
  {
    id: "MA-1",
    category: "Methods & Approaches",
    question: "A communicative task (CLT) must have:",
    options: [
      "Teacher talk only",
      "Information gap, learner choice, outcome feedback",
      "Rule presentation, drilling, testing",
      "Translation and dictation",
    ],
    correctIndex: 1,
    explanation: "Three features define communicative tasks.",
  },
  {
    id: "MA-2",
    category: "Methods & Approaches",
    question: "Audiolingual Method core technique:",
    options: ["Projects", "Pattern drills with dialogues", "Free role-plays", "Silent reading"],
    correctIndex: 1,
    explanation: "Habit formation via repetition/substitution drills.",
  },
  {
    id: "MA-3",
    category: "Methods & Approaches",
    question: "Lexical Approach prioritizes:",
    options: [
      "Discrete rules before lexis",
      "Lexical chunks and collocations",
      "Avoiding authentic input",
      "Phonetic transcription first",
    ],
    correctIndex: 1,
    explanation: "Fluency grows through chunks/collocations.",
  },
  {
    id: "MA-4",
    category: "Methods & Approaches",
    question: "CLIL/CBI aims to:",
    options: [
      "Teach content via L1 only",
      "Integrate subject content and language objectives",
      "Replace language learning with science",
      "Focus solely on grammar",
    ],
    correctIndex: 1,
    explanation: "Dual-focus lessons with scaffolding.",
  },
  {
    id: "MA-5",
    category: "Methods & Approaches",
    question: "Grammar–Translation emphasizes:",
    options: [
      "Spoken fluency",
      "L1 translation, explicit rules, reading",
      "Silent discovery",
      "Movement-based commands",
    ],
    correctIndex: 1,
    explanation:
      "Reading/writing focus, explicit grammar via translation.",
  },
  {
    id: "MA-6",
    category: "Methods & Approaches",
    question: "Direct Method principle:",
    options: [
      "Use L1 extensively",
      "Target language only with demonstration/realia",
      "Teach grammar first",
      "No speaking allowed",
    ],
    correctIndex: 1,
    explanation: "Inductive grammar using TL only.",
  },
  {
    id: "MA-7",
    category: "Methods & Approaches",
    question: "TPR is strongest for:",
    options: [
      "Abstract academic prose",
      "Beginners/young learners with actions",
      "Advanced exam prep",
      "Silent reading",
    ],
    correctIndex: 1,
    explanation: "Connects language to physical response.",
  },
  {
    id: "MA-8",
    category: "Methods & Approaches",
    question: "Silent Way features:",
    options: [
      "Teacher-centered lectures",
      "Cuisenaire rods, learner autonomy, self-correction",
      "Heavy translation",
      "Only audio",
    ],
    correctIndex: 1,
    explanation: "Discovery learning; minimal teacher talk.",
  },
  {
    id: "MA-9",
    category: "Methods & Approaches",
    question: "Suggestopedia aims to:",
    options: ["Induce relaxation with music/drama", "Drill minimal pairs", "Teach only syntax", "Ban group work"],
    correctIndex: 0,
    explanation: "Affective factors central.",
  },
  {
    id: "MA-10",
    category: "Methods & Approaches",
    question: "Community Language Learning sees teacher as:",
    options: ["Controller", "Counselor supporting learner-generated language", "Examiner", "Translator only"],
    correctIndex: 1,
    explanation: "Counselor role; learners record/transcribe.",
  },
  {
    id: "MA-11",
    category: "Methods & Approaches",
    question: "Dogme ELT is:",
    options: [
      "Materials-heavy scripted lessons",
      "Materials-light, conversation-driven",
      "Grammar translation only",
      "Total silence",
    ],
    correctIndex: 1,
    explanation: "Exploit emergent language from authentic talk.",
  },
  {
    id: "MA-12",
    category: "Methods & Approaches",
    question: "Genre pedagogy sequence:",
    options: [
      "Draft→edit→publish",
      "Model→deconstruct→jointly construct→independently construct",
      "Lecture→test",
      "Translate→memorize",
    ],
    correctIndex: 1,
    explanation: "Make purpose/audience/structure explicit.",
  },

  // Frameworks (8)
  {
    id: "FW-1",
    category: "Frameworks (PPP/ECRIF/TBLT/ESA)",
    question: "Correct PPP order:",
    options: [
      "Practice→Presentation→Production",
      "Presentation→Practice→Production",
      "Production→Practice→Presentation",
      "Preparation→Production→Practice",
    ],
    correctIndex: 1,
    explanation: "Contextual presentation → controlled → freer.",
  },
  {
    id: "FW-2",
    category: "Frameworks (PPP/ECRIF/TBLT/ESA)",
    question: "ECRIF stage of automaticity:",
    options: ["Encounter", "Clarify", "Remember", "Internalize"],
    correctIndex: 3,
    explanation: "E→C→R→I→F (fluency).",
  },
  {
    id: "FW-3",
    category: "Frameworks (PPP/ECRIF/TBLT/ESA)",
    question: "Willis TBLT ends with:",
    options: ["Test", "Report & language focus", "Homework only", "Silent reading"],
    correctIndex: 1,
    explanation: "Pre-task→Task/Planning/Report→Language focus.",
  },
  {
    id: "FW-4",
    category: "Frameworks (PPP/ECRIF/TBLT/ESA)",
    question: "ESA 'Engage' aims to:",
    options: ["Check homework", "Raise interest and lower anxiety", "Deliver explicit rules only", "Give a quiz"],
    correctIndex: 1,
    explanation: "Motivate; flexible sequences allowed.",
  },
  {
    id: "FW-5",
    category: "Frameworks (PPP/ECRIF/TBLT/ESA)",
    question: "Test–Teach–Test starts with:",
    options: ["Explicit rule input", "Quick diagnostic task", "Homework check", "Final exam"],
    correctIndex: 1,
    explanation: "Diagnose → target teaching → re-task.",
  },
  {
    id: "FW-6",
    category: "Frameworks (PPP/ECRIF/TBLT/ESA)",
    question: "PWP reading order:",
    options: ["Post→While→Pre", "Pre→While (gist→detail→infer)→Post", "While only", "Gist after detail"],
    correctIndex: 1,
    explanation: "Activate schema → comprehension → extension.",
  },
  {
    id: "FW-7",
    category: "Frameworks (PPP/ECRIF/TBLT/ESA)",
    question: "PDP listening includes:",
    options: ["Only dictation", "Predict→gist→detail→infer", "Grammar test", "Silent reading"],
    correctIndex: 1,
    explanation: "Multiple purposeful listens.",
  },
  {
    id: "FW-8",
    category: "Frameworks (PPP/ECRIF/TBLT/ESA)",
    question: "ESA flexible sequence means:",
    options: [
      "Always E-S-A",
      "Any order (e.g., E-A-S-A) depending on aims",
      "Only A-S-E",
      "Only Engage",
    ],
    correctIndex: 1,
    explanation: "Reorder to fit objectives.",
  },

  // Assessment (9)
  {
    id: "AS-1",
    category: "Assessment",
    question: "Formative assessment is:",
    options: [
      "High-stakes end test",
      "Ongoing checks that inform next steps",
      "Comparing students to cohort",
      "Aptitude for admissions",
    ],
    correctIndex: 1,
    explanation: "Assessment FOR learning.",
  },
  {
    id: "AS-2",
    category: "Assessment",
    question: "Consistency of scores =",
    options: ["Validity", "Reliability", "Authenticity", "Transparency"],
    correctIndex: 1,
    explanation: "Reliability = consistency across raters/occasions.",
  },
  {
    id: "AS-3",
    category: "Assessment",
    question: "Analytic rubric vs holistic:",
    options: [
      "One overall score",
      "Separate criteria scores",
      "Faster but less transparent",
      "Cannot be used for speaking",
    ],
    correctIndex: 1,
    explanation: "Analytic gives criterion-level feedback.",
  },
  {
    id: "AS-4",
    category: "Assessment",
    question: "Most authentic speaking task:",
    options: [
      "Reading isolated sentences",
      "Role-play a job interview",
      "Minimal pairs drill",
      "Picture matching",
    ],
    correctIndex: 1,
    explanation: "Mirror real-world performance.",
  },
  {
    id: "AS-5",
    category: "Assessment",
    question: "Inter-rater reliability improves when:",
    options: [
      "Vague descriptors",
      "Training & clear rubrics",
      "Each rater uses own scale",
      "No moderation",
    ],
    correctIndex: 1,
    explanation: "Calibration + shared criteria.",
  },
  {
    id: "AS-6",
    category: "Assessment",
    question: "Construct validity means:",
    options: ["Looks nice", "Measures intended ability", "Is consistent", "Is short"],
    correctIndex: 1,
    explanation: "What the test claims to measure.",
  },
  {
    id: "AS-7",
    category: "Assessment",
    question: "Positive washback occurs when:",
    options: [
      "Narrow memorization",
      "Tasks mirror outcomes/skills",
      "Only grammar in speaking course",
      "Surprise criteria",
    ],
    correctIndex: 1,
    explanation: "Alignment encourages useful study.",
  },
  {
    id: "AS-8",
    category: "Assessment",
    question: "Good MCQ stem should be:",
    options: [
      "Ambiguous",
      "Clear & testing one idea with plausible distractors",
      "Contain grammatical clues",
      "Have multiple correct answers",
    ],
    correctIndex: 1,
    explanation: "One best answer; avoid clueing.",
  },
  {
    id: "AS-9",
    category: "Assessment",
    question: "Criterion-referenced means:",
    options: ["Compare to others", "Judge against fixed descriptors", "Rank by percentile", "Grade on curve"],
    correctIndex: 1,
    explanation: "Performance vs standards.",
  },

  // Classroom Management (8)
  {
    id: "CM-1",
    category: "Classroom Management",
    question: "ICQs are for:",
    options: ["Content meaning", "Instructions understanding", "Spelling", "Filling time"],
    correctIndex: 1,
    explanation: "Use before tasks to ensure clarity.",
  },
  {
    id: "CM-2",
    category: "Classroom Management",
    question: "UDL for mixed-ability:",
    options: [
      "Single product for all",
      "Tiered tasks with choice",
      "Whole-class chorus only",
      "Disable visuals",
    ],
    correctIndex: 1,
    explanation: "Multiple means of engagement/representation/action.",
  },
  {
    id: "CM-3",
    category: "Classroom Management",
    question: "Feedback timing in fluency tasks:",
    options: [
      "Immediate interruption",
      "Delayed selective feedback after task",
      "No feedback",
      "Only peer feedback",
    ],
    correctIndex: 1,
    explanation: "Protect fluency; address patterns after.",
  },
  {
    id: "CM-4",
    category: "Classroom Management",
    question: "CCQs are for:",
    options: ["Instructions", "Concept/meaning understanding", "Spelling", "Time filler"],
    correctIndex: 1,
    explanation: "ICQs vs CCQs distinction.",
  },
  {
    id: "CM-5",
    category: "Classroom Management",
    question: "Best grouping for jigsaw reading:",
    options: ["Same text for all", "Expert groups then teach peers", "Only individual work", "Whole-class chorus"],
    correctIndex: 1,
    explanation: "Expert→teaching cycle.",
  },
  {
    id: "CM-6",
    category: "Classroom Management",
    question: "Routine supporting time-on-task:",
    options: [
      "No posted agenda",
      "Entry tasks + visual timers",
      "Random seating daily",
      "Punish first",
    ],
    correctIndex: 1,
    explanation: "Predictable routines save time.",
  },
  {
    id: "CM-7",
    category: "Classroom Management",
    question: "Quick attention signal:",
    options: ["Silent reading", "Call-and-response", "Long lecture", "Pop quiz"],
    correctIndex: 1,
    explanation: "Refocuses attention fast.",
  },
  {
    id: "CM-8",
    category: "Classroom Management",
    question: "Seating for pairwork & monitoring:",
    options: ["Exam rows", "Horseshoe/U-shape", "Single file", "Blocked aisles"],
    correctIndex: 1,
    explanation: "Visibility + movement.",
  },

  // Ethics & Values (5)
  {
    id: "ET-1",
    category: "Ethics & Values",
    question: "Assessment ethics best practice:",
    options: [
      "Surprise criteria",
      "Publish clear rubrics beforehand",
      "Share scripts publicly",
      "Reuse last year's test blindly",
    ],
    correctIndex: 1,
    explanation: "Transparency/fairness.",
  },
  {
    id: "ET-2",
    category: "Ethics & Values",
    question: "Data privacy practice:",
    options: [
      "Post grades publicly",
      "Anonymize data & secure storage",
      "Share on social media",
      "Email class list with grades",
    ],
    correctIndex: 1,
    explanation: "Protect identities and data.",
  },
  {
    id: "ET-3",
    category: "Ethics & Values",
    question: "Culturally responsive materials:",
    options: [
      "Stereotype groups",
      "Represent diversity respectfully",
      "Avoid local contexts",
      "Use imported content only",
    ],
    correctIndex: 1,
    explanation: "Fair representation increases inclusion.",
  },
  {
    id: "ET-4",
    category: "Ethics & Values",
    question: "Support academic integrity by:",
    options: [
      "Ignoring plagiarism",
      "Teaching paraphrase/summary/citation",
      "Only punishments",
      "Ban sources",
    ],
    correctIndex: 1,
    explanation: "Teach skills + clear policy.",
  },
  {
    id: "ET-5",
    category: "Ethics & Values",
    question: "Professional boundaries:",
    options: [
      "Friend students on all apps",
      "Use appropriate channels/tone",
      "Share personal issues",
      "Tutor privately w/o disclosure",
    ],
    correctIndex: 1,
    explanation: "Keep communication professional.",
  },

  // Curriculum & Syllabus (7)
  {
    id: "CS-1",
    category: "Curriculum & Syllabus",
    question: "Structural syllabus organized by:",
    options: ["Topics", "Grammatical forms/sequences", "Tasks/outcomes", "Genres only"],
    correctIndex: 1,
    explanation: "Sequence of forms/tenses.",
  },
  {
    id: "CS-2",
    category: "Curriculum & Syllabus",
    question: "Curriculum vs syllabus:",
    options: [
      "Curriculum = single lesson",
      "Curriculum = system-level aims/content/assessment; syllabus = course-level selection/sequence",
      "Interchangeable",
      "Syllabus broader than curriculum",
    ],
    correctIndex: 1,
    explanation: "Macro blueprint vs course plan.",
  },
  {
    id: "CS-3",
    category: "Curriculum & Syllabus",
    question: "Notional–functional syllabus uses:",
    options: [
      "Literary eras",
      "Communicative functions & notions",
      "Only grammar tenses",
      "Page numbers",
    ],
    correctIndex: 1,
    explanation: "Purpose-driven language.",
  },
  {
    id: "CS-4",
    category: "Curriculum & Syllabus",
    question: "Spiral curriculum:",
    options: ["No repetition", "Revisit key items at increasing complexity", "Teach once then test", "Random order"],
    correctIndex: 1,
    explanation: "Recycling consolidates learning.",
  },
  {
    id: "CS-5",
    category: "Curriculum & Syllabus",
    question: "Hidden curriculum refers to:",
    options: ["Official aims", "Unstated norms/values in practice", "Homework list", "Exam blueprint"],
    correctIndex: 1,
    explanation: "Implicit messages about roles/power.",
  },
  {
    id: "CS-6",
    category: "Curriculum & Syllabus",
    question: "Backwards design begins with:",
    options: ["Choosing pages", "Identifying desired results/standards", "Writing random activities", "Scheduling exams first"],
    correctIndex: 1,
    explanation: "Outcomes → evidence → plan.",
  },
  {
    id: "CS-7",
    category: "Curriculum & Syllabus",
    question: "Alignment means:",
    options: [
      "Teach one thing, test another",
      "Objectives, instruction, assessment match",
      "Only objectives matter",
      "Assessment drives all",
    ],
    correctIndex: 1,
    explanation: "Coherence across components.",
  },

  // ICT (6)
  {
    id: "ICT-1",
    category: "ICT",
    question: "Best tool for real-time collaborative writing:",
    options: ["PDF viewer", "Google Docs", "Static slides", "Image gallery"],
    correctIndex: 1,
    explanation: "Simultaneous editing/commenting.",
  },
  {
    id: "ICT-2",
    category: "ICT",
    question: "SAMR 'Redefinition' example:",
    options: [
      "Typing instead of handwriting",
      "Using spell-check",
      "Global multimedia podcast with analytics",
      "Print double-sided",
    ],
    correctIndex: 2,
    explanation: "Enables previously inconceivable tasks.",
  },
  {
    id: "ICT-3",
    category: "ICT",
    question: "In TPACK, 'P' stands for:",
    options: ["Phonology", "Pedagogy", "Platforms", "Projects"],
    correctIndex: 1,
    explanation: "Technological + Pedagogical + Content knowledge.",
  },
  {
    id: "ICT-4",
    category: "ICT",
    question: "Accessibility best practice:",
    options: ["No captions", "High color contrast & alt text", "Tiny fonts", "Text embedded in images"],
    correctIndex: 1,
    explanation: "Support all learners.",
  },
  {
    id: "ICT-5",
    category: "ICT",
    question: "Quick exit tickets tool:",
    options: ["Shared slideshow", "Paper or Google Forms", "Long essays", "Poster only"],
    correctIndex: 1,
    explanation: "Collect fast formative data.",
  },
  {
    id: "ICT-6",
    category: "ICT",
    question: "Digital citizenship includes:",
    options: ["Ignore copyright", "Respectful communication & proper sourcing", "Share student data freely", "Bypass filters"],
    correctIndex: 1,
    explanation: "Ethical, safe tech use.",
  },

  // Language System (15)
  {
    id: "LS-1",
    category: "Language System",
    question: "Correct mixed conditional:",
    options: [
      "If I knew, I would have told you yesterday.",
      "If I had slept earlier, I would feel better now.",
      "If it rains, we would have stayed home.",
      "If I were you, I will study harder.",
    ],
    correctIndex: 1,
    explanation: "Past condition → present result.",
  },
  {
    id: "LS-2",
    category: "Language System",
    question:
      "Future perfect passive: 'They will finish the report by Friday' →",
    options: [
      "The report is finished by Friday.",
      "The report has been finished by Friday.",
      "The report will have been finished by Friday.",
      "The report would have been finished by Friday.",
    ],
    correctIndex: 2,
    explanation: "will have been + past participle.",
  },
  {
    id: "LS-3",
    category: "Language System",
    question: "Correct collocation:",
    options: ["strong rain", "heavy rain", "powerful rain", "big rain"],
    correctIndex: 1,
    explanation: "Use 'heavy rain'.",
  },
  {
    id: "LS-4",
    category: "Language System",
    question: "Choose preposition: 'She is accustomed ___ long hours.'",
    options: ["at", "with", "for", "to"],
    correctIndex: 3,
    explanation: "accustomed to + noun/gerund.",
  },
  {
    id: "LS-5",
    category: "Language System",
    question: "Non-defining relative clause:",
    options: [
      "Students who study regularly improve.",
      "My sister, who lives abroad, is a teacher.",
      "The book that you lent me is great.",
      "People who recycle help the planet.",
    ],
    correctIndex: 1,
    explanation: "Extra info, comma-bounded.",
  },
  {
    id: "LS-6",
    category: "Language System",
    question: "BrE → AmE:",
    options: ["lorry → truck", "flat → condo", "torch → lantern", "football → football"],
    correctIndex: 0,
    explanation: "Standard mapping.",
  },
  {
    id: "LS-7",
    category: "Language System",
    question: "Reported universal truth:",
    options: [
      "The teacher said water boiled at 100°C.",
      "The teacher said that water boils at 100°C.",
      "The teacher said that water would boil at 100°C.",
      "The teacher said that water had boiled at 100°C.",
    ],
    correctIndex: 1,
    explanation: "No backshift for timeless facts.",
  },
  {
    id: "LS-8",
    category: "Language System",
    question: "Present perfect vs past simple:",
    options: [
      "I have finished my homework at 7 pm yesterday.",
      "I have visited Rabat three times.",
      "I visited Rabat three times this summer.",
      "I was visiting Rabat when…",
    ],
    correctIndex: 1,
    explanation: "Life experience without finished time marker.",
  },
  {
    id: "LS-9",
    category: "Language System",
    question: "Modal deduction (present):",
    options: [
      "She must to be at home.",
      "She must be at home.",
      "She might to be at home.",
      "She can to be at home.",
    ],
    correctIndex: 1,
    explanation: "Modal + base; no “to”.",
  },
  {
    id: "LS-10",
    category: "Language System",
    question: "No backshift applies to:",
    options: ["Universal truths", "Specific past events", "Future plans", "Orders"],
    correctIndex: 0,
    explanation: "Keep present simple.",
  },
  {
    id: "LS-11",
    category: "Language System",
    question: "Reduce: 'The man who is talking is my teacher.'",
    options: [
      "The man talking is my teacher.",
      "The man is talking my teacher.",
      "The man who talking is my teacher.",
      "The man to talking is my teacher.",
    ],
    correctIndex: 0,
    explanation: "who is V-ing → V-ing.",
  },
  {
    id: "LS-12",
    category: "Language System",
    question: "Best discourse marker for contrast:",
    options: ["Moreover", "However", "Therefore", "For example"],
    correctIndex: 1,
    explanation: "However = contrast.",
  },
  {
    id: "LS-13",
    category: "Language System",
    question: "Nominalization of 'decide':",
    options: ["decidement", "decision", "decidence", "deciderment"],
    correctIndex: 1,
    explanation: "Correct noun = decision.",
  },
  {
    id: "LS-14",
    category: "Language System",
    question: "Correct cleft for subject focus:",
    options: [
      "It was John who broke the vase.",
      "It was the vase that John broke it.",
      "It is broke the vase John.",
      "It was broken the vase by John.",
    ],
    correctIndex: 0,
    explanation: "It-cleft pattern.",
  },
  {
    id: "LS-15",
    category: "Language System",
    question: "Phrasal verb meaning 'tolerate':",
    options: ["put up with", "put out", "put off", "put across"],
    correctIndex: 0,
    explanation: "put up with = tolerate.",
  },

  // Feedback & Error Correction (10)
  {
    id: "FE-1",
    category: "Feedback & Error Correction",
    question:
      "Which move prompts self-correction by reformulating the error?",
    options: [
      "Clarification request",
      "Recast",
      "Explicit correction",
      "Metalinguistic cue",
    ],
    correctIndex: 3,
    explanation: "E.g., 'Past tense?' → noticing and self-repair.",
  },
  {
    id: "FE-2",
    category: "Feedback & Error Correction",
    question: "During fluency work, best timing is:",
    options: [
      "Immediate interruption",
      "Mid-sentence reformulation",
      "Delayed selective feedback",
      "No feedback ever",
    ],
    correctIndex: 2,
    explanation: "Delay to protect fluency; correct patterns later.",
  },
  {
    id: "FE-3",
    category: "Feedback & Error Correction",
    question: "A 'recast' is:",
    options: [
      "Loud repetition of error",
      "Implicit reformulation to correct form",
      "Peer rubric",
      "Written end-term note",
    ],
    correctIndex: 1,
    explanation: "Implicit negative evidence by modeling.",
  },
  {
    id: "FE-4",
    category: "Feedback & Error Correction",
    question: "Priority in communicative tasks:",
    options: [
      "All errors equally",
      "High-frequency/meaning-blocking or target-related errors",
      "Only pronunciation",
      "Only grammar",
    ],
    correctIndex: 1,
    explanation: "Focus on intelligibility and aims.",
  },
  {
    id: "FE-5",
    category: "Feedback & Error Correction",
    question: "Uptake refers to:",
    options: [
      "Teacher error log",
      "Learner's immediate response using feedback",
      "Admin report",
      "Score next term",
    ],
    correctIndex: 1,
    explanation: "Immediate attempt to incorporate feedback.",
  },
  {
    id: "FE-6",
    category: "Feedback & Error Correction",
    question: "Technique that elicits self-repair:",
    options: ["Elicitation", "Explicit correction", "Translation", "Echoing only"],
    correctIndex: 0,
    explanation: "Prompts learners to complete/correct their utterance.",
  },
  {
    id: "FE-7",
    category: "Feedback & Error Correction",
    question: "Fossilization is:",
    options: [
      "Temporary slips",
      "Stable non-target forms that resist change",
      "Only L1 transfer",
      "Teacher mistake",
    ],
    correctIndex: 1,
    explanation:
      "Persistent errors; need targeted input/feedback.",
  },
  {
    id: "FE-8",
    category: "Feedback & Error Correction",
    question: "Most explicit feedback:",
    options: [
      "Recast",
      "Clarification request",
      "Explicit correction with correct form",
      "Metalinguistic cue",
    ],
    correctIndex: 2,
    explanation: "States error + supplies correct form.",
  },
  {
    id: "FE-9",
    category: "Feedback & Error Correction",
    question: "Metalinguistic example:",
    options: ["You mean 'went'?", "Past tense?", "Pardon?", "(Teacher repeats correctly)"],
    correctIndex: 1,
    explanation: "Comment/question about the form.",
  },
  {
    id: "FE-10",
    category: "Feedback & Error Correction",
    question: "Balancing accuracy & fluency across PPP:",
    options: [
      "Heavy correction during production",
      "No correction during practice",
      "Selective target correction in practice; delayed feedback after production",
      "Only peer correction",
    ],
    correctIndex: 2,
    explanation:
      "Target in controlled phase; delay in freer phase.",
  },
];

// --------- UI Bits ---------
const CategoryPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs sm:text-sm border transition ${
      active ? "bg-black text-white" : "bg-white text-gray-800 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

export default function Home() {
  // Core state
  const [username, setUsername] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("username") || "" : ""
  );
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ id: string; choice: number | null }[]>(
    []
  );
  const [index, setIndex] = useState(0);
  const [seed, setSeed] = useState(() => Math.random());
  const [count, setCount] = useState("20");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(QUESTIONS.map((q) => q.category)))],
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("username", username);
  }, [username]);

  // Build session
  const sessionPool = useMemo(
    () => (filter === "All" ? QUESTIONS : QUESTIONS.filter((q) => q.category === filter)),
    [filter]
  );
  const sessionQuestions = useMemo(() => {
    const shuffled = shuffleDeterministic(sessionPool, seed);
    const n =
      count === "All"
        ? shuffled.length
        : Math.min(parseInt(count, 10), shuffled.length);
    return shuffled.slice(0, n);
  }, [sessionPool, seed, count]);

  const current = sessionQuestions[index];
  const total = sessionQuestions.length;
  const score = useMemo(
    () => computeScore(sessionQuestions, answers),
    [answers, sessionQuestions]
  );
  const progress = total ? Math.round((index / total) * 100) : 0;

  const start = () => {
    if (!username.trim()) return;
    setAnswers([]);
    setSelected(null);
    setIndex(0);
    setFinished(false);
    setSeed(Math.random());
    setStarted(true);
  };

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswers((prev) => [...prev, { id: current.id, choice: i }]);
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setStarted(false);
    setFinished(false);
    setAnswers([]);
    setSelected(null);
    setIndex(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Head>
        <title>English Teaching Exam MCQ — 2025 Practice</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <header className="mb-5">
          <h1 className="text-2xl font-bold">
            English Teaching Exam MCQ — 2025 Practice
          </h1>
          <p className="text-sm text-gray-600">
            Covers Learning Theories, Methods/Approaches, Frameworks
            (PPP/ECRIF/TBLT/ESA), Assessment, Classroom Management, Ethics,
            Curriculum/Syllabus, ICT, Language System, and Feedback & Error
            Correction.
          </p>
        </header>

        {/* Controls (before start) */}
        {!started && (
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Your name</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Test Candidate"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Questions per session
                </label>
                <select
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="40">40</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Select category (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <CategoryPill
                    key={cat}
                    label={cat}
                    active={filter === cat}
                    onClick={() => setFilter(cat)}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={start}
              className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
            >
              Bismillah Begin test
            </button>
          </div>
        )}

        {/* In-session UI */}
        {started && !finished && current && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Candidate:{" "}
                <span className="font-medium text-gray-900">{username}</span>
              </div>
              <div>
                Question {index + 1} / {total}
              </div>
            </div>

            <div
              aria-label="Progress"
              className="h-2 bg-gray-200 rounded-full overflow-hidden"
            >
              <div className="h-full bg-black" style={{ width: `${progress}%` }} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                {current.category}
              </div>
              <h2 className="text-lg font-semibold mb-4">{current.question}</h2>

              <div className="grid gap-2">
                {current.options.map((opt, i) => {
                  const isCorrect = i === current.correctIndex;
                  const chosen = selected === i;
                  const show = selected !== null;
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={selected !== null}
                      className={`text-left border rounded-xl px-4 py-3 transition ${
                        show
                          ? isCorrect
                            ? "border-green-600 bg-green-50"
                            : chosen
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 bg-white"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>{" "}
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm">
                  <div className="font-semibold mb-1">Explanation</div>
                  <div>{current.explanation || "—"}</div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={restart}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Restart
                </button>
                <button
                  onClick={next}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
                >
                  {index + 1 === total ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {started && finished && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="text-gray-700">
              {username}, you scored{" "}
              <span className="font-semibold">{score}</span> / {total} (
              {Math.round((score / total) * 100)}%).
            </p>

            <details className="rounded-xl border p-4">
              <summary className="cursor-pointer font-medium">
                Review answers
              </summary>
              <ol className="mt-3 space-y-3 list-decimal list-inside">
                {sessionQuestions.map((q, idx) => {
                  const picked = answers[idx]?.choice ?? null;
                  const isRight = picked === q.correctIndex;
                  return (
                    <li key={q.id} className="border rounded-xl p-3">
                      <div className="text-sm uppercase tracking-wide text-gray-500">
                        {q.category}
                      </div>
                      <div className="font-semibold">{q.question}</div>
                      <div className="mt-1 text-sm">
                        Your answer: {picked !== null ? q.options[picked] : "—"}{" "}
                        {isRight ? "✅" : "❌"}
                      </div>
                      {!isRight && (
                        <div className="text-sm">
                          Correct:{" "}
                          <span className="font-medium">
                            {q.options[q.correctIndex]}
                          </span>
                        </div>
                      )}
                      {q.explanation && (
                        <div className="mt-2 text-sm text-gray-700">
                          {q.explanation}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </details>

            <div className="flex gap-3">
              <button
                onClick={restart}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Start over
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
              >
                Print/Save Results
              </button>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-gray-500">
          Built For 2025 English Teaching Exam Revision • Made by @thadefaultboi
        </footer>
      </div>
    </div>
  );
}
