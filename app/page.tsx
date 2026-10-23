"use client"

import { useEffect, useState, type FormEvent } from "react"
import { sendEmail as sendEmailJS } from "../src/services/emailService"
import LandingHero from "@/components/landing-hero"

const PORTRAIT = "/483c47cd-8bb8-47da-8d0a-f3f726313005 - Edited.png"

const PROJECTS = [
  {
    id: "01",
    name: "VISIONIX Decisions",
    tag: "AI business intelligence",
    desc: "AI-powered BI platform that helps businesses make smarter strategic decisions with predictive analytics and intelligent automation.",
    stack: ["Python", "Machine Learning", "Predictive Analytics", "Full Stack"],
    status: "About to launch",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "02",
    name: "Veixon Co-Founders",
    tag: "AI co-founder platform",
    desc: "An AI co-founder from day one — idea validation, 90-day execution roadmaps, decision simulation and founder accountability tracking.",
    stack: ["AI / LLM workflows", "Web dashboard", "Vercel"],
    status: "Live",
    img: "/veixon-cofounders.png",
    href: "https://veixon-cofounders.vercel.app",
  },
  {
    id: "03",
    name: "Veixon AI",
    tag: "Decision-support AI",
    desc: "A human-brain-inspired AI system designed by Rishi to support decision-making and help power his startup.",
    stack: ["AI systems", "Decision support", "Memory & knowledge"],
    status: "In development",
    img: "/veixon-ai.png",
  },
  {
    id: "04",
    name: "Chakravyuh",
    tag: "AI fraud detection",
    desc: "Detects suspicious activity and fraud patterns using machine learning and intelligent behavioural analysis.",
    stack: ["Machine Learning", "Pattern Detection", "Behavioural Analytics"],
    status: "Security",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Vf7EII799k2PQfR4nm1SR3q2ZzdJRA.png",
  },
  {
    id: "05",
    name: "EcoConnect AI",
    tag: "AI waste management",
    desc: "Three-portal platform connecting citizens, delivery agents and NGOs/industries so scrap reaches the recyclers that need it, with batched pickups.",
    stack: ["AI image reporting", "WebGL", "Role-based web app"],
    status: "Hackathon",
    img: "/ecoconnect-ai.png",
  },
  {
    id: "06",
    name: "IntelliRecipe",
    tag: "AI recipe generator",
    desc: "Generates personalised recipes from the ingredients you have, your taste preferences and dietary requirements.",
    stack: ["AI", "Machine Learning", "Full Stack"],
    status: "Project",
    img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "07",
    name: "#DFA2Z",
    tag: "AI drone services",
    desc: "AI-based drone service platform delivering aerial solutions and intelligent automation for diverse industries.",
    stack: ["Drones", "Aerial AI", "Automation"],
    status: "Upcoming",
    img: "/dfa2z-drone.jpg",
  },
]

const CERTS = [
  {
    name: "Introduction to Machine Learning",
    org: "AWS Training & Certification",
    date: "May 2026",
    detail:
      "Core ML concepts — supervised vs unsupervised learning, the end-to-end ML lifecycle (data prep, training, evaluation, deployment) and applying ML to business problems on AWS.",
    href: "/certifications/aws-introduction-to-machine-learning.pdf",
  },
  {
    name: "Beyond Agentic",
    org: "Microsoft AI Innovators Hub",
    date: "Oct 2026",
    detail: "Certificate of appreciation for participating in the Beyond Agentic event at Microsoft Campus, Hyderabad.",
    href: "/certifications/microsoft-beyond-agentic.png",
  },
  {
    name: "Google Student Ambassador Pitch Night",
    org: "Google Student Ambassador Program",
    date: "May 2026",
    detail: "Certificate of participation recognizing creativity and contribution at Pitch Night Edition.",
    href: "/certifications/google-student-ambassador-pitch-night.png",
  },
  {
    name: "AI Hackathon — Runner-up",
    org: "Bower School of Entrepreneurship & STUDLYF",
    date: "May 2026",
    detail: "Runner-up team recognition at the AI Hackathon held at Meridian School.",
    href: "/certifications/bower-ai-hackathon-runner-up.pdf",
  },
  {
    name: "Introduction to Modern AI",
    org: "Cisco Networking Academy",
    date: "May 2026",
    detail: "Course completion covering AI and machine learning fundamentals, computer vision, language translation and large language models.",
    href: "/certifications/cisco-introduction-to-modern-ai.pdf",
  },
  {
    name: "ChatGPT Generative AI for Business Leaders",
    org: "Udemy",
    date: "May 2026",
    detail: "Completed the Gen AI Primer course for business leaders.",
    href: "/certifications/udemy-chatgpt-generative-ai-business-leaders.pdf",
  },
  {
    name: "Introduction to Generative AI and Agents",
    org: "Microsoft Learn",
    date: "May 2026",
    detail: "Microsoft Learn achievement for completing the introduction to generative AI and agents.",
    href: "/certifications/microsoft-learn-generative-ai-agents.pdf",
  },
  {
    name: "Explore AI Basics",
    org: "Microsoft Learn",
    date: "May 2026",
    detail: "Microsoft Learn achievement for completing the Explore AI basics learning path.",
    href: "/certifications/microsoft-learn-ai-basics.pdf",
  },
  {
    name: "Introduction to AI Concepts",
    org: "Microsoft Learn",
    date: "May 2026",
    detail: "Microsoft Learn achievement for completing the Introduction to AI concepts learning path.",
    href: "/certifications/microsoft-learn-ai-concepts.pdf",
  },
  {
    name: "Java DSA Course — Fundamentals and Beyond",
    org: "Scaler Topics",
    date: "May 2026",
    detail: "Completed a Java data structures and algorithms course covering 94 video tutorials, 12 modules and 7 challenges.",
    href: "/certifications/scaler-java-dsa.png",
  },
  {
    name: "Generative AI Mastermind",
    org: "Outskill",
    date: "2026",
    detail: "Certificate of completion for the Generative AI Mastermind program.",
    href: "/certifications/outskill-generative-ai-mastermind.pdf",
  },
  {
    name: "Claude 101",
    org: "Anthropic",
    date: "2026",
    detail: "Completed Anthropic's Claude 101 course.",
    href: "/certifications/claude-101.jpg",
  },
  {
    name: "Summer Hackathon 2026",
    org: "SpectrumCircle",
    date: "2026",
    detail: "Certificate of participation in the Summer Hackathon 2026.",
    href: "/certifications/spectrumcircle-summer-hackathon.png",
  },
  {
    name: "Samsung Solve for Tomorrow 2026",
    org: "Samsung",
    date: "2026",
    detail: "Certificate of participation recognizing contributions and design-thinking work for Samsung Solve for Tomorrow 2026.",
    href: "/certifications/samsung-solve-for-tomorrow.png",
  },
  {
    name: "IBM SkillsBuild Completion Certificate",
    org: "IBM SkillsBuild",
    date: "2026",
    detail: "Completion certificate issued through IBM SkillsBuild.",
    href: "/certifications/ibm-skillsbuild-completion.pdf",
  },
  {
    name: "Illuminate Entrepreneurship Bootcamp",
    org: "E-Cell, IIT Bombay",
    date: "Oct 2025",
    detail: "Certificate of appreciation for completing the entrepreneurship bootcamp at St. Peter's Engineering College.",
    href: "/certifications/ecell-illuminate-entrepreneurship-bootcamp.pdf",
  },
  {
    name: "Getting Started with AI on Jetson Nano",
    org: "NVIDIA Deep Learning Institute",
    date: "Dec 2025",
    detail:
      "Hands-on edge AI — set up the Jetson Nano, collected image data, and trained and deployed classification and regression models with PyTorch on an embedded GPU.",
    href: "https://learn.nvidia.com/certificates?id=vfGMHdW4RQG95Fygmlx1sA",
  },
  {
    name: "Cyber Security Job Simulation",
    org: "Deloitte (Forage)",
    date: "Nov 2025",
    detail:
      "Investigated a security breach as part of Deloitte's cyber team by analysing web-activity logs for suspicious behaviour. Verification code HcyJrfExZ8gAQJTYj.",
    href: "/deloitte-cyber-security-certificate.pdf",
  },
  {
    name: "Full-Stack Development 101",
    org: "Simplilearn",
    date: "May 2026",
    detail: "Front-end building blocks (HTML, CSS, JavaScript), back-end and server concepts, databases and how the layers connect.",
    href: "/certifications/simplilearn-full-stack-development.jpeg",
  },
  {
    name: "Python (Basic)",
    org: "HackerRank",
    date: "Jul 2025",
    detail: "Data types, operators, control flow, strings, collections, functions and basic object-oriented programming.",
    href: "/certifications/hackerrank-python-basic.pdf",
  },
  {
    name: "Java (Basic)",
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
  event: string
  project: string
  detail: string
  proofs?: AchievementProof[]
}

const ACHIEVEMENTS: Achievement[] = [
  {
    rank: "TOP 5",
    event: "India–Japan Innovation Hackathon",
    project: "EcoConnect AI",
    detail: "Finalist, placing 5th with an AI-powered waste management platform.",
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
    event: "AI Hackathon · Bower × STUDLYF × T-Hub",
    project: "Team VISIONIX",
    detail: "Runner-up at the May 2026 hackathon hosted at Meridian School.",
  },
  {
    rank: "18TH",
    event: "CodeChef DSA Monday",
    project: "Competitive programming",
    detail: "Placed 18th in the CodeChef Monday Munch — DSA Challenge 013 (Rated).",
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

const SKILLS = [
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Flask",
  "Machine Learning",
  "Predictive Analytics",
  "Prompt Engineering",
  "AI System Design",
  "Firebase",
  "Tailwind CSS",
  "Canva",
  "Photoshop",
  "DaVinci Resolve",
]

export default function Home() {
  const [formStatus, setFormStatus] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  /* scroll-reveal for everything below the film */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal")
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    )
    els.forEach((el) => io.observe(el))

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
    document.querySelectorAll<HTMLElement>(".ar-stat u[data-n]").forEach((el) => statIo.observe(el))

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
      io.disconnect()
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
    const message = fd.get("message")?.toString().trim() ?? ""
    if (!name || !email || !message) return setFormStatus("Please fill out all fields.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFormStatus("Please enter a valid email address.")
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
      setFormStatus(result.notice || "Message sent — I'll get back to you soon.")
    } catch (err) {
      console.error("Contact send error:", err)
      setFormStatus("Failed to send message. Please email me directly.")
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
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#achievements">Achievements</a>
          <a href="#certifications">Certifications</a>
          <a href="#contact" className="ar-cta">
            Let&apos;s talk
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
              <div className="ar-sec-h">ABOUT — WHO&apos;S BUILDING THIS</div>
              <h3 className="ar-sect">
                <span className="ln">
                  <span>AI engineer. Full-stack builder.</span>
                </span>
                <span className="ln l2">
                  <em>Founder.</em>
                </span>
              </h3>
              <p className="ar-p">
                I&apos;m S Abhinav Rishi — a third-year Computer Science student and the founder of VISIONIX. I combine
                machine learning, predictive analytics and modern web engineering to turn ambitious ideas into clean,
                scalable products — from business decision intelligence to fraud detection.
              </p>
              <p className="ar-p">
                I work mostly in Python, Java, C++, React and Flask, design and edit in Canva, Photoshop and DaVinci
                Resolve, and care about technology that feels smart, fast and human.
              </p>
            </div>
            <div className="ar-portrait reveal" style={{ ["--d" as string]: "120ms" }}>
              <img src={PORTRAIT} alt="S Abhinav Rishi" />
              <span className="ar-portrait-tag">FOUNDER · VISIONIX</span>
            </div>
          </div>
          <div className="ar-marquee reveal" aria-label="Skills">
            <div className="ar-marquee-track">
              {[...SKILLS, ...SKILLS].map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            WORK
          </div>
          <div className="reveal">
            <div className="ar-sec-h">SELECTED WORK</div>
            <h3 className="ar-sect">
              <span className="ln">
                <span>Seven products,</span>
              </span>
              <span className="ln l2">
                <em>one obsession: prediction.</em>
              </span>
            </h3>
          </div>
          <div className="ar-grid">
            {PROJECTS.map((p, i) => (
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
        </section>

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            WINS
          </div>
          <div className="reveal">
            <div className="ar-sec-h">MILESTONES & RECOGNITION</div>
            <h3 className="ar-sect">
              <span className="ln">
                <span>Built, competed,</span>
              </span>
              <span className="ln l2">
                <em>recognized.</em>
              </span>
            </h3>
          </div>
          <div className="ar-achievements">
            {ACHIEVEMENTS.map((achievement, i) => (
              <article
                key={achievement.event}
                className="ar-achievement glow-card reveal"
                style={{ ["--d" as string]: `${i * 90}ms` }}
              >
                <span className="ar-achievement-rank">{achievement.rank}</span>
                <span className="ar-mono">{achievement.event}</span>
                <h4>{achievement.project}</h4>
                <p>{achievement.detail}</p>
                {achievement.proofs?.map((proof) => (
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
        </section>

        {/* CERTIFICATIONS */}
        <section id="certifications" className="ar-sec">
          <div className="ar-bgword" aria-hidden="true">
            VERIFIED
          </div>
          <div className="reveal">
            <div className="ar-sec-h">CERTIFICATIONS</div>
            <h3 className="ar-sect">
              <span className="ln">
                <span>Verified,</span>
              </span>
              <span className="ln l2">
                <em>and still learning.</em>
              </span>
            </h3>
          </div>
          <div className="ar-certs">
            {CERTS.map((c, i) => (
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
        </section>

        {/* VISIONIX */}
        <section className="ar-sec">
          <div className="ar-visionix reveal">
            <div>
              <div className="ar-sec-h">THE COMPANY</div>
              <h3 className="ar-sect">
                <span className="ln">
                  <span>VISIONIX —</span>
                </span>
                <span className="ln l2">
                  <em>AI that sees ahead.</em>
                </span>
              </h3>
              <p className="ar-p">
                A product- and service-based company solving real-world problems with AI. I lead a crew of 2 co-founders
                and 10 talented members across AI engineering, product development and system design.
              </p>
            </div>
            <div className="ar-stats">
              {[
                ["1", "Startup founded"],
                ["13", "Member team"],
                ["6", "AI products"],
                ["6", "Certifications"],
              ].map(([n, l], i) => (
                <div key={l} className="ar-stat reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
                  <u data-n={n}>{n}</u>
                  <span>{l}</span>
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
              CONTACT
            </div>
            <h3 className="ar-sect" style={{ textAlign: "center" }}>
              <span className="ln">
                <span>Got a problem</span>
              </span>
              <span className="ln l2">
                <em>worth predicting?</em>
              </span>
            </h3>
            <a className="ar-mail" href="mailto:abhinavrishisaka@gmail.com">
              abhinavrishisaka@gmail.com
            </a>
          </div>
          <div className="ar-contact-grid">
            <form className="ar-form ar-card reveal" onSubmit={onSubmit}>
              <label>
                <span>Your name</span>
                <input name="name" type="text" required suppressHydrationWarning />
              </label>
              <label>
                <span>Your email</span>
                <input name="email" type="email" required suppressHydrationWarning />
              </label>
              <label>
                <span>What do you want to build?</span>
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
              <a href="https://github.com/Abhinav6305" target="_blank" rel="noopener noreferrer" className="glow-card">
                <span className="ar-mono">GITHUB</span>
                <b>/Abhinav6305 ↗</b>
              </a>
              <a href="tel:+919618587055" className="glow-card">
                <span className="ar-mono">PHONE</span>
                <b>+91 96185 87055</b>
              </a>
            </div>
          </div>
        </section>

        <div className="ar-endword" aria-hidden="true">
          ABHINAV RISHI
        </div>
        <footer className="ar-foot">
          <span>© 2026 S ABHINAV RISHI</span>
          <span>FOUNDER · VISIONIX</span>
          <span>HYDERABAD, INDIA</span>
        </footer>
      </main>
    </div>
  )
}
