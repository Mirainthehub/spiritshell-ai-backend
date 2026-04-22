import type { ChatTurn, IntakeState } from "../lib/intake/types";

export type BenchmarkCase = {
  id: string;
  label: string;
  intakeState: IntakeState;
  conversation: ChatTurn[];
  expectations: {
    shouldMentionAny?: string[];
    shouldAvoidAny?: string[];
    shouldHaveNonEmptyFields?: string[];
  };
};

export const benchmarkCases: BenchmarkCase[] = [
  {
    id: "baseline_visibility",
    label: "职场可见性",
    intakeState: {
      situation:
        "我在团队里承担了很多推进和执行的工作，但另一个更会表达的同事在会议中更容易被领导关注。我不想撕破脸，但也不想一直被忽视。",
      userGoal: "提升影响力并获得更公平的认可",
      powerHolder: "直属领导",
      userRole: "资深执行者",
      keyActors: "表达能力强的同事",
      constraints: "不能公开冲突，需要长期合作",
      risks: "被认为在争功或者难合作",
      priorActions: "偶尔在会议中补充，但没有主动展示",
      relationshipHorizon: "长期",
      tonePreference: "Balanced",
      lensMode: "Influence",
    },
    conversation: [
      {
        role: "user",
        content: "我在团队里做了很多实际推进，但另一个同事更会表现。",
      },
      { role: "assistant", content: "What outcome do you want most here?" },
      { role: "user", content: "我希望得到更公平的认可，也提升影响力。" },
    ],
    expectations: {
      shouldMentionAny: [
        "perception",
        "visibility",
        "narrative",
        "attribution",
        "可见",
        "感知",
        "叙事",
        "归因",
      ],
      shouldAvoidAny: ["多沟通就好了", "增强自信", "直接指责领导偏心"],
      shouldHaveNonEmptyFields: [
        "situationSummary",
        "hiddenDynamics",
        "relevantLaws",
        "finalRecommendation",
      ],
    },
  },
  {
    id: "ego_threat",
    label: "上级被威胁",
    intakeState: {
      situation:
        "我觉得自己在专业能力上比老板更强，经常有更好的想法，但每次我提出时他都会表现出防御甚至否定。",
      userGoal: "让自己的想法被采纳",
      powerHolder: "老板",
      userRole: "下属",
      keyActors: "老板",
      constraints: "不能得罪老板",
      risks: "被认为越界或不尊重",
      priorActions: "直接提出自己的方案",
      relationshipHorizon: "长期",
      tonePreference: "Diplomatic",
      lensMode: "Influence",
    },
    conversation: [
      { role: "user", content: "我提更好的方案时老板会防御。" },
      {
        role: "assistant",
        content: "Who actually has the power to decide what happens?",
      },
      { role: "user", content: "老板。" },
    ],
    expectations: {
      shouldMentionAny: [
        "ego",
        "status",
        "threat",
        "framing",
        "防御",
        "威胁",
        "地位",
        "框架",
      ],
      shouldAvoidAny: ["直接证明你比老板强", "当场纠正老板"],
      shouldHaveNonEmptyFields: [
        "strategicDiagnosis",
        "recommendedMoves",
        "redFlags",
      ],
    },
  },
  {
    id: "info_asymmetry",
    label: "信息不对称",
    intakeState: {
      situation:
        "我掌握一个对方不知道的重要信息，如果使用得当可以在谈判中占优势，但我不确定是否应该现在说出来。",
      userGoal: "在谈判中获得更好结果",
      powerHolder: "对方决策人",
      userRole: "谈判参与者",
      keyActors: "对方团队",
      constraints: "不能破坏合作关系",
      risks: "过早暴露信息失去优势",
      priorActions: "还未使用这个信息",
      relationshipHorizon: "中期合作",
      tonePreference: "Balanced",
      lensMode: "Influence",
    },
    conversation: [
      { role: "user", content: "我有对方不知道的信息，不确定何时说。" },
    ],
    expectations: {
      shouldMentionAny: [
        "timing",
        "leverage",
        "information",
        "asymmetry",
        "时机",
        "杠杆",
        "信息不对称",
      ],
      shouldAvoidAny: ["立刻全部坦白", "完全不说只靠运气"],
      shouldHaveNonEmptyFields: [
        "relevantLaws",
        "recommendedMoves",
        "responseStyles",
      ],
    },
  },
  {
    id: "relationship_pressure",
    label: "越主动越冷淡",
    intakeState: {
      situation:
        "我发现我越主动，对方越冷淡。我已经很努力维系关系，但感觉越来越失去吸引力。",
      userGoal: "恢复关系平衡",
      powerHolder: "对方（情感主导）",
      userRole: "投入更多的一方",
      keyActors: "对方",
      constraints: "不想彻底断开",
      risks: "进一步失去吸引力",
      priorActions: "持续主动联系",
      relationshipHorizon: "长期",
      tonePreference: "Cautious",
      lensMode: "Diplomacy",
    },
    conversation: [
      { role: "user", content: "我越主动，对方越冷淡。" },
    ],
    expectations: {
      shouldMentionAny: [
        "pressure",
        "imbalance",
        "autonomy",
        "signal",
        "压力",
        "失衡",
        "自主",
      ],
      shouldAvoidAny: ["继续加大投入", "每天更频繁联系"],
      shouldHaveNonEmptyFields: [
        "hiddenDynamics",
        "recommendedMoves",
        "finalRecommendation",
      ],
    },
  },
  {
    id: "pattern_replaceability",
    label: "长期被边缘化模式",
    intakeState: {
      situation:
        "我在不同团队里都会遇到类似情况：一开始被认为很可靠，但一段时间后逐渐被边缘化。",
      userGoal: "长期保持核心位置",
      powerHolder: "团队整体评价",
      userRole: "执行型成员",
      keyActors: "团队成员",
      constraints: "不想频繁换环境",
      risks: "长期被替代",
      priorActions: "专注做好任务",
      relationshipHorizon: "长期",
      tonePreference: "Balanced",
      lensMode: "Long-term Trust",
    },
    conversation: [
      { role: "user", content: "我总是先被认可，后来慢慢边缘化。" },
    ],
    expectations: {
      shouldMentionAny: [
        "replaceable",
        "narrative",
        "visibility",
        "positioning",
        "可替代",
        "叙事",
        "定位",
      ],
      shouldAvoidAny: ["只是环境不好", "唯一办法是离开"],
      shouldHaveNonEmptyFields: [
        "strategicDiagnosis",
        "recommendedMoves",
        "redFlags",
      ],
    },
  },
];
