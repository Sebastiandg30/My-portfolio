"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Github, Linkedin, Mail, FileText, Plus, Minus, X, ChevronLeft, ChevronRight, Terminal, Smartphone, TestTube, GitBranch, Repeat, Shield, Globe, Plane, Network, Search, Activity, ChevronUp } from 'lucide-react'
import Image from "next/image"
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { ClipboardCheck, Target, ListChecks, BarChart3 } from 'lucide-react';

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  return isClient
}

const LazyImage = ({ src, alt, className = '', onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    (<div className={`relative ${className}`} onClick={onClick}>
      <Image
        src={src}
        alt={alt}
        loading="lazy"
        onLoadingComplete={() => setIsLoading(false)}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: "cover"
        }} />
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-zinc-800 animate-pulse flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-zinc-400 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>)
  );
}

const LazyVideo = ({ src, className = '', onClick }: { src: string; className?: string; onClick?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => setIsLoading(false))
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [src])

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-zinc-800 animate-pulse flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-zinc-400 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Component() {

  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSection, setActiveSection] = useState('')
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [fullScreenContent, setFullScreenContent] = useState<{ type: 'image' | 'video'; src: string } | null>(null)
  const [showCertifications, setShowCertifications] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const cursorRef = useRef(null)
  const isClient = useIsClient()
  const projectsRef = useRef(null)

  useEffect(() => {
    if (isClient) {
      setIsMobile(window.innerWidth <= 768)
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768)
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [isClient])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about-me', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY })
        })
      }

      document.addEventListener('mousemove', handleMouseMove)
      return () => document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
      setActiveSection(sectionId)
    }
    setIsMenuOpen(false)
  }

  const skills = [
    { name: "Automated Testing", icon: <Terminal className="w-4 h-4" /> },
    { name: "Jest", icon: <TestTube className="w-4 h-4" /> },
    { name: "Agile Methodologies", icon: <GitBranch className="w-4 h-4" /> },
    { name: "CI/CD", icon: <Repeat className="w-4 h-4" /> },
    { name: "Security testing", icon: <Shield className="w-4 h-4" /> },
    { name: "App testing", icon: <Smartphone className="w-4 h-4" /> },
    { name: "Cross-browser Testing", icon: <Globe className="w-4 h-4" /> },
    { name: "TestFlight", icon: <Plane className="w-4 h-4" /> },
    { name: "API Testing", icon: <Network className="w-4 h-4" /> }
  ]

  const certificates = [
    {
      id: 1,
      title: "CS50's Introduction to Computer Science",
      issuer: "Harvard University",
      date: "2023",
      description: "Comprehensive introduction to computer science and programming.",
      image: "/HarvardX CS50x.jpg"
    },
    {
      id: 2,
      title: "CS50's Introduction to Programming with Python",
      issuer: "Harvard University",
      date: "2023",
      description: "Advanced programming concepts using Python.",
      image: "/HarvardX CS50P.jpg"
    },
    {
      id: 3,
      title: "Computer Science for Python Programming",
      issuer: "Harvard University",
      date: "2024",
      description: "Mastery of computer science fundamentals and Python programming through HarvardX's program",
      image: "/Professional Certificate Optimized.jpg"
    },
    {
      id: 4,
      title: "Master in SQL Server: From Beginner to Professional Level",
      issuer: "Udemy",
      date: "2023",
      description: "Comprehensive mastery of SQL Server, covering database management, querying, and professional-level skills.",
      image: "/SQL (1).jpg"
    },
    {
      id: 5,
      title: "Software Testing from Scratch: All-in-One MasterClass (2023)",
      issuer: "Harvard University",
      date: "2023",
      description: "Complete training in software testing fundamentals, covering manual and automated testing techniques.",
      image: "/TestingMC (1) (3).jpg"
    },
    {
      id: 6,
      title: "English Language Program Certification",
      issuer: "Universidad Central de Venezuela ",
      date: "2024",
      description: "Completion of all eight levels of the English language program, achieving proficiency in English as a foreign language.",
      image: "/CEBA.jpg"
    },
  ];
  

  const allProjects = [
    {
  id: 1,
  title: 'Stage 1: Manual QA Strategy – System Discovery',
  description: 'This project represents the foundational stage of a real QA pipeline. The goal was to simulate the experience of joining a new company or project where no previous QA process exists — requiring full exploration, planning, and documentation from scratch.',
  images: ['/manual-testing.jpg', '/parabank-test-flow.jpg'],
  githubUrl: '',
  technologies: ['Exploratory Testing', 'Test Plan', 'Excel', 'Jira', 'UI Review'],

  features: [
    'Performed <strong>exploratory testing</strong> to understand the application and identify the most critical user flows and risk areas.',
    'Created a <strong>basic Test Plan</strong> defining scope, objectives, environment, tools, and types of tests (functional, UI, usability).',
    'Designed test cases and scenarios using <strong>Excel</strong>, mapping user stories to step-by-step validations.',
    'Executed manual test cases, reporting and categorizing bugs in Jira, including security, UI, and functional issues.',
    'Identified inconsistencies such as <strong>text mismatches</strong> (e.g., “Register” vs “Signing up”), lack of input validation, and critical failures like login restrictions and broken transfers.'
  ],

  result: [
    'Established an initial <strong>QA baseline</strong> for the project, identifying major risks and defining the first testing structure.',
    'Discovered <strong>multiple high-impact bugs</strong> affecting core flows like registration, login, and fund transfers.',
    'Created detailed documentation that can be reused and evolved for future <strong>API and UI automation testing</strong>.',
    'Simulated a real onboarding scenario where a QA joins a project with no prior test coverage and builds everything from the ground up.'
  ]
},
  {
  id: 2,
  title: 'Stage 2: API Validation with Postman',
  description: 'This project simulates the creation of a reliable and reusable API test suite for a real-world application, covering critical endpoints like login and account retrieval. The tests were designed to support CI/CD pipelines by enabling fast feedback on API functionality.',
  images: ['/Postman.jpg'],
  githubUrl: '',
  technologies: ['Postman', 'Swagger', 'JSON', 'CI/CD', 'Environment Variables'],

  features: [
    'Created a <strong>modular Postman collection</strong> covering critical flows like user login and account access using parameterized requests.',
    'Designed automated tests that validate <strong>status codes</strong>, extract values from XML responses, and assert key fields like customer ID.',
    'Utilized <strong>Swagger documentation</strong> to understand request structures, response formats, and authentication methods.',
    'Implemented <strong>Postman scripting</strong> to handle XML-to-JSON conversion and environment variable injection for chained requests.',
    'Prepared the test collection for integration into a <strong>CI/CD pipeline</strong> to enable automatic API validation on changes to staging or main branches.'
  ],

  result: [
    'Built a <strong>reusable and scalable</strong> API testing foundation for future regression coverage.',
    'Enabled automated validation of key API behaviors with <strong>zero manual input</strong>, reducing testing time dramatically.',
    'Demonstrated how consistent and well-structured API tests can <strong>increase backend stability</strong> and developer confidence.',
    'Positioned the QA process for future <strong>comprehensive API coverage</strong> as the application grows.'
  ]
},
 {
  id: 3,
  title: 'Stage 3: Performance Testing with JMeter',
  description: 'This project introduces a basic yet realistic performance test to simulate multiple users interacting with a backend endpoint concurrently. The goal is to identify how the system behaves under load and to surface potential performance issues early in development.',
  images: ['/Jmeter.png'],
  githubUrl: '',
  technologies: ['JMeter', 'Load Testing', 'Summary Report', 'Thread Group'],

  features: [
    'Configured a <strong>Thread Group</strong> of 20 virtual users running for 30 seconds with a controlled ramp-up time.',
    'Simulated high concurrency by sending parallel <strong>HTTP GET requests</strong> to a login endpoint with test credentials.',
    'Used listeners such as <strong>Summary Report</strong> and <strong>View Results in Table</strong> to analyze latency, throughput, and error rates.',
    'Focused on detecting response time delays, failed requests, and system saturation during short bursts of high activity.',
    'Test configuration designed to be reusable and extendable for future stress or endurance scenarios.'
  ],

  result: [
    'Successfully simulated <strong>high user load</strong> and observed backend behavior under pressure.',
    'Identified the importance of setting realistic ramp-up periods and thread lifetime to replicate real-world user access patterns.',
    'Set a foundation for performance monitoring that helps mitigate the risk of <strong>server overload or API timeouts</strong> in production.',
    'Highlighted how performance tests fit naturally as a middle layer between API validation and full UI testing.'
  ]
},
   {
  id: 4,
  title: 'Stage 4: UI Automation with Selenium',
  description: 'This project focuses on automating the most critical user flows of the ParaBank application through a modular and maintainable Selenium framework. It simulates real-world practices like regression testing and CI integration after each code push.',
  images: ['/selenium.webp'],
  githubUrl: '',
  technologies: ['Selenium', 'Python', 'Pytest', 'POM', 'GitHub Actions'],

  features: [
    'Set up a dedicated automation folder structure using <strong>virtual environments</strong> to isolate dependencies.',
    'Developed a <strong>Page Object Model (POM)</strong> structure with `pages/` and `tests/` folders to keep logic and execution clean and maintainable.',
    'Built a UI test for the login flow using <strong>Pytest + Selenium WebDriver</strong>, validating visible page elements after login.',
    'Used <strong>GitHub Actions</strong> to run UI tests automatically after pushes to staging/main branches.',
    'Detected a critical issue where the <strong>UI login fails despite a 200 response from the API</strong>, proving that backend success doesn’t guarantee frontend integrity.'
  ],

  result: [
    'Created a <strong>scalable UI automation framework</strong> that supports future test cases and components.',
    'Exposed a real application bug through <strong>automated UI regression</strong>, enabling better coverage than API testing alone.',
    'Reinforced the value of frontend testing by detecting inconsistencies invisible to API layers.',
    'Showcased automation skills aligned with modern QA practices including <strong>CI/CD pipelines and structured design patterns</strong>.'
  ]
},
  ] 
  const filteredProjects = allProjects.filter(project => {
    if (selectedFilter === 'all') return true;
    return project.technologies.some(tech => 
      tech.toLowerCase().includes(selectedFilter.toLowerCase())
    );
  });

  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 3);

  const tools = [
    { 
      name: "Next.js", 
      icon: (
        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <mask id="mask0_408_134" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
            <circle cx="90" cy="90" r="90" fill="black"/>
          </mask>
          <g mask="url(#mask0_408_134)">
            <circle cx="90" cy="90" r="90" fill="black"/>
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)"/>
            <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)"/>
          </g>
            <defs>
            <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="180.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="126.875" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            </defs>
        </svg>
      )
    },
    { 
      name: "React", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5">
          <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
          <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      )
    },
    { 
      name: "Tailwind CSS", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 54 33" className="w-5 h-5">
          <g clipPath="url(#prefix__clip0)">
            <path fill="#38bdf8" fillRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" clipRule="evenodd"/>
          </g>
          <defs>
            <clipPath id="prefix__clip0">
              <path fill="#fff" d="M0 0h54v32.4H0z"/>
            </clipPath>
          </defs>
        </svg>
      )
    },
    { 
      name: "TypeScript", 
      icon: (
        <svg fill="none" height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path clipRule="evenodd" d="m23.4 0h-22.8c-.3 0-.6.3-.6.6v22.8c0 .3.3.6.6.6h22.8c.3 0 .6-.3.6-.6v-22.8c0-.3-.3-.6-.6-.6zm-11.6 12.7v2.5c.4.2.9.3 1.4.4s1 .1 1.5.1c.5 0 1 0 1.5-.1s.9-.3 1.3-.5c.4-.2.7-.5.9-.9s.4-.8.4-1.4c0-.4-.1-.7-.2-1s-.3-.5-.5-.7-.5-.4-.8-.6-.6-.3-1-.5c-.3-.1-.5-.2-.7-.3s-.4-.2-.5-.3-.2-.2-.3-.3-.1-.2-.1-.3c0-.1 0-.2.1-.3s.1-.2.3-.3.3-.1.5-.2.4-.1.7-.1c.2 0 .4 0 .6.1s.4.1.7.2.4.2.7.3.4.3.6.4v-2.3c-.4-.1-.8-.2-1.2-.3s-.9-.1-1.4-.1c-.5 0-1 .1-1.5.2s-.9.3-1.3.5-.7.6-.9.9-.4.9-.4 1.4c0 .4.1.7.2 1s.3.5.5.7.5.4.8.5c.3.2.6.3.9.4.3.1.6.2.8.3s.4.2.5.3.2.2.3.3.1.2.1.3c0 .1 0 .2-.1.3s-.2.2-.3.3-.3.1-.6.2-.5.1-.8.1c-.5 0-.9-.1-1.4-.2s-.9-.4-1.3-.7zm-4.4-2.9h2.3v-2.1h-7.3v2.1h2.3v7.3h2.7z" fill="#3178c6" fillRule="evenodd"/>
        </svg>
      )
    },
    { 
      name: "Framer Motion", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path d="M4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4C0 1.79086 1.79086 0 4 0Z" fill="#3B3B3B"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 5.33333H5.33333V12H12V18.6667H18.6667V12H12V5.33333Z" fill="white"/>
        </svg>
      )
    },
  ]

  const openProjectDialog = (index: number) => {
    const actualIndex = allProjects.findIndex(project => project.id === visibleProjects[index].id);
    setSelectedProjectIndex(actualIndex);
  }

  const closeProjectDialog = () => {
    setSelectedProjectIndex(null)
  }

  const navigateProject = (direction: 'prev' | 'next') => {
    if (selectedProjectIndex === null) return
    const newIndex = direction === 'prev' 
      ? (selectedProjectIndex - 1 + allProjects.length) % allProjects.length
      : (selectedProjectIndex + 1) % allProjects.length
    setSelectedProjectIndex(newIndex)
  }


  const projectVideos: { [key: number]: string } = {
    0: "/ManualTesting.mp4",
    1: "/Postman.mp4",
    2: "/Jmeter.mp4",
    3: "/Selenium.mp4",
  }

  const handleFullScreen = (type: 'image' | 'video', src: string) => {
    setFullScreenContent({ type, src })
    setIsFullScreen(true)
  }

  const filters = [
    { id: 'all', label: 'All', icon: <Search className="w-4 h-4" /> },
    { id: 'Test Plan', label: 'Manual Testing', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'Postman', label: 'API Testing', icon: <Network className="w-4 h-4" /> },
    { id: 'JMeter', label: 'Performance', icon: <Activity className="w-4 h-4" /> },
    { id: 'Selenium', label: 'UI Automation', icon: <Terminal className="w-4 h-4" /> },
  ]

  return (
  <div className={`min-h-screen bg-black text-white relative z-10 ${
      isMobile ? 'bg-[radial-gradient(ellipse_80%_100%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]' :
        ''
    }`}>
      {!isMobile && (
        <motion.div
          ref={cursorRef}
          className="fixed w-[600px] h-[600px] pointer-events-none z-0"
          style={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{
            type: "tween",
            ease: "linear",
            duration: 0
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute inset-[30%] bg-purple-500/20 rounded-full blur-3xl" />
          </div>
        </motion.div>
      )}
      <header className="fixed w-full top-0 z-40 px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            animate={{ opacity: [0, 1], y: [10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative inline-flex items-center">
              <motion.div 
                className="absolute left-3 w-2 h-2 bg-emerald-300 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Button 
                variant="outline" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-full pl-8 pr-6 py-2 shadow-lg"
                onClick={() => window.open('https://www.upwork.com/freelancers/~01797400cf1c137fb1', '_blank')}
              >
                Available for projects
              </Button>
            </div>
          </motion.div>
          
          <nav className="hidden md:flex gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex gap-1">
              {['projects', 'skills', 'experience', 'education', 'certifications', 'contact'].map((section) => (
                <Button
                  key={section}
                  variant="ghost"
                  size="sm"
                  className={`text-sm text-gray-300 hover:text-black rounded-full px-4 py-2 transition-colors ${
                    activeSection === section ? 'bg-white/20' : ''
                  }`}
                  onClick={() => scrollToSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
                </Button>
              ))}
            </div>
          </nav>

          <Button
            className="md:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </Button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-[72px] left-0 right-0 bg-black/90 backdrop-blur-md p-4 md:hidden z-30"
              >
                {['skills', 'projects', 'experience', 'education', 'certifications', 'contact'].map((section) => (
                  <Button
                    key={section}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left text-gray-300 hover:text-white py-2"
                    onClick={() => scrollToSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-sm text-gray-400">
            {isClient && currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Caracas' })}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 pt-32 pb-24 space-y-32">
        <motion.section 
          id="about-me" 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-4xl font-bold mb-4 leading-tight text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
           Building Reliable Digital Products
          </motion.h2>
          <motion.p 
            className="text-xl mb-4 text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          > 
       I create <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent font-medium">robust</span> testing strategies and automation frameworks to ensure digital products are functional, secure, and trustworthy.
          </motion.p>
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="border-t border-b border-indigo-300 dark:border-indigo-700 py-2 my-2">
              <p className="text-slate-300 dark:text-indigo-300 flex items-center justify-center gap-2">
                Located in Caracas, Venezuela 
                <Image src="/Flag_of_Venezuela.svg" alt="Flag of Venezuela" width={35} height={30} />
              </p>
              <p className="text-slate-300 dark:text-indigo-300">
                {isClient && currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Caracas' })} UTC-4
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-transparent border-slate-300 dark:border-slate-300 text-slate-300 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-300"
              onClick={() => window.open('/CV Sebastian Gómez.pdf')}
            >
              <FileText className="w-4 h-4" />
              Download CV
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="mailto:sebasdgg3001@gmail.com" 
                    className="text-slate-300 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-white flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    sebasdgg3001@gmail.com
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to send me an email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <ChevronDown className="mx-auto animate-bounce text-gray-400" size={32} />
          </motion.div>
        </motion.section>


        <motion.section 
          id="projects" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          ref={projectsRef}
        >
          <h2 className="text-3xl font-bold mb-4 text-center">Complete QA Pipeline: From Manual Testing to Full Automation</h2>
          <h2 className="text-1xl mb-8 text-center">This project series walks through a realistic, step-by-step QA process — starting from manual exploration and evolving into automated API, performance, and UI testing. Together, they form a complete testing pipeline for scalable and reliable software delivery.</h2>
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${
                  selectedFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/5 text-gray-400 hover:bg-white'
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.icon}
                {filter.label}
              </Button>
            ))}
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative group"
                whileHover={isMobile ? {} : { scale: 1.05 }}
              >
                <Card className="overflow-hidden bg-white/5 border-white/10 h-full flex flex-col">
                  <CardHeader className="p-0 aspect-video relative overflow-hidden">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      className="transition-all duration-300 md:filter md:grayscale md:group-hover:filter-none"
                      fill
                      sizes="100vw"
                      style={{
                        objectFit: "cover"
                      }} /> 
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <CardTitle className="text-white mb-2">{project.title}</CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button onClick={() => openProjectDialog(index)} className="bg-white/10 hover:bg-white/20 text-white">
                      View More
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          {filteredProjects.length > 3 && (
            <div className="flex justify-center mt-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold"
                >
                  {showAllProjects ? (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Minus size={24} />
                    </motion.div>
                  ) : (
                    <Plus size={24} />
                  )}
                </Button>
              </motion.div>
            </div>
          )}
        </motion.section>

        <motion.section 
          id="skills" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge 
                key={skill.name} 
                variant="secondary" 
                className="text-sm bg-white/10 text-gray-300 hover:bg-white/20 transition-colors duration-200 flex items-center gap-2"
              >
                {skill.icon}
                {skill.name}
              </Badge>
            ))}
          </div>
        </motion.section>

      <motion.section 
          id="experience" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Experience</h2>
          <div className="space-y-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">QA Engineer</CardTitle>
                <CardDescription className="text-gray-400">3MIT | 04/2025 - Present (Full-Time)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                   <li>Execute manual testing for customized Odoo-based ERP solutions tailored to national and international clients across various industries.</li>
                   <li>Lead testing of finance-heavy modules, including invoicing and accounting workflows, ensuring compliance with client-specific and local tax regulations.</li>
                   <li>Validate modifications across various Odoo modules such as Contacts, Accounting, Sales, Purchases, and Portal User Management.</li>
                   <li>Perform functional, regression, and exploratory testing to verify business logic, user flows, and system behavior after client-driven changes.</li>
                   <li>Handle real business data in CSV, xlsx, XML, and PDF formats to validate accuracy, expected structure, and proper integration across systems.</li>
                   <li>Create and maintain detailed test cases based on client specifications and existing functionality; flag and document issues for the development team.</li>
                   <li>Contribute to process improvement by adapting QA strategies to the dynamic nature of ERP customization for large-scale business operations.</li>
                </ul>
              </CardContent>
               </Card>
               <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">QA Engineer/Business Analyst</CardTitle>
                <CardDescription className="text-gray-400">Salmonlabs| 05/2025 - 08/2025 (Full-Time)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                   <li>Collect, enrich, and verify targeted contacts/companies per client criteria using LinkedIn Sales Navigator, Google, company sites, directories, registries, and news.</li>
                   <li>Build repeatable extraction pipelines (API calls/scraping → parsing → QC → delivery) and track progress/SLAs.</li>
                   <li>Apply ChatGPT API and other AI to review script flags, distinguish false positives/edge cases, and speed review cycles.</li>
                   <li>Process large CSV/XLSX datasets: enforce schema, clean, dedupe, normalize, and reconcile conflicting fields.</li>
                   <li>Use Postman to hit endpoints, trigger/monitor automated runs, inspect logs, and triage failures/timeouts.</li>
                   <li>Write and maintain Python scripts to automate ingestion, transforms, and validations; generate audit-ready reports.</li>
                   <li>Contribute to process improvement by adapting QA strategies to the dynamic nature of ERP customization for large-scale business operations.</li>
                </ul>
              </CardContent>
               </Card>
               <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">QA Automation Engineer</CardTitle>
                <CardDescription className="text-gray-400">Netforemost| 08/2024 - 04/2025 (Full-time)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Implemented Test-Driven Development (TDD) in projects to enhance code quality and ensure robust test coverage.</li>
                    <li>Developed and maintained automated scripts using Selenium for functional and regression tests, significantly reducing manual testing effort.</li>
                    <li>Conducted system, regression, and exploratory testing to ensure business functionality and interoperability.</li>
                    <li>Performed API testing using Postman (PATCH, GET, POST, DELETE), increasing early defect detection and reducing production issues.</li>
                    <li>Validated test environments, generated reports, and classified software quality issues, leading to a more streamlined testing process.</li>
                    <li>Worked on several projects, ensuring efficient testing processes and adaptability to varying project needs.</li>
                    <li>Regularly communicated with American Product Owners (POs) and clients during demos and daily standups in English, fostering clear understanding and alignment on project goals.</li>
                </ul>
              </CardContent>
            </Card>
               <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Manual & Automation QA Tester</CardTitle>
                <CardDescription className="text-gray-400">Uemura | 01/2024 - 08/2024 (Part-time)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Took a buggy and problematic production environment and worked on delivering a more stable and reliable version, improving overall system performance and user satisfaction.</li>
                    <li>Utilized positive and negative test scenarios for thorough system coverage, leading to an increase in early detection and a reduction in critical bugs in production.</li>
                    <li>Developed and maintained scalable test automation frameworks and manual testing processes, reducing testing time.</li>
                    <li>Triaged, diagnosed, reported, tracked, and resolved software quality issues.</li>
                    <li>Communicated actively across multiple teams, ensuring cohesion and collaboration, which improved team productivity and reduced project delivery time.</li>
                </ul>
              </CardContent>
            </Card>
            
          </div>
        </motion.section>
        
        <motion.section 
          id="education" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Education</h2>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Bachelor of Engineering, Computer Science</CardTitle>
              <CardDescription className="text-gray-400">Instituto Universitario de Nuevas Profesiones | 2023 - 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Completed two-year study abroad with Instituto Universitario de Nuevas Profesiones University a comprehensive program in Computer Science, focusing on software development, algorithms, and data structures. Gained a strong foundation in programming languages and software engineering principles.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section 
        id="certifications" 
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <h2 className="text-3xl font-bold">Certifications</h2>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowCertifications(!showCertifications)}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200"
          >
            {showCertifications ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </Button>
        </div>
        <AnimatePresence>
          {showCertifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden" // Add this class
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert) => (
                  <motion.div
                    key={cert.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="overflow-hidden bg-white/5 border-white/10 h-full flex flex-col">
                      <CardHeader className="p-0 relative overflow-hidden h-[250px] md:h-[282px]">
                        <Image
                          src={cert.image}
                          alt={cert.title}
                          className="transition-all duration-300 md:filter md:grayscale md:group-hover:filter-none"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{
                            objectFit: "cover"
                          }}
                        />
                      </CardHeader>
                      <CardContent className="p-4 flex-1">
                        <CardTitle className="text-white mb-2">{cert.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {cert.issuer} | {cert.date}
                        </CardDescription>
                        <p className="mt-2 text-sm text-gray-300">{cert.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>


      <motion.section 
          id="contact" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Contact</h2>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <motion.div 
                  className="flex items-center gap-4 w-full md:w-auto group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-white/10 p-3 rounded-full transition-colors group-hover:bg-blue-500/20">
                    <Mail className="w-6 h-6 text-gray-400 transition-colors group-hover:text-blue-500" />
                  </div>
                  <a 
                    href="mailto:sebasdgg3001@gmail.com" 
                    className="text-gray-300 transition-colors group-hover:text-blue-500 relative"
                  >
                    sebasdgg3001@gmail.com
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </a>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-4 w-full md:w-auto group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-white/10 p-3 rounded-full transition-colors group-hover:bg-[#0077B5]/20">
                    <Linkedin className="w-6 h-6 text-gray-400 transition-colors group-hover:text-[#0077B5]" />
                  </div>
                  <a 
                    href="https://www.linkedin.com/in/sebastiangomez30/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 transition-colors group-hover:text-[#0077B5] relative"
                  >
                    LinkedIn Profile
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0077B5] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </a>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-4 w-full md:w-auto group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-white/10 p-3 rounded-full transition-colors group-hover:bg-white/20">
                    <Github className="w-6 h-6 text-gray-400 transition-colors group-hover:text-white" />
                  </div>
                  <a 
                    href="https://github.com/Sebastiandg30" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 transition-colors group-hover:text-white relative"
                  >
                    GitHub Profile
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </a>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-1,8xl font-bold mb-6 text-center">Tools & Technologies used on this page</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {tool.icon}
                <span className="text-sm text-gray-300">{tool.name}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
      <Dialog open={selectedProjectIndex !== null} onOpenChange={closeProjectDialog}>
        <DialogContent className="max-w-[95vw] md:max-w-[80vw] w-full max-h-[78vh] h-full overflow-y-auto bg-zinc-900 text-white border border-zinc-800">
          {selectedProjectIndex !== null && (
            <div className="flex flex-col h-full">
              <DialogHeader className="border-b border-zinc-800 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white">
                      {allProjects[selectedProjectIndex].title}
                    </DialogTitle>
                 
                  </div>
                </div>
              </DialogHeader>
              
              <div className="flex-grow overflow-y-auto py-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <div className="space-y-4">
                      <div className="aspect-video w-full max-w-[400px] mx-auto overflow-hidden rounded-lg border border-zinc-800 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                        <LazyImage
                          src={allProjects[selectedProjectIndex].images[0]}
                          alt={`${allProjects[selectedProjectIndex].title} preview`}
                          className="w-full h-full"
                        />
                      </div>
                     <div className="aspect-video w-full max-w-[400px] mx-auto overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800/50 transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                        {projectVideos[selectedProjectIndex] ? (
                          <LazyVideo
                            src={projectVideos[selectedProjectIndex]}
                            className="w-full h-full"
                            onClick={() => handleFullScreen('video', projectVideos[selectedProjectIndex])}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <span className="text-zinc-400">No video available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 space-y-6 px-4">
  <div>
    <h3 className="flex items-center text-lg font-semibold text-white mb-2">
      <Target className="h-5 w-5 mr-2 text-blue-400" />
      Challenge
    </h3>
    {/* AÑADIMOS CLASES DE BLOCKQUOTE PARA ESTILO */}
    <p className="text-zinc-400 leading-relaxed border-l-4 border-blue-400 pl-4 italic text-sm">
      {allProjects[selectedProjectIndex].description}
    </p>
  </div>
  
  <div>
    <h3 className="flex items-center text-lg font-semibold text-white mb-2">
      <ListChecks className="h-5 w-5 mr-2 text-green-400" />
      Process
    </h3>
    <ul className="list-disc list-inside text-zinc-400 space-y-2 text-sm">
      {/* USAMOS dangerouslySetInnerHTML PARA RENDERIZAR LAS NEGRITAS */}
      {allProjects[selectedProjectIndex].features.map((feature, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: feature }} />
      ))}
    </ul>
  </div>

  {/* Verificamos si la propiedad 'result' existe antes de mostrarla */}
  {allProjects[selectedProjectIndex].result && (
    <div>
      <h3 className="flex items-center text-lg font-semibold text-white mb-2">
        <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
        Result
      </h3>
      <ul className="list-disc list-inside text-zinc-400 space-y-2 text-sm">
        {/* USAMOS dangerouslySetInnerHTML AQUÍ TAMBIÉN */}
        {allProjects[selectedProjectIndex].result.map((res, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: res }} />
        ))}
      </ul>
    </div>
  )}

  <div>
    <h3 className="text-lg font-semibold text-white mb-2">Technologies Used</h3>
    <div className="flex flex-wrap gap-2">
      {allProjects[selectedProjectIndex].technologies.map((tech) => (
        <Badge key={tech} variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
          {tech}
        </Badge>
      ))}
    </div>
  </div>

  <Button 
    onClick={() => window.open(allProjects[selectedProjectIndex].githubUrl, '_blank')}
    className="bg-white text-black hover:bg-gray-200 w-full"
  >
    <Github className="mr-2 h-4 w-4" />
    View on GitHub
  </Button>
</div>

                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => navigateProject('prev')}
                  className="bg-white text-black hover:bg-gray-200 border-0 transition-colors"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigateProject('next')}
                  className="bg-white text-black hover:bg-gray-200 border-0 transition-colors"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isFullScreen} onOpenChange={(open: boolean) => !open && setIsFullScreen(false)}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 bg-black">
          <DialogTitle className="sr-only">Full Screen Content</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {fullScreenContent?.type === 'image' && (
              <Image
                src={fullScreenContent.src}
                alt="Full screen image"
                fill
                sizes="100vw"
                style={{
                  objectFit: "contain"
                }} />
            )}
            {fullScreenContent?.type === 'video' && (
              <video
                src={fullScreenContent.src}
                className="w-full h-full object-contain"
                autoPlay
                loop
                controls
              />
            )}
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-10000 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4 text-white" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

