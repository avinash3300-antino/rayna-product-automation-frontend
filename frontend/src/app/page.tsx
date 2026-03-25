"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─────────────────── helpers ─────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(id);
      }
      setCount(current);
    }, 30);
    return () => clearInterval(id);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-bold text-white text-2xl md:text-3xl font-[family-name:var(--font-playfair)]">
      {count}
      {suffix}
    </span>
  );
}

function SectionWrapper({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className={`relative px-6 md:px-12 lg:px-24 py-20 md:py-28 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────────── data ─────────────────── */
const pipelineStages = [
  { icon: "🔍", name: "Intelligence Filter", color: "purple" },
  { icon: "📡", name: "Data Ingestion", color: "purple" },
  { icon: "🗄️", name: "Raw Data Store", color: "purple" },
  { icon: "🤖", name: "AI Classifier", color: "purple" },
  { icon: "🗂️", name: "Attribute Mapper", color: "purple" },
  { icon: "✍️", name: "Content Engine", color: "amber" },
  { icon: "👁️", name: "Human Review", color: "amber" },
  { icon: "🧪", name: "Staging", color: "purple" },
  { icon: "🚀", name: "Production", color: "purple" },
];

const beforeItems = [
  "Manual data entry for every product",
  "Inconsistent attribute schemas",
  "No SEO strategy at product level",
  "Scraping legal risks ignored",
  "No audit trail on data changes",
  "Packages built in spreadsheets",
  "Weeks to launch a new destination",
];

const afterItems = [
  "Automated ingestion via official APIs",
  "Schema-enforced attribute mapping per category",
  "Ahrefs-powered SEO content per product",
  "API-first, ToS-compliant data policy",
  "Full audit trail on every pipeline action",
  "Rules-based Package Builder with pricing engine",
  "New destination live in hours, not weeks",
];

const pipelineCards = [
  {
    stage: 1,
    icon: "🔍",
    name: "Destination Intelligence Filter",
    desc: "Ahrefs keyword research + source discovery + approved website list compilation before ingestion begins.",
    type: "auto",
  },
  {
    stage: 2,
    icon: "📡",
    name: "Data Ingestion",
    desc: "Official APIs (Booking.com, Viator, GetYourGuide) as primary sources. Governed scraping only where ToS explicitly permits.",
    type: "auto",
  },
  {
    stage: 3,
    icon: "🗄️",
    name: "Raw Data Store",
    desc: "Every record stored with source URL, timestamp, confidence score, and ToS approval flag. Full raw audit trail.",
    type: "auto",
  },
  {
    stage: 4,
    icon: "🤖",
    name: "AI Classifier",
    desc: "Claude API classifies each record into Hotels, Attractions, Transfers, or Restaurants with a 0.0–1.0 confidence score.",
    type: "auto",
  },
  {
    stage: 5,
    icon: "🗂️",
    name: "Attribute Mapper",
    desc: "Category-specific schema enforcement. Incomplete records flagged and routed to enrichment queue automatically.",
    type: "auto",
  },
  {
    stage: 6,
    icon: "✍️",
    name: "AI Content Engine",
    desc: "Claude API + Ahrefs keywords generate descriptions, meta tags, FAQs, Schema.org markup, and image alt text per product.",
    type: "human",
  },
  {
    stage: 7,
    icon: "👁️",
    name: "Human Review Gates",
    desc: "Queue A: classification review. Queue B: content approval. Nothing reaches staging without passing both gates.",
    type: "human",
  },
  {
    stage: 8,
    icon: "🧪",
    name: "Staging Environment",
    desc: "Full production mirror. Every batch validated before the Product Manager approves the production push.",
    type: "auto",
  },
  {
    stage: 9,
    icon: "🚀",
    name: "Production Push",
    desc: "Upsert logic with full rollback by job ID. Package Builder assembles packages automatically post-push.",
    type: "auto",
  },
];

const featurePillars = [
  {
    icon: "🧠",
    title: "Destination Intelligence Filter",
    desc: "Before fetching a single record, the system queries Ahrefs for the top 50 keywords for your destination, scores every candidate data source by domain authority and keyword relevance, and compiles a ranked Approved Source List — automatically, every run.",
    stat: "50 keywords researched per destination",
  },
  {
    icon: "🔒",
    title: "Legal-First Data Policy",
    desc: "Official APIs are the mandatory primary source. Web scraping is permitted only for sources that pass a legal approval checklist — with ToS status, robots.txt check, and data usage rights verified for every candidate source before it enters the pipeline.",
    stat: "0 unauthorised scraping targets",
  },
  {
    icon: "🤖",
    title: "AI Content at Scale",
    desc: "Claude API generates 7 content outputs per product: short description, long description, meta title, meta description, FAQ section (3–5 Q&As targeting Google PAA), Schema.org JSON-LD markup, and SEO image alt text — all keyword-grounded via Ahrefs.",
    stat: "7 SEO outputs generated per product",
  },
  {
    icon: "📦",
    title: "Intelligent Package Builder",
    desc: "7 package types with configurable JSON combination rules. Automated pricing engine: base cost + configurable margin + floor price guard. AI-generated day-by-day itineraries. Packages flagged as incomplete if any net rate data is missing.",
    stat: "20% default margin, configurable per type",
  },
];

const productCategories = [
  {
    icon: "🏨",
    name: "Hotels",
    source: "Booking.com API + Hotelbeds",
    schema: [
      "23 attributes including star rating, room types",
      "Board types (RO/BB/HB/FB/AI), amenities (min 5)",
      "Cancellation policy, net rate",
    ],
    phase: "Phase 2 — Pilot",
    phaseColor: "text-[#C9A84C]",
    badgeBg: "bg-[#C9A84C]/10 border-[#C9A84C]/30",
  },
  {
    icon: "🎡",
    name: "Attractions",
    source: "Viator Partner API + GetYourGuide",
    schema: [
      "Operating hours by weekday",
      "Ticket types (Adult/Child/Family/Senior)",
      "Typical visit duration, minimum age restriction",
    ],
    phase: "Phase 3",
    phaseColor: "text-[#00D4B4]",
    badgeBg: "bg-[#00D4B4]/10 border-[#00D4B4]/30",
  },
  {
    icon: "🚗",
    name: "Transfers",
    source: "Direct Supplier APIs + Rayna Internal DB",
    schema: [
      "Origin → Destination routing",
      "Vehicle type (Sedan/Van/Minibus/Coach/Luxury)",
      "Pax limits, flight monitoring for airport transfers",
    ],
    phase: "Phase 3",
    phaseColor: "text-[#00D4B4]",
    badgeBg: "bg-[#00D4B4]/10 border-[#00D4B4]/30",
  },
  {
    icon: "🍽️",
    name: "Restaurants",
    source: "TripAdvisor Content API + Google Places",
    schema: [
      "Cuisine multi-select, halal certification",
      "Average spend per person, reservation required",
      "Operating hours by day",
    ],
    phase: "Phase 4",
    phaseColor: "text-[#F59E0B]",
    badgeBg: "bg-[#F59E0B]/10 border-[#F59E0B]/30",
  },
];

const tagDimensions = [
  {
    icon: "💰",
    label: "Budget Tier",
    color: "#C9A84C",
    tags: ["Budget", "Mid-Range", "Luxury", "Ultra-Luxury"],
  },
  {
    icon: "🌊",
    label: "Travel Theme",
    color: "#00D4B4",
    tags: [
      "Beach & Coastal",
      "Adventure & Outdoor",
      "Romance & Couples",
      "Family & Kids",
      "Culture & Heritage",
      "Food & Dining",
      "Wellness & Spa",
      "Nightlife",
      "Business & MICE",
    ],
  },
  {
    icon: "👥",
    label: "Audience",
    color: "#A78BFA",
    tags: [
      "Solo Traveller",
      "Couples",
      "Families with Young Children",
      "Families with Teenagers",
      "Groups (5+)",
      "Senior Travellers",
      "Corporate",
    ],
  },
  {
    icon: "📍",
    label: "Location Type",
    color: "#60A5FA",
    tags: [
      "Beachfront",
      "City Centre",
      "Desert / Inland",
      "Mountain",
      "Island",
      "Waterfront / Marina",
      "Theme Park District",
    ],
  },
  {
    icon: "✨",
    label: "Special Attributes",
    color: "#34D399",
    tags: [
      "Halal-Friendly",
      "Pet-Friendly",
      "Wheelchair Accessible",
      "Eco-Friendly",
      "Pool Included",
      "All-Inclusive",
      "Free Cancellation",
    ],
  },
];

const modules = [
  { icon: "🌍", name: "Destination Dashboard", desc: "Trigger runs, monitor pipeline status" },
  { icon: "📡", name: "Ingestion Monitor", desc: "Real-time job progress per source" },
  { icon: "🔍", name: "Review Queue A", desc: "Classify low-confidence records manually" },
  { icon: "✍️", name: "Review Queue B", desc: "Approve or edit AI-generated content" },
  { icon: "📦", name: "Product Browser", desc: "Browse all products by destination/category" },
  { icon: "🎛️", name: "Attribute Editor", desc: "Edit fields, flag missing data, bulk edit" },
  { icon: "🔗", name: "Booking Source Mapper", desc: "Assign Source 1/2/3 per product" },
  { icon: "🏷️", name: "Tag Manager", desc: "Apply taxonomy tags, review AI suggestions" },
  { icon: "📋", name: "Package Builder", desc: "Assemble packages with pricing engine" },
  { icon: "✅", name: "Staging Approval", desc: "Review diff, approve production push" },
  { icon: "📊", name: "Monitoring & Alerts", desc: "Freshness heatmap, API health, errors" },
];

const roadmapPhases = [
  {
    phase: 1,
    title: "Foundation",
    weeks: "Weeks 1–4",
    color: "#60A5FA",
    items: ["API audit", "Legal review", "Schema sign-off", "API partnerships", "Tag taxonomy approval"],
  },
  {
    phase: 2,
    title: "Hotels Pilot",
    weeks: "Weeks 5–12",
    color: "#C9A84C",
    items: ["End-to-end hotel pipeline", "Review Queues A+B", "Basic Operations UI", "Booking Source Mapper"],
  },
  {
    phase: 3,
    title: "Attractions & Transfers",
    weeks: "Weeks 13–20",
    color: "#00D4B4",
    items: ["Full pipeline", "Package Builder", "Full Booking Source UI", "AI auto-tagging"],
  },
  {
    phase: 4,
    title: "Scale & Restaurants",
    weeks: "Weeks 21–28",
    color: "#22C55E",
    items: [
      "Restaurants",
      "Automated refresh cadence",
      "Multi-destination parallel runs",
      "All package types live",
    ],
  },
];

const techRows = [
  {
    label: "AI & Data",
    items: ["Claude API (Anthropic)", "Ahrefs API", "PostgreSQL 16"],
  },
  {
    label: "Official APIs",
    items: ["Booking.com Affiliate", "Viator Partner", "GetYourGuide", "Google Places"],
  },
  {
    label: "Infrastructure",
    items: ["n8n (Pipeline Orchestration)", "Node.js / Fastify", "React 18 + Tailwind", "Apify / Bright Data", "Grafana + PagerDuty"],
  },
];

const risks = [
  {
    title: "Scraping ToS Violations",
    resolution: "API-first policy. Scraping limited to verified ToS-compliant sources only.",
  },
  {
    title: "Classification Errors in Product Master",
    resolution: "Mandatory Human Review Queue A before any API push.",
  },
  {
    title: "Package Rules Undefined",
    resolution: "Full package typology + pricing engine defined.",
  },
  {
    title: "Human Review Gates Missing",
    resolution: "Two mandatory queues: Classification + Content.",
  },
  {
    title: "Anti-Bot Blocking",
    resolution: "Managed scraping via Apify/Bright Data — not in-house.",
  },
];

/* ─────────────────── navbar hook ─────────────────── */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/* ─────────────────── COMPONENT ─────────────────── */
export default function Home() {
  const scrolled = useScrolled();
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pipeline", href: "#pipeline" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Tech Stack", href: "#tech" },
  ];

  return (
    <div className="min-h-screen bg-[#0A1628] text-white font-[family-name:var(--font-dm-sans)] dot-grid-bg">
      {/* ═══ SECTION 1 — NAVBAR ═══ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A1628]/90 backdrop-blur-md border-b border-[#C9A84C]/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-[#C9A84C] font-bold text-lg tracking-wide">RAYNA TOURS</span>
            <span className="text-[#8899AA] text-sm hidden sm:inline">Product Automation</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[#8899AA] hover:text-white text-sm transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="btn-ghost-gold px-4 py-2 rounded-lg text-sm font-medium"
            >
              Sign In
            </a>
            <a
              href="#access"
              className="btn-gold px-4 py-2 rounded-lg text-sm font-semibold hidden sm:inline-block"
            >
              Get Access
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ SECTION 2 — HERO ═══ */}
      <section className="min-h-screen flex items-center pt-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-[11px] uppercase tracking-[0.1em] text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full px-4 py-1.5 mb-6">
              Internal Platform · Version 2.2 · March 2026
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
              From Destination Name
              <br />
              to Published Catalogue.
              <br />
              <span className="text-[#C9A84C]">Fully Automated.</span>
            </h1>
            <p className="text-[#8899AA] text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              Ingest, classify, enrich, and publish hotels, attractions, and transfers across any
              destination — powered by Claude AI, Ahrefs keyword data, and a governed human review
              pipeline.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="/login" className="btn-gold px-6 py-3 rounded-lg font-semibold text-sm">
                Sign In to Platform
              </a>
              <a href="#pipeline" className="btn-ghost-gold px-6 py-3 rounded-lg font-medium text-sm">
                View Documentation
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {[
                { value: 9, label: "Pipeline Stages" },
                { value: 4, label: "Product Categories" },
                { value: 2, label: "Human Review Gates" },
                { value: 100, label: "Audit Trail", suffix: "%" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  {i > 0 && <span className="text-[#C9A84C] text-lg">·</span>}
                  <div className="text-center">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                    <p className="text-[#8899AA] text-xs mt-1">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Pipeline Diagram */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-col items-center relative"
          >
            <PipelineDiagram />
          </motion.div>
        </div>
      </section>

      {/* ═══ SECTION 3 — BEFORE vs AFTER ═══ */}
      <SectionWrapper className="bg-[#0D1B2E]">
        <motion.h2
          variants={fadeUp}
          className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold text-center mb-16"
        >
          The Old Way vs. <span className="text-[#C9A84C]">The Rayna Way</span>
        </motion.h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before */}
          <motion.div variants={stagger} className="space-y-4">
            {beforeItems.map((item, i) => (
              <motion.div
                key={i}
                variants={slideLeft}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 bg-[#EF4444]/5 border border-[#EF4444]/10 rounded-lg px-4 py-3"
              >
                <span className="text-[#EF4444] text-lg shrink-0">✕</span>
                <span className="text-[#8899AA] text-sm">{item}</span>
              </motion.div>
            ))}
          </motion.div>
          {/* After */}
          <motion.div variants={stagger} className="space-y-4">
            {afterItems.map((item, i) => (
              <motion.div
                key={i}
                variants={slideRight}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 bg-[#C9A84C]/5 border border-[#C9A84C]/10 rounded-lg px-4 py-3"
              >
                <span className="text-[#22C55E] text-lg shrink-0">✓</span>
                <span className="text-[#CDD5DE] text-sm">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* ═══ SECTION 4 — 9-STAGE PIPELINE ═══ */}
      <SectionWrapper id="pipeline">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold mb-4">
            The <span className="text-[#C9A84C]">9-Stage</span> Automated Pipeline
          </h2>
          <p className="text-[#8899AA] max-w-2xl mx-auto">
            Every product follows a governed, auditable journey from raw data source to live
            catalogue entry.
          </p>
        </motion.div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipelineCards.map((card) => (
            <motion.div
              key={card.stage}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className={`card-hover bg-[#111F35] rounded-xl p-6 border border-white/5 ${
                card.type === "human"
                  ? "border-l-4 border-l-[#F59E0B]"
                  : "border-l-4 border-l-[#A78BFA]"
              }`}
            >
              <span className="text-[#C9A84C] font-[family-name:var(--font-playfair)] text-3xl font-bold">
                {String(card.stage).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2 mt-3 mb-2">
                <span className="text-xl">{card.icon}</span>
                <h3 className="font-semibold text-white">{card.name}</h3>
              </div>
              <p className="text-[#8899AA] text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══ SECTION 5 — 4 FEATURE PILLARS ═══ */}
      <SectionWrapper id="features" className="bg-[#0D1B2E]">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold mb-4">
            Built for Scale. <span className="text-[#C9A84C]">Built for Governance.</span>
          </h2>
        </motion.div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {featurePillars.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="card-hover bg-[#111F35] rounded-xl p-8 border border-white/5 border-l-4 border-l-[#00D4B4] relative"
            >
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-xl text-white mb-3">{f.title}</h3>
              <p className="text-[#8899AA] text-sm leading-relaxed mb-6">{f.desc}</p>
              <span className="inline-block text-[11px] uppercase tracking-[0.1em] text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full px-3 py-1">
                {f.stat}
              </span>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══ SECTION 6 — PRODUCT CATEGORIES ═══ */}
      <SectionWrapper>
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold mb-4">
            Every Product Type. <span className="text-[#C9A84C]">One Unified Pipeline.</span>
          </h2>
        </motion.div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCategories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="card-hover bg-[#111F35] rounded-xl p-6 border border-white/5 flex flex-col"
            >
              <span className="text-5xl mb-4">{cat.icon}</span>
              <h3 className="font-semibold text-xl text-white mb-2">{cat.name}</h3>
              <span className="inline-block text-xs text-[#8899AA] bg-[#0A1628] rounded px-2 py-1 mb-4 w-fit">
                {cat.source}
              </span>
              <ul className="text-[#8899AA] text-xs space-y-1.5 mb-4 flex-1">
                {cat.schema.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#00D4B4] mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
              <span
                className={`inline-block text-[11px] uppercase tracking-[0.1em] ${cat.phaseColor} ${cat.badgeBg} border rounded-full px-3 py-1 w-fit`}
              >
                {cat.phase}
              </span>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══ SECTION 7 — TAG TAXONOMY ═══ */}
      <SectionWrapper className="bg-[#0D1B2E]">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold mb-4">
            A Tag Taxonomy <span className="text-[#C9A84C]">Built for Real Filtering</span>
          </h2>
          <p className="text-[#8899AA]">5 dimensions · 40+ tags · AI-suggested · Human-confirmed</p>
        </motion.div>
        <div className="max-w-5xl mx-auto space-y-8">
          {tagDimensions.map((dim) => (
            <motion.div key={dim.label} variants={fadeUp} transition={{ duration: 0.4 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{dim.icon}</span>
                <span className="text-sm font-semibold text-white">{dim.label}</span>
              </div>
              <motion.div variants={stagger} className="flex flex-wrap gap-2">
                {dim.tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    variants={fadeUp}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="tag-chip text-xs px-3 py-1.5 rounded-full border cursor-default"
                    style={{
                      color: dim.color,
                      borderColor: `${dim.color}33`,
                      backgroundColor: `${dim.color}0D`,
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══ SECTION 8 — OPERATIONS UI MODULES ═══ */}
      <SectionWrapper>
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold mb-4">
            Everything in One <span className="text-[#C9A84C]">Operations Centre</span>
          </h2>
          <p className="text-[#8899AA]">11 modules. 5 user roles. Zero context-switching.</p>
        </motion.div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m) => (
            <motion.div
              key={m.name}
              variants={fadeUp}
              transition={{ duration: 0.3 }}
              className="card-hover bg-[#111F35] rounded-xl p-5 border border-white/5 flex items-start gap-4"
            >
              <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-[#C9A84C]/10 shrink-0">
                {m.icon}
              </span>
              <div>
                <h3 className="font-semibold text-white text-sm">{m.name}</h3>
                <p className="text-[#8899AA] text-xs mt-1">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

     

      {/* ═══ SECTION 10 — TECH STACK ═══ */}
      <SectionWrapper id="tech">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold mb-4">
            Enterprise-Grade <span className="text-[#C9A84C]">Technology Stack</span>
          </h2>
        </motion.div>
        <div className="max-w-4xl mx-auto space-y-8">
          {techRows.map((row) => (
            <motion.div key={row.label} variants={fadeUp} transition={{ duration: 0.4 }}>
              <span className="text-[11px] uppercase tracking-[0.1em] text-[#8899AA] mb-3 block">
                {row.label}
              </span>
              <div className="flex flex-wrap gap-3">
                {row.items.map((item) => (
                  <span
                    key={item}
                    className="card-hover text-sm text-white bg-[#111F35] border border-white/5 rounded-lg px-4 py-2.5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══ SECTION 11 — RISK MITIGATION ═══ */}
      <SectionWrapper className="bg-gradient-to-b from-[#C9A84C]/5 to-[#0A1628]">
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-semibold">
            All 5 HIGH-Severity Risks from v1.0 —{" "}
            <span className="text-[#22C55E]">Resolved in v2.2</span>
          </h2>
        </motion.div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {risks.map((r) => (
            <motion.div
              key={r.title}
              variants={fadeUp}
              transition={{ duration: 0.3 }}
              className="bg-[#111F35] border border-white/5 border-l-4 border-l-[#C9A84C] rounded-lg p-5"
            >
              <div className="flex items-start gap-3">
                <span className="text-[#22C55E] text-lg shrink-0">✓</span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{r.title}</h3>
                  <p className="text-[#8899AA] text-xs leading-relaxed">{r.resolution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══ SECTION 12 — CTA + FOOTER ═══ */}
      <section className="relative px-6 md:px-12 lg:px-24 py-28" id="access">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.12)_0%,_transparent_70%)]" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative text-center max-w-2xl mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold mb-6"
          >
            Ready to Automate
            <br />
            <span className="text-[#C9A84C]">Your Catalogue?</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8899AA] mb-10">
            Sign in to the platform or contact the Strategy & Analytics team to request access.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <a href="/login" className="btn-gold px-8 py-3.5 rounded-lg font-semibold text-sm">
              Sign In to Platform
            </a>
            <a href="#" className="btn-ghost-gold px-8 py-3.5 rounded-lg font-medium text-sm">
              Contact Team
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C9A84C]/10 px-6 md:px-12 lg:px-24 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#C9A84C] font-bold text-sm tracking-wide">RAYNA TOURS</span>
            <span className="text-[#8899AA] text-xs">Product Automation</span>
          </div>
          <div className="flex items-center gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-[#8899AA] hover:text-white text-xs transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <span className="text-[#8899AA] text-xs">Confidential — Internal Use Only</span>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#C9A84C]/5 text-center">
          <p className="text-[#556677] text-xs">
            © 2026 Rayna Tours · Automated Product Creation System v2.2 · Prepared by Strategy &
            Analytics, Rayna Tours
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────── Pipeline SVG Diagram ─────────────────── */
function PipelineDiagram() {
  const nodeSpacing = 64;
  const nodeRadius = 20;
  const svgWidth = 260;
  const centerX = svgWidth / 2;
  const startY = 30;
  const totalHeight = startY + pipelineStages.length * nodeSpacing + 20;

  return (
    <div className="relative" style={{ height: totalHeight, width: svgWidth }}>
      <svg
        width={svgWidth}
        height={totalHeight}
        viewBox={`0 0 ${svgWidth} ${totalHeight}`}
        fill="none"
        className="absolute inset-0"
      >
        {/* Connecting lines */}
        {pipelineStages.map((_, i) => {
          if (i === pipelineStages.length - 1) return null;
          const y1 = startY + i * nodeSpacing + nodeRadius;
          const y2 = startY + (i + 1) * nodeSpacing - nodeRadius;
          return (
            <line
              key={`line-${i}`}
              x1={centerX}
              y1={y1}
              x2={centerX}
              y2={y2}
              stroke="rgba(201,168,76,0.2)"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {pipelineStages.map((stage, i) => {
        const y = startY + i * nodeSpacing;
        const isAmber = stage.color === "amber";
        return (
          <div
            key={stage.name}
            className="absolute flex items-center gap-3 group"
            style={{ top: y - nodeRadius, left: 0, width: "100%", height: nodeRadius * 2 }}
          >
            <div
              className="shrink-0 rounded-full flex items-center justify-center text-sm transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(201,168,76,0.4)]"
              style={{
                width: nodeRadius * 2,
                height: nodeRadius * 2,
                marginLeft: centerX - nodeRadius,
                background: isAmber
                  ? "linear-gradient(135deg, #F59E0B33, #F59E0B11)"
                  : "linear-gradient(135deg, #A78BFA33, #A78BFA11)",
                border: `1.5px solid ${isAmber ? "#F59E0B55" : "#A78BFA55"}`,
              }}
            >
              {stage.icon}
            </div>
            <span className="text-xs text-[#8899AA] whitespace-nowrap group-hover:text-white transition-colors">
              {stage.name}
            </span>
          </div>
        );
      })}

      {/* Animated travelling dot */}
      <div
        className="absolute w-3 h-3 rounded-full pipeline-dot"
        style={{
          left: centerX - 6,
          background: "linear-gradient(135deg, #C9A84C, #00D4B4)",
          animation: `travelDown ${pipelineStages.length * 0.6}s linear infinite, glow-pulse 2s ease-in-out infinite`,
        }}
      />
      <style jsx>{`
        @keyframes travelDown {
          0% {
            top: ${startY}px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: ${startY + (pipelineStages.length - 1) * nodeSpacing}px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
