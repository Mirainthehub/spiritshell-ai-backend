import type { AnalysisResult } from "./types";

/** English demo analysis — paired with Chinese MOCK_ANALYSIS for locale-aware mock. */
export const MOCK_ANALYSIS_EN: AnalysisResult = {
  situationSummary:
    "You carry a lot of delivery and reliability, but your manager’s attention and credit are being captured by someone who manages visibility better. The real problem isn’t “who works harder”—it’s **re-weighting your place in the organizational narrative** without turning this into a zero-sum fight.",
  powerMap: {
    actors: [
      {
        name: "You",
        role: "High-contribution, low-visibility executor",
        formalPower: "Medium",
        informalInfluence: "Low",
        stanceTowardUser: "Neutral",
        notes:
          "Your leverage is mostly in facts and outcomes; power here often comes from **seen results plus trusted interpretation rights**.",
      },
      {
        name: "Your manager",
        role: "Allocator of resources and attention",
        formalPower: "High",
        informalInfluence: "High",
        stanceTowardUser: "Neutral",
        notes:
          "They may not undervalue you—they may just manage the team in the lowest-cognitive-load way: whoever is easiest to read and report upward.",
      },
      {
        name: "Peer",
        role: "High-visibility competitor / performer",
        formalPower: "Medium",
        informalInfluence: "High",
        stanceTowardUser: "Competitive",
        notes:
          "They may treat influence as a core asset: meetings, narrative, alignment, early upward updates.",
      },
    ],
    alliances: [
      "Lightweight collaboration with cross-functional peers so results are witnessed from a third angle",
      "Structured updates with your manager—not emotional venting",
    ],
    threats: [
      "If you only ship quietly, your manager may assume you need no extra management cost",
      "If you complain about the peer publicly, you read as political or unstable",
    ],
  },
  hiddenDynamics: [
    {
      label: "Attention imbalance",
      explanation:
        "Manager time and attention are scarce; good performers often win by being cheaper to notice.",
    },
    {
      label: "Status competition",
      explanation:
        "This isn’t only credit—it’s a fight over who gets defined as the “key person.”",
    },
    {
      label: "Narrative control",
      explanation:
        "Who speaks first, how, and in which channels often shapes what “the facts” become inside the org.",
    },
    {
      label: "Ego threat (you)",
      explanation:
        "Unfairness pressure pushes “prove myself” moves—which usually lower strategic quality.",
    },
    {
      label: "Dependency structure",
      explanation:
        "The more you rely on a single source of approval (your manager), the less room you have to negotiate.",
    },
  ],
  relevantLaws: [
    {
      lawNumber: 1,
      title: "Never Outshine the Master",
      whyRelevant:
        "You need visibility without making your manager feel blindsided or foolish. Frame wins as **their decision and team process**.",
      misuseRisk:
        "Over-humility makes you disappear; the move is “reflect credit upward,” not erase yourself.",
    },
    {
      lawNumber: 6,
      title: "Court Attention at All Cost",
      whyRelevant:
        "Your core gap is visibility—not noise. Build **predictable, repeatable visibility**: cadence, milestones, early risk surfacing.",
      misuseRisk:
        "Performative behavior erodes professional trust; you want “seen competence,” not spectacle.",
    },
    {
      lawNumber: 11,
      title: "Learn to Keep People Dependent on You",
      whyRelevant:
        "Turn critical capability into a deliverable, handoffable, hard-to-replace module (metrics, process, interfaces).",
      misuseRisk:
        "Hoarding information backfires; dependency should come from structural value, not blackmail.",
    },
    {
      lawNumber: 48,
      title: "Assume Formlessness",
      whyRelevant:
        "Don’t lock into “victim / nice person.” Stay flexible: align sometimes, ask sharp questions sometimes, use data sometimes.",
      misuseRisk:
        "Over-smoothness erases boundaries; stay clear, stay controlled.",
    },
  ],
  strategicDiagnosis: {
    mainMistakeToAvoid:
      "Framing it as “me vs peer on effort.” That pulls your manager into referee mode and makes you look emotional.",
    whatOthersCareAbout:
      "Your manager cares about risk, control, and outcomes; your peer cares about position and reputation. Speak in “reduce manager overhead” language.",
    trueLeveragePoint:
      "Make contribution **auditable**: milestones, metrics, external impact, third-party endorsement.",
    worstMoveRightNow:
      "Private complaints about the peer / implying unfairness to your manager; or passive-aggressive Slack. That burns professional credibility fast.",
  },
  recommendedMoves: {
    immediateNextStep:
      "This week, a 15-minute alignment: three bullets—what you shipped, what you need next, what risks you see—and selectively CC stakeholders.",
    shortTermStrategy:
      "Weekly visibility: fixed cadence; break big work into showcaseable milestones; turn cross-team work into witnessed wins.",
    longTermPositioning:
      "Move from “contributor” to “person who defines the problem”: propose metrics, process, and decision frames so the org depends on your judgment—not only your hours.",
  },
  responseStyles: [
    {
      style: "Soft",
      approach:
        "Frame the ask as stability and transparency for the team—avoid personal accusations.",
      sampleWording:
        "I want to align priorities: I’m at X on A/B; I need Y to proceed. If it works, a 5-minute sync every two weeks would help me surface risks earlier.",
      upside: "Low relationship friction; easier for your manager to accept.",
      downside: "Slower change; requires sustained follow-through.",
    },
    {
      style: "Balanced",
      approach:
        "Use facts and structure to earn attention: goals—delivery—risk—support needed.",
      sampleWording:
        "I want to align my work to team goals: my area contributed X on the metrics; next I’ll break milestones into Y and send a risk list before Z.",
      upside: "Professional and crisp; reads as strong-but-contained.",
      downside: "Requires prep and follow-up; not a one-shot fix.",
    },
    {
      style: "Hard",
      approach:
        "Make tradeoffs explicit: ask for priority, resources, or visibility—or force a decision.",
      sampleWording:
        "If we stay on plan A, I need a clear priority on B; otherwise I can narrow scope to C. Which outcome do you want me to protect first?",
      upside: "Turns “invisible” work into a decision surface quickly.",
      downside: "Tone risk if you lack leverage; use when you have chips.",
    },
  ],
  redFlags: [
    "Treating power literacy as permission to manipulate: humiliation, gossip coalitions, information hostage-taking.",
    "Passive-aggressive retaliation toward your peer—it stains your brand.",
    "Short-term toxic wins: credit theft, smearing, threat-based negotiation.",
  ],
  finalRecommendation:
    "Your top priority is to make visibility a **repeatable professional mechanism**, not a one-time emotional pitch. Use structured updates to buy attention budget from your manager while embedding credit into their narrative and team goals—make “being seen” auditable. You don’t need to defeat your peer; you need to make the system less able to ignore you.",
  uncertaintyNote:
    "Without org size, performance system, trust history with your manager, or whether the peer crossed lines (credit theft, manipulation), the confrontation level and best phrasing remain uncertain.",
  missingInformation: [
    "Is your manager task-first or relationship-first?",
    "Do you have quantified goals (OKR/KPI) you can cite?",
    "Is the peer’s behavior boundary-crossing (credit theft, misinformation)?",
    "Do you have cross-functional partners who can endorse you?",
  ],
  ethicalGuardrailNote:
    "Power Lens maps incentives and dynamics; it does **not** endorse manipulation, deception, or harm. The most durable moves are usually clear, bounded, and reputation-preserving.",
};
