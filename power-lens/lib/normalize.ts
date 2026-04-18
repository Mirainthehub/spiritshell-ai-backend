import type { AnalysisResult, ResponseStyleKind } from "./types";
import { MOCK_ANALYSIS } from "./mock-data";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const STYLE_ORDER: ResponseStyleKind[] = ["Soft", "Balanced", "Hard"];

export function normalizeAnalysisResult(raw: unknown): AnalysisResult {
  if (!isObj(raw)) return { ...MOCK_ANALYSIS };

  const r = raw as Record<string, unknown>;

  const powerMap = isObj(r.powerMap) ? r.powerMap : {};
  const strategicDiagnosis = isObj(r.strategicDiagnosis)
    ? r.strategicDiagnosis
    : {};
  const recommendedMoves = isObj(r.recommendedMoves) ? r.recommendedMoves : {};

  const actors = Array.isArray(powerMap.actors) ? powerMap.actors : [];
  const hiddenDynamics = Array.isArray(r.hiddenDynamics)
    ? r.hiddenDynamics
    : [];
  const relevantLaws = Array.isArray(r.relevantLaws) ? r.relevantLaws : [];
  const redFlags = Array.isArray(r.redFlags) ? r.redFlags : [];
  const missingInformation = Array.isArray(r.missingInformation)
    ? r.missingInformation
    : [];

  let responseStyles = Array.isArray(r.responseStyles)
    ? r.responseStyles
    : [];
  responseStyles = STYLE_ORDER.map((style, i) => {
    const item = isObj(responseStyles[i]) ? responseStyles[i] : {};
    return {
      style,
      approach: String(item.approach ?? ""),
      sampleWording: String(item.sampleWording ?? ""),
      upside: String(item.upside ?? ""),
      downside: String(item.downside ?? ""),
    };
  });

  return {
    situationSummary: String(r.situationSummary ?? ""),
    powerMap: {
      actors: actors.map((a) => {
        const x = isObj(a) ? a : {};
        return {
          name: String(x.name ?? ""),
          role: String(x.role ?? ""),
          formalPower: (x.formalPower as AnalysisResult["powerMap"]["actors"][0]["formalPower"]) ?? "Medium",
          informalInfluence:
            (x.informalInfluence as AnalysisResult["powerMap"]["actors"][0]["informalInfluence"]) ??
            "Medium",
          stanceTowardUser:
            (x.stanceTowardUser as AnalysisResult["powerMap"]["actors"][0]["stanceTowardUser"]) ??
            "Neutral",
          notes: String(x.notes ?? ""),
        };
      }),
      alliances: Array.isArray(powerMap.alliances)
        ? powerMap.alliances.map(String)
        : [],
      threats: Array.isArray(powerMap.threats)
        ? powerMap.threats.map(String)
        : [],
    },
    hiddenDynamics: hiddenDynamics.map((h) => {
      const x = isObj(h) ? h : {};
      return {
        label: String(x.label ?? ""),
        explanation: String(x.explanation ?? ""),
      };
    }),
    relevantLaws: relevantLaws.map((l) => {
      const x = isObj(l) ? l : {};
      return {
        lawNumber: Number(x.lawNumber) || 0,
        title: String(x.title ?? ""),
        whyRelevant: String(x.whyRelevant ?? ""),
        misuseRisk: String(x.misuseRisk ?? ""),
      };
    }),
    strategicDiagnosis: {
      mainMistakeToAvoid: String(strategicDiagnosis.mainMistakeToAvoid ?? ""),
      whatOthersCareAbout: String(strategicDiagnosis.whatOthersCareAbout ?? ""),
      trueLeveragePoint: String(strategicDiagnosis.trueLeveragePoint ?? ""),
      worstMoveRightNow: String(strategicDiagnosis.worstMoveRightNow ?? ""),
    },
    recommendedMoves: {
      immediateNextStep: String(recommendedMoves.immediateNextStep ?? ""),
      shortTermStrategy: String(recommendedMoves.shortTermStrategy ?? ""),
      longTermPositioning: String(recommendedMoves.longTermPositioning ?? ""),
    },
    responseStyles,
    redFlags: redFlags.map(String),
    finalRecommendation: String(r.finalRecommendation ?? ""),
    uncertaintyNote: String(r.uncertaintyNote ?? ""),
    missingInformation: missingInformation.map(String),
    ethicalGuardrailNote: String(r.ethicalGuardrailNote ?? ""),
  };
}
