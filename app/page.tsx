'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Briefcase,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  Star,
  Wrench,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { defaultAchievements, normalizeAchievements, type Achievement } from '@/lib/achievements'
import {
  defaultSiteContent,
  normalizeSiteContent,
  type ExperienceItem,
  type SiteContent,
} from '@/lib/site-content'

type ExperienceGroupKey = keyof SiteContent['experience']

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function UpworkMark({
  className = '',
  size = 16,
}: {
  className?: string
  size?: number
}) {
  return (
    <Image
      src="/upwork-icon.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    />
  )
}

function TopRatedBadge() {
  return (
    <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#2f6fff]/10 px-2 py-1">
      <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
        <span className="absolute inset-0 bg-[#2f6fff] [clip-path:polygon(50%_0%,92%_25%,92%_75%,50%_100%,8%_75%,8%_25%)]" />
        <Star className="relative h-2.5 w-2.5 text-white" strokeWidth={2.6} />
      </span>
      <span className="font-mono-custom text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1f4fc6]">
        Top Rated
      </span>
    </div>
  )
}

function TopRatedMiniBadge({ onGreen = false }: { onGreen?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
        onGreen ? 'bg-[#0f172a]/30 text-white' : 'bg-[#2f6fff]/12 text-[#1f4fc6]'
      }`}
    >
      <span className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        <span className="absolute inset-0 bg-[#2f6fff] [clip-path:polygon(50%_0%,92%_25%,92%_75%,50%_100%,8%_75%,8%_25%)]" />
        <Star className="relative h-2.5 w-2.5 text-white" strokeWidth={2.6} />
      </span>
      <span className="font-mono-custom text-[9px] font-semibold uppercase tracking-[0.12em]">
        Top Rated
      </span>
    </span>
  )
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
        <h3 className="font-display text-2xl leading-[1.22]">{achievement.title}</h3>
        <p className="mt-2 text-sm text-slate-300">{achievement.company}</p>
      </div>

      {achievement.previewVideo ? (
        <div className="relative h-44 overflow-hidden border-b border-black/10 bg-black">
          <video
            src={achievement.previewVideo}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      ) : null}

      <div className="space-y-4 p-5 text-sm text-[var(--ink-muted)]">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tomato)]" />
          <p>{achievement.challenge}</p>
        </div>

        {expanded ? (
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
        ) : null}

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
          type="button"
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

function ExperienceGroup({
  group,
  items,
}: {
  group: ExperienceGroupKey
  items: ExperienceItem[]
}) {
  const isContract = group === 'contractual'

  return (
    <div className="space-y-5">
      {items.length === 0 ? (
        <div className="glass-card p-6 text-sm text-slate-600">
          No experience items configured for this section yet.
        </div>
      ) : null}

      <div className="space-y-4">
        {items.map((job, index) => (
          <motion.article
            key={job.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            custom={index}
            className="glass-card p-5"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  isContract
                    ? 'bg-[var(--night)] text-white'
                    : 'bg-[#14A800]/15 text-[#128200]'
                }`}
              >
                {isContract ? (
                  'Contract'
                ) : (
                  <>
                    <UpworkMark size={14} />
                    Upwork
                  </>
                )}
              </span>
              <h4 className="font-display text-2xl leading-[1.28]">{job.role}</h4>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {job.company}
              </span>
            </div>

            <p className="mb-4 inline-flex items-center gap-2 font-mono-custom text-xs text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {job.period} · {job.location}
            </p>

            <ul className="space-y-2 text-sm text-slate-700">
              {job.bullets.map((bullet, bulletIndex) => (
                <li key={`${job.id}-${bulletIndex}`} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {job.link ? (
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--teal)] hover:underline"
              >
                View project source <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </motion.article>
        ))}
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements)
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent)
  const [experienceView, setExperienceView] = useState<ExperienceGroupKey>('contractual')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBackToTopOnMobile, setShowBackToTopOnMobile] = useState(false)
  const [showHiddenAdmin, setShowHiddenAdmin] = useState(false)
  const [brandTapCount, setBrandTapCount] = useState(0)
  const tapResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const adminRevealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [achievementsResponse, siteContentResponse] = await Promise.all([
          fetch('/api/achievements', { cache: 'no-store' }),
          fetch('/api/site-content', { cache: 'no-store' }),
        ])

        if (achievementsResponse.ok) {
          const achievementsPayload = (await achievementsResponse.json()) as {
            achievements?: unknown
          }
          if (achievementsPayload.achievements) {
            setAchievements(normalizeAchievements(achievementsPayload.achievements))
          }
        }

        if (siteContentResponse.ok) {
          const siteContentPayload = (await siteContentResponse.json()) as {
            siteContent?: unknown
          }
          if (siteContentPayload.siteContent) {
            setSiteContent(normalizeSiteContent(siteContentPayload.siteContent))
          }
        }
      } catch {
        setAchievements(defaultAchievements)
        setSiteContent(defaultSiteContent)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const updateBackToTopState = () => {
      const target = document.getElementById('achievements')
      const threshold = target ? target.offsetTop - 120 : window.innerHeight
      setShowBackToTopOnMobile(window.scrollY > threshold)
    }

    updateBackToTopState()
    window.addEventListener('scroll', updateBackToTopState, { passive: true })
    window.addEventListener('resize', updateBackToTopState)

    return () => {
      window.removeEventListener('scroll', updateBackToTopState)
      window.removeEventListener('resize', updateBackToTopState)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (tapResetTimerRef.current) {
        clearTimeout(tapResetTimerRef.current)
      }
      if (adminRevealTimerRef.current) {
        clearTimeout(adminRevealTimerRef.current)
      }
    }
  }, [])

  const sections = [
    { id: 'achievements', label: 'achievements' },
    { id: 'experience', label: 'experience' },
    { id: 'certifications', label: 'certifications' },
    { id: 'contact', label: 'contact' },
  ]

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return

    const headerOffset = 88
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const nextCount = brandTapCount + 1
    setBrandTapCount(nextCount)

    if (tapResetTimerRef.current) {
      clearTimeout(tapResetTimerRef.current)
    }

    tapResetTimerRef.current = setTimeout(() => setBrandTapCount(0), 1200)

    if (nextCount >= 5) {
      setBrandTapCount(0)
      setShowHiddenAdmin(true)

      if (adminRevealTimerRef.current) {
        clearTimeout(adminRevealTimerRef.current)
      }

      adminRevealTimerRef.current = setTimeout(() => {
        setShowHiddenAdmin(false)
      }, 10000)
    }
  }

  const emailHref = `mailto:${siteContent.profile.email}`
  const experienceTabs: Array<{
    id: ExperienceGroupKey
    label: string
    helper: string
    icon: typeof Building2
    count: number
  }> = [
    {
      id: 'contractual',
      label: 'Contractual CV',
      helper: 'Formal roles',
      icon: Building2,
      count: siteContent.experience.contractual.length,
    },
    {
      id: 'upwork',
      label: 'Upwork',
      helper: 'Project outcomes',
      icon: BriefcaseBusiness,
      count: siteContent.experience.upwork.length,
    },
  ]

  return (
    <div className="relative overflow-x-hidden text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[color:rgba(251,247,241,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <button
            type="button"
            onClick={handleBrandClick}
            className="font-display text-xl leading-[1.28]"
            aria-label="Go to top"
          >
            Sebastian Gomez
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {sections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="rounded-lg px-3 py-2 text-sm font-semibold capitalize text-slate-600 transition-colors hover:bg-black/5 hover:text-black"
              >
                {section.label}
              </button>
            ))}

            {showHiddenAdmin ? (
              <Link
                href="/admin"
                className="ml-2 inline-flex items-center gap-1 rounded-lg border border-black/20 bg-white px-2.5 py-1.5 text-xs font-semibold"
              >
                <Lock className="h-3.5 w-3.5" /> Admin
              </Link>
            ) : null}
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
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className="rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize text-slate-600 hover:bg-black/5"
                >
                  {section.label}
                </button>
              ))}

              {showHiddenAdmin ? (
                <Link
                  href="/admin"
                  className="mt-1 inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold"
                >
                  <Lock className="h-4 w-4" /> Admin
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      <main id="top" className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 md:pt-16">
        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="space-y-6">
            <div className="flex w-full items-center justify-between gap-3 md:justify-start md:gap-8">
              <p className="section-label min-w-0">QA Engineer · Test Automation</p>
              <div className="shrink-0">
                <TopRatedBadge />
              </div>
            </div>

            <h1 className="font-display text-5xl leading-[1.14] md:text-7xl">
              Real QA wins from
              <span className="block text-[var(--tomato)]">production environments.</span>
            </h1>

            <p className="max-w-2xl text-lg text-slate-600">
              {siteContent.profile.headline} {siteContent.profile.intro}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={siteContent.profile.cvUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--night)] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <FileText className="h-4 w-4" /> Download CV
              </a>
              <a
                href={siteContent.profile.upworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#14A800] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <UpworkMark size={16} /> Upwork <ExternalLink className="h-4 w-4" />
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
            <h2 className="font-display text-2xl leading-[1.22]">Quick Snapshot</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--teal)]" /> {siteContent.profile.locationLabel}
              </p>
              {siteContent.quickSnapshot.highlights.map((item, index) => (
                <p key={`${item}-${index}`} className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[var(--tomato)]" /> {item}
                </p>
              ))}
              <a
                href={siteContent.profile.upworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-[var(--teal)] hover:underline"
              >
                <UpworkMark size={15} /> <ExternalLink className="h-4 w-4" /> Upwork profile
              </a>
            </div>

            <div className="border-t border-black/10 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Core stack</p>
              <div className="flex flex-wrap gap-2">
                {siteContent.quickSnapshot.coreStack.map(tool => (
                  <Badge
                    key={tool}
                    className="border-black/10 bg-black/[0.04] px-2.5 py-1 text-xs text-slate-700"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="social-links flex gap-2 pt-2">
              <a
                href={emailHref}
                className="inline-flex rounded-lg border border-black/10 bg-white p-2.5 text-slate-700 transition-colors hover:text-black"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={siteContent.profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg border border-black/10 bg-white p-2.5 text-slate-700 transition-colors hover:text-black"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={siteContent.profile.githubUrl}
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
          <div className="mb-8 space-y-2">
            <p className="section-label">Most Relevant Work</p>
            <h2 className="font-display text-4xl leading-[1.2] md:text-5xl">Client Achievements</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </section>

        <section id="experience" className="scroll-mt-24 pt-16 md:pt-24">
          <p className="section-label">Experience</p>
          <h2 className="mt-2 font-display text-4xl leading-[1.2] md:text-5xl">Professional Timeline</h2>

          <div className="mt-8 space-y-6">
            <div className="glass-card p-2">
              <div className="grid gap-2 sm:grid-cols-2">
                {experienceTabs.map(tab => {
                  const Icon = tab.icon
                  const isActive = experienceView === tab.id

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setExperienceView(tab.id)}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        isActive && tab.id === 'upwork'
                          ? 'border-[#128200] bg-[#14A800] text-white'
                          : isActive
                            ? 'border-transparent bg-[var(--night)] text-white'
                            : 'border-black/10 bg-white text-slate-700 hover:bg-black/[0.03]'
                      }`}
                    >
                      <p className="inline-flex flex-wrap items-center gap-2 text-sm font-semibold">
                        <Icon className="h-4 w-4" />
                        {tab.label}
                        {tab.id === 'upwork' ? <UpworkMark size={14} /> : null}
                        {tab.id === 'upwork' ? <TopRatedMiniBadge onGreen={isActive} /> : null}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          isActive && tab.id === 'upwork'
                            ? 'text-[#ecffe8]'
                            : isActive
                              ? 'text-slate-200'
                              : 'text-slate-500'
                        }`}
                      >
                        {tab.helper} · {tab.count}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <ExperienceGroup
              group={experienceView}
              items={siteContent.experience[experienceView]}
            />
          </div>
        </section>

        <section id="certifications" className="scroll-mt-24 pt-16 md:pt-24">
          <p className="section-label">Learning</p>
          <h2 className="mt-2 font-display text-4xl leading-[1.2] md:text-5xl">Selected Certifications</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {siteContent.certifications.map(cert => (
              <a
                key={cert.id}
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group overflow-hidden transition hover:-translate-y-0.5"
              >
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
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--teal)]">
                    Verify credential <ArrowUpRight className="h-3.5 w-3.5" />
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 pb-8 pt-16 md:pt-24">
          <div className="glass-card rounded-3xl px-6 py-10 text-center md:px-10">
            <p className="section-label">Contact</p>
            <h2 className="mt-2 font-display text-4xl leading-[1.2] md:text-5xl">{siteContent.contact.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-700">
              {siteContent.contact.description}
            </p>
            <div className="social-links mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={siteContent.profile.upworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#14A800] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <UpworkMark size={16} /> <ExternalLink className="h-4 w-4" /> Upwork
              </a>
              <a
                href={emailHref}
                className="inline-flex items-center gap-2 rounded-xl border border-black/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
              <a
                href={siteContent.profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-black/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800"
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
        className={`fixed bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-slate-700 shadow-sm transition-all hover:text-black md:opacity-100 md:pointer-events-auto ${
          showBackToTopOnMobile
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ChevronDown className="h-4 w-4 rotate-180" />
      </button>
    </div>
  )
}
