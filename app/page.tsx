"use client"

import { useEffect, useState } from "react"
import { sendEmail as sendEmailJS } from "../src/services/emailService"
import { toast } from "@/hooks/use-toast"

export default function Home() {
  const [formStatus, setFormStatus] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add("js-ready")

    // Mouse Blob Follower
    const blob = document.getElementById("cursor-blob")
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      if (blob) {
        blob.style.transform = `translate(${x - 200}px, ${y - 200}px)`
      }
    }
    document.addEventListener("mousemove", handleMouseMove)

    const projectRows = document.querySelectorAll(".project-row")
    const handleProjectPointer = (e: PointerEvent) => {
      projectRows.forEach((row) => {
        const rect = row.getBoundingClientRect()
        if (rect.top > window.innerHeight || rect.bottom < 0) return
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        ;(row as HTMLElement).style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`)
        ;(row as HTMLElement).style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`)
        ;(row as HTMLElement).style.setProperty("--float-x", `${(x * 10).toFixed(2)}px`)
        ;(row as HTMLElement).style.setProperty("--float-y", `${(y * 8).toFixed(2)}px`)
      })
    }
    window.addEventListener("pointermove", handleProjectPointer)

    // Parallax Effect
    const handleScroll = () => {
      const scroll = window.pageYOffset

      // Hero parallax
      const parallaxTexts = document.querySelectorAll(".parallax-text")
      parallaxTexts.forEach((text) => {
        if (text.closest(".project-row")) return
        const speed = text.getAttribute("data-speed")
        if (speed) {
          const offset = scroll * Number.parseFloat(speed) * 0.04
          const clampedOffset = Math.max(-90, Math.min(90, offset))
          ;(text as HTMLElement).style.transform = `translateX(${clampedOffset}px)`
        }
      })

      const heroImg = document.getElementById("hero-img")
      if (heroImg) {
        heroImg.style.transform = `translate(-50%, calc(-50% + ${scroll * 0.2}px)) scale(${1 + scroll * 0.0005})`
      }

      // Floating labels in project section
      const labels = document.querySelectorAll(".floating-label")
      labels.forEach((label, index) => {
        const direction = index % 2 === 0 ? 1 : -1
        const offset = Math.max(-70, Math.min(70, scroll * 0.035 * direction))
        ;(label as HTMLElement).style.transform = `translateY(${offset}px)`
      })
    }
    window.addEventListener("scroll", handleScroll)

    // Simple reveal on enter (Intersection Observer)
    const observerOptions = {
      threshold: 0.22,
      rootMargin: "0px 0px -12% 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("active", entry.isIntersecting)
      })
    }, observerOptions)

    document.querySelectorAll(".reveal-text, .project-row").forEach((text) => {
      observer.observe(text)
    })

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = e.currentTarget as HTMLAnchorElement
        const href = target.getAttribute("href")
        if (href) {
          document.querySelector(href)?.scrollIntoView({
            behavior: "smooth",
          })
        }
      })
    })

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("pointermove", handleProjectPointer)
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div className="blob" id="cursor-blob"></div>

      <nav>
        <div className="logo">ABHINAV ©26</div>
        <ul className="nav-links">
          <li>
            <a href="#work">Projects</a>
          </li>
          <li>
            <a href="#certifications">Certifications</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section id="hero" className="hero-section">
          <div className="hero-title-container container">
            <span className="huge-type parallax-text" data-speed="-2">
              ABHINAV
            </span>
            <span className="huge-type outline-text parallax-text hero-last-name" data-speed="2">
              RISHI
            </span>
          </div>
          <img
            src="/483c47cd-8bb8-47da-8d0a-f3f726313005 - Edited.png"
            alt="Abhinav Rishi"
            className="hero-portrait"
          />
        </section>

        {/* INTRO */}
        <section id="about">
          <div className="container">
            <div className="intro-copy" style={{ maxWidth: "900px" }}>
              <h2
                className="parallax-text intro-heading"
                data-speed="0.12"
                style={{
                  fontSize: "3rem",
                  fontFamily: "var(--syne)",
                  marginBottom: "40px",
                }}
              >
                BUILDING INTELLIGENT SYSTEMS THAT PREDICT PROBLEMS.
              </h2>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 300,
                  color: "#888",
                  marginBottom: "30px",
                }}
              >
                I’m S Abhinav Rishi, an AI Engineer, Full Stack Developer, and founder of VISIONIX focused on building intelligent systems that predict problems before they happen.
My work combines Artificial Intelligence, Machine Learning, and modern web technologies to create futuristic digital experiences.
I enjoy turning complex ideas into clean, scalable, and impactful products.
From developing AI-powered solutions to crafting high-end web applications, I aim to build technology that feels smart, fast, and human.
I specialize in Python, Java, C++, React, Flask, and AI system design.
Beyond coding, I’m deeply passionate about innovation, automation, and creating products that leave a lasting impact.
I believe technology should not only solve real-world problems but also inspire people through design and intelligence.
Every project I build reflects precision, creativity, and a vision for the future.
Currently, I’m focused on pushing the boundaries of AI-driven experiences and next-generation software systems.
My goal is to build meaningful technology that shapes the future of digital intelligence.
              </p>
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 300,
                  color: "#666",
                }}
              >
                Turning ambitious ideas into scalable AI-driven realities.
              </p>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="scrolling-marquee">
          <div className="marquee-inner">
            <span className="huge-type outline-text">AI ENGINEER — FULL STACK — MACHINE LEARNING — PROMPT ENGINEER — </span>
            <span className="huge-type outline-text">AI ENGINEER — FULL STACK — MACHINE LEARNING — PROMPT ENGINEER — </span>
          </div>
        </div>

        {/* WORK SECTION */}
        <section id="work" className="container">
          <div className="sticky-type parallax-text" data-speed="-1">ARCHIVE</div>

          {/* Project 1 */}
          <div className="project-row project-row--image-right">
            <div className="project-info">
              <span style={{ fontFamily: "var(--syne)", color: "var(--accent)" }}>001 / BUSINESS INTELLIGENCE</span>
              <h3 className="huge-type parallax-text" style={{ fontSize: "clamp(2rem, 8vw, 4rem)", margin: "20px 0" }} data-speed="0.08">
                VISIONIX DECISIONS
              </h3>
              <p>
                An AI Powered Business Intelligence Platform designed to help businesses make smarter strategic decisions using artificial intelligence, predictive analytics, and intelligent automation.
              </p>
              <div className="divider"></div>
              <p>STATUS: ABOUT TO LAUNCH</p>
            </div>
            <div className="project-media">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
                alt="Visionix Project"
                className="project-image"
              />
              <div className="floating-label huge-type outline-text" style={{ fontSize: "8rem" }}>
                DECISIONS
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="project-row project-row--image-left intellirecipe-row">
            <div className="project-media">
              <img
                src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1000"
                alt="IntelliRecipe Project"
                className="project-image"
              />
              <div
                className="floating-label huge-type outline-text"
                style={{ fontSize: "8rem", right: "auto", left: "-100px" }}
              >
                RECIPES
              </div>
            </div>
            <div className="project-info">
              <span style={{ fontFamily: "var(--syne)", color: "var(--accent)" }}>002 / AI RECIPE GENERATOR</span>
              <h3 className="huge-type" style={{ fontSize: "6rem", margin: "20px 0" }}>
                INTELLIRECIPE
              </h3>
              <p>
                An AI recipe generator that creates personalized recipes based on ingredients, preferences, and dietary requirements.
              </p>
              <div className="divider"></div>
              <p>TECH STACK: AI, Machine Learning, Full Stack</p>
            </div>
          </div>

          {/* Project 3 */}
          <div className="project-row project-row--image-right">
            <div className="project-info">
              <span style={{ fontFamily: "var(--syne)", color: "var(--accent)" }}>003 / FRAUD DETECTION</span>
              <h3 className="huge-type" style={{ fontSize: "6rem", margin: "20px 0" }}>
                CHAKRAVYUH
              </h3>
              <p>
                An AI Fraud Detection System that detects suspicious activities and fraud patterns using machine learning and intelligent behavioral analysis.
              </p>
              <div className="divider"></div>
              <p>TECH STACK: Machine Learning, Pattern Detection, AI</p>
            </div>
            <div className="project-media">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Vf7EII799k2PQfR4nm1SR3q2ZzdJRA.png"
                alt="Chakravyuh Project"
                className="project-image"
              />
              <div className="floating-label huge-type outline-text" style={{ fontSize: "8rem" }}>
                SECURITY
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div className="project-row project-row--image-left">
            <div className="project-media">
              <img
                src="/dfa2z-drone.jpg"
                alt="DFA2Z Project"
                className="project-image"
              />
              <div
                className="floating-label huge-type outline-text"
                style={{ fontSize: "8rem", right: "auto", left: "-100px" }}
              >
                DRONES
              </div>
            </div>
            <div className="project-info">
              <span style={{ fontFamily: "var(--syne)", color: "var(--accent)" }}>004 / DRONE SERVICES</span>
              <h3 className="huge-type" style={{ fontSize: "6rem", margin: "20px 0" }}>
                #DFA2Z
              </h3>
              <p>
                An AI-based drone service platform designed to deliver comprehensive aerial solutions and intelligent automation for diverse industries.
              </p>
              <div className="divider"></div>
              <p>STATUS: UPCOMING</p>
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section id="certifications">
          <div className="container">
            <div style={{ marginBottom: "60px" }}>
              <h2
                style={{
                  fontSize: "3rem",
                  fontFamily: "var(--syne)",
                  marginBottom: "40px",
                }}
                className="parallax-text"
                data-speed="-1"
              >
                CERTIFICATIONS
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "30px",
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h4 style={{ fontFamily: "var(--syne)", fontSize: "1.3rem", marginBottom: "10px" }}>
                  Python (Basic)
                </h4>
                <p style={{ color: "#888", marginBottom: "15px" }}>HackerRank</p>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.9rem" }}>Earned on: 30 Jul, 2025</p>
                <a
                  href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/python_basic%20certificate%20%281%29_page-0001-ATQuRfV9gdaseCj7tXiNHGtmJvKR3o.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  VIEW CERTIFICATE →
                </a>
              </div>
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "30px",
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h4 style={{ fontFamily: "var(--syne)", fontSize: "1.3rem", marginBottom: "10px" }}>
                  Java (Basic)
                </h4>
                <p style={{ color: "#888", marginBottom: "15px" }}>HackerRank</p>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.9rem" }}>Earned on: 11 Oct, 2025</p>
                <a
                  href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/java%20certificate-7WHZ3UzaUAV0LkHldZ3oPHFTXQUTxC.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  VIEW CERTIFICATE →
                </a>
              </div>
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "30px",
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h4 style={{ fontFamily: "var(--syne)", fontSize: "1.3rem", marginBottom: "10px" }}>
                  Full-Stack Development 101
                </h4>
                <p style={{ color: "#888", marginBottom: "15px" }}>Simplilearn</p>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.9rem" }}>Completed: 25 May, 2026</p>
                <a
                  href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-25%20at%2023.35.20-B2AdfGWwh6orSAv1pKijjfMzgr9Si1.jpeg"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  VIEW CERTIFICATE →
                </a>
              </div>
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "30px",
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h4 style={{ fontFamily: "var(--syne)", fontSize: "1.3rem", marginBottom: "10px" }}>
                  Introduction to Machine Learning
                </h4>
                <p style={{ color: "#888", marginBottom: "15px" }}>AWS Training & Certification</p>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.9rem" }}>Completed: 25 May, 2026</p>
                <a
                  href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ML%20Certificate_page-0001-KsrRiFCPkYLdY5oYhS8MOfPn8AztQr.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  VIEW CERTIFICATE →
                </a>
              </div>
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "30px",
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h4 style={{ fontFamily: "var(--syne)", fontSize: "1.3rem", marginBottom: "10px" }}>
                  Getting Started with AI on Jetson Nano
                </h4>
                <p style={{ color: "#888", marginBottom: "15px" }}>NVIDIA</p>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.9rem" }}>Completed: 25 Dec, 2025</p>
                <a
                  href="https://learn.nvidia.com/certificates?id=vfGMHdW4RQG95Fygmlx1sA"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  VIEW CERTIFICATE →
                </a>
              </div>
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "30px",
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h4 style={{ fontFamily: "var(--syne)", fontSize: "1.3rem", marginBottom: "10px" }}>
                  Cyber Security Job Simulation
                </h4>
                <p style={{ color: "#888", marginBottom: "15px" }}>Deloitte</p>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.9rem" }}>Completed: 13 Nov, 2025</p>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.85rem" }}>
                  Verification Code: HcyJrfExZ8gAQJTYj
                </p>
                <p style={{ color: "#666", marginBottom: "10px", fontSize: "0.85rem" }}>
                  Certificate verified and stored securely
                </p>
                <a
                  href="/deloitte-cyber-security-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  VIEW CERTIFICATE →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        {/* ABOUT / FOUNDER SECTION */}
        <section id="founder">
          <div className="container">
            <div style={{ marginBottom: "60px" }}>
              <h2
                style={{
                  fontSize: "3rem",
                  fontFamily: "var(--syne)",
                  marginBottom: "10px",
                }}
                className="reveal-text"
              >
                FOUNDER OF VISIONIX
              </h2>
              <p style={{ color: "var(--accent)", fontFamily: "var(--syne)", fontSize: "1.2rem", fontWeight: 600 }}>
                ABOUT VISIONIX
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
              {/* Image */}
              <div>
                <div style={{ position: "relative" }}>
                  <img
                    src="/founder-portrait.png"
                    alt="Founder of VISIONIX"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "0",
                      filter: "grayscale(1)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div style={{ paddingTop: "30px" }}>
                <p
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 300,
                    color: "#ccc",
                    lineHeight: "1.8",
                    marginBottom: "30px",
                  }}
                >
                  VISIONIX is a product and service-based company dedicated to solving real-world problems with innovative AI-powered solutions. Leading a dynamic team of 2 co-founders and 10 talented crew members, we&apos;re committed to building the future of intelligent technology.
                </p>

                <div
                  style={{
                    paddingTop: "30px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "10px" }}>CORE EXPERTISE</p>
                  <p style={{ color: "#ccc", lineHeight: "1.8" }}>
                    AI Engineering • Product Development • System Design • Machine Learning • Full Stack Development
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact">
          <div className="container">
            <div style={{ marginBottom: "60px" }}>
              <h2
                style={{
                  fontSize: "3rem",
                  fontFamily: "var(--syne)",
                  marginBottom: "40px",
                }}
              >
                LET&apos;S — CONNECT
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginBottom: "80px" }}>
              {/* Contact Form */}
              <div>
                <h3 style={{ fontFamily: "var(--syne)", fontSize: "1.5rem", marginBottom: "30px" }}>GET IN TOUCH</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.currentTarget
                    const formData = new FormData(form)
                    const name = formData.get("name")?.toString().trim() ?? ""
                    const email = formData.get("email")?.toString().trim() ?? ""
                    const message = formData.get("message")?.toString().trim() ?? ""

                    // Basic validation
                    if (!name || !email || !message) {
                      setFormStatus("Please fill out all fields.")
                      return
                    }

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(email)) {
                      setFormStatus("Please enter a valid email address.")
                      return
                    }

                    setSending(true)
                    setFormStatus(null)

                    try {
                      // Send email via EmailJS (client-side)
                      await sendEmailJS({ name, email, message })

                      // Persist message via existing server API (keeps Firestore / admin flow)
                      const response = await fetch("/api/contact", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name, email, message }),
                      })

                      if (!response.ok) {
                        const result = await response.json().catch(() => ({}))
                        throw new Error(result.error || "Failed to save message.")
                      }

                      form.reset()
                      setFormStatus("Message sent successfully.")
                      toast({ title: "Message sent successfully." })
                    } catch (error: any) {
                      console.error("Contact send error:", error)
                      setFormStatus("Failed to send message.")
                      toast({ title: "Failed to send message.", description: error?.message })
                    } finally {
                      setSending(false)
                    }
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>
                      YOUR NAME
                    </label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      name="name"
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontFamily: "inherit",
                        fontSize: "1rem",
                        transition: "all 0.3s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>
                      YOUR EMAIL
                    </label>
                    <input
                      suppressHydrationWarning
                      type="email"
                      name="email"
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontFamily: "inherit",
                        fontSize: "1rem",
                        transition: "all 0.3s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>
                      WHAT DO YOU WANT TO CONNECT ABOUT?
                    </label>
                    <textarea
                      suppressHydrationWarning
                      name="message"
                      required
                      rows={5}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontFamily: "inherit",
                        fontSize: "1rem",
                        resize: "vertical",
                        transition: "all 0.3s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      }}
                    />
                  </div>

                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={sending}
                    style={{
                      padding: "14px 32px",
                      background: sending ? "rgba(255,255,255,0.2)" : "white",
                      color: sending ? "rgba(0,0,0,0.6)" : "black",
                      border: "none",
                      fontFamily: "var(--syne)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      cursor: sending ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      marginTop: "10px",
                    }}
                    onMouseEnter={(e) => {
                      if (sending) return
                      e.currentTarget.style.background = "var(--accent)"
                      e.currentTarget.style.color = "white"
                    }}
                    onMouseLeave={(e) => {
                      if (sending) return
                      e.currentTarget.style.background = "white"
                      e.currentTarget.style.color = "black"
                    }}
                  >
                    {sending ? "SENDING..." : "SEND MESSAGE"}
                  </button>
                </form>
                {formStatus ? (
                  <p style={{ marginTop: "16px", color: "#ccc" }}>{formStatus}</p>
                ) : null}
              </div>

              {/* Contact Info & Social Links */}
              <div>
                <h3 style={{ fontFamily: "var(--syne)", fontSize: "1.5rem", marginBottom: "30px" }}>CONNECT WITH ME</h3>

                <div style={{ marginBottom: "40px" }}>
                  <p style={{ color: "#888", marginBottom: "8px", fontSize: "0.9rem" }}>EMAIL</p>
                  <a
                    href="mailto:abhinavrishisaka@gmail.com"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                  >
                    abhinavrishisaka@gmail.com
                  </a>
                </div>

                <div style={{ marginBottom: "50px" }}>
                  <p style={{ color: "#888", marginBottom: "15px", fontSize: "0.9rem", textTransform: "uppercase" }}>
                    FOLLOW ME
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <a
                      href="https://linkedin.com/in/abhinavrishisaka"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "12px 24px",
                        background: "white",
                        color: "black",
                        border: "none",
                        fontFamily: "var(--syne)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        display: "inline-block",
                        textAlign: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--accent)";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "black";
                      }}
                    >
                      → LINKEDIN
                    </a>
                    <a
                      href="https://github.com/Abhinav6305"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "12px 24px",
                        background: "white",
                        color: "black",
                        border: "none",
                        fontFamily: "var(--syne)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        display: "inline-block",
                        textAlign: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--accent)";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "black";
                      }}
                    >
                      → GITHUB
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "var(--syne)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                color: "#555",
                flexWrap: "wrap",
                gap: "20px",
                paddingTop: "30px",
              }}
            >
              <div>© 2026 ABHINAV RISHI</div>
              <div>DESIGN BY ABHINAV</div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
