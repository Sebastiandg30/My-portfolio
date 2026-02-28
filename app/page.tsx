'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Bug,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  Github,
  Laptop,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  ServerCog,
  Settings,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { defaultAchievements, normalizeAchievements, type Achievement } from '@/lib/achievements'

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement
  index: number
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="glass-card overflow-hidden"
    >
      <div className="border-b border-black/10 bg-[var(--night)] p-5 text-white">
        <div className="mb-2 flex items-start justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
            {achievement.role}
          </span>
          <span className="font-mono-custom text-xs text-slate-300">{achievement.period}</span>
        </div>
        <h3 className="font-display text-2xl leading-tight">{achievement.title}</h3>
        <p className="mt-2 text-sm text-slate-300">{achievement.company}</p>
      </div>

      <div className="space-y-4 p-5 text-sm text-[var(--ink-muted)]">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tomato)]" />
          <p>{achievement.challenge}</p>
        </div>

        {expanded && (
          <>
            <div className="flex items-start gap-3">
              <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" />
              <p>{achievement.action}</p>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--mustard)]" />
              <p className="font-semibold text-slate-700">{achievement.impact}</p>
            </div>
          </>
        )}

        <div className="flex flex-wrap gap-2">
          {achievement.tags.map(tag => (
            <Badge
              key={`${achievement.id}-${tag}`}
              className="border-black/10 bg-black/[0.04] px-2.5 py-1 text-xs text-slate-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-black/10 px-5 py-3">
        <button
          onClick={() => setExpanded(value => !value)}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-800"
        >
          {expanded ? 'Hide details' : 'View full case'}
        </button>

        {achievement.proofUrl ? (
          <a
            href={achievement.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--teal)] hover:underline"
          >
            Source <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </motion.article>
  )
}

export default function PortfolioPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const response = await fetch('/api/achievements', { cache: 'no-store' })
        if (!response.ok) return

        const payload = (await response.json()) as { achievements?: unknown }
        if (payload.achievements) {
          setAchievements(normalizeAchievements(payload.achievements))
        }
      } catch {
        setAchievements(defaultAchievements)
      }
    }

    loadAchievements()
  }, [])

  const sections = ['achievements', 'skills', 'experience', 'certifications', 'contact']

  const skills = [
    { label: 'Test Automation', icon: <Bug className="h-4 w-4" /> },
    { label: 'Selenium', icon: <Laptop className="h-4 w-4" /> },
    { label: 'Python', icon: <ServerCog className="h-4 w-4" /> },
    { label: 'API Testing', icon: <Workflow className="h-4 w-4" /> },
    { label: 'CI/CD', icon: <Settings className="h-4 w-4" /> },
    { label: 'Financial QA', icon: <ShieldCheck className="h-4 w-4" /> },
  ]

  const experience = [
    {
      role: 'QA Engineer',
      company: '3MIT',
      period: 'Apr 2025 - Present',
      bullets: [
        'Tested finance-heavy Odoo ERP modules under strict tax requirements.',
        'Built and maintained regression coverage for accounting workflows.',
        'Automated high-risk scenarios to prevent production incidents.',
      ],
    },
    {
      role: 'QA Engineer / Business Analyst',
      company: 'Salmonlabs',
      period: 'May 2025 - Aug 2025',
      bullets: [
        'Automated data validation pipelines with Python.',
        'Integrated AI checks to reduce false positives in lead validation.',
        'Processed and cleaned large CSV/XLSX datasets for analysis.',
      ],
    },
    {
      role: 'QA Engineer',
      company: 'Netforemost',
      period: 'Aug 2024 - Apr 2025',
      bullets: [
        'Implemented Selenium test suites integrated in CI/CD.',
        'Validated backend APIs with Postman test collections.',
        'Improved release confidence with repeatable QA flows.',
      ],
    },
  ]

  const certs = [
    { title: "CS50's Intro to Computer Science", issuer: 'Harvard University', image: '/HarvardX CS50x.jpg' },
    { title: "CS50's Intro to Python", issuer: 'Harvard University', image: '/HarvardX CS50P.jpg' },
    { title: 'Software Testing MasterClass', issuer: 'Udemy', image: '/TestingMC (1) (3).jpg' },
  ]

  return (
    <div className="relative overflow-x-hidden text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[color:rgba(251,247,241,0.9)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <a href="#top" className="font-display text-xl leading-none">
            Sebastian Gomez
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {sections.map(section => (
              <a
                key={section}
                href={`#${section}`}
                className="rounded-lg px-3 py-2 text-sm font-semibold capitalize text-slate-600 transition-colors hover:bg-black/5 hover:text-black"
              >
                {section}
              </a>
            ))}
            <a
              href="/admin"
              className="ml-2 inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold"
            >
              Admin
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(value => !value)}
            className="rounded-lg border border-black/10 bg-white p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-black/10 bg-[var(--paper)] px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {sections.map(section => (
                <a
                  key={section}
                  href={`#${section}`}
                  className="rounded-lg px-3 py-2 text-sm font-semibold capitalize text-slate-600 hover:bg-black/5"
                  onClick={() => setMenuOpen(false)}
                >
                  {section}
                </a>
              ))}
              <a
                href="/admin"
                className="mt-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold"
              >
                Admin panel
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <main id="top" className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 md:pt-16">
        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="space-y-6">
            <span className="section-label">QA Engineer · Automation Specialist</span>

            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
              Real QA wins from
              <span className="block text-[var(--tomato)]">real production work.</span>
            </h1>

            <p className="max-w-2xl text-lg text-slate-600">
              I design testing systems that prevent expensive bugs, improve release confidence, and make complex products safer to ship.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/CV Sebastian Gómez.pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--night)] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <FileText className="h-4 w-4" /> Download CV
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01797400cf1c137fb1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold"
              >
                Upwork <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="glass-card space-y-4 p-6"
          >
            <h2 className="font-display text-2xl">Quick Snapshot</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--teal)]" /> Caracas, Venezuela (UTC-4)
              </p>
              <p className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[var(--tomato)]" /> Focused on fintech, ERP, and data-heavy products
              </p>
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--mustard)]" /> Open to long-term QA and automation projects
              </p>
            </div>
            <div className="flex gap-2 pt-2 social-links">
              <a
                href="mailto:sebasdgg3001@gmail.com"
                className="inline-flex rounded-lg border border-black/10 bg-white p-2.5 text-slate-700 transition-colors hover:text-black"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/sebastiangomez30/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg border border-black/10 bg-white p-2.5 text-slate-700 transition-colors hover:text-black"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/Sebastiandg30"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg border border-black/10 bg-white p-2.5 text-slate-700 transition-colors hover:text-black"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </section>

        <section id="achievements" className="scroll-mt-24 pt-16 md:pt-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="section-label">Most Relevant Work</p>
              <h2 className="font-display text-4xl md:text-5xl">Client Achievements</h2>
              <p className="max-w-2xl text-slate-600">
                This section is fully editable from the admin panel, so I can keep adding real project outcomes over time.
              </p>
            </div>
            <a
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold"
            >
              Update achievements
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </section>

        <section id="skills" className="scroll-mt-24 pt-16 md:pt-24">
          <p className="section-label">Toolbox</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">How I Work</h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {skills.map(skill => (
              <Badge
                key={skill.label}
                className="inline-flex items-center gap-2 rounded-full border-black/15 bg-white px-4 py-2 text-sm text-slate-700"
              >
                {skill.icon}
                {skill.label}
              </Badge>
            ))}
          </div>
        </section>

        <section id="experience" className="scroll-mt-24 pt-16 md:pt-24">
          <p className="section-label">Experience</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">Professional Timeline</h2>

          <div className="mt-8 space-y-4">
            {experience.map((job, index) => (
              <motion.article
                key={`${job.company}-${job.period}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                custom={index}
                className="glass-card p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl">{job.role}</h3>
                  <span className="rounded-full bg-[var(--night)] px-3 py-1 text-xs font-semibold text-white">
                    {job.company}
                  </span>
                </div>
                <p className="mb-4 inline-flex items-center gap-2 font-mono-custom text-xs text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {job.period}
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {job.bullets.map(bullet => (
                    <li key={bullet} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="certifications" className="scroll-mt-24 pt-16 md:pt-24">
          <p className="section-label">Learning</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">Selected Certifications</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certs.map(cert => (
              <article key={cert.title} className="glass-card overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold leading-snug">{cert.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{cert.issuer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 pb-8 pt-16 md:pt-24">
          <div className="glass-card rounded-3xl bg-[var(--night)] px-6 py-10 text-center text-white md:px-10">
            <p className="section-label !text-slate-300">Contact</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Need stronger release confidence?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              If your team is shipping fast and quality is becoming risky, I can help you build a QA system that scales with your product.
            </p>
            <div className="social-links mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:sebasdgg3001@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[var(--night)]"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
              <a
                href="https://www.linkedin.com/in/sebastiangomez30/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-slate-700 shadow-sm transition-colors hover:text-black"
        aria-label="Back to top"
      >
        <ChevronDown className="h-4 w-4 rotate-180" />
      </button>
    </div>
  )
}
