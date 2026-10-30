"use client"

import { useEffect, useState, type FormEvent } from "react"
import { sendEmail as sendEmailJS } from "../src/services/emailService"
import LandingHero from "@/components/landing-hero"

const PORTRAIT = "/483c47cd-8bb8-47da-8d0a-f3f726313005 - Edited.png"
const RESUME = "/S_Abhinav_Rishi_Resume.pdf"
const GITHUB = "https://github.com/Abhinav6305"

/* ------------------------------------------------------------------ content */

const DESCRIPTORS = [
  "Coder",
  "AI Engineer",
  "Full-Stack Developer",
  "UI/UX Designer",
  "Problem Solver",
  "Hackathon Runner-up",
  "Product Thinker",
  "Graphic Designer",
  "Video Editor",
  "Lifelong Learner",
]

const EDUCATION = [
  {
    level: "B.TECH",
    degree: "Bachelor of Technology — Computer Science & Engineering",
    school: "St. Peter's Engineering College, Hyderabad",
    score: "",
    scoreLabel: "",
    when: "3rd Year · Pursuing",
    detail: "Focus areas: Artificial Intelligence, Machine Learning and Full Stack Development.",
    current: true,
  },
  {
    level: "INTERMEDIATE",
    degree: "Intermediate (Class XII)",
    school: "Trividya Junior College",
    score: "92%",
    scoreLabel: "Scored",
    when: "Completed",
    detail: "",
    current: false,
  },
  {
    level: "SSC",
    degree: "Secondary School Certificate (Class X)",
    school: "Bhashyam High School",
    score: "95%",
    scoreLabel: "Scored",
    when: "Completed",
    detail: "",
    current: false,
  },
]

const STRENGTHS = [
  "Building products end to end, from idea to launch",
  "Translating complex problems into simple, usable AI tools",
  "Fast learner, with certifications across AI, development and security",
  "Visual communication through design and video",
]

type Cat = "AI / ML" | "Full Stack" | "Upcoming"
const FILTERS: ("All" | Cat)[] = ["All", "AI / ML", "Full Stack", "Upcoming"]

const PROJECTS: {
  id: string
  name: string
  tag: string
  desc: string
  stack: string[]
  status: string
  cats: Cat[]
  img: string
  href?: string
}[] = [
  {
    id: "01",
    name: "Veixon Co-Founders",
    tag: "AI planning assistant",
    desc: "Takes a raw idea all the way to early execution: it validates the idea and surfaces risks and gaps, turns it into a 90-day roadmap, simulates the hard decisions and tracks progress on an accountability dashboard.",
    stack: ["AI / LLM workflows", "Web dashboard", "Vercel"],
    status: "Live",
    cats: ["AI / ML", "Full Stack"],
    img: "/veixon-cofounders.png",
    href: "https://veixon-cofounders.vercel.app",
  },
  {
    id: "02",
    name: "EcoConnect AI",
    tag: "AI waste management",
    desc: "One loop, three portals. Citizens scan and upload waste, verified industries claim the material they need, and delivery agents get batched bulk pickups by area. Placed top 5 at the India–Japan Innovation Hackathon.",
    stack: ["AI image reporting", "WebGL", "Role-based web app"],
    status: "Top 5 · Hackathon",
    cats: ["AI / ML", "Full Stack"],
    img: "/ecoconnect-ai.png",
  },
  {
    id: "03",
    name: "VISIONIX Decisions",
    tag: "AI business intelligence",
    desc: "A business-intelligence platform that pairs predictive analytics with intelligent automation, turning raw business data into forward-looking recommendations.",
    stack: ["Python", "Machine Learning", "Predictive Analytics", "Full Stack"],
    status: "In development",
    cats: ["AI / ML", "Full Stack"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "04",
    name: "Chakravyuh",
    tag: "AI fraud detection",
    desc: "Named after the Mahabharata's labyrinth formation. Machine learning and behavioural analysis trace suspicious activity ring by ring and flag anomalies before they turn into losses.",
    stack: ["Machine Learning", "Pattern Detection", "Behavioural Analytics"],
    status: "Security",
    cats: ["AI / ML"],
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Vf7EII799k2PQfR4nm1SR3q2ZzdJRA.png",
  },
  {
    id: "05",
    name: "Veixon AI",
    tag: "Decision-support AI",
    desc: "A human-brain-inspired AI system designed to support decision-making, with long-term memory and a knowledge layer.",
    stack: ["AI systems", "Decision support", "Memory & knowledge"],
    status: "In development",
    cats: ["AI / ML"],
    img: "/veixon-ai.png",
  },
  {
    id: "06",
    name: "IntelliRecipe",
    tag: "AI recipe generator",
    desc: "Opens the fridge and asks what you have. Generates personalised recipes from your ingredients, your taste preferences and your dietary needs.",
    stack: ["AI", "Machine Learning", "Full Stack"],
    status: "Project",
    cats: ["AI / ML", "Full Stack"],
    img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "07",
    name: "#DFA2Z",
    tag: "AI drone services",
    desc: "Taking AI to the skies: an AI-based drone service platform for aerial solutions and intelligent automation across industries.",
    stack: ["Drones", "Aerial AI", "Automation"],
    status: "Upcoming",
    cats: ["Upcoming"],
    img: "/dfa2z-drone.jpg",
  },
]

const SKILL_GROUPS = [
  { name: "Languages", items: ["Python", "Java", "C++", "JavaScript", "TypeScript"] },
  { name: "Web & Frameworks", items: ["React", "Next.js", "Flask", "Three.js", "Tailwind CSS", "REST APIs"] },
  {
    name: "AI / ML",
    items: ["Machine Learning", "Generative AI", "LLMs & Prompt Engineering", "AI Agents", "Predictive Analytics", "Anomaly Detection", "Edge AI (Jetson Nano)"],
  },
  { name: "Cloud & Tools", items: ["Firebase", "Vercel", "AWS (fundamentals)", "Git & GitHub"] },
  { name: "Design & Product", items: ["UI/UX Design", "Product Design", "System Design", "Design Thinking"] },
  { name: "Creative", items: ["Canva", "Adobe Photoshop", "DaVinci Resolve", "Typing · 67 WPM"] },
]
const SKILLS = SKILL_GROUPS.flatMap((g) => g.items)

const EXPERIENCE = [
  {
    role: "UI / UX Design Intern",
    org: "FlyRank AI",
    when: "Jul 2026 – Nov 2026 · 20 weeks",
    current: true,
    detail:
      "Selected for FlyRank AI's July 2026 internship program in the UI / UX Design track. Designing interfaces and user experiences for AI-driven products.",
    tags: ["UI/UX Design", "AI products", "Product Design"],
  },
]

const CERTS = [
  {
    name: "Introduction to Machine Learning",
    kind: "course",
    org: "AWS Training & Certification",
    date: "May 2026",
    detail:
      "Core ML concepts — supervised vs unsupervised learning, the end-to-end ML lifecycle (data prep, training, evaluation, deployment) and applying ML to business problems on AWS.",
    href: "/certifications/aws-introduction-to-machine-learning.pdf",
  },
  {
    name: "Beyond Agentic",
    kind: "event",
    org: "Microsoft AI Innovators Hub",
    date: "Oct 2026",
    detail: "Certificate of appreciation for participating in the Beyond Agentic event at Microsoft Campus, Hyderabad.",
    href: "/certifications/microsoft-beyond-agentic.png",
  },
  {
    name: "Google Student Ambassador Pitch Night",
    kind: "event",
    org: "Google Student Ambassador Program",
    date: "May 2026",
    detail: "Certificate of participation recognizing creativity and contribution at Pitch Night Edition.",
    href: "/certifications/google-student-ambassador-pitch-night.png",
  },
  {
    name: "AI Hackathon — Runner-up",
    kind: "event",
    org: "Bower School of Entrepreneurship & STUDLYF",
    date: "May 2026",
    detail: "Runner-up team recognition at the AI Hackathon held at Meridian School.",
    href: "/certifications/bower-ai-hackathon-runner-up.pdf",
  },
  {
    name: "Introduction to Modern AI",
    kind: "course",
    org: "Cisco Networking Academy",
    date: "May 2026",
    detail: "Course completion covering AI and machine learning fundamentals, computer vision, language translation and large language models.",
    href: "/certifications/cisco-introduction-to-modern-ai.pdf",
  },
  {
    name: "ChatGPT Generative AI for Business Leaders",
    kind: "course",
    org: "Udemy",
    date: "May 2026",
    detail: "Completed the Gen AI Primer course for business leaders.",
    href: "/certifications/udemy-chatgpt-generative-ai-business-leaders.pdf",
  },
  {
    name: "Introduction to Generative AI and Agents",
    kind: "course",
    org: "Microsoft Learn",
    date: "May 2026",
    detail: "Microsoft Learn achievement for completing the introduction to generative AI and agents.",
    href: "/certifications/microsoft-learn-generative-ai-agents.pdf",
  },
  {
    name: "Explore AI Basics",
    kind: "course",
    org: "Microsoft Learn",
    date: "May 2026",
    detail: "Microsoft Learn achievement for completing the Explore AI basics learning path.",
    href: "/certifications/microsoft-learn-ai-basics.pdf",
  },
  {
    name: "Introduction to AI Concepts",
    kind: "course",
    org: "Microsoft Learn",
    date: "May 2026",
    detail: "Microsoft Learn achievement for completing the Introduction to AI concepts learning path.",
    href: "/certifications/microsoft-learn-ai-concepts.pdf",
  },
  {
    name: "Java DSA Course — Fundamentals and Beyond",
    kind: "course",
    org: "Scaler Topics",
    date: "May 2026",
    detail: "Completed a Java data structures and algorithms course covering 94 video tutorials, 12 modules and 7 challenges.",
    href: "/certifications/scaler-java-dsa.png",
  },
  {
    name: "Generative AI Mastermind",
    kind: "course",
    org: "Outskill",
    date: "2026",
    detail: "Certificate of completion for the Generative AI Mastermind program.",
    href: "/certifications/outskill-generative-ai-mastermind.pdf",
  },
  {
    name: "Claude 101",
    kind: "course",
    org: "Anthropic",
    date: "2026",
    detail: "Completed Anthropic's Claude 101 course.",
    href: "/certifications/claude-101.jpg",
  },
  {
    name: "Summer Hackathon 2026",
    kind: "event",
    org: "SpectrumCircle",
    date: "2026",
    detail: "Certificate of participation in the Summer Hackathon 2026.",
    href: "/certifications/spectrumcircle-summer-hackathon.png",
  },
  {
    name: "Samsung Solve for Tomorrow 2026",
    kind: "event",
    org: "Samsung",
    date: "2026",
    detail: "Certificate of participation recognizing contributions and design-thinking work for Samsung Solve for Tomorrow 2026.",
    href: "/certifications/samsung-solve-for-tomorrow.png",
  },
  {
    name: "IBM SkillsBuild Completion Certificate",
    kind: "course",
    org: "IBM SkillsBuild",
    date: "2026",
    detail: "Completion certificate issued through IBM SkillsBuild.",
    href: "/certifications/ibm-skillsbuild-completion.pdf",
  },
  {
    name: "Illuminate Entrepreneurship Bootcamp",
    kind: "event",
    org: "E-Cell, IIT Bombay",
    date: "Oct 2025",
    detail: "Certificate of appreciation for completing the Illuminate bootcamp at St. Peter's Engineering College.",
    href: "/certifications/ecell-illuminate-entrepreneurship-bootcamp.pdf",
  },
  {
    name: "Getting Started with AI on Jetson Nano",
    kind: "course",
    org: "NVIDIA Deep Learning Institute",
    date: "Dec 2025",
    detail:
      "Hands-on edge AI — set up the Jetson Nano, collected image data, and trained and deployed classification and regression models with PyTorch on an embedded GPU.",
    href: "https://learn.nvidia.com/certificates?id=vfGMHdW4RQG95Fygmlx1sA",
  },
  {
    name: "Cyber Security Job Simulation",
    kind: "course",
    org: "Deloitte (Forage)",
    date: "Nov 2025",
    detail:
      "Investigated a security breach as part of Deloitte's cyber team by analysing web-activity logs for suspicious behaviour. Verification code HcyJrfExZ8gAQJTYj.",
    href: "/deloitte-cyber-security-certificate.pdf",
  },
  {
    name: "Full-Stack Development 101",
    kind: "course",
    org: "Simplilearn",
    date: "May 2026",
    detail: "Front-end building blocks (HTML, CSS, JavaScript), back-end and server concepts, databases and how the layers connect.",
    href: "/certifications/simplilearn-full-stack-development.jpeg",
  },
  {
    name: "Python (Basic)",
    kind: "course",
    org: "HackerRank",
    date: "Jul 2025",
    detail: "Data types, operators, control flow, strings, collections, functions and basic object-oriented programming.",
    href: "/certifications/hackerrank-python-basic.pdf",
  },
  {
    name: "Java (Basic)",
    kind: "course",
    org: "HackerRank",
    date: "Oct 2025",
    detail: "Classes and objects, data types, loops and conditionals, methods and core OOP principles.",
    href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/java%20certificate-7WHZ3UzaUAV0LkHldZ3oPHFTXQUTxC.png",
  },
]

type AchievementProof = {
  image: string
  alt: string
  label: string
  compact?: boolean
}

type Achievement = {
  rank: string
  date?: string
  event: string
  org: string
  project: string
  detail: string
  proofs?: AchievementProof[]
}

const ACHIEVEMENTS: Achievement[] = [
  {
    rank: "TOP 5",
    date: "2026",
    event: "India–Japan Innovation Hackathon",
    org: "India–Japan Innovation Hackathon 2026",
    project: "EcoConnect AI",
    detail: "Finalist, placing 5th with EcoConnect AI, a three-portal waste-recycling platform.",
    proofs: [
      {
        image: "/achievements/india-japan-innovation-hackathon-top-5.png",
        alt: "Award poster recognizing Team Celestial Voyagers and EcoConnect AI as 5th Prize Winner at the India–Japan Innovation Hackathon 2026",
        label: "View award poster ↗",
        compact: true,
      },
      {
        image: "/achievements/india-japan-news-coverage.png",
        alt: "News coverage of the India–Japan Innovation Hackathon achievement",
        label: "View news coverage ↗",
        compact: true,
      },
    ],
  },
  {
    rank: "RUNNER-UP",
    date: "May 2026",
    event: "AI Hackathon",
    org: "Bower School of Entrepreneurship × STUDLYF · Meridian School",
    project: "Two days, one AI build",
    detail: "Secured runner-up in a two-day AI hackathon (9–10 May 2026), recognised for innovation, problem-solving and teamwork.",
  },
  {
    rank: "18TH",
    event: "CodeChef DSA Monday",
    org: "CodeChef",
    project: "Competitive programming",
    detail: "Placed 18th in the rated Monday Munch DSA Challenge 013.",
    proofs: [
      {
        image: "/achievements/codechef-dsamonday013.png",
        alt: "CodeChef DSA Monday Challenge 013 contest page showing rank 18",
        label: "View contest rank ↗",
      },
      {
        image: "/achievements/codechef-dsamonday013-row.png",
        alt: "CodeChef leaderboard row showing rank 18 and score 600",
        label: "View leaderboard entry ↗",
      },
    ],
  },
]

const BEYOND = [
  { k: "DESIGN", v: "Social media creatives, posters and brand visuals in Canva." },
  { k: "PHOTO", v: "Retouching, compositing and image manipulation in Photoshop." },
  { k: "VIDEO", v: "Editing, colour grading and promo videos in DaVinci Resolve." },
  { k: "SPEED", v: "Types at 67 WPM with 97% accuracy, verified on typing.com." },
]

/* two masked lines that wipe up as the section scrolls in */
const H = ({ a, b, center }: { a: string; b: string; center?: boolean }) => (
  <h3 className="ar-sect" style={center ? { textAlign: "center" } : undefined}>
    <span className="ln">
      <span>{a}</span>
    </span>
    <span className="ln l2">
      <em>{b}</em>
    </span>
  </h3>
)

/* ------------------------------------------------------------------ page */

export default function Home() {
  const [formStatus, setFormStatus] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState<"All" | Cat>("All")
  const [certTab, setCertTab] = useState<"course" | "event">("course")
  const [certsOpen, setCertsOpen] = useState(false)

  const shownProjects = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.cats.includes(filter))
  const tabCerts = CERTS.filter((c) => c.kind === certTab)
  const shownCerts = certsOpen ? tabCerts : tabCerts.slice(0, 6)
  const courseCount = CERTS.filter((c) => c.kind === "course").length
  const eventCount = CERTS.length - courseCount

  /* scroll-reveal (re-armed whenever filters or tabs swap the cards) */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.in)")
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [filter, certTab, certsOpen])

  useEffect(() => {
    // stats count up the first time they come into view
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const statIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          statIo.unobserve(e.target)
          const el = e.target as HTMLElement
          const end = Number(el.dataset.n || "0")
          if (reduce || !end) return
          const t0 = performance.now()
          const tick = (now: number) => {
            const k = Math.min(1, (now - t0) / 1400)
            el.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 4))))
            if (k < 1) requestAnimationFrame(tick)
          }
          el.textContent = "0"
          requestAnimationFrame(tick)
        }),
      { threshold: 0.6 },
    )
    document.querySelectorAll<HTMLElement>("[data-n]").forEach((el) => statIo.observe(el))

    // cursor-follow glow on cards
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".glow-card")
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty("--mx", `${e.clientX - r.left}px`)
      card.style.setProperty("--my", `${e.clientY - r.top}px`)
    }
    document.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      statIo.disconnect()
      document.removeEventListener("pointermove", onMove)
    }
  }, [])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = fd.get("name")?.toString().trim() ?? ""
    const email = fd.get("email")?.toString().trim() ?? ""
    const subject = fd.get("subject")?.toString().trim() ?? ""
    const body = fd.get("message")?.toString().trim() ?? ""
    if (!name || !email || !body) return setFormStatus("Please fill in your name, email and message.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFormStatus("Please enter a valid email address.")
    const message = subject ? `Subject: ${subject}\n\n${body}` : body
    setSending(true)
    setFormStatus(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(result.error || "Failed to save message.")
      try {
        await sendEmailJS({ name, email, message })
      } catch (err) {
        console.warn("EmailJS delivery skipped:", err)
      }
      form.reset()
      setFormStatus(result.notice || "Message sent. I'll get back to you soon.")
    } catch (err) {
      console.error("Contact send error:", err)
      setFormStatus("Couldn't send that. Please email me directly at abhinavrishisaka@gmail.com.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="site">
      <header className="ar-top">
        <a href="#hero" className="ar-brand">
          <i />
          ABHINAV<span>·</span>RISHI
        </a>
        <nav className="ar-links" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#certifications">Certifications</a>
          <a href="#projects">Projects</a>
          <a href="#academics">Academics</a>
          <a href="#experience">Experience</a>
          <a href="#achievements">Achievements</a>
          <a href="#contact" className="ar-cta">
            Contact
          </a>
        </nav>
      </header>

      <div className="ar-progress" aria-hidden="true" />
      <LandingHero />

      <main className="ar-main">
        <div className="ar-horizon" aria-hidden="true" />

        {/* ABOUT */}
        <section id="about" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            ABOUT
          </div>
          <div className="ar-about">
            <div className="reveal">
              <div className="ar-sec-h">ABOUT ME · GET TO KNOW ME</div>
              <H a="Who am I?" b="A builder who looks up." />
              <p className="ar-p">
                I&apos;m S Abhinav Rishi, a third-year B.Tech Computer Science student at St. Peter&apos;s Engineering
                College in Hyderabad, and I build
                intelligent systems that predict problems before they happen. My work sits where machine learning,
                generative AI and full-stack engineering meet, and I like taking an idea from a rough sketch all the way
                to something people can actually use.
              </p>
              <p className="ar-p">
                Right now I&apos;m a UI/UX Design Intern at FlyRank AI, designing interfaces for AI-driven products. Along
                the way I&apos;ve built an AI planning assistant that turns raw ideas into 90-day roadmaps, a three-portal
                recycling platform that placed top 5 at the India–Japan Innovation Hackathon, and a fraud detector that
                traps suspicious behaviour ring by ring.
              </p>
              <p className="ar-p">
                When I&apos;m not writing code, I&apos;m designing: posters and brand visuals in Canva, photo composites in
                Photoshop, promo videos colour-graded in DaVinci Resolve. I collect certificates the way some people
                collect stamps, {CERTS.length} so far, and I type at 67 words a minute, which helps when an idea
                won&apos;t wait.
              </p>
              <div className="ar-cloud">
                {DESCRIPTORS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
            <div className="ar-portrait reveal" style={{ ["--d" as string]: "120ms" }}>
              <img src={PORTRAIT} alt="S Abhinav Rishi" />
              <span className="ar-portrait-tag">AI ENGINEER · DESIGNER</span>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            SKILLS
          </div>
          <div className="reveal">
            <div className="ar-sec-h">SKILLS · MY TOOLKIT</div>
            <H a="What I work with," b="every day." />
          </div>
          <div className="ar-skills">
            {SKILL_GROUPS.map((g, i) => (
              <article key={g.name} className="ar-skill glow-card reveal" style={{ ["--d" as string]: `${(i % 3) * 90}ms` }}>
                <span className="ar-mono">{g.name}</span>
                <div className="ar-tags">
                  {g.items.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="ar-marquee reveal" aria-label="Skills">
            <div className="ar-marquee-track">
              {[...SKILLS, ...SKILLS].map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section id="certifications" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            VERIFIED
          </div>
          <div className="reveal ar-sec-row">
            <div>
              <div className="ar-sec-h">CERTIFICATIONS · ALWAYS LEARNING</div>
              <H a="Verified," b="and still learning." />
            </div>
            <div className="ar-count">
              <u data-n={CERTS.length}>{CERTS.length}</u>
              <span>certificates earned</span>
            </div>
          </div>
          <div className="ar-filters" role="tablist" aria-label="Certificate type">
            {(
              [
                ["course", `Courses · ${courseCount}`],
                ["event", `Hackathons & Events · ${eventCount}`],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={certTab === k}
                className={certTab === k ? "on" : ""}
                onClick={() => {
                  setCertTab(k)
                  setCertsOpen(false)
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="ar-certs">
            {shownCerts.map((c, i) => (
              <a
                key={c.name}
                className="ar-cert glow-card reveal"
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ["--d" as string]: `${(i % 3) * 90}ms` }}
              >
                <div className="ar-cert-top">
                  <span className="ar-mono">{c.org}</span>
                  <span className="ar-mono dim">{c.date}</span>
                </div>
                <h4>{c.name}</h4>
                <p>{c.detail}</p>
                <span className="ar-link">View certificate ↗</span>
              </a>
            ))}
          </div>
          {tabCerts.length > 6 && (
            <div className="ar-more">
              <button type="button" className="ar-btn ghost" onClick={() => setCertsOpen((v) => !v)}>
                {certsOpen ? "SHOW LESS ↑" : `SHOW ALL ${tabCerts.length} ↓`}
              </button>
            </div>
          )}
        </section>

        {/* PROJECTS */}
        <section id="projects" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            WORK
          </div>
          <div className="reveal">
            <div className="ar-sec-h">PROJECTS · THINGS I&apos;VE BUILT</div>
            <H a="Seven projects," b="one obsession: prediction." />
          </div>
          <div className="ar-filters" role="tablist" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={filter === f ? "on" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="ar-grid">
            {shownProjects.map((p, i) => (
              <article key={p.id} className="ar-proj glow-card reveal" style={{ ["--d" as string]: `${(i % 3) * 90}ms` }}>
                <div className="ar-proj-media">
                  {p.img ? <img src={p.img} alt="" loading="lazy" /> : <div className="ar-proj-art" data-id={p.id} />}
                  <span className="ar-proj-num">{p.id}</span>
                </div>
                <div className="ar-proj-body">
                  <div className="ar-proj-top">
                    <span className="ar-mono">{p.tag}</span>
                    <span className="ar-pill">{p.status}</span>
                  </div>
                  <h4>{p.name}</h4>
                  <p>{p.desc}</p>
                  <div className="ar-tags">
                    {p.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  {p.href && (
                    <a className="ar-link" href={p.href} target="_blank" rel="noopener noreferrer">
                      Visit live ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="ar-more">
            <a className="ar-btn ghost" href={GITHUB} target="_blank" rel="noopener noreferrer">
              VIEW MORE ON GITHUB ↗
            </a>
          </div>
        </section>

        {/* ACADEMIC BACKGROUND */}
        <section id="academics" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            ACADEMICS
          </div>
          <div className="ar-resume">
            <div className="reveal">
              <div className="ar-sec-h">ACADEMIC BACKGROUND · WHERE I LEARNED</div>
              <H a="School to" b="engineering." />
              <p className="ar-p">
                From Bhashyam High School to Trividya Junior College to computer science at St. Peter&apos;s, each step
                pulled me a little further toward AI. The full story is on one page.
              </p>
              <a className="ar-btn" href={RESUME} target="_blank" rel="noopener noreferrer">
                DOWNLOAD RESUME ↓
              </a>
              <article className="ar-edu ar-strengths glow-card">
                <div className="ar-cert-top">
                  <span className="ar-mono">STRENGTHS</span>
                </div>
                <ul className="ar-list">
                  {STRENGTHS.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </article>
            </div>
            <ol className="ar-timeline">
              {EDUCATION.map((e, i) => (
                <li key={e.level} className={`ar-edu glow-card reveal${e.current ? " now" : ""}`} style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <div className="ar-cert-top">
                    <span className="ar-mono">{e.level}</span>
                    <span className={`ar-pill${e.current ? " now" : ""}`}>{e.current ? "● " + e.when : e.when}</span>
                  </div>
                  <div className="ar-edu-row">
                    <div>
                      <h4>{e.degree}</h4>
                      <span className="ar-school">{e.school}</span>
                      {e.detail && <p>{e.detail}</p>}
                    </div>
                    {e.score && (
                      <div className="ar-score">
                        <u>{e.score}</u>
                        <span>{e.scoreLabel}</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            EXPERIENCE
          </div>
          <div className="reveal">
            <div className="ar-sec-h">EXPERIENCE · WHERE I&apos;VE WORKED</div>
            <H a="Learning by" b="shipping." />
          </div>
          <div className="ar-exp">
            {EXPERIENCE.map((x) => (
              <article key={x.role} className="ar-exp-card glow-card reveal">
                <div className="ar-exp-when">
                  <span className="ar-mono dim">{x.when}</span>
                  {x.current && <span className="ar-pill now">● PRESENT</span>}
                </div>
                <div>
                  <h4>{x.role}</h4>
                  <span className="ar-mono">{x.org}</span>
                  <p>{x.detail}</p>
                  <div className="ar-tags">
                    {x.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ACHIEVEMENTS + BEYOND */}
        <section id="achievements" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            WINS
          </div>
          <div className="reveal">
            <div className="ar-sec-h">ACHIEVEMENTS · MILESTONES</div>
            <H a="Built, competed," b="recognised." />
          </div>
          <div className="ar-achievements">
            {ACHIEVEMENTS.map((a, i) => (
              <article key={a.event} className="ar-achievement glow-card reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
                <div className="ar-ach-top">
                  <span className="ar-achievement-rank">{a.rank}</span>
                  {a.date && <span className="ar-mono dim">{a.date}</span>}
                </div>
                <h4>{a.event}</h4>
                <span className="ar-mono">{a.org}</span>
                <p>
                  <b>{a.project}.</b> {a.detail}
                </p>
                {a.proofs?.map((proof) => (
                  <a
                    key={proof.image}
                    className={`ar-achievement-proof${proof.compact ? " ar-achievement-proof-compact" : ""}`}
                    href={proof.image}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={proof.image} alt={proof.alt} loading="lazy" />
                    <span className="ar-mono">{proof.label}</span>
                  </a>
                ))}
              </article>
            ))}
          </div>

          <div className="ar-beyond reveal">
            <div className="ar-sec-h">BEYOND THE CODE</div>
            <div className="ar-beyond-grid">
              {BEYOND.map((b) => (
                <div key={b.k}>
                  <span className="ar-mono">{b.k}</span>
                  <p>{b.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="ar-sec ar-contact">
          <div className="ar-bgword" aria-hidden="true">
            HELLO
          </div>
          <div className="reveal">
            <div className="ar-sec-h" style={{ textAlign: "center" }}>
              CONTACT · SAY HELLO
            </div>
            <H a="Got an idea, or a problem" b="worth predicting?" center />
            <p className="ar-p ar-center">
              Whether it&apos;s an internship, a collaboration or a question about one of my projects, my inbox is open.
            </p>
            <a className="ar-mail" href="mailto:abhinavrishisaka@gmail.com">
              abhinavrishisaka@gmail.com
            </a>
          </div>
          <div className="ar-contact-grid">
            <form className="ar-form ar-card reveal" onSubmit={onSubmit}>
              <div className="ar-form-row">
                <label>
                  <span>Your name</span>
                  <input name="name" type="text" required suppressHydrationWarning />
                </label>
                <label>
                  <span>Your email</span>
                  <input name="email" type="email" required suppressHydrationWarning />
                </label>
              </div>
              <label>
                <span>Subject</span>
                <input name="subject" type="text" suppressHydrationWarning />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows={5} required suppressHydrationWarning />
              </label>
              <button className="ar-btn" type="submit" disabled={sending} suppressHydrationWarning>
                {sending ? "SENDING…" : "SEND MESSAGE →"}
              </button>
              {formStatus && <p className="ar-status">{formStatus}</p>}
            </form>
            <div className="ar-socials reveal" style={{ ["--d" as string]: "120ms" }}>
              <a href="https://linkedin.com/in/abhinavrishisaka" target="_blank" rel="noopener noreferrer" className="glow-card">
                <span className="ar-mono">LINKEDIN</span>
                <b>/in/abhinavrishisaka ↗</b>
              </a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="glow-card">
                <span className="ar-mono">GITHUB</span>
                <b>/Abhinav6305 ↗</b>
              </a>
              <a href="tel:+919618587055" className="glow-card">
                <span className="ar-mono">PHONE</span>
                <b>+91 96185 87055</b>
              </a>
              <div className="ar-loc glow-card">
                <span className="ar-mono">BASED IN</span>
                <b>Hyderabad, India</b>
              </div>
            </div>
          </div>
          <p className="ar-tagline">Keep looking up. Keep building.</p>
        </section>

        <div className="ar-endword" aria-hidden="true">
          ABHINAV RISHI
        </div>
        <footer className="ar-foot">
          <span>© 2026 S ABHINAV RISHI. ALL RIGHTS RESERVED.</span>
          <span>KEEP LOOKING UP. KEEP BUILDING.</span>
          <span>HYDERABAD, INDIA</span>
        </footer>
      </main>
    </div>
  )
}
