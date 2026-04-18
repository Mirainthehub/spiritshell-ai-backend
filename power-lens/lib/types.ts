import type { ChatTurn, IntakeState } from "./intake/types";

export type TonePreference =
  | "Cautious"
  | "Balanced"
  | "Assertive"
  | "Defensive"
  | "Diplomatic";

export type LensMode = "Survival" | "Influence" | "Diplomacy" | "Long-term Trust";

export type FormalPower = "Low" | "Medium" | "High";
export type InformalInfluence = "Low" | "Medium" | "High";
export type Stance =
  | "Supportive"
  | "Neutral"
  | "Competitive"
  | "Threatening";

export type ResponseStyleKind = "Soft" | "Balanced" | "Hard";

export interface PowerMapActor {
  name: string;
  role: string;
  formalPower: FormalPower;
  informalInfluence: InformalInfluence;
  stanceTowardUser: Stance;
  notes: string;
}

export interface RelevantLaw {
  lawNumber: number;
  title: string;
  whyRelevant: string;
  misuseRisk: string;
}

export interface HiddenDynamic {
  label: string;
  explanation: string;
}

export interface StrategicDiagnosis {
  mainMistakeToAvoid: string;
  whatOthersCareAbout: string;
  trueLeveragePoint: string;
  worstMoveRightNow: string;
}

export interface RecommendedMoves {
  immediateNextStep: string;
  shortTermStrategy: string;
  longTermPositioning: string;
}

export interface ResponseStyle {
  style: ResponseStyleKind;
  approach: string;
  sampleWording: string;
  upside: string;
  downside: string;
}

/** Full analysis output — LLM + mock must conform */
export interface AnalysisResult {
  situationSummary: string;
  powerMap: {
    actors: PowerMapActor[];
    alliances: string[];
    threats: string[];
  };
  hiddenDynamics: HiddenDynamic[];
  relevantLaws: RelevantLaw[];
  strategicDiagnosis: StrategicDiagnosis;
  recommendedMoves: RecommendedMoves;
  responseStyles: ResponseStyle[];
  redFlags: string[];
  finalRecommendation: string;
  /** When inputs are thin, explain what is uncertain */
  uncertaintyNote: string;
  /** What the user could add to sharpen the analysis */
  missingInformation: string[];
  /** Short ethical framing — not moralizing, bounded intelligence */
  ethicalGuardrailNote: string;
}

/** @deprecated Legacy flat body; prefer AnalyzeApiRequestBody */
export interface AnalyzeRequestBody {
  situation: string;
  goal: string;
  userRole: string;
  otherActors: string;
  constraints: string;
  tonePreference: TonePreference;
  lensMode: LensMode;
  /** When true, skip LLM and return mock */
  useMock?: boolean;
  /** From Conversation Intake Engine (optional, improves prompt) */
  powerHolder?: string;
  risks?: string;
  priorActions?: string;
  relationshipHorizon?: string;
}

/** POST /api/analyze — intake + dialogue → AnalysisResult JSON */
export interface AnalyzeApiRequestBody {
  intakeState: IntakeState;
  conversation: ChatTurn[];
  useMock?: boolean;
}
