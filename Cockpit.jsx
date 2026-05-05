import React, { useState, useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from "recharts";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Circle, Download, Mail,
  Building2, User, Briefcase, TrendingUp, AlertCircle, Sparkles,
  ChevronRight, Award, Target, Database, Workflow, Bot, BarChart3
} from "lucide-react";

// ─── DESIGN TOKENS (ATS brand) ─────────────────────────────────────
const C = {
  navy: "#0d1f3c",
  navyDeep: "#091530",
  navySoft: "#142a4f",
  red: "#c8102e",
  redDeep: "#a00d25",
  ink: "#0a0e1a",
  paper: "#f4f5f7",
  paperWarm: "#ebedf0",
  line: "#d8dce2",
  lineSoft: "#e6e9ee",
  text: "#1a2238",
  textSoft: "#5a6478",
  textMute: "#8d96a8",
  green: "#0d8050",
  amber: "#b8860b",
  white: "#ffffff",
};
const FONT_DISPLAY = "'Bebas Neue', 'Oswald', sans-serif";
const FONT_BODY = "'DM Sans', 'Helvetica Neue', sans-serif";
const FONT_MONO = "'Roboto Mono', 'JetBrains Mono', monospace";

// ─── ASSESSMENT STRUCTURE ──────────────────────────────────────────
// 5 dimensions × 5 questions = 25 questions, mapped to the published
// Growth OS framework: Demand, Data & Intelligence, Process & Governance,
// AI Workforce, Continuous Optimization.
const DIMENSIONS = [
  {
    id: "demand",
    num: "01",
    name: "Demand System",
    icon: Target,
    blurb: "How predictably you generate qualified pipeline.",
    questions: [
      { q: "How would you describe your pipeline generation today?", opts: [
        { label: "Reactive — pipeline depends on outbound sales effort", score: 1 },
        { label: "Campaign-driven — spikes when we run something", score: 2 },
        { label: "Multi-channel mix, but inconsistent results", score: 3 },
        { label: "Repeatable system producing steady pipeline", score: 4 },
        { label: "Predictive engine with forecastable output by segment", score: 5 },
      ]},
      { q: "Can you tie marketing-sourced revenue to specific channels?", opts: [
        { label: "Not really — we track activity, not revenue", score: 1 },
        { label: "Partially — last-touch attribution only", score: 2 },
        { label: "Multi-touch attribution, but trust is mixed", score: 3 },
        { label: "Yes — channel-level revenue contribution is clear", score: 4 },
        { label: "Yes, with predictive ROI by channel and segment", score: 5 },
      ]},
      { q: "How do you identify accounts most likely to buy?", opts: [
        { label: "We don't — sales picks targets", score: 1 },
        { label: "Basic ICP firmographics", score: 2 },
        { label: "ICP plus engagement scoring", score: 3 },
        { label: "Intent data combined with behavioral signals", score: 4 },
        { label: "Predictive propensity model with daily scoring", score: 5 },
      ]},
      { q: "How fast does an MQL reach a sales conversation?", opts: [
        { label: "Days — or it falls through the cracks", score: 1 },
        { label: "24 hours, sometimes longer", score: 2 },
        { label: "Within 24 hours, mostly", score: 3 },
        { label: "Within 4 hours via defined SLA", score: 4 },
        { label: "Within 1 hour with automated routing", score: 5 },
      ]},
      { q: "Is your demand generation tied to revenue forecasts?", opts: [
        { label: "No — it's a separate marketing plan", score: 1 },
        { label: "Loosely — annual targets only", score: 2 },
        { label: "Quarterly pipeline targets exist but aren't binding", score: 3 },
        { label: "Pipeline targets reverse-engineered from revenue plan", score: 4 },
        { label: "Continuous forecast tied to live signal data", score: 5 },
      ]},
    ],
  },
  {
    id: "data",
    num: "02",
    name: "Data & Intelligence",
    icon: Database,
    blurb: "Whether your decisions are driven by real insight or assumption.",
    questions: [
      { q: "How clean and unified is your customer data?", opts: [
        { label: "Scattered across systems with major gaps", score: 1 },
        { label: "Mostly in CRM but with quality issues", score: 2 },
        { label: "Centralized with periodic clean-up", score: 3 },
        { label: "Unified customer view with active governance", score: 4 },
        { label: "Single source of truth with real-time enrichment", score: 5 },
      ]},
      { q: "How do you make marketing decisions today?", opts: [
        { label: "Experience and intuition", score: 1 },
        { label: "Monthly reports reviewed in meetings", score: 2 },
        { label: "Dashboards, but reactive analysis", score: 3 },
        { label: "Live data with weekly decision cycles", score: 4 },
        { label: "Real-time decisioning with automated triggers", score: 5 },
      ]},
      { q: "Do you have visibility into buyer intent before they raise their hand?", opts: [
        { label: "No — we wait for inbound", score: 1 },
        { label: "Some web analytics", score: 2 },
        { label: "Web behavior plus form engagement", score: 3 },
        { label: "Third-party intent data integrated", score: 4 },
        { label: "Multi-source intent fused into propensity scores", score: 5 },
      ]},
      { q: "How quickly can you answer 'what's working' for a campaign?", opts: [
        { label: "Weeks, if at all", score: 1 },
        { label: "End-of-campaign report", score: 2 },
        { label: "Weekly performance review", score: 3 },
        { label: "Daily — via dashboards", score: 4 },
        { label: "Real-time — with automated alerts on signal changes", score: 5 },
      ]},
      { q: "How do you measure marketing's contribution to revenue?", opts: [
        { label: "We don't, formally", score: 1 },
        { label: "Lead volume and MQLs", score: 2 },
        { label: "Sourced pipeline reported quarterly", score: 3 },
        { label: "Sourced and influenced pipeline tracked continuously", score: 4 },
        { label: "Closed-won attribution with predictive forecast", score: 5 },
      ]},
    ],
  },
  {
    id: "process",
    num: "03",
    name: "Process & Governance",
    icon: Workflow,
    blurb: "Whether ownership and execution are clear at every level.",
    questions: [
      { q: "How clear is ownership between marketing and sales?", opts: [
        { label: "Constant friction over leads and accounts", score: 1 },
        { label: "Roles defined but not enforced", score: 2 },
        { label: "Clear roles with occasional disputes", score: 3 },
        { label: "Documented SLAs followed by both teams", score: 4 },
        { label: "Joint accountability with shared metrics", score: 5 },
      ]},
      { q: "How do you handle handoffs between teams?", opts: [
        { label: "Email and hope", score: 1 },
        { label: "CRM tasks but inconsistent follow-through", score: 2 },
        { label: "Defined process with manual oversight", score: 3 },
        { label: "Automated routing with SLA tracking", score: 4 },
        { label: "Closed-loop system with breach alerts and audit log", score: 5 },
      ]},
      { q: "Are there documented standards for how marketing work gets done?", opts: [
        { label: "No — it's tribal knowledge", score: 1 },
        { label: "Some documentation, often outdated", score: 2 },
        { label: "Playbooks for major plays", score: 3 },
        { label: "Standardized workflows with version control", score: 4 },
        { label: "Living operating system with continuous updates", score: 5 },
      ]},
      { q: "How do you ensure quality and brand consistency at scale?", opts: [
        { label: "Spot-checks and luck", score: 1 },
        { label: "Manual review by leadership", score: 2 },
        { label: "Templates plus approval workflow", score: 3 },
        { label: "Defined gates with measurable quality criteria", score: 4 },
        { label: "Automated guardrails plus governance dashboard", score: 5 },
      ]},
      { q: "How are decisions about marketing priorities made?", opts: [
        { label: "Whoever shouts loudest", score: 1 },
        { label: "Annual planning cycle", score: 2 },
        { label: "Quarterly reviews with leadership", score: 3 },
        { label: "Data-driven prioritization framework", score: 4 },
        { label: "Continuous re-prioritization based on live signals", score: 5 },
      ]},
    ],
  },
  {
    id: "ai",
    num: "04",
    name: "AI Workforce",
    icon: Bot,
    blurb: "Whether AI is occasional usage or embedded execution.",
    questions: [
      { q: "How is AI used in your marketing function today?", opts: [
        { label: "Not at all, or experimentation only", score: 1 },
        { label: "Individual contributors using ChatGPT ad-hoc", score: 2 },
        { label: "Some standardized prompts and templates", score: 3 },
        { label: "Defined AI workflows for specific tasks", score: 4 },
        { label: "Structured AI agents embedded in daily execution", score: 5 },
      ]},
      { q: "Do you have repeatable AI workflows owned by specific roles?", opts: [
        { label: "No — it's individual experimentation", score: 1 },
        { label: "A few templates floating around", score: 2 },
        { label: "Documented workflows for some functions", score: 3 },
        { label: "Defined agents with clear inputs and outputs", score: 4 },
        { label: "Full agent library with governance and SLAs", score: 5 },
      ]},
      { q: "How much manual time has AI removed from your operation?", opts: [
        { label: "Minimal — too early to measure", score: 1 },
        { label: "A few hours per person per week", score: 2 },
        { label: "10-20% capacity unlocked", score: 3 },
        { label: "20-40% capacity unlocked across functions", score: 4 },
        { label: "Significant capacity reallocated to higher-value work", score: 5 },
      ]},
      { q: "How do you ensure AI output quality and brand fit?", opts: [
        { label: "We don't — output goes out as-is", score: 1 },
        { label: "Manual review case-by-case", score: 2 },
        { label: "Standardized review workflow", score: 3 },
        { label: "Brand-tuned models plus approval gates", score: 4 },
        { label: "Automated guardrails plus quality scoring", score: 5 },
      ]},
      { q: "Is AI usage tied to measurable business outcomes?", opts: [
        { label: "No — it's about productivity, not revenue", score: 1 },
        { label: "Anecdotal stories of time saved", score: 2 },
        { label: "Some metrics tracked at team level", score: 3 },
        { label: "AI tied to specific revenue and cost outcomes", score: 4 },
        { label: "Every agent has defined ROI and continuous optimization", score: 5 },
      ]},
    ],
  },
  {
    id: "optimize",
    num: "05",
    name: "Continuous Optimization",
    icon: BarChart3,
    blurb: "Whether your system gets sharper every cycle or stays static.",
    questions: [
      { q: "How often is marketing performance reviewed and tuned?", opts: [
        { label: "Annually, at planning time", score: 1 },
        { label: "Quarterly business reviews", score: 2 },
        { label: "Monthly performance meetings", score: 3 },
        { label: "Weekly cycles with documented changes", score: 4 },
        { label: "Continuous — embedded in daily operations", score: 5 },
      ]},
      { q: "Do you systematically test and learn?", opts: [
        { label: "No formal testing", score: 1 },
        { label: "Occasional A/B tests", score: 2 },
        { label: "Regular tests on major channels", score: 3 },
        { label: "Test backlog with prioritization framework", score: 4 },
        { label: "Always-on experimentation with statistical rigor", score: 5 },
      ]},
      { q: "How do you benchmark performance externally?", opts: [
        { label: "We don't — only internal trends", score: 1 },
        { label: "Industry reports occasionally", score: 2 },
        { label: "Annual benchmark study", score: 3 },
        { label: "Quarterly peer comparison", score: 4 },
        { label: "Real-time cohort benchmarking", score: 5 },
      ]},
      { q: "How quickly can you act on a new insight?", opts: [
        { label: "Months — change requires major effort", score: 1 },
        { label: "Quarters, depending on scope", score: 2 },
        { label: "Weeks for most changes", score: 3 },
        { label: "Days — within sprint cycles", score: 4 },
        { label: "Hours — system designed for rapid iteration", score: 5 },
      ]},
      { q: "Does your marketing capability compound over time?", opts: [
        { label: "No — same problems every year", score: 1 },
        { label: "Slow improvement", score: 2 },
        { label: "Steady year-over-year gains", score: 3 },
        { label: "Capability clearly compounds quarter-to-quarter", score: 4 },
        { label: "Meaningfully ahead of peers and accelerating", score: 5 },
      ]},
    ],
  },
];

const TOTAL_Q = DIMENSIONS.reduce((s, d) => s + d.questions.length, 0);

// Cohort and ATS benchmarks (mock values for the demo)
const COHORT_AVG = { demand: 52, data: 48, process: 56, ai: 38, optimize: 51 };
const ATS_BENCH  = { demand: 91, data: 88, process: 95, ai: 94, optimize: 89 };

// ─── PRIMITIVES ────────────────────────────────────────────────────
const Mono = ({ children, style, ...rest }) => (
  <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", ...style }} {...rest}>
    {children}
  </span>
);
const Display = ({ children, size = 48, color = C.navy, style }) => (
  <span style={{ fontFamily: FONT_DISPLAY, fontSize: size, letterSpacing: "0.01em", lineHeight: 0.95, color, fontWeight: 400, ...style }}>
    {children}
  </span>
);
const Slash = ({ children, color = C.red }) => (
  <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textSoft }}>
    <span style={{ color }}>// </span>{children}
  </span>
);

const btnPrimary = {
  background: C.red, color: C.white, border: "none",
  padding: "14px 22px", fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.12em",
  textTransform: "uppercase", fontWeight: 600, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 10,
};
const btnGhost = {
  background: "transparent", color: C.navy, border: `1px solid ${C.line}`,
  padding: "14px 18px", fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.12em",
  textTransform: "uppercase", fontWeight: 500, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 8,
};

// ─── INTRO STAGE ───────────────────────────────────────────────────
function Intro({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: C.paper, fontFamily: FONT_BODY, color: C.text }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${C.line}`, background: C.white, padding: "18px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 11, height: 11, background: C.white }} />
          </div>
          <div>
            <Mono style={{ color: C.textMute, fontSize: 9 }}>● ATS</Mono>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: C.navy, lineHeight: 1, marginTop: 2 }}>GROWTH OS</div>
          </div>
        </div>
        <Mono style={{ color: C.textSoft }}>Maturity Assessment · v2026</Mono>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "60px 36px 40px" }}>
        <Slash>The Growth OS Maturity Assessment</Slash>
        <div style={{ marginTop: 14, marginBottom: 22 }}>
          <Display size={72}>How does your<br/>marketing system<br/><span style={{ color: C.red }}>actually score?</span></Display>
        </div>
        <p style={{ fontSize: 17, color: C.textSoft, lineHeight: 1.55, maxWidth: 680, marginBottom: 36 }}>
          25 questions. 10 minutes. A scored diagnostic across the five dimensions of the
          ATS Growth Operating System — benchmarked against industrial peers and the ATS
          Marketing Floor itself.
        </p>

        {/* What you get */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.line, border: `1px solid ${C.line}`, marginBottom: 40 }}>
          {[
            { label: "Maturity Index", val: "0–100", desc: "Composite score with band: Reactive, Functional, Systematic, or Engine.", icon: Award },
            { label: "Cohort Benchmark", val: "vs. peers", desc: "How you stack against other industrial mid-market companies.", icon: TrendingUp },
            { label: "Top 3 Gaps", val: "Ranked", desc: "Highest-ROI opportunities with projected business impact.", icon: Target },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} style={{ background: C.white, padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Icon size={15} color={C.red} strokeWidth={1.8} />
                  <Mono style={{ color: C.textMute }}>{b.label}</Mono>
                </div>
                <Display size={30}>{b.val}</Display>
                <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 8, lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Dimensions list */}
        <Slash>What gets measured</Slash>
        <div style={{ marginTop: 14, marginBottom: 36, display: "flex", flexDirection: "column", gap: 1, background: C.line, border: `1px solid ${C.line}` }}>
          {DIMENSIONS.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.id} style={{ background: C.white, padding: "16px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <Mono style={{ color: C.red, width: 28 }}>{d.num}</Mono>
                <Icon size={18} color={C.navy} strokeWidth={1.6} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{d.name}</div>
                  <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 2 }}>{d.blurb}</div>
                </div>
                <Mono style={{ color: C.textMute }}>5 Q</Mono>
              </div>
            );
          })}
        </div>

        <button onClick={onStart} style={btnPrimary}>
          → Start the assessment
        </button>
        <span style={{ marginLeft: 16, fontSize: 12, color: C.textMute, fontFamily: FONT_MONO, letterSpacing: "0.06em" }}>
          ~10 MIN · NO SIGN-UP TO START
        </span>
      </div>
    </div>
  );
}

// ─── QUESTION STAGE ────────────────────────────────────────────────
function Questions({ answers, setAnswers, onComplete, onBack }) {
  // Build flat question list for navigation
  const flat = useMemo(() => {
    const out = [];
    DIMENSIONS.forEach((d, di) => {
      d.questions.forEach((q, qi) => {
        out.push({ ...q, dim: d, dimIdx: di, qIdx: qi, key: `${d.id}-${qi}` });
      });
    });
    return out;
  }, []);

  const [idx, setIdx] = useState(0);
  const cur = flat[idx];
  const answered = answers[cur.key];
  const progress = ((idx + (answered ? 1 : 0)) / flat.length) * 100;

  function pick(score) {
    const next = { ...answers, [cur.key]: score };
    setAnswers(next);
    // Auto-advance after short pause
    setTimeout(() => {
      if (idx < flat.length - 1) setIdx(idx + 1);
      else onComplete(next);
    }, 220);
  }

  function manualNext() {
    if (idx < flat.length - 1) setIdx(idx + 1);
    else onComplete(answers);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.paper, fontFamily: FONT_BODY, color: C.text, display: "flex", flexDirection: "column" }}>
      {/* Top bar with progress */}
      <div style={{ borderBottom: `1px solid ${C.line}`, background: C.white }}>
        <div style={{ padding: "16px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 22, height: 22, background: C.red }} />
            <Mono style={{ color: C.navy, fontWeight: 600 }}>GROWTH OS · ASSESSMENT</Mono>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Mono style={{ color: C.textSoft }}>
              {idx + 1} / {flat.length}
            </Mono>
            <button onClick={onBack} style={{ ...btnGhost, padding: "8px 12px", fontSize: 10 }}>Exit</button>
          </div>
        </div>
        <div style={{ height: 3, background: C.paperWarm }}>
          <div style={{ height: "100%", width: `${progress}%`, background: C.red, transition: "width 240ms" }} />
        </div>
      </div>

      {/* Question content */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "48px 36px" }}>
        <div style={{ width: "100%", maxWidth: 760 }}>
          {/* Dimension chip */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <Mono style={{ color: C.red }}>{cur.dim.num} · {cur.dim.name}</Mono>
            <div style={{ flex: 1, height: 1, background: C.line }} />
            <Mono style={{ color: C.textMute }}>Q{cur.qIdx + 1} of 5</Mono>
          </div>

          {/* Question */}
          <div style={{ marginBottom: 32 }}>
            <Display size={36} style={{ lineHeight: 1.1 }}>{cur.q}</Display>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cur.opts.map((opt, i) => {
              const sel = answered === opt.score;
              return (
                <button key={i} onClick={() => pick(opt.score)} style={{
                  textAlign: "left", padding: "16px 20px",
                  background: sel ? C.navy : C.white,
                  color: sel ? C.white : C.text,
                  border: `1px solid ${sel ? C.navy : C.line}`,
                  borderLeft: `3px solid ${sel ? C.red : "transparent"}`,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                  fontFamily: FONT_BODY, fontSize: 14, transition: "all 120ms",
                }}
                onMouseEnter={(e) => { if (!sel) { e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.borderLeftColor = C.red; } }}
                onMouseLeave={(e) => { if (!sel) { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.borderLeftColor = "transparent"; } }}
                >
                  {sel ? <CheckCircle2 size={18} color={C.red} /> : <Circle size={18} color={C.textMute} />}
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{opt.label}</span>
                  <Mono style={{ color: sel ? "#8da3c8" : C.textMute, fontSize: 10 }}>L{opt.score}</Mono>
                </button>
              );
            })}
          </div>

          {/* Nav */}
          <div style={{ marginTop: 36, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => idx > 0 && setIdx(idx - 1)} disabled={idx === 0} style={{
              ...btnGhost, opacity: idx === 0 ? 0.4 : 1, cursor: idx === 0 ? "not-allowed" : "pointer"
            }}>
              <ArrowLeft size={13} /> Previous
            </button>
            {answered && (
              <button onClick={manualNext} style={btnPrimary}>
                {idx === flat.length - 1 ? "See your score" : "Next"} <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GATE STAGE (lead capture before results) ──────────────────────
function Gate({ onSubmit, onBack }) {
  const [form, setForm] = useState({ first: "", last: "", email: "", company: "", title: "", revenue: "" });
  const valid = form.first && form.last && form.email && form.company;

  return (
    <div style={{ minHeight: "100vh", background: C.paper, fontFamily: FONT_BODY, color: C.text }}>
      <div style={{ borderBottom: `1px solid ${C.line}`, background: C.white, padding: "18px 36px" }}>
        <Mono style={{ color: C.navy, fontWeight: 600 }}>GROWTH OS · ASSESSMENT</Mono>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 36px" }}>
        <Slash>Almost done</Slash>
        <div style={{ marginTop: 12, marginBottom: 14 }}>
          <Display size={56}>Your score is ready.</Display>
        </div>
        <p style={{ fontSize: 15, color: C.textSoft, lineHeight: 1.55, marginBottom: 36, maxWidth: 560 }}>
          We'll generate your maturity index, cohort benchmark, and a custom 8-page
          PDF identifying your three biggest gaps. Tell us where to send it.
        </p>

        <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Field label="First name" value={form.first} onChange={(v) => setForm({ ...form, first: v })} />
            <Field label="Last name" value={form.last} onChange={(v) => setForm({ ...form, last: v })} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Field label="Work email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
            <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <Mono style={{ color: C.textSoft, marginBottom: 6, display: "block" }}>Annual revenue (optional)</Mono>
            <select
              value={form.revenue}
              onChange={(e) => setForm({ ...form, revenue: e.target.value })}
              style={{
                width: "100%", padding: "12px 14px", fontFamily: FONT_BODY, fontSize: 14,
                border: `1px solid ${C.line}`, background: C.white, color: C.text, outline: "none",
              }}
            >
              <option value="">Select range…</option>
              <option>Under $50M</option>
              <option>$50M – $250M</option>
              <option>$250M – $1B</option>
              <option>$1B – $5B</option>
              <option>Over $5B</option>
            </select>
          </div>

          <div style={{ fontSize: 11.5, color: C.textMute, lineHeight: 1.5, marginBottom: 22 }}>
            By submitting, you agree to receive your assessment results and occasional
            insights from ATS. We don't share your data. Unsubscribe anytime.
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <button onClick={onBack} style={btnGhost}><ArrowLeft size={13} /> Back to questions</button>
            <button
              onClick={() => valid && onSubmit(form)}
              disabled={!valid}
              style={{ ...btnPrimary, opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}
            >
              Reveal my score <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <Mono style={{ color: C.textSoft, marginBottom: 6, display: "block" }}>{label}</Mono>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", padding: "12px 14px", fontFamily: FONT_BODY, fontSize: 14,
          border: `1px solid ${C.line}`, background: C.white, color: C.text, outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => { e.target.style.borderColor = C.navy; }}
        onBlur={(e) => { e.target.style.borderColor = C.line; }}
      />
    </div>
  );
}

// ─── RESULTS STAGE ─────────────────────────────────────────────────
function band(score) {
  if (score >= 85) return { name: "Engine", color: C.green, desc: "Your marketing operates as a true growth engine. You're ahead of the cohort and approaching ATS-level maturity. Focus on compounding advantages." };
  if (score >= 65) return { name: "Systematic", color: C.navy, desc: "Strong fundamentals with a defined operating model. The opportunity is to tighten governance, deepen AI integration, and tie more activity to revenue." };
  if (score >= 45) return { name: "Functional", color: C.amber, desc: "You have the building blocks but they're not yet a system. Disconnected tools, inconsistent execution, and unclear ownership are likely capping your growth." };
  return { name: "Reactive", color: C.red, desc: "Marketing operates as discrete activity rather than a system. Significant opportunity exists to convert effort into measurable, repeatable revenue." };
}

function Results({ form, scores, onRestart }) {
  const overall = Math.round(
    Object.values(scores).reduce((s, v) => s + v, 0) / Object.values(scores).length
  );
  const b = band(overall);

  // Build radar data
  const radarData = DIMENSIONS.map((d) => ({
    metric: d.name,
    you: scores[d.id],
    cohort: COHORT_AVG[d.id],
    ats: ATS_BENCH[d.id],
  }));

  // Identify top 3 gaps (largest delta to ATS benchmark)
  const gaps = DIMENSIONS
    .map((d) => ({
      dim: d,
      you: scores[d.id],
      ats: ATS_BENCH[d.id],
      gap: ATS_BENCH[d.id] - scores[d.id],
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  const recoMap = {
    demand: { lift: "+18-32% pipeline within 2 quarters", action: "Stand up a propensity-scored account list with daily signal refresh" },
    data: { lift: "+12-22% conversion on existing pipeline", action: "Unify customer data and add intent layer for behavioral scoring" },
    process: { lift: "Recover 6-14 days of cycle time", action: "Document SLA-bound handoffs between marketing and sales with breach alerts" },
    ai: { lift: "Reclaim 200-400 hrs per quarter", action: "Move from ad-hoc AI usage to defined agents with owners and run-books" },
    optimize: { lift: "Compounding 8-15% gains per quarter", action: "Establish weekly optimization cycles with documented test backlog" },
  };

  return (
    <div style={{ minHeight: "100vh", background: C.paper, fontFamily: FONT_BODY, color: C.text }}>
      <div style={{ borderBottom: `1px solid ${C.line}`, background: C.white, padding: "18px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mono style={{ color: C.navy, fontWeight: 600 }}>GROWTH OS · ASSESSMENT RESULTS</Mono>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...btnGhost, padding: "10px 14px", fontSize: 10 }}><Mail size={12} /> Email me PDF</button>
          <button style={{ ...btnGhost, padding: "10px 14px", fontSize: 10 }}><Download size={12} /> Download</button>
        </div>
      </div>

      {/* Hero score */}
      <div style={{ background: C.navy, color: C.white, padding: "60px 36px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Slash color="#8da3c8">Your maturity index · {form.company || "Your company"}</Slash>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 60, alignItems: "center", marginTop: 18 }}>
            <div>
              <Display size={180} color={C.white} style={{ lineHeight: 0.85 }}>{overall}</Display>
              <Mono style={{ color: "#8da3c8", marginTop: 8, display: "block" }}>OUT OF 100</Mono>
            </div>
            <div>
              <div style={{
                display: "inline-block", padding: "6px 14px", border: `1.5px solid ${b.color}`,
                color: b.color, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.14em",
                textTransform: "uppercase", fontWeight: 600, marginBottom: 18,
              }}>
                Band: {b.name}
              </div>
              <Display size={42} color={C.white} style={{ marginBottom: 16, display: "block" }}>
                You're operating in the<br/><span style={{ color: b.color }}>{b.name.toLowerCase()}</span> tier.
              </Display>
              <p style={{ fontSize: 15, color: "#c4d0e3", lineHeight: 1.6, maxWidth: 560 }}>
                {b.desc}
              </p>
              <div style={{ marginTop: 22, display: "flex", gap: 32 }}>
                <div>
                  <Mono style={{ color: "#8da3c8" }}>Cohort avg</Mono>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: C.white, marginTop: 4 }}>49</div>
                </div>
                <div style={{ width: 1, background: C.navySoft }} />
                <div>
                  <Mono style={{ color: "#8da3c8" }}>ATS Marketing Floor</Mono>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: C.white, marginTop: 4 }}>91</div>
                </div>
                <div style={{ width: 1, background: C.navySoft }} />
                <div>
                  <Mono style={{ color: "#8da3c8" }}>Your gap to ATS</Mono>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: C.red, marginTop: 4 }}>−{91 - overall}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Radar */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 36px" }}>
        <Slash>Five dimensions · scored</Slash>
        <Display size={40} style={{ marginTop: 12, marginBottom: 28, display: "block" }}>
          Where you stand vs. peers and ATS.
        </Display>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24, marginBottom: 48 }}>
          <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 24 }}>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.line} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontFamily: FONT_MONO, fill: C.textSoft, letterSpacing: "0.04em" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fontFamily: FONT_MONO, fill: C.textMute }} stroke={C.line} />
                <Radar name="Cohort avg" dataKey="cohort" stroke={C.textMute} fill={C.textMute} fillOpacity={0.12} strokeWidth={1.5} />
                <Radar name="You" dataKey="you" stroke={C.red} fill={C.red} fillOpacity={0.28} strokeWidth={2.5} />
                <Radar name="ATS" dataKey="ats" stroke={C.navy} fill={C.navy} fillOpacity={0.06} strokeWidth={1.5} strokeDasharray="4 3" />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT_MONO, letterSpacing: "0.08em", textTransform: "uppercase", paddingTop: 12 }} />
                <Tooltip contentStyle={{ background: C.navy, border: "none", fontFamily: FONT_MONO, fontSize: 11, color: C.white, padding: "8px 10px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DIMENSIONS.map((d) => {
              const Icon = d.icon;
              const s = scores[d.id];
              const c = COHORT_AVG[d.id];
              const a = ATS_BENCH[d.id];
              const aboveCohort = s > c;
              return (
                <div key={d.id} style={{ background: C.white, border: `1px solid ${C.line}`, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon size={15} color={C.navy} strokeWidth={1.7} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{d.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <Display size={22}>{s}</Display>
                      <Mono style={{ color: aboveCohort ? C.green : C.red, fontSize: 10 }}>
                        {aboveCohort ? "+" : ""}{s - c} vs cohort
                      </Mono>
                    </div>
                  </div>
                  <div style={{ position: "relative", height: 6, background: C.paperWarm }}>
                    {/* Cohort marker */}
                    <div style={{ position: "absolute", left: `${c}%`, top: -3, width: 1, height: 12, background: C.textMute }} />
                    {/* ATS marker */}
                    <div style={{ position: "absolute", left: `${a}%`, top: -3, width: 2, height: 12, background: C.navy }} />
                    {/* You bar */}
                    <div style={{ height: "100%", width: `${s}%`, background: C.red }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: FONT_MONO, fontSize: 9, color: C.textMute, letterSpacing: "0.06em" }}>
                    <span>Cohort {c}</span>
                    <span>ATS {a}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 3 gaps */}
        <Slash>Your top 3 opportunities</Slash>
        <Display size={40} style={{ marginTop: 12, marginBottom: 24, display: "block" }}>
          Where to focus, ranked by impact.
        </Display>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
          {gaps.map((g, i) => {
            const Icon = g.dim.icon;
            const reco = recoMap[g.dim.id];
            return (
              <div key={g.dim.id} style={{
                background: C.white, border: `1px solid ${C.line}`,
                borderLeft: `4px solid ${C.red}`, padding: "24px 28px",
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Display size={48} color={C.red}>{i + 1}</Display>
                  <div style={{ width: 44, height: 44, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color={C.navy} strokeWidth={1.6} />
                  </div>
                </div>
                <div>
                  <Mono style={{ color: C.red }}>Priority {i === 0 ? "P1" : i === 1 ? "P1" : "P2"}</Mono>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.navy, marginTop: 4, marginBottom: 8 }}>
                    {g.dim.name}
                  </div>
                  <div style={{ fontSize: 13.5, color: C.textSoft, lineHeight: 1.55, marginBottom: 8 }}>
                    {reco.action}
                  </div>
                  <Mono style={{ color: C.green }}>Projected lift: {reco.lift}</Mono>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Mono style={{ color: C.textMute }}>Gap to ATS</Mono>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: C.red, lineHeight: 1, marginTop: 4 }}>
                    {g.gap}
                  </div>
                  <Mono style={{ color: C.textMute }}>POINTS</Mono>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ background: C.red, color: C.white, padding: "44px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ maxWidth: 560 }}>
            <Mono style={{ color: "#ffd5dc" }}>Recommended next step</Mono>
            <div style={{ marginTop: 10 }}>
              <Display size={36} color={C.white}>
                Walk through your results with the team that built it.
              </Display>
            </div>
            <p style={{ fontSize: 14, color: "#ffd5dc", marginTop: 12, lineHeight: 1.5 }}>
              60-minute strategy session with an ATS Growth OS architect. We'll show you
              how the ATS Marketing Floor closed each of these gaps inside our own business.
            </p>
          </div>
          <button style={{
            background: C.white, color: C.red, border: "none",
            padding: "18px 28px", fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.14em",
            textTransform: "uppercase", fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            Book strategy session <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button onClick={onRestart} style={{
            background: "none", border: "none", color: C.textSoft,
            fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer", textDecoration: "underline"
          }}>
            Restart the assessment
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.line}`, background: C.white, padding: "24px 36px", marginTop: 48 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Mono style={{ color: C.textMute }}>© 2026 Advanced Technology Services · Peoria, IL</Mono>
          <Mono style={{ color: C.textMute }}>advancedtech.com</Mono>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────
export default function GrowthOSAssessment() {
  const [stage, setStage] = useState("intro"); // intro | questions | gate | results
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({});

  // Compute dimension scores (0-100 scale, where each Q is 1-5)
  const scores = useMemo(() => {
    const out = {};
    DIMENSIONS.forEach((d) => {
      const dimAnswers = d.questions.map((_, qi) => answers[`${d.id}-${qi}`] || 0);
      const total = dimAnswers.reduce((s, v) => s + v, 0);
      const max = d.questions.length * 5;
      out[d.id] = Math.round((total / max) * 100);
    });
    return out;
  }, [answers]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500;600&display=swap');
        body { margin: 0; }
        * { box-sizing: border-box; }
        button:focus { outline: none; }
        button:focus-visible { outline: 2px solid ${C.red}; outline-offset: 2px; }
        input:focus, select:focus { outline: none; }
      `}</style>

      {stage === "intro" && <Intro onStart={() => setStage("questions")} />}
      {stage === "questions" && (
        <Questions
          answers={answers}
          setAnswers={setAnswers}
          onComplete={() => setStage("gate")}
          onBack={() => setStage("intro")}
        />
      )}
      {stage === "gate" && (
        <Gate
          onSubmit={(f) => { setForm(f); setStage("results"); }}
          onBack={() => setStage("questions")}
        />
      )}
      {stage === "results" && (
        <Results
          form={form}
          scores={scores}
          onRestart={() => { setAnswers({}); setForm({}); setStage("intro"); }}
        />
      )}
    </>
  );
}
