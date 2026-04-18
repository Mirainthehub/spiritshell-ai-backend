import type { AnalysisResult } from "./types";

export const DEMO_SITUATION =
  "我在团队里贡献很多，但另一个更会表现的同事获得了更多领导关注，我不想撕破脸，也不想显得委屈，应该怎么处理？";

export const DEMO_FORM = {
  situation: DEMO_SITUATION,
  goal: "获得公平认可、提升影响力，同时避免冲突与关系恶化",
  userRole: "团队核心贡献者 / 下属",
  otherActors: "领导；更擅长自我展示的同事",
  constraints: "不能撕破脸；不想显得委屈或情绪化；短期内不离职",
  tonePreference: "Balanced" as const,
  lensMode: "Influence" as const,
};

export const MOCK_ANALYSIS: AnalysisResult = {
  situationSummary:
    "你在产出与可靠性上承担了不少，但领导的注意力与认可被另一位更擅长“可见性管理”的同事截走。你真正想解决的不是“谁更努力”，而是**在组织叙事里重新获得权重与可见性**，同时不把关系变成零和对抗。",
  powerMap: {
    actors: [
      {
        name: "你",
        role: "高贡献、低可见性的执行者",
        formalPower: "Medium",
        informalInfluence: "Low",
        stanceTowardUser: "Neutral",
        notes:
          "你的筹码多在“事实与结果”，但权力往往来自“被看见的结果 + 被信任的解释权”。",
      },
      {
        name: "领导",
        role: "资源分配者、注意力调度者",
        formalPower: "High",
        informalInfluence: "High",
        stanceTowardUser: "Neutral",
        notes:
          "领导可能并未低估你，只是用更省认知的方式处理团队：谁更容易被读懂、谁更容易被汇报。",
      },
      {
        name: "同事",
        role: "高可见性的竞争者 / 表演者",
        formalPower: "Medium",
        informalInfluence: "High",
        stanceTowardUser: "Competitive",
        notes:
          "对方可能把“影响力”当成核心资产：会议、叙事、对齐、提前汇报。",
      },
    ],
    alliances: [
      "与跨职能同事建立轻量协作，让成果从第三方视角被看见",
      "与领导建立“结构化更新”而非“情绪抱怨”",
    ],
    threats: [
      "若你只埋头交付，领导会默认你不需要额外管理成本",
      "若你公开抱怨同事，会被解读为不稳定或政治化",
    ],
  },
  hiddenDynamics: [
    {
      label: "Attention imbalance",
      explanation:
        "领导的时间与注意力是稀缺资源；会表现的人本质是“更便宜地占用注意力”。",
    },
    {
      label: "Status competition",
      explanation:
        "这不是单纯的功劳之争，而是**谁被定义成“关键人物”**的竞争。",
    },
    {
      label: "Narrative control",
      explanation:
        "谁先说、怎么说、在哪些渠道说，往往决定“事实”在组织里长什么样。",
    },
    {
      label: "Ego threat (for you)",
      explanation:
        "不公平感会逼你做出“证明自己”的冲动动作；这通常降低策略质量。",
    },
    {
      label: "Dependency structure",
      explanation:
        "你越依赖单一认可来源（直属领导），你的议价空间越小。",
    },
  ],
  relevantLaws: [
    {
      lawNumber: 1,
      title: "Never Outshine the Master",
      whyRelevant:
        "你想被看见，但不能以“让领导显得迟钝/被蒙蔽”的方式出现。要把功劳写成**领导的决策与团队机制**的结果。",
      misuseRisk:
        "过度谦卑导致消失；正确做法是“把光反射给上级”，而不是自我抹除。",
    },
    {
      lawNumber: 6,
      title: "Court Attention at All Cost",
      whyRelevant:
        "你的问题核心是可见性不足。不是喧哗，而是**可预测、可复用的可见性**：节奏化更新、里程碑、风险前置。",
      misuseRisk:
        "变成表演会损害专业可信度；要的是“被看见的专业”，不是“噪音”。",
    },
    {
      lawNumber: 11,
      title: "Learn to Keep People Dependent on You",
      whyRelevant:
        "把关键能力变成“可交付、可交接、但难替代”的模块（例如：指标口径、流程、跨团队接口）。",
      misuseRisk:
        "藏信息会反噬信任；依赖应来自“结构价值”，不是“信息勒索”。",
    },
    {
      lawNumber: 48,
      title: "Assume Formlessness",
      whyRelevant:
        "不要固定成“受害者/老好人”角色；用更灵活的互动策略：有时对齐，有时提问，有时用数据说话。",
      misuseRisk:
        "过度圆滑会失去立场；边界仍要清晰，只是表达要克制。",
    },
  ],
  strategicDiagnosis: {
    mainMistakeToAvoid:
      "把问题表述成“我和同事谁更努力”，这会让领导进入裁判模式，而你最容易显得情绪化。",
    whatOthersCareAbout:
      "领导在意风险、可控性与结果；同事在意位置与声望。你要用“降低领导管理成本”的语言说话。",
    trueLeveragePoint:
      "把贡献从“隐性”变成“可审计”：里程碑、指标、对外影响、跨团队背书。",
    worstMoveRightNow:
      "私下抱怨同事/暗示领导不公；或在群里阴阳怪气。这会迅速降低你的“专业可信度”。",
  },
  recommendedMoves: {
    immediateNextStep:
      "本周一次 15 分钟对齐：用 3 条 bullet 说明“我完成了什么 + 下一步需要什么 + 风险是什么”，并抄送关键干系人（有选择地）。",
    shortTermStrategy:
      "建立“每周可见性”：固定节奏更新；把大项目拆成可展示的里程碑；把跨部门协作变成第三方见证。",
    longTermPositioning:
      "从“贡献者”升级为“可定义问题的人”：提出指标、流程与决策框架，让组织依赖你的判断，而不仅是你的工时。",
  },
  responseStyles: [
    {
      style: "Soft",
      approach:
        "把诉求包装成“想让团队更稳、让信息更透明”，避免指向个人。",
      sampleWording:
        "我想和你对齐一下优先级：我这边在 A/B 上推进到 X，下一步需要 Y 支持；如果方便，我希望每两周用 5 分钟同步一次，避免我这边风险后置。",
      upside: "关系摩擦低，领导更容易接受。",
      downside: "改变速度慢，需要持续执行。",
    },
    {
      style: "Balanced",
      approach:
        "用事实与结构争取注意力：对齐目标—交付—风险—需要的支持。",
      sampleWording:
        "我想把当前工作对齐到团队目标：我负责的部分在指标上贡献了 X；接下来我会把里程碑拆成 Y，并在 Z 节点前给你风险清单。",
      upside: "专业、清晰，最像“强者的克制”。",
      downside: "需要准备与跟进，不是一次对话解决。",
    },
    {
      style: "Hard",
      approach:
        "明确边界与可验证结果：要求资源/优先级/曝光权，或把选择交给领导。",
      sampleWording:
        "如果继续按 A 路线，我需要你在 B 上明确优先级；否则我可以在 C 上收敛范围。你更希望我优先保证哪一块？",
      upside: "快速把“隐性”变成“可决策”。",
      downside: "语气拿捏不好会显得对抗；适合有筹码时使用。",
    },
  ],
  redFlags: [
    "把“权力视角”当成操控手册：用信息不对称、羞辱、拉帮结派去压人。",
    "用“虚假谦虚”或“阴阳怪气”去报复同事，会污染你的职业品牌。",
    "短期有效但长期有毒：抢功、抹黑、威胁式谈判。",
  ],
  finalRecommendation:
    "在你情境下，最优先的策略是：**把“可见性”做成可重复的专业机制，而不是一次性情绪表达**。用结构化更新占领领导的注意力预算，同时把功劳嵌进上级叙事与团队目标里，让“被看见”变成可审计的结果。你不需要赢过同事，你需要让系统更难忽略你。",
  uncertaintyNote:
    "未提供组织规模、绩效机制、你与领导的历史信任度、同事具体行为（是否越界）等，因此对抗烈度与最佳话术强度仍不确定。",
  missingInformation: [
    "领导的管理风格：偏任务型还是偏关系型？",
    "你是否有量化指标（OKR/KPI）可引用？",
    "同事的“表现”是否包含越界抢功或信息操纵？",
    "你是否有跨团队接口人可为你背书？",
  ],
  ethicalGuardrailNote:
    "Power Lens 用权力动力学视角拆解局势，但**不鼓励操纵、欺骗或伤害他人**。最稳的策略通常同时满足：专业可信、关系可维护、长期可复用。",
};
