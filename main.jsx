import React, { useState, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowRight, Activity, Zap,
  Users, Target, Bot, Workflow, BarChart3, Database, FileText,
  Clock, CheckCircle2, AlertCircle, Play, ChevronRight, Search, Bell,
  Settings, Filter, Download, MoreHorizontal, Building2, Flame, Sparkles,
  Eye, GitBranch, Award, Plus, Cpu, MessageSquare, PieChart, Layers
} from "lucide-react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────
const C = {
  navy: "#0d1f3c", navyDeep: "#091530", navySoft: "#142a4f",
  red: "#c8102e", redDeep: "#a00d25", ink: "#0a0e1a",
  paper: "#f4f5f7", paperWarm: "#ebedf0", line: "#d8dce2", lineSoft: "#e6e9ee",
  text: "#1a2238", textSoft: "#5a6478", textMute: "#8d96a8",
  green: "#0d8050", amber: "#b8860b", white: "#ffffff",
};
const FONT_DISPLAY = "'Bebas Neue', 'Oswald', sans-serif";
const FONT_BODY = "'DM Sans', 'Helvetica Neue', sans-serif";
const FONT_MONO = "'Roboto Mono', 'JetBrains Mono', monospace";

// ─── MOCK DATA ─────────────────────────────────────────────────────
const PIPELINE_TREND = [
  { week: "W1", sourced: 1.2, won: 0.4 }, { week: "W2", sourced: 1.5, won: 0.5 },
  { week: "W3", sourced: 1.4, won: 0.6 }, { week: "W4", sourced: 1.8, won: 0.7 },
  { week: "W5", sourced: 2.1, won: 0.8 }, { week: "W6", sourced: 2.3, won: 0.9 },
  { week: "W7", sourced: 2.6, won: 1.1 }, { week: "W8", sourced: 2.9, won: 1.3 },
  { week: "W9", sourced: 3.1, won: 1.4 }, { week: "W10", sourced: 3.4, won: 1.6 },
  { week: "W11", sourced: 3.6, won: 1.7 }, { week: "W12", sourced: 3.9, won: 1.9 },
];

const ACCOUNTS = [
  { id: 1, name: "Caterpillar Inc.", industry: "Heavy Equipment", score: 94, intent: "Surging", signals: 12, owner: "M. Reyes", stage: "Engaged", value: "$840K", lastSignal: "2h ago", flag: "hot" },
  { id: 2, name: "Deere & Company", industry: "Agriculture", score: 91, intent: "Surging", signals: 9, owner: "T. Okafor", stage: "Identified", value: "$620K", lastSignal: "5h ago", flag: "hot" },
  { id: 3, name: "Bunge Limited", industry: "Food Processing", score: 87, intent: "Rising", signals: 7, owner: "M. Reyes", stage: "Engaged", value: "$410K", lastSignal: "1d ago", flag: "warm" },
  { id: 4, name: "Eaton Corporation", industry: "Power Mgmt", score: 84, intent: "Rising", signals: 6, owner: "S. Linhart", stage: "Qualified", value: "$1.2M", lastSignal: "3h ago", flag: "warm" },
  { id: 5, name: "Parker Hannifin", industry: "Motion Ctrl", score: 81, intent: "Steady", signals: 4, owner: "T. Okafor", stage: "Identified", value: "$320K", lastSignal: "2d ago", flag: "warm" },
  { id: 6, name: "Tyson Foods", industry: "Food Processing", score: 78, intent: "Rising", signals: 5, owner: "M. Reyes", stage: "Engaged", value: "$540K", lastSignal: "6h ago", flag: "warm" },
  { id: 7, name: "Cummins Inc.", industry: "Engines", score: 76, intent: "Steady", signals: 3, owner: "S. Linhart", stage: "Qualified", value: "$890K", lastSignal: "1d ago", flag: "cool" },
  { id: 8, name: "Archer-Daniels-Midland", industry: "Food Processing", score: 73, intent: "Steady", signals: 3, owner: "T. Okafor", stage: "Identified", value: "$280K", lastSignal: "3d ago", flag: "cool" },
];

// ─── THE FOUR AGENTS — matching public taxonomy ────────────────────
const AGENTS = [
  {
    id: "demand",
    name: "Demand Agent",
    icon: Target,
    role: "Pipeline & propensity",
    desc: "Scores every account in CRM for buying propensity, surfaces real-time intent signals, and powers the Predictive Demand Engine that forecasts pipeline by segment.",
    status: "active",
    runs: 4127,
    saved: "184 hrs",
    avgTime: "2.1 min",
    owner: "Marketing Ops · Revenue Ops",
    lastRun: "Now",
    capabilities: [
      { name: "Predictive Demand Engine", desc: "Forecasts pipeline by segment 60 days ahead", flagship: true },
      { name: "Account Propensity Scoring", desc: "Daily scoring of 2,840 accounts" },
      { name: "Intent Signal Fusion", desc: "Web + 3rd-party + behavioral signals" },
      { name: "RFQ Triage", desc: "Routes inbound RFQs by fit and urgency" },
    ],
    inputs: ["CRM accounts", "Web behavior", "Intent data", "Historical wins"],
    outputs: ["Propensity scores", "Daily account briefs", "Pipeline forecast", "Sales alerts"],
  },
  {
    id: "content",
    name: "Content Agent",
    icon: FileText,
    role: "Production & repurposing",
    desc: "Generates, repurposes, and tunes technical content to brand standards — turning long-form assets into channel-ready collateral with built-in quality gates.",
    status: "active",
    runs: 1893,
    saved: "142 hrs",
    avgTime: "4.3 min",
    owner: "Content Team · Field Marketing",
    lastRun: "8 min ago",
    capabilities: [
      { name: "Technical Repurposing", desc: "Long-form → LinkedIn, email, sales collateral" },
      { name: "Brand-Tuned Generation", desc: "Drafts in ATS voice with guardrails" },
      { name: "Pre-Meeting Briefs", desc: "Account intel + talking points for AEs" },
      { name: "Trade Show Sequences", desc: "Personalized post-event outreach within 24h" },
    ],
    inputs: ["Source assets", "Brand guidelines", "Account context", "Buyer persona"],
    outputs: ["Drafted content", "Channel adaptations", "Meeting briefs", "Email sequences"],
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    icon: BarChart3,
    role: "Intelligence & decisioning",
    desc: "Translates raw marketing data into real-time decisioning. Detects performance shifts, synthesizes win/loss patterns, and benchmarks the operation against the ATS Marketing Floor.",
    status: "active",
    runs: 982,
    saved: "98 hrs",
    avgTime: "3.8 min",
    owner: "Revenue Ops · Strategy",
    lastRun: "23 min ago",
    capabilities: [
      { name: "Real-Time Decisioning", desc: "Auto-alerts on material performance shifts" },
      { name: "Win/Loss Synthesis", desc: "Pattern detection across closed deals" },
      { name: "Cohort Benchmarking", desc: "vs. ATS Marketing Floor + industrial peers" },
      { name: "Attribution Modeling", desc: "Multi-touch revenue contribution" },
    ],
    inputs: ["CRM activity", "Marketing data", "Web analytics", "External benchmarks"],
    outputs: ["Performance alerts", "Win/loss reports", "Benchmark dashboards", "Attribution"],
  },
  {
    id: "ops",
    name: "Ops Agent",
    icon: Workflow,
    role: "Process & governance",
    desc: "Enforces SLAs across marketing-to-sales handoffs, governs AI output quality, and keeps the operating system running clean — with a full audit trail for every action.",
    status: "active",
    runs: 6231,
    saved: "118 hrs",
    avgTime: "0.6 min",
    owner: "Marketing Ops",
    lastRun: "Now",
    capabilities: [
      { name: "SLA Enforcement", desc: "Tracks 5 workflows, alerts on breach" },
      { name: "AI Quality Gates", desc: "Brand and accuracy checks on agent output" },
      { name: "Audit Log", desc: "Full record of decisions, approvals, agent actions" },
      { name: "Lead Routing", desc: "Auto-assigns based on territory and capacity" },
    ],
    inputs: ["Workflow definitions", "Agent outputs", "CRM events", "Team capacity"],
    outputs: ["Routed handoffs", "SLA reports", "Quality scores", "Audit trail"],
  },
];

const WORKFLOWS = [
  { id: "w1", name: "MQL → SQL Handoff", owner: "Marketing → Sales", sla: "4 hrs", compliance: 94, runs: 312, breaches: 19 },
  { id: "w2", name: "Inbound RFQ Routing", owner: "Marketing → Inside Sales", sla: "1 hr", compliance: 98, runs: 689, breaches: 14 },
  { id: "w3", name: "Demo Request Triage", owner: "Marketing → AE", sla: "2 hrs", compliance: 91, runs: 147, breaches: 13 },
  { id: "w4", name: "Trade Show Lead Qual", owner: "Events → SDR", sla: "24 hrs", compliance: 87, runs: 203, breaches: 27 },
  { id: "w5", name: "Account-Based Plays", owner: "Marketing → AE", sla: "48 hrs", compliance: 96, runs: 84, breaches: 3 },
];

const FUNNEL_DATA = [
  { stage: "Identified", count: 2840, pct: 100 },
  { stage: "Engaged", count: 1124, pct: 39.6 },
  { stage: "Qualified", count: 487, pct: 17.1 },
  { stage: "Opportunity", count: 198, pct: 7.0 },
  { stage: "Closed Won", count: 73, pct: 2.6 },
];

// Predictive Demand Engine forecast
const DEMAND_FORECAST = [
  { period: "W-4", actual: 2.1, forecast: null, confidence_low: null, confidence_high: null },
  { period: "W-3", actual: 2.3, forecast: null, confidence_low: null, confidence_high: null },
  { period: "W-2", actual: 2.6, forecast: null, confidence_low: null, confidence_high: null },
  { period: "W-1", actual: 2.9, forecast: null, confidence_low: null, confidence_high: null },
  { period: "Now", actual: 3.4, forecast: 3.4, confidence_low: 3.4, confidence_high: 3.4 },
  { period: "W+1", actual: null, forecast: 3.7, confidence_low: 3.5, confidence_high: 3.9 },
  { period: "W+2", actual: null, forecast: 4.0, confidence_low: 3.7, confidence_high: 4.3 },
  { period: "W+3", actual: null, forecast: 4.2, confidence_low: 3.8, confidence_high: 4.7 },
  { period: "W+4", actual: null, forecast: 4.5, confidence_low: 3.9, confidence_high: 5.1 },
];

const BENCHMARK_DATA = [
  { metric: "Demand", you: 88, cohort: 62, ats: 91 },
  { metric: "Data", you: 76, cohort: 54, ats: 88 },
  { metric: "Process", you: 91, cohort: 58, ats: 95 },
  { metric: "AI Workforce", you: 81, cohort: 38, ats: 94 },
  { metric: "Optimization", you: 78, cohort: 51, ats: 89 },
];

const QUARTERLY_TREND = [
  { q: "Q1 '25", you: 58, cohort: 52 }, { q: "Q2 '25", you: 64, cohort: 54 },
  { q: "Q3 '25", you: 71, cohort: 55 }, { q: "Q4 '25", you: 78, cohort: 57 },
  { q: "Q1 '26", you: 83, cohort: 59 },
];

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
const Pill = ({ children, tone = "neutral" }) => {
  const tones = {
    hot: { bg: "#fef2f4", color: C.red, border: "#f5c8d0" },
    warm: { bg: "#fff8ed", color: C.amber, border: "#f0d896" },
    cool: { bg: "#eef3f8", color: C.textSoft, border: "#cdd6e2" },
    good: { bg: "#edf6f1", color: C.green, border: "#bcd9c8" },
    flagship: { bg: C.navy, color: C.white, border: C.navy },
    neutral: { bg: C.paperWarm, color: C.text, border: C.line },
    active: { bg: "#edf6f1", color: C.green, border: "#bcd9c8" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
      background: t.bg, color: t.color, border: `1px solid ${t.border}`,
      padding: "3px 8px", fontWeight: 500, whiteSpace: "nowrap"
    }}>{children}</span>
  );
};

const tipStyle = { background: C.navy, border: "none", borderRadius: 0, fontFamily: FONT_MONO, fontSize: 11, color: C.white, padding: "8px 10px" };
const btnPrimary = { background: C.red, color: C.white, border: "none", padding: "10px 16px", fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 };
const btnGhost = { background: C.white, color: C.navy, border: `1px solid ${C.line}`, padding: "10px 14px", fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 };
const chipStyle = { fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.06em", padding: "4px 8px", background: C.paper, color: C.navy, border: `1px solid ${C.line}`, textTransform: "uppercase" };

// ─── SHELL ─────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "demand", label: "Demand Agent", icon: Target, group: "AI WORKFORCE" },
  { id: "content", label: "Content Agent", icon: FileText },
  { id: "analytics", label: "Analytics Agent", icon: BarChart3 },
  { id: "ops", label: "Ops Agent", icon: Workflow },
  { id: "governance", label: "Governance", icon: GitBranch, group: "OPERATING SYSTEM" },
  { id: "optimize", label: "Optimization", icon: Sparkles },
];

function Shell({ active, setActive, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.paper, fontFamily: FONT_BODY, color: C.text }}>
      <aside style={{ width: 248, background: C.navy, color: C.white, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 22px 26px", borderBottom: `1px solid ${C.navySoft}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, background: C.white }} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.14em", color: "#8da3c8" }}>● ATS</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: "0.04em", color: C.white, marginTop: 2 }}>GROWTH OS</div>
            </div>
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.12em", color: "#5d749b", marginTop: 14, textTransform: "uppercase" }}>
            Cockpit · v2026.1
          </div>
        </div>

        <nav style={{ flex: 1, padding: "18px 14px", overflowY: "auto" }}>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <React.Fragment key={item.id}>
                {item.group && (
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.16em", color: "#5d749b", padding: "16px 10px 8px" }}>
                    {item.group}
                  </div>
                )}
                <button onClick={() => setActive(item.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", marginBottom: 2,
                    background: isActive ? C.red : "transparent",
                    color: isActive ? C.white : "#c4d0e3",
                    border: "none", cursor: "pointer", textAlign: "left",
                    fontFamily: FONT_BODY, fontSize: 13, fontWeight: isActive ? 600 : 400,
                    borderLeft: isActive ? `3px solid ${C.white}` : "3px solid transparent",
                    transition: "background 120ms",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = C.navySoft; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={15} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        <div style={{ padding: "16px 18px", borderTop: `1px solid ${C.navySoft}`, fontFamily: FONT_MONO, fontSize: 10, color: "#8da3c8", letterSpacing: "0.06em" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, background: "#3dd17a", borderRadius: "50%" }} />
            <span>SYSTEM HEALTHY</span>
          </div>
          <div style={{ color: "#5d749b" }}>4 agents running · sync 2m</div>
        </div>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 60, background: C.white, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 20 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 14 }}>
            <Search size={16} color={C.textMute} />
            <input placeholder="Search accounts, agents, workflows…" style={{ border: "none", outline: "none", background: "transparent", fontFamily: FONT_BODY, fontSize: 13, color: C.text, flex: 1, maxWidth: 420 }} />
          </div>
          <Mono style={{ color: C.textSoft }}>Q1 FY26 · WK 12</Mono>
          <div style={{ width: 1, height: 22, background: C.line }} />
          <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
            <Bell size={17} color={C.textSoft} strokeWidth={1.7} />
            <div style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, background: C.red, borderRadius: "50%" }} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Settings size={17} color={C.textSoft} strokeWidth={1.7} />
          </button>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, fontFamily: FONT_BODY }}>SM</div>
        </header>

        <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
      </main>
    </div>
  );
}

// ─── KPI / PANEL primitives ────────────────────────────────────────
function Kpi({ label, value, delta, trend, sub, accent }) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? C.green : C.red;
  return (
    <div style={{ background: accent ? C.navy : C.white, padding: "20px 22px", color: accent ? C.white : C.text }}>
      <Mono style={{ color: accent ? "#8da3c8" : C.textMute }}>{label}</Mono>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
        <Display size={40} color={accent ? C.white : C.navy}>{value}</Display>
        <div style={{ display: "flex", alignItems: "center", gap: 3, color: trendColor, fontSize: 12, fontWeight: 600 }}>
          <TrendIcon size={13} strokeWidth={2.2} />{delta}
        </div>
      </div>
      <div style={{ fontSize: 11, color: accent ? "#8da3c8" : C.textMute, marginTop: 6, fontFamily: FONT_MONO, letterSpacing: "0.04em" }}>{sub}</div>
    </div>
  );
}

function Panel({ title, right, children, padding = 22 }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${padding - 6}px ${padding}px`, borderBottom: `1px solid ${C.lineSoft}` }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: C.text }}>{title}</div>
        {right}
      </div>
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

// ─── OVERVIEW ──────────────────────────────────────────────────────
function Overview({ go }) {
  return (
    <div style={{ padding: "32px 36px 60px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Slash>The growth floor · Live</Slash>
          <div style={{ marginTop: 10 }}>
            <Display size={56}>Good morning, Sandra.</Display>
          </div>
          <div style={{ marginTop: 14, color: C.textSoft, fontSize: 14, maxWidth: 640 }}>
            <strong style={{ color: C.text }}>3 accounts surged overnight.</strong> The four agents ran 1,247 jobs while you slept,
            pipeline sourced is up <strong style={{ color: C.green }}>+18% WoW</strong>, and the Predictive Demand Engine is forecasting
            <strong style={{ color: C.text }}> $4.5M sourced by W+4</strong> — well above plan.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btnGhost}><Download size={13} /> Daily brief</button>
          <button style={btnPrimary}>Run morning standup <ArrowRight size={13} /></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.line, border: `1px solid ${C.line}`, marginBottom: 28 }}>
        <Kpi label="Pipeline Sourced" value="$3.9M" delta="+18%" trend="up" sub="vs prior 12wk" accent />
        <Kpi label="Marketing ROI" value="4.2:1" delta="+0.4" trend="up" sub="trailing 90d" />
        <Kpi label="AI Hrs Saved" value="542" delta="+89" trend="up" sub="this week · 4 agents" />
        <Kpi label="SLA Compliance" value="93%" delta="-2pt" trend="down" sub="across 5 workflows" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 28 }}>
        <Panel title="Pipeline sourced vs. won" right={<Mono style={{ color: C.textSoft }}>$M · 12 weeks</Mono>}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={PIPELINE_TREND} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.red} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.navy} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={C.navy} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.lineSoft} vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: C.textMute }} axisLine={{ stroke: C.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: C.textMute }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Area type="monotone" dataKey="sourced" stroke={C.red} strokeWidth={2} fill="url(#g1)" name="Sourced" />
              <Area type="monotone" dataKey="won" stroke={C.navy} strokeWidth={2} fill="url(#g2)" name="Won" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Today's priority signals" right={<Pill tone="hot">3 hot</Pill>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {ACCOUNTS.slice(0, 4).map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.lineSoft}` : "none" }}>
                <div style={{ width: 36, height: 36, background: a.flag === "hot" ? "#fef2f4" : "#eef3f8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {a.flag === "hot" ? <Flame size={16} color={C.red} /> : <Building2 size={16} color={C.textSoft} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: C.textMute, fontFamily: FONT_MONO, letterSpacing: "0.04em" }}>{a.signals} signals · {a.lastSignal}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.navy, lineHeight: 1 }}>{a.score}</div>
                  <Mono style={{ color: a.flag === "hot" ? C.red : C.textMute, fontSize: 9 }}>{a.intent}</Mono>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => go("demand")} style={{ width: "100%", marginTop: 12, padding: "10px", background: C.paperWarm, border: `1px solid ${C.line}`, cursor: "pointer", fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.1em", color: C.navy, textTransform: "uppercase", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            Open Demand Agent <ChevronRight size={12} />
          </button>
        </Panel>
      </div>

      {/* THE FOUR AGENTS — top-level cards */}
      <Slash>The four agents · AI as workforce, not tool</Slash>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 14, marginBottom: 28 }}>
        {AGENTS.map((a) => {
          const Icon = a.icon;
          return (
            <button key={a.id} onClick={() => go(a.id)} style={{
              background: C.white, border: `1px solid ${C.line}`, padding: "22px 22px",
              cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column",
              gap: 10, fontFamily: FONT_BODY, transition: "all 150ms", borderTop: `3px solid ${C.red}`
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(13,31,60,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} strokeWidth={1.7} />
                </div>
                <ArrowUpRight size={16} color={C.textMute} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{a.name}</div>
                <Mono style={{ color: C.red, marginTop: 3 }}>{a.role}</Mono>
              </div>
              <div style={{ fontSize: 12.5, color: C.textSoft, lineHeight: 1.5 }}>{a.desc}</div>
              <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${C.lineSoft}`, display: "flex", justifyContent: "space-between" }}>
                <Mono style={{ color: C.navy }}>{a.runs.toLocaleString()} runs</Mono>
                <Mono style={{ color: C.green }}>{a.saved} saved</Mono>
              </div>
            </button>
          );
        })}
      </div>

      {/* OS layer */}
      <Slash>Operating system layer</Slash>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <button onClick={() => go("governance")} style={osCardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, background: C.paperWarm, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GitBranch size={18} color={C.navy} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Governance</div>
              <Mono style={{ color: C.textSoft }}>5 workflows · 93% SLA · Full audit</Mono>
            </div>
          </div>
          <ChevronRight size={16} color={C.textMute} />
        </button>
        <button onClick={() => go("optimize")} style={osCardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, background: C.paperWarm, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={18} color={C.navy} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Optimization</div>
              <Mono style={{ color: C.textSoft }}>+24pt vs cohort · −8 to ATS Floor</Mono>
            </div>
          </div>
          <ChevronRight size={16} color={C.textMute} />
        </button>
      </div>
    </div>
  );
}

const osCardStyle = {
  background: C.white, border: `1px solid ${C.line}`, padding: "18px 22px",
  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
  fontFamily: FONT_BODY, transition: "all 120ms",
};

// ─── DEMAND AGENT page ─────────────────────────────────────────────
function DemandAgent() {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => {
    if (filter === "hot") return ACCOUNTS.filter((a) => a.flag === "hot");
    if (filter === "surging") return ACCOUNTS.filter((a) => a.intent === "Surging");
    return ACCOUNTS;
  }, [filter]);

  return (
    <div style={{ padding: "32px 36px 60px" }}>
      <Slash>AI Workforce · Agent 01</Slash>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, marginBottom: 8, flexWrap: "wrap", gap: 16 }}>
        <Display size={48}>Demand Agent</Display>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btnGhost}><Filter size={13} /> Filter</button>
          <button style={btnGhost}><Download size={13} /> Export</button>
          <button style={btnPrimary}>Push to CRM <ArrowRight size={13} /></button>
        </div>
      </div>
      <div style={{ marginBottom: 26, color: C.textSoft, fontSize: 14, maxWidth: 720 }}>
        Owns pipeline generation and propensity scoring across every account in CRM. Powers the
        <strong style={{ color: C.text }}> Predictive Demand Engine</strong> that forecasts pipeline 60 days ahead by segment.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: C.line, border: `1px solid ${C.line}`, marginBottom: 24 }}>
        <Kpi label="Accounts Scored" value="2,840" delta="+12" trend="up" sub="last 24h" />
        <Kpi label="High Propensity" value="187" delta="+9" trend="up" sub="score ≥ 80" />
        <Kpi label="Surging Intent" value="34" delta="+6" trend="up" sub="signals last 7d" accent />
        <Kpi label="Forecast Accuracy" value="91%" delta="+3pt" trend="up" sub="trailing 4 weeks" />
      </div>

      {/* PREDICTIVE DEMAND ENGINE — flagship feature */}
      <Panel
        title="Predictive Demand Engine · 4-week forecast"
        right={<div style={{ display: "flex", alignItems: "center", gap: 8 }}><Pill tone="flagship">Flagship</Pill><Mono style={{ color: C.green }}>+27% vs plan</Mono></div>}
      >
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={DEMAND_FORECAST} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="conf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.red} stopOpacity={0.18} />
                <stop offset="100%" stopColor={C.red} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.lineSoft} vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: C.textMute }} axisLine={{ stroke: C.line }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: C.textMute }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tipStyle} />
            <Area type="monotone" dataKey="confidence_high" stroke="none" fill="url(#conf)" name="80% confidence" />
            <Area type="monotone" dataKey="confidence_low" stroke="none" fill={C.white} fillOpacity={1} legendType="none" />
            <Line type="monotone" dataKey="actual" stroke={C.navy} strokeWidth={2.5} dot={{ r: 4, fill: C.navy }} name="Actual" />
            <Line type="monotone" dataKey="forecast" stroke={C.red} strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 4, fill: C.red }} name="Forecast" />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT_MONO, letterSpacing: "0.06em", textTransform: "uppercase", paddingTop: 8 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 14, padding: "14px 16px", background: C.paper, borderLeft: `3px solid ${C.red}`, fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>
          <strong>Forecast brief:</strong> Sourced pipeline tracking to <strong>$4.5M by W+4</strong> (+27% vs plan).
          Confidence band widens after W+2 — driven by 14 enterprise accounts in early stages.
          The Demand Agent recommends accelerating outreach on <strong>Caterpillar, Deere, and Eaton</strong> to
          tighten the upper confidence bound.
        </div>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24, marginBottom: 24 }}>
        <Panel title="Demand funnel · trailing 90d" right={<Mono style={{ color: C.textSoft }}>Live</Mono>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
            {FUNNEL_DATA.map((s, i) => {
              const isLast = i === FUNNEL_DATA.length - 1;
              return (
                <div key={s.stage}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{s.stage}</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.navy }}>{s.count.toLocaleString()}</span>
                      <Mono style={{ color: C.textMute, width: 44, textAlign: "right" }}>{s.pct}%</Mono>
                    </div>
                  </div>
                  <div style={{ height: 8, background: C.paperWarm }}>
                    <div style={{ height: "100%", width: `${s.pct}%`, background: isLast ? C.red : `linear-gradient(90deg, ${C.navy}, ${C.navySoft})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Live signal stream" right={<div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 6, height: 6, background: C.green, borderRadius: "50%", animation: "pulse 1.4s ease-in-out infinite" }} /><Mono style={{ color: C.green }}>Streaming</Mono></div>}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { time: "09:42", account: "Caterpillar Inc.", signal: "VP Operations visited /predictive-maintenance 3x", strength: "high" },
              { time: "09:38", account: "Deere & Company", signal: "Procurement contact opened pricing sheet", strength: "high" },
              { time: "09:21", account: "Bunge Limited", signal: "Web session: 18 min on case studies", strength: "med" },
              { time: "08:54", account: "Eaton Corporation", signal: "Downloaded Industrial AI whitepaper", strength: "med" },
              { time: "08:33", account: "Tyson Foods", signal: "RFQ submitted via web form", strength: "high" },
              { time: "08:12", account: "Parker Hannifin", signal: "LinkedIn engagement on field service post", strength: "low" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 5 ? `1px solid ${C.lineSoft}` : "none", alignItems: "flex-start" }}>
                <Mono style={{ color: C.textMute, width: 42, paddingTop: 1 }}>{s.time}</Mono>
                <div style={{ width: 6, height: 6, marginTop: 7, background: s.strength === "high" ? C.red : s.strength === "med" ? C.amber : C.textMute, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: C.text }}><strong>{s.account}</strong> · {s.signal}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Accounts ranked by propensity"
        right={
          <div style={{ display: "flex", gap: 6 }}>
            {[["all", "All"], ["hot", "Hot"], ["surging", "Surging"]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: "5px 10px", fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.08em",
                textTransform: "uppercase", border: `1px solid ${filter === k ? C.navy : C.line}`,
                background: filter === k ? C.navy : C.white, color: filter === k ? C.white : C.textSoft,
                cursor: "pointer", fontWeight: 500
              }}>{l}</button>
            ))}
          </div>
        }
        padding={0}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.paper }}>
              {["Account", "Industry", "Score", "Intent", "Signals", "Owner", "Stage", "Value"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textSoft, fontWeight: 500, borderBottom: `1px solid ${C.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} style={{ borderBottom: `1px solid ${C.lineSoft}` }}>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {a.flag === "hot" && <Flame size={13} color={C.red} />}
                    <strong style={{ color: C.text }}>{a.name}</strong>
                  </div>
                </td>
                <td style={{ padding: "13px 16px", color: C.textSoft }}>{a.industry}</td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: C.navy }}>{a.score}</div>
                    <div style={{ width: 50, height: 4, background: C.paperWarm }}>
                      <div style={{ height: "100%", width: `${a.score}%`, background: a.score >= 90 ? C.red : a.score >= 80 ? C.amber : C.navy }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <Pill tone={a.intent === "Surging" ? "hot" : a.intent === "Rising" ? "warm" : "cool"}>{a.intent}</Pill>
                </td>
                <td style={{ padding: "13px 16px", fontFamily: FONT_MONO, color: C.text }}>{a.signals}</td>
                <td style={{ padding: "13px 16px", color: C.textSoft }}>{a.owner}</td>
                <td style={{ padding: "13px 16px", color: C.text }}>{a.stage}</td>
                <td style={{ padding: "13px 16px", fontFamily: FONT_MONO, fontWeight: 500, color: C.text }}>{a.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

// ─── GENERIC AGENT PAGE (Content / Analytics / Ops) ────────────────
function AgentPage({ agentId }) {
  const a = AGENTS.find((x) => x.id === agentId);
  if (!a) return null;
  const Icon = a.icon;

  // Mock activity stream for each agent
  const activityByAgent = {
    content: [
      { time: "09:48", event: "Generated pre-meeting brief for Caterpillar (M. Reyes)", tag: "Brief" },
      { time: "09:31", event: "Repurposed 'Predictive Maintenance' whitepaper → 5 LinkedIn posts", tag: "Repurpose" },
      { time: "09:12", event: "Drafted RFQ response for Tyson Foods (pending approval)", tag: "Draft" },
      { time: "08:54", event: "Updated trade show follow-up sequence (24 contacts)", tag: "Sequence" },
      { time: "08:22", event: "Pre-meeting brief delivered for Deere & Co.", tag: "Brief" },
    ],
    analytics: [
      { time: "09:50", event: "Performance alert: Demo Request Triage SLA breach (2h 14m)", tag: "Alert" },
      { time: "09:15", event: "Win/loss synthesis updated — pattern detected in food processing segment", tag: "Synthesis" },
      { time: "08:40", event: "Cohort benchmark refreshed — moved up 2 ranks vs peers", tag: "Benchmark" },
      { time: "08:11", event: "Attribution model retrained on Q1 closed-won deals", tag: "Model" },
      { time: "07:45", event: "Anomaly detected: organic web traffic +34% (inspecting)", tag: "Anomaly" },
    ],
    ops: [
      { time: "09:51", event: "Routed RFQ from Eaton to Inside Sales (T. Okafor)", tag: "Routing" },
      { time: "09:48", event: "Quality gate: blocked 1 brief for off-brand language", tag: "Quality" },
      { time: "09:42", event: "M. Reyes approved Caterpillar brief", tag: "Approval" },
      { time: "09:21", event: "SLA met: MQL→SQL handoff (3h 12m)", tag: "SLA" },
      { time: "09:05", event: "Lead reassigned: Bunge → enterprise pod", tag: "Routing" },
    ],
  };
  const activity = activityByAgent[agentId] || [];

  return (
    <div style={{ padding: "32px 36px 60px" }}>
      <Slash>AI Workforce · {a.name}</Slash>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, marginBottom: 8, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={26} strokeWidth={1.6} />
          </div>
          <Display size={48}>{a.name}</Display>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btnGhost}><GitBranch size={13} /> Audit log</button>
          <button style={btnGhost}><Eye size={13} /> Run history</button>
          <button style={btnPrimary}><Play size={13} /> Run agent</button>
        </div>
      </div>
      <div style={{ marginBottom: 26, color: C.textSoft, fontSize: 14, maxWidth: 760 }}>{a.desc}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: C.line, border: `1px solid ${C.line}`, marginBottom: 24 }}>
        <Kpi label="Status" value="Active" delta="—" trend="up" sub={`${a.owner.split('·')[0].trim()}`} accent />
        <Kpi label="Runs (90d)" value={a.runs.toLocaleString()} delta="+412" trend="up" sub="vs prior 90d" />
        <Kpi label="Hrs Saved" value={a.saved} delta="+34" trend="up" sub="vs manual baseline" />
        <Kpi label="Avg Run Time" value={a.avgTime} delta="-0.4" trend="up" sub="down quarter-over-quarter" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 24 }}>
        <Panel title="Capabilities" right={<Mono style={{ color: C.textSoft }}>{a.capabilities.length} sub-functions</Mono>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {a.capabilities.map((c) => (
              <div key={c.name} style={{
                padding: "14px 16px", background: c.flagship ? C.navy : C.paper,
                color: c.flagship ? C.white : C.text,
                borderLeft: `3px solid ${c.flagship ? C.red : C.line}`,
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                    {c.flagship && <Pill tone="hot">Flagship</Pill>}
                  </div>
                  <div style={{ fontSize: 12, color: c.flagship ? "#c4d0e3" : C.textSoft, lineHeight: 1.5 }}>{c.desc}</div>
                </div>
                <ChevronRight size={16} color={c.flagship ? C.white : C.textMute} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Configuration" right={<button style={{ ...btnGhost, padding: "5px 10px", fontSize: 10 }}>Edit</button>}>
          <div style={{ marginBottom: 16 }}>
            <Mono style={{ color: C.textSoft, marginBottom: 6, display: "block" }}>Owner</Mono>
            <div style={{ fontSize: 13, color: C.text }}>{a.owner}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Mono style={{ color: C.textSoft, marginBottom: 6, display: "block" }}>Inputs</Mono>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {a.inputs.map((x) => <span key={x} style={chipStyle}>{x}</span>)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Mono style={{ color: C.textSoft, marginBottom: 6, display: "block" }}>Outputs</Mono>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {a.outputs.map((x) => <span key={x} style={chipStyle}>{x}</span>)}
            </div>
          </div>
          <div>
            <Mono style={{ color: C.textSoft, marginBottom: 6, display: "block" }}>Last run</Mono>
            <div style={{ fontSize: 13, color: C.text, fontFamily: FONT_MONO }}>{a.lastRun}</div>
          </div>
        </Panel>
      </div>

      <Panel title="Recent activity" right={<Mono style={{ color: C.textSoft }}>Last 24h</Mono>}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {activity.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < activity.length - 1 ? `1px solid ${C.lineSoft}` : "none", alignItems: "center" }}>
              <Mono style={{ color: C.textMute, width: 48 }}>{e.time}</Mono>
              <div style={{ flex: 1, fontSize: 13, color: C.text }}>{e.event}</div>
              <Pill tone="cool">{e.tag}</Pill>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ─── GOVERNANCE PAGE ───────────────────────────────────────────────
function Governance() {
  return (
    <div style={{ padding: "32px 36px 60px" }}>
      <Slash>Operating system · Governance</Slash>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, marginBottom: 26, flexWrap: "wrap", gap: 16 }}>
        <Display size={48}>Process &amp; accountability</Display>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btnGhost}><FileText size={13} /> SLA report</button>
          <button style={btnPrimary}>Configure handoff <ArrowRight size={13} /></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: C.line, border: `1px solid ${C.line}`, marginBottom: 24 }}>
        <Kpi label="Active Workflows" value="5" delta="+1" trend="up" sub="across functions" />
        <Kpi label="Avg SLA Compliance" value="93%" delta="-2pt" trend="down" sub="rolling 30d" accent />
        <Kpi label="Total Handoffs" value="1,435" delta="+87" trend="up" sub="last 30 days" />
        <Kpi label="Breaches" value="76" delta="+9" trend="down" sub="needs attention" />
      </div>

      <Panel title="SLA-bound handoffs" right={<Mono style={{ color: C.textSoft }}>5 active</Mono>} padding={0}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.paper }}>
              {["Workflow", "Handoff", "SLA", "Compliance", "Runs", "Breaches", ""].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textSoft, fontWeight: 500, borderBottom: `1px solid ${C.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WORKFLOWS.map((w) => (
              <tr key={w.id} style={{ borderBottom: `1px solid ${C.lineSoft}` }}>
                <td style={{ padding: "16px" }}><strong style={{ color: C.text }}>{w.name}</strong></td>
                <td style={{ padding: "16px", color: C.textSoft }}>{w.owner}</td>
                <td style={{ padding: "16px", fontFamily: FONT_MONO, color: C.text }}>{w.sla}</td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: w.compliance >= 95 ? C.green : w.compliance >= 90 ? C.navy : C.amber }}>{w.compliance}%</div>
                    <div style={{ width: 80, height: 4, background: C.paperWarm }}>
                      <div style={{ height: "100%", width: `${w.compliance}%`, background: w.compliance >= 95 ? C.green : w.compliance >= 90 ? C.navy : C.amber }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px", fontFamily: FONT_MONO, color: C.text }}>{w.runs}</td>
                <td style={{ padding: "16px" }}><span style={{ color: w.breaches > 20 ? C.red : C.textSoft, fontFamily: FONT_MONO }}>{w.breaches}</span></td>
                <td style={{ padding: "16px" }}><button style={{ ...btnGhost, padding: "6px 10px", fontSize: 10 }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Panel title="Ownership matrix" right={<Mono style={{ color: C.textSoft }}>RACI · live</Mono>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { fn: "Demand Generation", owner: "Marketing Ops", agent: "Demand Agent", status: "good" },
              { fn: "Lead Qualification", owner: "Inside Sales", agent: "Demand Agent", status: "good" },
              { fn: "Content Production", owner: "Content Team", agent: "Content Agent", status: "good" },
              { fn: "Account Research", owner: "Field Marketing", agent: "Content Agent", status: "warn" },
              { fn: "Pipeline Reporting", owner: "Revenue Ops", agent: "Analytics Agent", status: "good" },
              { fn: "Workflow Routing", owner: "Marketing Ops", agent: "Ops Agent", status: "good" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: C.paper, border: `1px solid ${C.lineSoft}`, borderLeft: `3px solid ${r.status === "good" ? C.green : C.amber}` }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{r.fn}</div>
                  <Mono style={{ color: C.textMute }}>{r.owner} · powered by {r.agent}</Mono>
                </div>
                {r.status === "good" ? <CheckCircle2 size={16} color={C.green} /> : <AlertCircle size={16} color={C.amber} />}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Audit log · last 24h" right={<Mono style={{ color: C.textSoft }}>Full history available</Mono>}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { time: "09:48", actor: "Content Agent", event: "Generated brief for Caterpillar Inc.", tag: "Agent" },
              { time: "09:42", actor: "M. Reyes", event: "Approved AI brief for Caterpillar Inc.", tag: "Approval" },
              { time: "09:15", actor: "Analytics Agent", event: "Win/loss pattern detected (food processing)", tag: "Synth" },
              { time: "08:33", actor: "Ops Agent", event: "Routed Deere account to enterprise pod", tag: "Routing" },
              { time: "08:02", actor: "System", event: "Demo Request Triage SLA breach (2h 14m)", tag: "Breach" },
              { time: "07:48", actor: "S. Linhart", event: "Updated Eaton account scoring weights", tag: "Config" },
            ].map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 5 ? `1px solid ${C.lineSoft}` : "none" }}>
                <Mono style={{ color: C.textMute, width: 42, flexShrink: 0 }}>{e.time}</Mono>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: C.text }}><strong>{e.actor}</strong> · {e.event}</div>
                </div>
                <Pill tone={e.tag === "Breach" ? "hot" : e.tag === "Agent" || e.tag === "Synth" ? "warm" : "cool"}>{e.tag}</Pill>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─── OPTIMIZATION PAGE ─────────────────────────────────────────────
function Optimize() {
  return (
    <div style={{ padding: "32px 36px 60px" }}>
      <Slash>Operating system · Continuous Optimization</Slash>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, marginBottom: 26, flexWrap: "wrap", gap: 16 }}>
        <Display size={48}>Benchmark vs. ATS Marketing Floor</Display>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btnGhost}><Award size={13} /> Q1 review</button>
          <button style={btnPrimary}>Schedule QBR <ArrowRight size={13} /></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: C.line, border: `1px solid ${C.line}`, marginBottom: 24 }}>
        <Kpi label="Maturity Index" value="83" delta="+5" trend="up" sub="vs Q4 · 100 max" accent />
        <Kpi label="Cohort Rank" value="#3" delta="+2" trend="up" sub="of 47 industrial peers" />
        <Kpi label="Gap to ATS Floor" value="-8pt" delta="+4" trend="up" sub="closing quarterly" />
        <Kpi label="Optimizations Shipped" value="14" delta="+5" trend="up" sub="this quarter" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Panel title="You vs. cohort vs. ATS Marketing Floor" right={<Mono style={{ color: C.textSoft }}>5 dimensions</Mono>}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={BENCHMARK_DATA}>
              <PolarGrid stroke={C.line} />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: C.textSoft }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fontFamily: FONT_MONO, fill: C.textMute }} stroke={C.line} />
              <Radar name="Cohort avg" dataKey="cohort" stroke={C.textMute} fill={C.textMute} fillOpacity={0.12} strokeWidth={1.5} />
              <Radar name="You" dataKey="you" stroke={C.red} fill={C.red} fillOpacity={0.22} strokeWidth={2} />
              <Radar name="ATS Floor" dataKey="ats" stroke={C.navy} fill={C.navy} fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 3" />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT_MONO, letterSpacing: "0.06em", textTransform: "uppercase", paddingTop: 8 }} />
              <Tooltip contentStyle={tipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Maturity index · trailing 5 quarters" right={<Mono style={{ color: C.green }}>↑ +25pt</Mono>}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={QUARTERLY_TREND} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={C.lineSoft} vertical={false} />
              <XAxis dataKey="q" tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: C.textMute }} axisLine={{ stroke: C.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: FONT_MONO, fill: C.textMute }} axisLine={false} tickLine={false} domain={[40, 100]} />
              <Tooltip contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT_MONO, letterSpacing: "0.06em", textTransform: "uppercase", paddingTop: 8 }} />
              <Line type="monotone" dataKey="you" stroke={C.red} strokeWidth={2.5} dot={{ r: 4, fill: C.red }} name="You" />
              <Line type="monotone" dataKey="cohort" stroke={C.textMute} strokeWidth={1.5} strokeDasharray="4 3" dot={{ r: 3, fill: C.textMute }} name="Cohort" />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel title="Top gaps to ATS Floor" right={<Mono style={{ color: C.textSoft }}>Ranked by ROI</Mono>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { area: "Data & Intelligence", you: 76, target: 88, lift: "+12% conv. rate", priority: "P1" },
              { area: "Optimization Loop", you: 78, target: 89, lift: "Compounding 8-15%/qtr", priority: "P1" },
              { area: "AI Workforce", you: 81, target: 94, lift: "Reclaim 200+ hrs/qtr", priority: "P2" },
              { area: "Demand System", you: 88, target: 91, lift: "+$340K pipeline", priority: "P2" },
            ].map((g, i) => (
              <div key={i} style={{ padding: "14px 16px", background: C.paper, border: `1px solid ${C.lineSoft}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{g.area}</div>
                    <Mono style={{ color: C.green, marginTop: 3 }}>Projected lift: {g.lift}</Mono>
                  </div>
                  <Pill tone={g.priority === "P1" ? "hot" : "warm"}>{g.priority}</Pill>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.text, width: 48 }}>{g.you} / {g.target}</div>
                  <div style={{ flex: 1, height: 6, background: C.paperWarm, position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, height: "100%", width: `${g.you}%`, background: C.navy }} />
                    <div style={{ position: "absolute", left: `${g.target}%`, top: -2, width: 2, height: 10, background: C.red }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recommended next experiments" right={<Sparkles size={14} color={C.red} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { title: "Add intent data layer to Demand Agent", why: "Closes Data gap. ATS Marketing Floor saw +12% pipeline within 1 quarter.", effort: "3 weeks" },
              { title: "Expand Content Agent to inside sales", why: "Pre-meeting briefs for AEs cut prep time 80%. Already proven for outside sales.", effort: "2 weeks" },
              { title: "Tighten MQL→SQL handoff to 2hr SLA", why: "Currently 4hr. Industrial peers at 2hr see 23% higher SQL→Opp conversion.", effort: "1 sprint" },
              { title: "Deploy Analytics Agent win/loss synthesis monthly", why: "Currently quarterly. Faster cycle catches messaging drift before it shows up in pipeline.", effort: "1 week" },
            ].map((r, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: i < 3 ? `1px solid ${C.lineSoft}` : "none", display: "flex", gap: 12 }}>
                <div style={{ width: 28, height: 28, background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT_DISPLAY, fontSize: 14 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.5, marginBottom: 6 }}>{r.why}</div>
                  <Mono style={{ color: C.red }}>Effort: {r.effort}</Mono>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────
export default function GrowthOSCockpit() {
  const [active, setActive] = useState("overview");
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        body { margin: 0; }
        button:focus { outline: none; }
        button:focus-visible { outline: 2px solid ${C.red}; outline-offset: 2px; }
      `}</style>
      <Shell active={active} setActive={setActive}>
        {active === "overview" && <Overview go={setActive} />}
        {active === "demand" && <DemandAgent />}
        {active === "content" && <AgentPage agentId="content" />}
        {active === "analytics" && <AgentPage agentId="analytics" />}
        {active === "ops" && <AgentPage agentId="ops" />}
        {active === "governance" && <Governance />}
        {active === "optimize" && <Optimize />}
      </Shell>
    </>
  );
}
