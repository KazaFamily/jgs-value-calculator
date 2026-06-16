export interface BusinessSegment {
  id: string;
  nameEN: string;
  nameJP: string;
  membersPerStore: number;
  revenuePerStoreMo: number;
  txnPerMemberMo: number;
  opexPerMemberMo: number;
  incrMarginPct: number;
  sl1PromoRevenuePct: number;
  sl2MemberGrowthPct: number;
  sl3RetentionRevenuePct: number;
  sl4CostOptPct: number;
  sourceEN: string;
  sourceJP: string;
}

export const SEGMENTS: BusinessSegment[] = [
  {
    id: "grocery",
    nameEN: "Grocery / Supermarket",
    nameJP: "食料品・スーパーマーケット",
    membersPerStore: 2500,
    revenuePerStoreMo: 127000000,
    txnPerMemberMo: 3.8,
    opexPerMemberMo: 150,
    incrMarginPct: 0.20,
    sl1PromoRevenuePct: 0.04,
    sl2MemberGrowthPct: 0,
    sl3RetentionRevenuePct: 0.02,
    sl4CostOptPct: 0.15,
    sourceEN: "JBrain client baseline + JGS analytics",
    sourceJP: "JBrainクライアント実績値＋JGS分析",
  },
  {
    id: "drugstore",
    nameEN: "Drugstore Chain",
    nameJP: "ドラッグストアチェーン",
    membersPerStore: 10000,
    revenuePerStoreMo: 35200000,
    txnPerMemberMo: 1.3,
    opexPerMemberMo: 120,
    incrMarginPct: 0.25,
    sl1PromoRevenuePct: 0.02,
    sl2MemberGrowthPct: 0.01,
    sl3RetentionRevenuePct: 0.02,
    sl4CostOptPct: 0.15,
    sourceEN: "JACDS FY2024 / Sugi cross-check",
    sourceJP: "JACDS FY2024 / スギ薬局クロスチェック",
  },
  {
    id: "restaurant",
    nameEN: "Restaurant Group (integrated)",
    nameJP: "飲食店グループ（インテグレーテッド）",
    membersPerStore: 3700,
    revenuePerStoreMo: 11900000,
    txnPerMemberMo: 0.8,
    opexPerMemberMo: 120,
    incrMarginPct: 0.30,
    sl1PromoRevenuePct: 0.03,
    sl2MemberGrowthPct: 0.02,
    sl3RetentionRevenuePct: 0,
    sl4CostOptPct: 0.15,
    sourceEN: "Skylark FY2025 benchmarks",
    sourceJP: "すかいらーく FY2025 ベンチマーク",
  },
  {
    id: "retail_coalition",
    nameEN: "Neighborhood Retail Coalition",
    nameJP: "地域店舗連合・商店街",
    membersPerStore: 400,
    revenuePerStoreMo: 22500000,
    txnPerMemberMo: 1.0,
    opexPerMemberMo: 60,
    incrMarginPct: 0.25,
    sl1PromoRevenuePct: 0.02,
    sl2MemberGrowthPct: 0.02,
    sl3RetentionRevenuePct: 0,
    sl4CostOptPct: 0,
    sourceEN: "Small Business Agency survey",
    sourceJP: "中小企業庁実態調査",
  },
  {
    id: "utility",
    nameEN: "Electric Utility",
    nameJP: "電力会社",
    membersPerStore: 50000,
    revenuePerStoreMo: 315000000,
    txnPerMemberMo: 1.0,
    opexPerMemberMo: 40,
    incrMarginPct: 0.06,
    sl1PromoRevenuePct: 0.02,
    sl2MemberGrowthPct: 0,
    sl3RetentionRevenuePct: 0,
    sl4CostOptPct: 0,
    sourceEN: "TEPCO FY2024 data",
    sourceJP: "東京電力 FY2024データ",
  },
  {
    id: "financial",
    nameEN: "Regional Financial Institution",
    nameJP: "地方金融機関",
    membersPerStore: 5000,
    revenuePerStoreMo: 25000000,
    txnPerMemberMo: 2.0,
    opexPerMemberMo: 80,
    incrMarginPct: 0.45,
    sl1PromoRevenuePct: 0.005,
    sl2MemberGrowthPct: 0.005,
    sl3RetentionRevenuePct: 0,
    sl4CostOptPct: 0,
    sourceEN: "Regional Banks Association data",
    sourceJP: "地方銀行協会データ",
  },
  {
    id: "specialty_retail",
    nameEN: "Specialty Retail Chain",
    nameJP: "専門店小売チェーン",
    membersPerStore: 10000,
    revenuePerStoreMo: 45000000,
    txnPerMemberMo: 0.6,
    opexPerMemberMo: 120,
    incrMarginPct: 0.45,
    sl1PromoRevenuePct: 0.03,
    sl2MemberGrowthPct: 0.02,
    sl3RetentionRevenuePct: 0,
    sl4CostOptPct: 0.15,
    sourceEN: "UNIQLO Japan FY2025 proxy",
    sourceJP: "ユニクロ日本法人 FY2025プロキシ指標",
  }
];

export const TRANSLATIONS = {
  en: {
    title: "Value Calculator",
    subtitle: "JGS x Comarch — CLM Cloud Impact Estimator",
    langToggle: "日本語",
    
    // Step instructions
    stepTitle: "Sales Engineering Guide",
    step1: "Enter prospect name & choose a sector.",
    step2: "Input current store location count.",
    step3: "Align baseline benchmarks with known values.",
    step4: "Fine-tune potential Comarch service line impact percentage overrides.",
    step5: "Present annual cumulative opportunity results to lead.",
    
    // Prospect Info Group
    prospectInfo: "Prospect Information",
    companyName: "Prospect / Company Name",
    companyNamePlaceholder: "e.g., Tokyo Retail Corp",
    businessSegment: "Business Segment / Industry Sector",
    selectSegment: "Select segment preset...",
    storeLocations: "Number of Store Locations",
    monthlyActiveMembers: "Active Members (total monthly, optional)",
    monthlyActiveMembersPlaceholder: "Leave empty to use per-store default",
    autoSuggestActiveMembers: "Suggested from total: {{val}} members/store",
    
    // Assumptions Group
    segmentAssumptions: "Baseline Segment Assumptions",
    assumptionsSub: "Adjust preset averages as needed to match prospect real-world scales.",
    assumptionLabel: "Assumption",
    defLabel: "Segment Default",
    estLabel: "Your Estimate",
    unitLabel: "Unit",
    sourceLabel: "Benchmark Baseline Source",
    
    activeMembers: "Active members per store",
    revenuePerStore: "Revenue per store / month",
    txnPerMember: "Avg transactions / member / month",
    opexPerMember: "Operating cost / member / month",
    incrMargin: "Incremental margin on new sales",
    memberShare: "Member share of revenue",
    
    membersUnit: "members",
    currencyMoUnit: "¥ / month",
    txnUnit: "txn / member",
    opexUnit: "¥ / member",
    percentUnit: "% of revenue",
    percentLabelOnly: "%",
    
    // Service Line Impact
    serviceLineImpact: "Service Line Impact Estimates",
    serviceLineImpactSub: "Estimates align based on your discovery conversations. Override values by sliding or typing.",
    serviceLineLabel: "Service Line",
    estRevenueImpact: "Est. Revenue Impact %",
    revImpactMo: "Revenue Impact / Store / Month",
    marginImpactMo: "Margin Impact / Store / Month",
    costSavingMo: "Cost Saving / Store / Month",
    netValueMo: "Net Value / Store / Month",
    confidence: "Confidence Level",
    
    sl1Title: "SL1 — Managed Promotions",
    sl1Desc: "Revenue lift from running targeting promotions. Requires real-time POS integration.",
    sl2Title: "SL2 — Member Recruitment",
    sl2Desc: "Revenue lift from structured member drive campaigns (twice a year).",
    sl3Title: "SL3 — Retention / Churn Defense",
    sl3Desc: "Revenue protected through churn defense — keeping active members.",
    sl4Title: "SL4 — Program Cost Optimization",
    sl4Desc: "Operating cost reduction from points/rewards redesign.",
    
    // Confidence text translation
    confidenceMediumJBrain: "Medium — JBrain data",
    confidenceMediumJBrainDrives: "Medium — JBrain drives",
    confidenceLowMed: "Low-Med — limited data",
    confidenceMediumDelicia: "Medium — Delicia case",
    confidenceDefault: "Medium",
    
    // Summary
    totalImpact: "Total Cumulative Impact Summary",
    totalNetValuePerStore: "Total Net Value per Store / Month",
    totalStores: "Number of Stores Active",
    totalValueMonth: "Total Estimated Value / Month",
    totalValueYear: "Total Estimated Value / Year",
    annualOpportunity: "Annual Net Value Created",
    monthlyOpportunity: "Monthly Net Value Created",
    calculatedAlert: "Instant live estimates updated based on parameters.",
    resetPrompt: "Reset Overrides",
    
    // Footer / Source
    caveatHeader: "Sales Enablement Disclaimers",
    caveat1: "All estimates are directional starting points for design/sales conversations, not formal commercial SLA guarantees. Actual results vary on execution.",
    caveat2: "Grocery presets are highly optimized using extensive JBrain client baselines. Other industry models use Japan macroeconomic indices.",
    caveat3: "SL1 promotions engine benefit requires real-time POS processing integrations (such as Teraoka or TEC setups). Adjust down if prospect cannot support.",
    footerSource: "Source: JBrain client analytics (JGS internal), Japan market benchmarks (JACDS, Skylark, TEPCO, Regional Banks Association), Comarch CLM Cloud business model.",
    
    // Interactive buttons
    editButton: "Edit Preset Baseline",
    usingPreset: "Using Presetted Segment Baseline Values"
  },
  jp: {
    title: "バリュー・カルキュレーター",
    subtitle: "JGS x Comarch — CLMクラウド収益インパクト試算ツール",
    langToggle: "English",
    
    // Step instructions
    stepTitle: "成約のためのセールス設計ガイド",
    step1: "見込み客の企業名を入力し、もっとも近い業界カテゴリーを選択します。",
    step2: "想定全体の展開店舗数を入力します。",
    step3: "ベンチマーク初期値がプリロードされます。必要に応じて個別数値を上書き可。",
    step4: "各サービスライン（SL）ごとの予測成長率％インパクトをヒアリングに合わせて微調整。",
    step5: "下部に連動計算される「年間創出バリュー（売上高 margins + 経費削減）」を元に提案を組み立てます。",
    
    // Prospect Info Group
    prospectInfo: "見込み対象のプロファイル",
    companyName: "見込み客・企業名",
    companyNamePlaceholder: "例：東京リテール株式会社",
    businessSegment: "該当業界カテゴリー",
    selectSegment: "カテゴリーを選択してください...",
    storeLocations: "対象店舗数",
    monthlyActiveMembers: "月間アクティブ会員数合計（分かる場合のみ、任意）",
    monthlyActiveMembersPlaceholder: "未入力の場合、店舗ごとの初期値を使用します",
    autoSuggestActiveMembers: "店舗あたり換算推奨：{{val}} 名",
    
    // Assumptions Group
    segmentAssumptions: "シミュレーション前提条件（ベンチマーク）",
    assumptionsSub: "業界プリセット値が表示されます。個別のヒアリング結果に応じて「カスタム値」への上書きが可能です。",
    assumptionLabel: "想定項目",
    defLabel: "ベンチマーク初期値",
    estLabel: "カスタム入力値",
    unitLabel: "単位",
    sourceLabel: "ベンチマークの根拠データ",
    
    activeMembers: "1店舗あたりのアクティブ会員数",
    revenuePerStore: "1店舗あたりの月間売上高",
    txnPerMember: "会員1人あたりの月間平均取引回数",
    opexPerMember: "会員1人あたりの月間システム・運営コスト",
    incrMargin: "新規売上に対する限界利益率",
    memberShare: "売上における会員シェア",
    
    membersUnit: "名",
    currencyMoUnit: "円 / 月",
    txnUnit: "回 / 月",
    opexUnit: "円 / 会員・月",
    percentUnit: "% (対売上)",
    percentLabelOnly: "%",
    
    // Service Line Impact
    serviceLineImpact: "COMARCHサービスライン別の収益効果予測",
    serviceLineImpactSub: "サービスラインごとの貢献値％をスライドまたは直接入力で調節します。店舗ごとの営業効果が自動計算されます。",
    serviceLineLabel: "提供サービスライン(SL)",
    estRevenueImpact: "売上高への期待インパクト %",
    revImpactMo: "店舗別月間売上創出額",
    marginImpactMo: "店舗別月間利益創出額",
    costSavingMo: "店舗別月間コスト削減額",
    netValueMo: "店舗別月間純付加価値",
    confidence: "データ信頼度",
    
    sl1Title: "SL1 — プロモーション管理 (Managed Promotions)",
    sl1Desc: "実購買ログ動向に基づくピンポイントな販促実施による売上向上。リアルタイムなPOS接続（寺岡、TECなど）が必要です。",
    sl2Title: "SL2 — 会員獲得強化 (Member Recruitment)",
    sl2Desc: "年2回構造化された会員リクルーティングキャンペーンの実行による、新規アクティブ会員増に伴う売上向上。",
    sl3Title: "SL3 — 離脱防止 (Retention / Churn Defense)",
    sl3Desc: "離脱リスクのある既存会員のアクティブ会員化保護による売上の維持効果。",
    sl4Title: "SL4 — プログラムコスト最適化 (Cost Optimization)",
    sl4Desc: "ポイント付与・リワードルールの最適な再設計による、無駄な還元コストや運営固定コストの削減効果。",
    
    // Confidence text translation
    confidenceMediumJBrain: "中レベル — JBrainクライアント実績",
    confidenceMediumJBrainDrives: "中レベル — JBrain獲得ドライブ実績",
    confidenceLowMed: "低〜中レベル — 限定的な検証対象データ",
    confidenceMediumDelicia: "中レベル — 株式会社デリシア実導入例",
    confidenceDefault: "中程度",
    
    // Summary
    totalImpact: "想定最終バリュー試算結果（サマリー）",
    totalNetValuePerStore: "店舗あたりの月間バリュー創出",
    totalStores: "シミュレーション総店舗数",
    totalValueMonth: "想定月間創出バリュー（全体店舗）",
    totalValueYear: "想定年間創出バリュー（全体店舗）",
    annualOpportunity: "創出される年間付加価値",
    monthlyOpportunity: "創出される月間付加価値",
    calculatedAlert: "各数値を基にしたリアルタイムな見積りバリューが連動更新されています。",
    resetPrompt: "上書き値をリセット",
    
    // Footer / Source
    caveatHeader: "ご提案に関する重要事項・免責",
    caveat1: "本試算機による算出額は商談に向けた目安／シミュレーション値であり、実際の導入時における成果やサービス品質（SLA）を保証するものではありません。",
    caveat2: "「スーパーマーケット」カテゴリーはJBrainが培った国内の実顧客実績を豊富に反映していますが、その他カテゴリーは日本国内のマクロ指標を用いた予測モデルとなります。",
    caveat3: "SL1（プロモーション管理）の効果最大化のためには、レジPOS連動の仕組みが必要になります。POS連携が技術的に困難な場合は比率を低減して試算してください。",
    footerSource: "情報元：JBrain流通クライアント分析（JGS社内データ）、日本国内ドラッグストア・外食ベンチマーク（JACDS、すかいらーく、東京電力、地方銀行協会各公開情報）、Comarch社CLM Cloud想定費用対効果設計モデル。",
    
    // Interactive buttons
    editButton: "項目セクションのカスタム",
    usingPreset: "選択カテゴリーの標準ベンチマークを適用中"
  }
};
