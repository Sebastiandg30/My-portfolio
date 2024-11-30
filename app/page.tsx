"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Github, Linkedin, Mail, FileText, Plus, Minus, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  return isClient
}

const LazyImage = ({ src, alt, className = '', onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoadingComplete={() => setIsLoading(false)}
      />
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
      const sections = ['about-me', 'skills', 'projects', 'experience', 'education', 'contact']
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
    "Manual Testing", "Automated Testing", "UI Testing", "Responsive testing", "Jest", "JIRA",
    "Agile Methodologies", "CI/CD", "Click Up", "Security testing", "App testing", "Cross-browser Testing", "TestFlight", "API Testing"
  ]

  const allProjects = [
    {
      id: 1, 
      title: 'API Testing with Postman', 
      description: 'Used Postman to validate critical API endpoints by automating tests for HTTP methods (GET, POST, PATCH, DELETE), ensuring reliability, performance, and error handling.', 
      images: ['/0.jpg', '/new-image-1.jpg', '/placeholder.svg?height=400&width=600'],
      githubUrl: 'https://github.com/Sebastiandg30',
      technologies: ['Postman', 'JSON', 'API Testing Frameworks', 'Continuous Integration Tools'],
      features: [
        'Comprehensive test coverage for critical API endpoints.',
        'Verification of data integrity and response consistency.',
        'Automated monitoring and regression testing of endpoints.',
        'Integration with CI/CD pipelines for seamless deployment validation.'
      ]
    },
    {
      id: 2, 
      title: 'Automated Testing with Selenium', 
      description: 'Developed and executed automated functional and regression tests using Selenium and Selenium IDE to ensure web application quality and compatibility across browsers. Integrated testing into the development cycle for efficient defect detection and resolution.', 
      images: ['/selenium.png', '/new-image-1.jpg', '/placeholder.svg?height=400&width=600'],
      githubUrl: 'https://github.com/Sebastiandg30',
      technologies: ['Selenium', 'Selenium IDE', 'JavaScript', 'Cross-Browser Testing Tools'],
      features: [
        'Automated functional and regression testing for a web application.',
        'Cross-browser testing to ensure compatibility across environments.',
        'Reusable and maintainable test scripts.',
        'Integration of automated testing into the development lifecycle.'
      ]
    },
    {
      id: 3, 
      title: 'Mobile App Testing with Appium', 
      description: 'Automated testing for mobile applications using Appium to ensure functionality, performance, and compatibility across Android and iOS devices. Video demo will be added soon.', 
      images: ['/appium-transformed.png', '/new-image-1.jpg', '/placeholder.svg?height=400&width=600'],
      githubUrl: 'https://github.com/Sebastiandg30',
      technologies: ['Appium', 'Java', 'Mobile Testing Frameworks', 'Android & iOS Platforms'],
      features: [
        'Automated functional and regression testing for mobile apps.',
        'Cross-platform testing for Android and iOS devices.',
        'Validation of performance and user experience.',
        'Scalable test scripts for diverse mobile environments.'
      ]
    },
    {
      id: 4, 
      title: 'Behavior-Driven Testing with Cucumber', 
      description: 'Implemented behavior-driven development (BDD) tests using Cucumber to bridge communication between technical and non-technical stakeholders while ensuring software quality.', 
      images: ['/cucumber.png', '/new-image-1.jpg', '/placeholder.svg?height=400&width=600'],
      githubUrl: 'https://github.com/Sebastiandg30',
      technologies: ['Cucumber', 'Gherkin', 'Java', 'Behavior-Driven Development (BDD)'],
      features: [
        'Designed and executed BDD test scenarios with Gherkin syntax.',
        'Improved collaboration between development teams and stakeholders.',
        'Ensured software meets business requirements through clear documentation.',
        'Integrated with test automation frameworks for efficient testing.'
      ]
    },
    {
      id: 5, 
      title: 'Computer Science for Python Programming', 
      description: 'Earned certificates for completing Harvard’s CS50 Introduction to Computer Science and CS50’s Introduction to Programming with Python, gaining a solid foundation in computer science concepts and Python development.', 
      images: ['/python.jpg', '/new-image-1.jpg', '/placeholder.svg?height=400&width=600'],
      githubUrl: 'https://github.com/Sebastiandg30',
      technologies: ['Python', 'C', 'Data Structures', 'Algorithms', 'Web Development Basics'],
      features: [
        'Learned foundational computer science concepts, including algorithms and data structures.',
        'Gained hands-on experience with Python programming for real-world applications.',
        'Explored web development basics, including front-end and back-end concepts.',
        'Completed multiple programming assignments and projects to reinforce learning.'
      ]
    },
    { 
      id: 6, 
      title: 'Continuous Integration Pipeline', 
      description: 'Streamlined CI/CD pipeline implementation, automating build, test, and deployment processes for faster and more reliable software delivery. Video demo will be added soon.', 
      images: ['/Jenkins.png', '/new-image-6.jpg', '/placeholder.svg?height=400&width=600'],
      githubUrl: 'https://github.com/Sebastiandg30',
      technologies: ['Appium', 'Cucumber', 'Java', 'TestNG', 'Jenkins'],
      features: [
        'Designed and managed automated CI/CD pipelines.',
        'Integrated Jenkins with version control systems like Git.',
        'Automated build, test, and deployment workflows.',
      ]
    },
    {
      id: 7, 
      title: 'Application Security Testing with OWASP Tools', 
      description: 'Utilized OWASP tools to identify and mitigate security vulnerabilities in web applications, ensuring compliance with best practices for secure software development.  Video demo will be added soon.', 
      images: ['/owasp.png', '/new-image-1.jpg', '/placeholder.svg?height=400&width=600'],
      githubUrl: 'https://github.com/Sebastiandg30',
      technologies: ['OWASP ZAP', 'Burp Suite', 'Web Security', 'Penetration Testing'],
      features: [
        'Performed security scans to detect vulnerabilities in web applications.',
        'Analyzed application behavior and recommended security improvements.',
        'Ensured compliance with OWASP Top 10 security guidelines.',
        'Conducted penetration testing to identify and mitigate risks.',
        'Enhanced application security through proactive testing.'
      ]
  },
  ]

  const visibleProjects = showAllProjects ? allProjects : allProjects.slice(0, 3)

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
    setSelectedProjectIndex(index)
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
    0: "/Postman.mp4",
    1: "/SeleniumVideo.mp4",
    3: "/Cucumber.mp4",
    4: "/CSvideo.mp4",
  }

  const handleFullScreen = (type: 'image' | 'video', src: string) => {
    setFullScreenContent({ type, src })
    setIsFullScreen(true)
  }

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
                onClick={() => window.open('https://www.linkedin.com/in/sebastiangomez30/', '_blank')}
              >
                Available for projects
              </Button>
            </div>
          </motion.div>
          
          <nav className="hidden md:flex gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex gap-1">
              {['about-me', 'skills', 'projects', 'experience', 'education', 'contact'].map((section) => (
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
                className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md p-4 md:hidden"
              >
                {['about-me', 'skills', 'projects', 'experience', 'education', 'contact'].map((section) => (
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

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 bg-black/90 backdrop-blur-md p-4 md:hidden z-30"
          >
            {['about-me', 'skills', 'projects', 'experience', 'education', 'contact'].map((section) => (
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

      <main className="container mx-auto px-4 pt-32 pb-24 space-y-32">
        <motion.section 
          id="about-me" 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            QA Engineer
          </motion.h2>
          <motion.p 
            className="text-xl mb-4 text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          > 
          I am Sebastian Gómez, a <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent font-medium">QA Engineer</span>, and I ensure quality and intuitive user experiences. After hours, I build my own projects.
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
                <img src="/Flag_of_Venezuela.svg" alt="Flag of Venezuela" width={35} height={30} />
              </p>
              <p className="text-slate-300 dark:text-indigo-300">
                {isClient && currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Caracas' })} UTC-4
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-transparent border-slate-300 dark:border-slate-300 text-slate-300 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-300"
              onClick={() => window.open('/Sebastian Gomez CV.pdf')}
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
          id="skills" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="text-sm bg-white/10 text-gray-300 hover:bg-white/20 transition-colors duration-200"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </motion.section>

        <motion.section 
          id="projects" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          ref={projectsRef}
        >
          <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
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
                    layout="fill"
                    objectFit="cover"
                    className="transition-all duration-300 md:filter md:grayscale md:group-hover:filter-none"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white"
                    onClick={() => handleFullScreen('image', project.images[0])}
                  >
                    <Maximize2 />
                  </Button>
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
          <div className="flex justify-center mt-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                onClick={() => {
                  setShowAllProjects(!showAllProjects)
                  if (showAllProjects) {
                    scrollToSection('projects')
                  }
                }}
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
        </motion.section>
        <motion.section 
          id="experience" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6">Experience</h2>
          <div className="space-y-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Mid QA Engineer</CardTitle>
                <CardDescription className="text-gray-400">NetForemost | 2024 August - Present </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Implemented manual and automated testing strategies, improving testing efficiency across various projects.</li>
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
                <CardTitle className="text-white">QA Engineer</CardTitle>
                <CardDescription className="text-gray-400">Uemura | 2024 January - 2024 July (Part-time)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Created functional and regression automation scripts from test case requirements, reducing manual effort and saving several hours per week.</li>
                  <li>Utilized positive and negative test scenarios for thorough system coverage, leading to an increase in early defect detection and a reduction in critical bugs in production.</li>
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
          <h2 className="text-3xl font-bold mb-6">Education</h2>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Bachelor of Engineering, Computer Science</CardTitle>
              <CardDescription className="text-gray-400">Instituto Universitario de Nuevas Profesiones | 2023 - 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
              Completed two-year study abroad with Instituto Universitario de Nuevas Profesiones University a comprehensive program in Computer Science, focusing on software development, algorithms, and data structures. Gained a strong foundation in programming languages and software engineering principles.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section 
          id="contact" 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6">Contact</h2>
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
          <h2 className="text-1,8xl font-bold mb-6">Tools & Technologies used on this page</h2>
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
                      <div className="aspect-video w-full max-w-[400px] mx-auto overflow-hidden rounded-lg border border-zinc-800">
                        <LazyImage
                          src={allProjects[selectedProjectIndex].images[0]}
                          alt={`${allProjects[selectedProjectIndex].title} preview`}
                          className="w-full h-full"
                          onClick={() => handleFullScreen('image', allProjects[selectedProjectIndex].images[0])}
                        />
                      </div>
                      <div className="aspect-video w-full max-w-[400px] mx-auto overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800/50">
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
                      <h3 className="text-lg font-semibold text-white mb-2">Project Overview</h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {allProjects[selectedProjectIndex].description}
                      </p>
                    </div>
                    
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

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
                      <ul className="list-disc list-inside text-zinc-400">
                        {allProjects[selectedProjectIndex].features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => window.open(allProjects[selectedProjectIndex].githubUrl, '_blank')}
                      className="bg-white text-black hover:bg-gray-200"
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

      <Dialog open={isFullScreen} onOpenChange={(open) => !open && setIsFullScreen(false)}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 bg-black">
          <DialogTitle className="sr-only">Full Screen Content</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {fullScreenContent?.type === 'image' && (
              <Image
                src={fullScreenContent.src}
                alt="Full screen image"
                layout="fill"
                objectFit="contain"
              />
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
  )
}