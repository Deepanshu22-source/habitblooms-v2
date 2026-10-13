'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Unlock, Sparkles, BookOpen, ChevronRight, Award, CheckCircle2, ArrowLeft } from 'lucide-react'

interface ResourceItem {
  id: string
  title: string
  subtitle: string
  duration: string
  tag: string
  icon: string
  content: string[]
}

const VAULT_DATA: Record<string, ResourceItem[]> = {
  UPSC: [
    {
      id: 'upsc-1',
      title: '90-Day Mains Answer Writing Framework',
      subtitle: 'The 3-part structure (Intro, Framework/Diagram, Directive Conclusion) used by Rank < 50 toppers.',
      duration: '10 min read',
      tag: 'Mains GS',
      icon: '✍️',
      content: [
        '📌 Part 1: The First 60 Seconds — Deconstructing Directives: Never start writing immediately. Identify the core directive (Critically Analyze, Discuss, Evaluate). For "Critically Analyze", allocate 60% arguments in favor, 30% counterpoints/challenges, and 10% balanced conclusion.',
        '📌 Part 2: Structure over Content: Use sub-headings directly derived from the question parts. Examiners scan 100+ copies a day — bullets, micro-flowcharts, and underlined constitutional articles (e.g., Article 21, 368) instantly boost marks by 1-2 points per question.',
        '📌 Part 3: Value Addition Hack: Every answer must contain at least 1 committee recommendation (e.g., Punchhi, Sarkaria, NITI Aayog report) or relevant case law to stand out from generic responses.',
        '📌 Part 4: Speed Management: Train for 7 minutes for 10-markers (150 words) and 11 minutes for 15-markers (250 words). Never leave any question blank in Mains.'
      ]
    },
    {
      id: 'upsc-2',
      title: 'Prelims Elimination & High-Yield Trend Map',
      subtitle: 'Mastering the 50-50 elimination technique and identifying recurring UPSC core themes.',
      duration: '12 min read',
      tag: 'Prelims GS-1',
      icon: '🎯',
      content: [
        '📌 Trend 1: Core Static Anchor: 65% of the cutoff comes from standard static subjects (Polity, Modern History, Ecology & Geography). Master Laxmikanth and Spectrum till you hit 90%+ accuracy before touching obscure current affairs.',
        '📌 Trend 2: The 50-50 Elimination Protocol: In modern Prelims, direct knowledge only answers 30-35 questions. The remaining 45-50 questions require educated elimination between 2 remaining options.',
        '📌 Trend 3: PYQ Reverse Engineering: Solve 10 years of UPSC Prelims PYQs not just for answers, but for the options. Research every incorrect option as UPSC frequently recycles past options into future questions.',
        '📌 Trend 4: Negative Marking Discipline: If you cannot eliminate at least one option with certainty, leave the question. Blind guessing is the #1 reason candidates miss the cutoff by 2-3 marks.'
      ]
    },
    {
      id: 'upsc-3',
      title: 'Daily 3-Block Timetable & CSAT Safety Strategy',
      subtitle: 'Managing mental stamina and securing the 66-mark CSAT cutoff without last-minute panic.',
      duration: '8 min read',
      tag: 'Strategy',
      icon: '⏱️',
      content: [
        '📌 Block 1 (Morning 3h): Heavy conceptual reading or answer writing when brain energy is at peak.',
        '📌 Block 2 (Afternoon 2.5h): Current affairs analysis and PYQ solving. Switch to active output to fight post-lunch sluggishness.',
        '📌 Block 3 (Evening 2h): Static revision and compulsory 45-minute daily CSAT problem practice.',
        '📌 CSAT Reality Check: Never treat CSAT lightly. Practice reading comprehension elimination and 25 reasoning questions every alternate day from January onward.'
      ]
    }
  ],
  CA: [
    {
      id: 'ca-1',
      title: '30-Day Audit & Tax Section Memorization Blueprint',
      subtitle: 'Active recall and spatial memory techniques to quote exact section numbers and SAs.',
      duration: '11 min read',
      tag: 'Theory Papers',
      icon: '⚖️',
      content: [
        '📌 Technique 1: Group Sections by Theme: Do not memorize sections linearly. Group Companies Act sections into stories (e.g., Audit & Auditors: Sec 139 to 148 as a sequential journey of appointment, disqualification, rights, and penalty).',
        '📌 Technique 2: Standards on Auditing (SAs) Memory Pegs: Associate SA 200 series with General Principles, 300 with Risk Assessment, and 500 with Audit Evidence. Quote the SA title along with the number for full presentation marks.',
        '📌 Technique 3: Daily 20-Minute Audio Recall: Record yourself reciting 10 sections and their core provisions. Listen to it during your daily commute or post-dinner walks.',
        '📌 Technique 4: ICAI Keywords: The examiner matches keywords with study material. Underline statutory terminology (e.g., "True and Fair view", "Material misstatement", "Reasonable assurance").'
      ]
    },
    {
      id: 'ca-2',
      title: 'RTP & MTP Practical Paper Solving Strategy',
      subtitle: 'How to score 70+ exemption in Accounts, Costing, and Financial Management.',
      duration: '9 min read',
      tag: 'Practical Papers',
      icon: '📊',
      content: [
        '📌 Step 1: Step-Marking Mastery: Even if final balance sheet totals don’t match, 80% of marks are in working notes and initial journal entries. Show clean, numbered working notes first.',
        '📌 Step 2: The 15-Minute Reading Time Strategy: Read the paper from back to front. Identify the 2 easiest questions to attempt in the first 45 minutes to build confidence.',
        '📌 Step 3: Solve Last 3 RTPs and 2 MTPs under strict 3-hour exam conditions. Over 40% of concepts mirror past RTP trends.',
        '📌 Step 4: Speed Calibration: Aim for 1.8 minutes per mark. For a 10-mark problem, do not spend more than 18 minutes.'
      ]
    }
  ],
  JEE: [
    {
      id: 'jee-1',
      title: 'High-Weightage Physics & Chemistry Formula Vault',
      subtitle: 'The 50 critical formulas and reaction mechanisms responsible for 40% of JEE Main questions.',
      duration: '14 min read',
      tag: 'Formulas',
      icon: '⚡',
      content: [
        '📌 Physics Mechanics: Modern Physics, Current Electricity, and Thermodynamics make up 35% of the paper. Memorize de Broglie wavelength relations, Bohr radius derivations, and Carnot cycle efficiencies.',
        '📌 Chemistry Organic Pathways: Name reactions (Aldol, Cannizzaro, Reimer-Tiemann) must be mapped on a single 1-page chart with reagents and reaction conditions.',
        '📌 Math High-Yield Units: Coordinate Geometry, Matrices/Determinants, and Vectors/3D are the highest return-on-investment topics.',
        '📌 Daily Formula Drill: Write all formulas from one unit on a blank paper from memory every night before sleeping.'
      ]
    },
    {
      id: 'jee-2',
      title: 'The 3-Hour Exam Strategy: Order of Attempt & Speed',
      subtitle: 'How 99 percentile scorers distribute their 180 minutes between Chemistry, Physics, and Math.',
      duration: '8 min read',
      tag: 'Exam Strategy',
      icon: '🎯',
      content: [
        '📌 Round 1 (Chemistry — 40 mins): Clear all Inorganic and direct Organic questions first. Chemistry provides the fastest score-to-time ratio.',
        '📌 Round 2 (Physics — 55 mins): Target single-step formula numericals and conceptual questions.',
        '📌 Round 3 (Math — 75 mins): Math is notoriously lengthy. Pick the 12-14 most straightforward questions and solve them accurately without second-guessing.',
        '📌 Buffer 10 Minutes: Review marked-for-review questions and double-check calculation errors in integer-type answers.'
      ]
    }
  ],
  NEET: [
    {
      id: 'neet-1',
      title: 'NCERT Biology 360/360 Line-by-Line Revision Protocol',
      subtitle: 'Extracting every hidden MCQ from diagrams, scientist introductions, and summary paragraphs.',
      duration: '10 min read',
      tag: 'Biology Mastery',
      icon: '🧬',
      content: [
        '📌 Rule 1: Diagram Captions: 10-15% of NEET biology questions target labels or captions below NCERT figures. Re-draw all lifecycle diagrams from memory.',
        '📌 Rule 2: Summary Paragraphs: Many questions are framed directly from the summary section at the end of each NCERT chapter which students often skip.',
        '📌 Rule 3: Scientist Forewords: Read the 1-page scientist biographies at the start of each unit (e.g., Ernst Mayr, Ramdeo Misra). Questions on their contributions have appeared repeatedly.',
        '📌 Rule 4: Active Testing: After reading a chapter, solve 100 questions immediately. Review every wrong answer against the exact NCERT line.'
      ]
    },
    {
      id: 'neet-2',
      title: 'Negative Marking Prevention & Physics Speed Drill',
      subtitle: 'Protecting your 650+ target by eliminating avoidable negative marks.',
      duration: '8 min read',
      tag: 'Score Booster',
      icon: '🛡️',
      content: [
        '📌 Avoid Option Traps: Read questions carefully for words like "INCORRECT", "EXCEPT", and "NOT TRUE". Circle these words in the question paper.',
        '📌 Physics Formula Flashcards: Maintain a pocket notebook of 150 standard physics formulas. Practice dimensional analysis to verify complex equations.',
        '📌 OMR Bubbling Discipline: Bubble the OMR sheet subject-by-subject (Biology first, then Chemistry, then Physics) rather than all at the end to avoid catastrophic bubbling shifts.'
      ]
    }
  ],
  General: [
    {
      id: 'gen-1',
      title: 'The 21-Day Habit Mastery & Micro-Habit Playbook',
      subtitle: 'How to lock in unshakeable daily habits using the 2-minute rule and habit stacking.',
      duration: '7 min read',
      tag: 'Habit Psychology',
      icon: '🌿',
      content: [
        '📌 Step 1: The 2-Minute Rule: When you start a new habit, it should take less than two minutes to do. "Read 30 pages" becomes "Read one page". Make the entry barrier effortless.',
        '📌 Step 2: Habit Stacking: Anchor your new habit to an existing routine: "After I brew morning coffee, I will check my HabitBlooms dashboard for 60 seconds."',
        '📌 Step 3: Never Miss Twice: Missing once is an accident. Missing twice is the start of a new, bad habit. Use Streak Freezes to protect your momentum when emergencies strike.',
        '📌 Step 4: Environment Design: Make the cues of good habits obvious and the friction of bad habits high (e.g. keep study books open, phone in another room).'
      ]
    },
    {
      id: 'gen-2',
      title: 'Dopamine Reset & Deep Work Protocol',
      subtitle: 'Eliminate brain fog, reclaim your attention span, and achieve 4 hours of effortless focus daily.',
      duration: '9 min read',
      tag: 'Peak Focus',
      icon: '🧠',
      content: [
        '📌 Protocol 1: Morning Zero-Phone Hour: Do not look at notifications or social media for the first 60 minutes after waking up. Protect your baseline dopamine.',
        '📌 Protocol 2: 90-Minute Ultradian Cycles: Human focus peaks in 90-minute blocks followed by 20 minutes of restorative rest (walk, hydration, stretching).',
        '📌 Protocol 3: The Distraction Parking Lot: Keep a blank notepad beside you. When a random urge to check something hits, write it down and return to deep work.',
        '📌 Protocol 4: Evening Shutdown Routine: Close all tabs, mark completed habits, and review tomorrow’s top 3 priorities before closing your day.'
      ]
    }
  ]
}

interface Props {
  isOpen: boolean
  onClose: () => void
  userRank: number
  examGoal: string
}

export default function ResourceVaultModal({ isOpen, onClose, userRank, examGoal }: Props) {
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null)

  if (!isOpen) return null

  // Normalize goal to key
  const normalizedGoal = examGoal?.toUpperCase() || 'UPSC'
  const isCA = normalizedGoal.includes('CA')
  const isJEE = normalizedGoal.includes('JEE')
  const isNEET = normalizedGoal.includes('NEET')
  const isUPSC = normalizedGoal.includes('UPSC')

  let categoryKey = 'General'
  if (isUPSC) categoryKey = 'UPSC'
  else if (isCA) categoryKey = 'CA'
  else if (isJEE) categoryKey = 'JEE'
  else if (isNEET) categoryKey = 'NEET'

  const resources = VAULT_DATA[categoryKey] || VAULT_DATA['General']
  const isUnlocked = userRank <= 10 && userRank > 0

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0d1322] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-white"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Award size={18} />
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Weekly Squad Reward
                </span>
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                {categoryKey} Topper Resource Vault 📚
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Curated high-yield blueprints unlocked exclusively by top squad rankers.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Status Bar */}
          <div className="my-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  isUnlocked
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Your Status:</span>
                  {isUnlocked ? (
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                      UNLOCKED 🔓 (Rank #{userRank})
                    </span>
                  ) : (
                    <span className="text-amber-400 font-extrabold flex items-center gap-1">
                      LOCKED 🔒 (Rank #{userRank > 0 ? userRank : '—'})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isUnlocked
                    ? 'Congratulations! You finished in the Top 10 this week. All blueprints are fully unlocked.'
                    : `Reach the Top 10 on the weekly leaderboard to unlock all official guides! (${userRank > 10 ? `${userRank - 10} ranks away` : 'Check off habits to climb!'})`}
                </p>
              </div>
            </div>
          </div>

          {/* Content Body: Either List or Reader View */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {selectedResource ? (
              /* Inline Blueprint Reader */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setSelectedResource(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold mb-2"
                >
                  <ArrowLeft size={14} /> Back to Vault List
                </button>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-400 mb-1">
                    <span>{selectedResource.tag}</span>
                    <span>•</span>
                    <span>{selectedResource.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedResource.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{selectedResource.subtitle}</p>
                </div>

                <div className="space-y-3 pt-2">
                  {selectedResource.content.map((paragraph, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-sm leading-relaxed text-gray-300"
                    >
                      {paragraph}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Resource Cards List */
              resources.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isUnlocked
                      ? 'bg-white/[0.02] border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02]'
                      : 'bg-white/[0.01] border-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {item.tag}
                        </span>
                        <span className="text-xs text-gray-500">{item.duration}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 sm:self-center">
                    {isUnlocked ? (
                      <button
                        onClick={() => setSelectedResource(item)}
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 rounded-xl text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                      >
                        <BookOpen size={14} /> Read Blueprint
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedResource(item)}
                        className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-medium transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                      >
                        <Lock size={12} className="text-amber-400" /> Preview Outline
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
            <span>Weekly reset happens every Sunday at midnight IST.</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Sparkles size={12} /> {categoryKey} Study Hub
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
