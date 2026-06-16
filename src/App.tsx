import React, { useState, useMemo, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Settings2, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  Info,
  HelpCircle,
  TrendingUp,
  Lock,
  ArrowRight,
  TrendingDown,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SEGMENTS, TRANSLATIONS, BusinessSegment } from "./data";

export default function App() {
  // Locale State
  const [lang, setLang] = useState<"en" | "jp">("jp"); // JP default for Japan local market context, supports easy swap
  const t = TRANSLATIONS[lang];

  // UI state
  const [showInstructions, setShowInstructions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Core Form Inputs
  const [prospectName, setProspectName] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState(SEGMENTS[0].id);
  const [storeCountRaw, setStoreCountRaw] = useState<string>("10");
  const [totalMembersRaw, setTotalMembersRaw] = useState<string>("");

  // Key Assumptions Overrides (State as strings to allow natural typing/erasure)
  const [overrideMembers, setOverrideMembers] = useState<string>("");
  const [overrideRevenue, setOverrideRevenue] = useState<string>("");
  const [overrideTxn, setOverrideTxn] = useState<string>("");
  const [overrideOpex, setOverrideOpex] = useState<string>("");
  const [overrideIncrMargin, setOverrideIncrMargin] = useState<string>("");
  const [overrideMemberShare, setOverrideMemberShare] = useState<string>("");

  // Service Line Overrides (State as strings of fractions or decimals, e.g. "0.04" or "4")
  const [overrideSl1, setOverrideSl1] = useState<string>("");
  const [overrideSl2, setOverrideSl2] = useState<string>("");
  const [overrideSl3, setOverrideSl3] = useState<string>("");
  const [overrideSl4, setOverrideSl4] = useState<string>("");

  // Find active segment preset
  const activeSegment = useMemo(() => {
    return SEGMENTS.find(s => s.id === selectedSegmentId) || SEGMENTS[0];
  }, [selectedSegmentId]);

  // Derived effective values of factors (uses override if set, else segment default)
  const storeCount = useMemo(() => {
    const val = parseInt(storeCountRaw, 10);
    return isNaN(val) || val < 0 ? 0 : val;
  }, [storeCountRaw]);

  const activeMembersPerStore = useMemo(() => {
    if (overrideMembers !== "") {
      const val = parseFloat(overrideMembers);
      return isNaN(val) ? activeSegment.membersPerStore : val;
    }
    return activeSegment.membersPerStore;
  }, [overrideMembers, activeSegment]);

  // Offer to suggest/set the per-store count if the user inputs overall members
  const totalSuggestedMembersPerStore = useMemo(() => {
    const totalMem = parseFloat(totalMembersRaw);
    if (isNaN(totalMem) || totalMem <= 0 || storeCount <= 0) return null;
    return Math.round(totalMem / storeCount);
  }, [totalMembersRaw, storeCount]);

  const revenuePerStoreMo = useMemo(() => {
    if (overrideRevenue !== "") {
      const val = parseFloat(overrideRevenue);
      return isNaN(val) ? activeSegment.revenuePerStoreMo : val;
    }
    return activeSegment.revenuePerStoreMo;
  }, [overrideRevenue, activeSegment]);

  const txnPerMemberMo = useMemo(() => {
    if (overrideTxn !== "") {
      const val = parseFloat(overrideTxn);
      return isNaN(val) ? activeSegment.txnPerMemberMo : val;
    }
    return activeSegment.txnPerMemberMo;
  }, [overrideTxn, activeSegment]);

  const opexPerMemberMo = useMemo(() => {
    if (overrideOpex !== "") {
      const val = parseFloat(overrideOpex);
      return isNaN(val) ? activeSegment.opexPerMemberMo : val;
    }
    return activeSegment.opexPerMemberMo;
  }, [overrideOpex, activeSegment]);

  const incrMarginPct = useMemo(() => {
    if (overrideIncrMargin !== "") {
      const val = parseFloat(overrideIncrMargin);
      return isNaN(val) ? activeSegment.incrMarginPct : val / 100.0;
    }
    return activeSegment.incrMarginPct;
  }, [overrideIncrMargin, activeSegment]);

  const memberShareOfRevenue = useMemo(() => {
    if (overrideMemberShare !== "") {
      const val = parseFloat(overrideMemberShare);
      return isNaN(val) ? 0.65 : val / 100.0;
    }
    return 0.65; 
  }, [overrideMemberShare]);

  // Service Line Percentages (Active Values)
  const sl1Pct = useMemo(() => {
    if (overrideSl1 !== "") {
      const val = parseFloat(overrideSl1);
      return isNaN(val) ? activeSegment.sl1PromoRevenuePct : val / 100.0;
    }
    return activeSegment.sl1PromoRevenuePct;
  }, [overrideSl1, activeSegment]);

  const sl2Pct = useMemo(() => {
    if (overrideSl2 !== "") {
      const val = parseFloat(overrideSl2);
      return isNaN(val) ? activeSegment.sl2MemberGrowthPct : val / 100.0;
    }
    return activeSegment.sl2MemberGrowthPct;
  }, [overrideSl2, activeSegment]);

  const sl3Pct = useMemo(() => {
    if (overrideSl3 !== "") {
      const val = parseFloat(overrideSl3);
      return isNaN(val) ? activeSegment.sl3RetentionRevenuePct : val / 100.0;
    }
    return activeSegment.sl3RetentionRevenuePct;
  }, [overrideSl3, activeSegment]);

  const sl4Pct = useMemo(() => {
    if (overrideSl4 !== "") {
      const val = parseFloat(overrideSl4);
      return isNaN(val) ? activeSegment.sl4CostOptPct : val / 100.0;
    }
    return activeSegment.sl4CostOptPct;
  }, [overrideSl4, activeSegment]);

  // CALCULATIONS (Re-implemented faithfully from Sheet formulas)
  const sl1RevenueImpact = useMemo(() => {
    const divFactor = Math.max(activeMembersPerStore, 1);
    return activeMembersPerStore * (revenuePerStoreMo / divFactor) * sl1Pct;
  }, [activeMembersPerStore, revenuePerStoreMo, sl1Pct]);

  const sl1MarginImpact = useMemo(() => {
    return sl1RevenueImpact * incrMarginPct;
  }, [sl1RevenueImpact, incrMarginPct]);

  const sl1CostSaving = 0;
  const sl1NetValue = sl1MarginImpact + sl1CostSaving;

  // SL2 Member Recruitment
  const sl2RevenueImpact = useMemo(() => {
    const divFactor = Math.max(activeMembersPerStore, 1);
    return activeMembersPerStore * (revenuePerStoreMo / divFactor) * sl2Pct;
  }, [activeMembersPerStore, revenuePerStoreMo, sl2Pct]);

  const sl2MarginImpact = useMemo(() => {
    return sl2RevenueImpact * incrMarginPct;
  }, [sl2RevenueImpact, incrMarginPct]);

  const sl2CostSaving = 0;
  const sl2NetValue = sl2MarginImpact + sl2CostSaving;

  // SL3 Retention / Churn Defense
  const sl3RevenueImpact = useMemo(() => {
    const divFactor = Math.max(activeMembersPerStore, 1);
    return activeMembersPerStore * (revenuePerStoreMo / divFactor) * sl3Pct;
  }, [activeMembersPerStore, revenuePerStoreMo, sl3Pct]);

  const sl3MarginImpact = useMemo(() => {
    return sl3RevenueImpact * incrMarginPct;
  }, [sl3RevenueImpact, incrMarginPct]);

  const sl3CostSaving = 0;
  const sl3NetValue = sl3MarginImpact + sl3CostSaving;

  // SL4 Program Cost Optimization
  const sl4RevenueImpact = 0;
  const sl4MarginImpact = 0;
  const sl4CostSaving = useMemo(() => {
    return activeMembersPerStore * opexPerMemberMo * sl4Pct;
  }, [activeMembersPerStore, opexPerMemberMo, sl4Pct]);
  
  const sl4NetValue = sl4MarginImpact + sl4CostSaving;

  // TOTALS
  const totalNetValuePerStoreMo = useMemo(() => {
    return sl1NetValue + sl2NetValue + sl3NetValue + sl4NetValue;
  }, [sl1NetValue, sl2NetValue, sl3NetValue, sl4NetValue]);

  const totalValueMonthAllStores = useMemo(() => {
    return totalNetValuePerStoreMo * storeCount;
  }, [totalNetValuePerStoreMo, storeCount]);

  const totalValueYearAllStores = useMemo(() => {
    return totalValueMonthAllStores * 12;
  }, [totalValueMonthAllStores]);

  // Format Japanese Yen elegantly
  const formatYen = (val: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatPercent = (fraction: number) => {
    return `${(fraction * 100).toFixed(1)}%`;
  };

  // Reset function to restore values back to selected category presets
  const handleReset = () => {
    setOverrideMembers("");
    setOverrideRevenue("");
    setOverrideTxn("");
    setOverrideOpex("");
    setOverrideIncrMargin("");
    setOverrideMemberShare("");
    setOverrideSl1("");
    setOverrideSl2("");
    setOverrideSl3("");
    setOverrideSl4("");
    setTotalMembersRaw("");
  };

  // Copy structured proposal summary to Clipboard for salesperson
  const handleCopySummary = () => {
    const segmentName = lang === "en" ? activeSegment.nameEN : activeSegment.nameJP;
    const txt = `${t.title} — JGS x Comarch
--------------------------------------------------
${t.companyName}: ${prospectName || (lang === "en" ? "Prospect" : "見込み客")}
${t.businessSegment}: ${segmentName}
${t.storeLocations}: ${storeCount} stores
--------------------------------------------------
${t.activeMembers}: ${activeMembersPerStore.toLocaleString()} (${overrideMembers !== "" ? "Custom" : "Preset"})
${t.revenuePerStore}: ${formatYen(revenuePerStoreMo)} (${overrideRevenue !== "" ? "Custom" : "Preset"})
${t.incrMargin}: ${(incrMarginPct * 100).toFixed(1)}%
--------------------------------------------------
EXPECTED ANNUAL VALUE CREATED:
★ ${formatYen(totalValueYearAllStores)} / year (${t.annualOpportunity})
- ${formatYen(totalValueMonthAllStores)} / month (${t.monthlyOpportunity})
- ${formatYen(totalNetValuePerStoreMo)} / store / month (${t.totalNetValuePerStore})
--------------------------------------------------
SERVICE LINE VALUE SHARE (MONTHLY PER STORE):
1. ${t.sl1Title}: ${formatYen(sl1NetValue)} / mo (Impact: ${formatPercent(sl1Pct)})
2. ${t.sl2Title}: ${formatYen(sl2NetValue)} / mo (Impact: ${formatPercent(sl2Pct)})
3. ${t.sl3Title}: ${formatYen(sl3NetValue)} / mo (Impact: ${formatPercent(sl3Pct)})
4. ${t.sl4Title}: ${formatYen(sl4NetValue)} / mo (Impact: ${formatPercent(sl4Pct)})
--------------------------------------------------
Generated via JGS Comarch Value Calculator App - ${new Date().toLocaleDateString()}`;

    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="calculator-root" className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Glassmorphic Sticky Header matching Sleek Interface spec */}
      <header id="app-header" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 shadow-sm transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-200">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 font-display">
                  {t.title}
                </h1>
                <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md border border-indigo-100/50">
                  CLM Cloud
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hard Reset Button */}
            <button 
              id="reset-btn"
              onClick={handleReset} 
              className="text-xs text-slate-400 hover:text-indigo-600 p-2 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1 cursor-pointer"
              title={t.resetPrompt}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-semibold">{t.resetPrompt}</span>
            </button>

            {/* Custom Premium EN / JP Toggle switch as requested in Design specs */}
            <div 
              id="language-toggle"
              onClick={() => setLang(lang === "en" ? "jp" : "en")}
              className="w-20 h-8 bg-slate-100 rounded-full flex items-center p-1 cursor-pointer select-none border border-slate-200/60"
            >
              <div className={`w-1/2 h-full rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                EN
              </div>
              <div className={`w-1/2 h-full rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${lang === 'jp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                JP
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">

        {/* Step Guide Accordion */}
        <div id="guide-accordion" className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-xs transition-shadow hover:shadow-xs">
          <button
            id="toggle-instructions-btn"
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50 hover:cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{t.stepTitle}</span>
            </div>
            {showInstructions ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="p-5 space-y-3 bg-white text-xs text-slate-500 leading-relaxed">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="font-mono text-[9px] text-indigo-600 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded">01</span>
                      <p className="font-medium text-slate-700 mt-1">{t.step1}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="font-mono text-[9px] text-indigo-600 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded">02</span>
                      <p className="font-medium text-slate-700 mt-1">{t.step2}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="font-mono text-[9px] text-indigo-600 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded">03</span>
                      <p className="font-medium text-slate-700 mt-1">{t.step3}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="font-mono text-[9px] text-indigo-600 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded">04</span>
                      <p className="font-medium text-slate-700 mt-1">{t.step4}</p>
                    </div>
                    <div className="p-3 bg-emerald-50/20 rounded-2xl border border-emerald-100/50 space-y-1">
                      <span className="font-mono text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded">05</span>
                      <p className="font-medium text-slate-800 mt-1">{t.step5}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 1: Prospect Profile */}
        <section id="prospect-profile-section" className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-display">
              {t.prospectInfo}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Company Name */}
            <div className="space-y-1.5 input-group">
              <label htmlFor="company-name-input" className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                {t.companyName}
              </label>
              <input
                id="company-name-input"
                type="text"
                placeholder={t.companyNamePlaceholder}
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden text-slate-700 font-semibold"
              />
            </div>

            {/* Business Segment dropdown */}
            <div className="space-y-1.5 input-group">
              <label htmlFor="segment-select" className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                {t.businessSegment}
              </label>
              <div className="relative">
                <select
                  id="segment-select"
                  value={selectedSegmentId}
                  onChange={(e) => {
                    setSelectedSegmentId(e.target.value);
                    handleReset();
                  }}
                  className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden text-slate-700 font-semibold appearance-none pr-8 cursor-pointer"
                >
                  {SEGMENTS.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {lang === "en" ? seg.nameEN : seg.nameJP}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Store locations */}
            <div className="space-y-1.5 input-group">
              <label htmlFor="store-locations-input" className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block flex justify-between">
                <span>{t.storeLocations}</span>
                <span className="text-[10px] text-slate-400 normal-case font-medium">{storeCount} stores</span>
              </label>
              <div className="relative">
                <input
                  id="store-locations-input"
                  type="number"
                  placeholder="e.g., 10"
                  value={storeCountRaw}
                  min="1"
                  onChange={(e) => setStoreCountRaw(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden text-slate-700 font-semibold"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Optional Overall Monthly Members */}
            <div className="space-y-1.5 input-group">
              <label htmlFor="total-monthly-members-input" className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                {t.monthlyActiveMembers}
              </label>
              <input
                id="total-monthly-members-input"
                type="number"
                placeholder={t.monthlyActiveMembersPlaceholder}
                value={totalMembersRaw}
                onChange={(e) => setTotalMembersRaw(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden text-slate-700 font-semibold"
              />
              {totalSuggestedMembersPerStore !== null && (
                <div className="flex items-center justify-between text-[10px] text-indigo-600 pt-1 font-medium bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100/50">
                  <span>{t.autoSuggestActiveMembers.replace("{{val}}", totalSuggestedMembersPerStore.toLocaleString())}</span>
                  <button
                    id="apply-suggestion-btn"
                    onClick={() => setOverrideMembers(totalSuggestedMembersPerStore.toString())}
                    className="underline hover:text-indigo-800 cursor-pointer font-bold ml-2 text-[10px]"
                  >
                    Apply (上書き適用)
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Segment Assumptions Baseline */}
        <section id="segment-assumptions-section" className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-600" />
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-display">
                  {t.segmentAssumptions}
                </h2>
                <p className="text-[10px] text-slate-400 italic mt-0.5">
                  {t.assumptionsSub}
                </p>
              </div>
            </div>
            
            {/* Baseline source details with pill */}
            <div className="text-[10px] text-indigo-700 bg-indigo-50/50 py-1.5 px-3 rounded-xl font-semibold border border-indigo-100/40 text-left sm:text-right">
              <span className="font-bold opacity-75">{t.sourceLabel}: </span>
              {lang === "en" ? activeSegment.sourceEN : activeSegment.sourceJP}
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-xs min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]/5 text-right">
                  <th className="pb-3 text-left w-2/5">{t.assumptionLabel}</th>
                  <th className="pb-3 text-right w-1/5">{t.defLabel}</th>
                  <th className="pb-3 text-center w-3/10" style={{ textAlign: "center" }}>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200/50 px-2.5 py-1 rounded-md font-bold inline-block text-[9px] uppercase tracking-normal">
                      {t.estLabel} ( editable )
                    </span>
                  </th>
                  <th className="pb-3 text-left pl-4 text-slate-400 w-1/10">{t.unitLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* 1. Active members per store */}
                <tr className="align-middle group">
                  <td className="py-3 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {t.activeMembers}
                  </td>
                  <td className="py-3 font-mono text-right text-slate-400 font-semibold">
                    {activeSegment.membersPerStore.toLocaleString()}
                  </td>
                  <td className="py-1.5 px-3">
                    <input
                      id="est-members-input"
                      type="number"
                      placeholder="Override preset..."
                      value={overrideMembers}
                      onChange={(e) => setOverrideMembers(e.target.value)}
                      className={`w-full text-center py-2 text-xs px-3 rounded-xl border font-bold focus:ring-2 focus:ring-amber-500/10 focus:outline-hidden focus:border-amber-500 transition-all ${
                        overrideMembers !== "" 
                          ? "bg-amber-500/10 border-amber-300 text-amber-900" 
                          : "bg-amber-50/20 border-slate-100 text-slate-700"
                      }`}
                    />
                  </td>
                  <td className="py-3 text-slate-400 pl-4 font-medium">
                    {t.membersUnit}
                  </td>
                </tr>

                {/* 2. Revenue per store / month */}
                <tr className="align-middle group">
                  <td className="py-3 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {t.revenuePerStore}
                  </td>
                  <td className="py-3 font-mono text-right text-slate-400 font-semibold">
                    {formatYen(activeSegment.revenuePerStoreMo)}
                  </td>
                  <td className="py-1.5 px-3">
                    <input
                      id="est-revenue-input"
                      type="number"
                      placeholder="e.g. 100000000"
                      value={overrideRevenue}
                      onChange={(e) => setOverrideRevenue(e.target.value)}
                      className={`w-full text-center py-2 text-xs px-3 rounded-xl border font-bold focus:ring-2 focus:ring-amber-500/10 focus:outline-hidden focus:border-amber-500 transition-all ${
                        overrideRevenue !== "" 
                          ? "bg-amber-500/10 border-amber-300 text-amber-900" 
                          : "bg-amber-50/20 border-slate-100 text-slate-700"
                      }`}
                    />
                  </td>
                  <td className="py-3 text-slate-400 pl-4 font-medium">
                    {t.currencyMoUnit}
                  </td>
                </tr>

                {/* 3. Avg transactions / member / month */}
                <tr className="align-middle group">
                  <td className="py-3 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {t.txnPerMember}
                  </td>
                  <td className="py-3 font-mono text-right text-slate-400 font-semibold">
                    {activeSegment.txnPerMemberMo.toFixed(1)}
                  </td>
                  <td className="py-1.5 px-3">
                    <input
                      id="est-txn-input"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 2.4"
                      value={overrideTxn}
                      onChange={(e) => setOverrideTxn(e.target.value)}
                      className={`w-full text-center py-2 text-xs px-3 rounded-xl border font-bold focus:ring-2 focus:ring-amber-500/10 focus:outline-hidden focus:border-amber-500 transition-all ${
                        overrideTxn !== "" 
                          ? "bg-amber-500/10 border-amber-300 text-amber-900" 
                          : "bg-amber-50/20 border-slate-100 text-slate-700"
                      }`}
                    />
                  </td>
                  <td className="py-3 text-slate-400 pl-4 font-medium">
                    {t.txnUnit}
                  </td>
                </tr>

                {/* 4. Operating cost / member / month */}
                <tr className="align-middle group">
                  <td className="py-3 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {t.opexPerMember}
                  </td>
                  <td className="py-3 font-mono text-right text-slate-400 font-semibold">
                    {formatYen(activeSegment.opexPerMemberMo)}
                  </td>
                  <td className="py-1.5 px-3">
                    <input
                      id="est-opex-input"
                      type="number"
                      placeholder="e.g. 100"
                      value={overrideOpex}
                      onChange={(e) => setOverrideOpex(e.target.value)}
                      className={`w-full text-center py-2 text-xs px-3 rounded-xl border font-bold focus:ring-2 focus:ring-amber-500/10 focus:outline-hidden focus:border-amber-500 transition-all ${
                        overrideOpex !== "" 
                          ? "bg-amber-500/10 border-amber-300 text-amber-900" 
                          : "bg-amber-50/20 border-slate-100 text-slate-700"
                      }`}
                    />
                  </td>
                  <td className="py-3 text-slate-400 pl-4 font-medium">
                    {t.opexUnit}
                  </td>
                </tr>

                {/* 5. Incremental margin on new sales */}
                <tr className="align-middle group">
                  <td className="py-3 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {t.incrMargin}
                  </td>
                  <td className="py-3 font-mono text-right text-slate-400 font-semibold">
                    {formatPercent(activeSegment.incrMarginPct)}
                  </td>
                  <td className="py-1.5 px-3">
                    <input
                      id="est-margin-input"
                      type="number"
                      placeholder="e.g. 30"
                      value={overrideIncrMargin}
                      onChange={(e) => setOverrideIncrMargin(e.target.value)}
                      className={`w-full text-center py-2 text-xs px-3 rounded-xl border font-bold focus:ring-2 focus:ring-amber-500/10 focus:outline-hidden focus:border-amber-500 transition-all ${
                        overrideIncrMargin !== "" 
                          ? "bg-amber-500/10 border-amber-300 text-amber-900" 
                          : "bg-amber-50/20 border-slate-100 text-slate-700"
                      }`}
                    />
                  </td>
                  <td className="py-3 text-slate-400 pl-4 font-medium">
                    {t.percentLabelOnly}
                  </td>
                </tr>

                {/* 6. Member share of revenue (editable factor as in Sheet row 17) */}
                <tr className="align-middle group">
                  <td className="py-3 font-medium text-slate-700 flex items-center gap-1.5 group-hover:text-slate-900 transition-colors">
                    <span>{t.memberShare}</span>
                    <span className="group/tooltip relative cursor-help text-slate-300 hover:text-slate-500">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-900 text-white rounded-xl p-2.5 text-[10px] hidden group-hover/tooltip:block z-25 font-normal leading-normal shadow-lg border border-slate-750">
                        Japan standard consumer retail loyalty statistics benchmark. Preconfigured, informational. (日本小売標準ベンチマーク値)
                      </div>
                    </span>
                  </td>
                  <td className="py-3 font-mono text-right text-slate-400 font-semibold">
                    65.0%
                  </td>
                  <td className="py-1.5 px-3">
                    <input
                      id="est-share-input"
                      type="number"
                      placeholder="e.g. 70"
                      value={overrideMemberShare}
                      onChange={(e) => setOverrideMemberShare(e.target.value)}
                      className={`w-full text-center py-2 text-xs px-3 rounded-xl border font-bold focus:ring-2 focus:ring-amber-500/10 focus:outline-hidden focus:border-amber-500 transition-all ${
                        overrideMemberShare !== "" 
                          ? "bg-amber-500/10 border-amber-300 text-amber-900" 
                          : "bg-amber-50/20 border-slate-100 text-slate-700"
                      }`}
                    />
                  </td>
                  <td className="py-3 text-slate-400 pl-4 font-medium">
                    {t.percentLabelOnly}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Comarch Service Line Impact Estimates */}
        <section id="service-lines-section" className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col xs:flex-row xs:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-display">
                  {t.serviceLineImpact}
                </h2>
                <p className="text-[10px] text-slate-400 italic mt-0.5">
                  {t.serviceLineImpactSub}
                </p>
              </div>
            </div>
            {/* Override Indicator Prompt */}
            <span             
              className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg"
            >
              {t.usingPreset}
            </span>
          </div>

          <div className="space-y-6">

            {/* Service Line 1: Managed Promotions */}
            <div id="service-line-1" className="space-y-4 p-4 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 border border-slate-100/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                    {t.sl1Title}
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded-md border border-indigo-100/30">
                      SL1
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 leading-normal max-w-2xl mt-1">
                    {t.sl1Desc}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">{t.confidence}: </span>
                  <span className="text-[10px] text-slate-500 font-bold">{t.confidenceMediumJBrain}</span>
                </div>
              </div>

              {/* Slider for interactive percentage lift adjustment + Manual input */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Active Impact Lift */}
                <div className="col-span-1 md:col-span-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sl1-slider" className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {t.estRevenueImpact}
                    </label>
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {formatPercent(sl1Pct)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sl1-slider"
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={overrideSl1 !== "" ? overrideSl1 : (activeSegment.sl1PromoRevenuePct * 100).toFixed(1)}
                      onChange={(e) => setOverrideSl1(e.target.value)}
                      className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-250 rounded-lg hover:accent-indigo-700"
                    />
                    <input
                      id="sl1-input"
                      type="number"
                      step="0.1"
                      placeholder={(activeSegment.sl1PromoRevenuePct * 100).toFixed(1)}
                      value={overrideSl1}
                      onChange={(e) => setOverrideSl1(e.target.value)}
                      className="w-16 text-center py-1 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Derived calculations */}
                <div className="col-span-1 md:col-span-8 grid grid-cols-2 xs:grid-cols-3 gap-2 text-right">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                      {t.revImpactMo}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700 block mt-0.5">
                      {formatYen(sl1RevenueImpact)}
                    </span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <span className="text-[9px] text-indigo-500 uppercase tracking-wider block font-bold">
                      {t.marginImpactMo}
                    </span>
                    <span className="font-mono text-xs font-bold text-indigo-600 block mt-0.5">
                      {formatYen(sl1MarginImpact)}
                    </span>
                  </div>
                  <div className="col-span-2 xs:col-span-1 bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/30 shadow-3xs">
                    <span className="text-[9px] text-emerald-600 uppercase tracking-wider block font-bold">
                      {t.netValueMo}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-emerald-700 block mt-0.5">
                      {formatYen(sl1NetValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Line 2: Member Recruitment */}
            <div id="service-line-2" className="space-y-4 p-4 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 border border-slate-100/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                    {t.sl2Title}
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded-md border border-indigo-100/30">
                      SL2
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 leading-normal max-w-2xl mt-1">
                    {t.sl2Desc}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">{t.confidence}: </span>
                  <span className="text-[10px] text-slate-500 font-bold">{t.confidenceMediumJBrainDrives}</span>
                </div>
              </div>

              {/* Slider for interactive percentage lift adjustment + Manual input */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Active Impact Lift */}
                <div className="col-span-1 md:col-span-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sl2-slider" className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {t.estRevenueImpact}
                    </label>
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {formatPercent(sl2Pct)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sl2-slider"
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={overrideSl2 !== "" ? overrideSl2 : (activeSegment.sl2MemberGrowthPct * 100).toFixed(1)}
                      onChange={(e) => setOverrideSl2(e.target.value)}
                      className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-250 rounded-lg hover:accent-indigo-700"
                    />
                    <input
                      id="sl2-input"
                      type="number"
                      step="0.1"
                      placeholder={(activeSegment.sl2MemberGrowthPct * 100).toFixed(1)}
                      value={overrideSl2}
                      onChange={(e) => setOverrideSl2(e.target.value)}
                      className="w-16 text-center py-1 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Derived calculations */}
                <div className="col-span-1 md:col-span-8 grid grid-cols-2 xs:grid-cols-3 gap-2 text-right">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                      {t.revImpactMo}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700 block mt-0.5">
                      {formatYen(sl2RevenueImpact)}
                    </span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <span className="text-[9px] text-indigo-500 uppercase tracking-wider block font-bold">
                      {t.marginImpactMo}
                    </span>
                    <span className="font-mono text-xs font-bold text-indigo-600 block mt-0.5">
                      {formatYen(sl2MarginImpact)}
                    </span>
                  </div>
                  <div className="col-span-2 xs:col-span-1 bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/30 shadow-3xs">
                    <span className="text-[9px] text-emerald-600 uppercase tracking-wider block font-bold">
                      {t.netValueMo}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-emerald-700 block mt-0.5">
                      {formatYen(sl2NetValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Line 3: Retention / Churn Defense */}
            <div id="service-line-3" className="space-y-4 p-4 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 border border-slate-100/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                    {t.sl3Title}
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded-md border border-indigo-100/30">
                      SL3
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 leading-normal max-w-2xl mt-1">
                    {t.sl3Desc}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">{t.confidence}: </span>
                  <span className="text-[10px] text-slate-500 font-bold">{t.confidenceLowMed}</span>
                </div>
              </div>

              {/* Slider for interactive percentage lift adjustment + Manual input */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Active Impact Lift */}
                <div className="col-span-1 md:col-span-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sl3-slider" className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {t.estRevenueImpact}
                    </label>
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {formatPercent(sl3Pct)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sl3-slider"
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={overrideSl3 !== "" ? overrideSl3 : (activeSegment.sl3RetentionRevenuePct * 100).toFixed(1)}
                      onChange={(e) => setOverrideSl3(e.target.value)}
                      className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-250 rounded-lg hover:accent-indigo-700"
                    />
                    <input
                      id="sl3-input"
                      type="number"
                      step="0.1"
                      placeholder={(activeSegment.sl3RetentionRevenuePct * 100).toFixed(1)}
                      value={overrideSl3}
                      onChange={(e) => setOverrideSl3(e.target.value)}
                      className="w-16 text-center py-1 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Derived calculations */}
                <div className="col-span-1 md:col-span-8 grid grid-cols-2 xs:grid-cols-3 gap-2 text-right">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                      {t.revImpactMo}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700 block mt-0.5">
                      {formatYen(sl3RevenueImpact)}
                    </span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <span className="text-[9px] text-indigo-500 uppercase tracking-wider block font-bold">
                      {t.marginImpactMo}
                    </span>
                    <span className="font-mono text-xs font-bold text-indigo-600 block mt-0.5">
                      {formatYen(sl3MarginImpact)}
                    </span>
                  </div>
                  <div className="col-span-2 xs:col-span-1 bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/30 shadow-3xs">
                    <span className="text-[9px] text-emerald-600 uppercase tracking-wider block font-bold">
                      {t.netValueMo}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-emerald-700 block mt-0.5">
                      {formatYen(sl3NetValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Line 4: Program Cost Optimization */}
            <div id="service-line-4" className="space-y-4 p-4 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 border border-slate-100/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                    {t.sl4Title}
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded-md border border-indigo-100/30">
                      SL4
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 leading-normal max-w-2xl mt-1">
                    {t.sl4Desc}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">{t.confidence}: </span>
                  <span className="text-[10px] text-slate-500 font-bold">{t.confidenceMediumDelicia}</span>
                </div>
              </div>

              {/* Slider for interactive percentage lift adjustment + Manual input */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Active Impact Cost Optimization */}
                <div className="col-span-1 md:col-span-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sl4-slider" className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {t.estRevenueImpact} (Cost Reduc.)
                    </label>
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {formatPercent(sl4Pct)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="sl4-slider"
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={overrideSl4 !== "" ? overrideSl4 : (activeSegment.sl4CostOptPct * 100).toFixed(0)}
                      onChange={(e) => setOverrideSl4(e.target.value)}
                      className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-250 rounded-lg hover:accent-indigo-700"
                    />
                    <input
                      id="sl4-input"
                      type="number"
                      step="1"
                      placeholder={(activeSegment.sl4CostOptPct * 100).toFixed(0)}
                      value={overrideSl4}
                      onChange={(e) => setOverrideSl4(e.target.value)}
                      className="w-16 text-center py-1 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Derived financial cost calculation columns */}
                <div className="col-span-1 md:col-span-8 grid grid-cols-2 xs:grid-cols-3 gap-2 text-right">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                      {t.revImpactMo}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400 block mt-0.5">
                      ¥0
                    </span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <span className="text-[9px] text-indigo-500 uppercase tracking-wider block font-bold">
                      {t.costSavingMo}
                    </span>
                    <span className="font-mono text-xs font-bold text-indigo-600 block mt-0.5">
                      {formatYen(sl4CostSaving)}
                    </span>
                  </div>
                  <div className="col-span-2 xs:col-span-1 bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/30 shadow-3xs">
                    <span className="text-[9px] text-emerald-600 uppercase tracking-wider block font-bold">
                      {t.netValueMo}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-emerald-700 block mt-0.5">
                      {formatYen(sl4NetValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Hero Section 4: Cumulative Business Opportunity (SPECTACULAR SLEEK THEME GRADIENT) */}
        <section id="opportunity-summary-hero" className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-650 text-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(79,70,229,0.3)] border border-indigo-500/20 relative overflow-hidden">
          
          {/* Glowing gradient mesh accents */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[250px] h-[250px] bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block font-display">
                  {t.totalImpact}
                </span>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mt-1 font-display">
                  <span className="bg-white/10 p-1.5 rounded-xl block border border-white/10">
                    <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                  </span>
                  <span>{prospectName || (lang === "en" ? "Tokyo Prospect" : "見込みリテール候補様")} &times; Comarch</span>
                </h2>
              </div>
              <p className="text-[10.5px] text-emerald-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/5 font-semibold hidden xs:block">
                {t.calculatedAlert}
              </p>
            </div>

            {/* Core Calculations Presentation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Single Store value per month */}
              <div className="space-y-1.5 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] text-indigo-100 uppercase tracking-wider block font-bold opacity-80">
                  {t.totalNetValuePerStore}
                </span>
                <span className="font-mono text-xl font-extrabold text-white block mt-1">
                  {formatYen(totalNetValuePerStoreMo)}
                </span>
                <span className="text-[9.5px] text-indigo-200 block/90 font-medium">
                  / {lang === "en" ? "store / month" : "店舗・月"}
                </span>
              </div>

              {/* Total stores value per month */}
              <div className="space-y-1.5 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] text-indigo-100 uppercase tracking-wider block font-bold opacity-80">
                  {t.totalValueMonth}
                </span>
                <span className="font-mono text-xl font-extrabold text-white block mt-1">
                  {formatYen(totalValueMonthAllStores)}
                </span>
                <span className="text-[9.5px] text-indigo-200 block font-semibold">
                  across {storeCount} stores
                </span>
              </div>

              {/* Mega Annual Opportunity */}
              <div className="space-y-1.5 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md shadow-xs">
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                  <span>{t.totalValueYear}</span>
                  <span className="text-[9px] bg-emerald-400 text-indigo-950 font-black px-1.5 py-0.2 rounded-md">
                    ANNUAL
                  </span>
                </span>
                <span className="font-mono text-2xl font-black text-emerald-300 block mt-1">
                  {formatYen(totalValueYearAllStores)}
                </span>
                <span className="text-[9.5px] text-indigo-100/85 block font-semibold">
                  {t.annualOpportunity}
                </span>
              </div>

            </div>

            {/* Quick Share Form Factor Copy to Clipboard */}
            <div className="flex flex-col xs:flex-row items-center justify-between gap-4 pt-3 border-t border-white/5">
              <span className="text-[11px] text-indigo-100/75 text-center xs:text-left flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-300" />
                <span>Internal Comarch sales enablement model</span>
              </span>
              <button
                id="copy-summary-btn"
                onClick={handleCopySummary}
                className="w-full xs:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-indigo-650 text-xs font-bold shadow-lg hover:shadow-xl transition-all active:scale-98 cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-900 font-bold">Copied (コピー完了!)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-indigo-600" />
                    <span>Copy Proposal Summary</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </section>

        {/* Section 5: Dynamic Disclaimers and Sources */}
        <section id="disclaimers-footer" className="bg-white rounded-3xl border border-slate-200/60 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Info className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.caveatHeader}
            </h3>
          </div>

          <ul className="list-disc list-inside space-y-2 text-[11px] text-slate-500 leading-relaxed pl-1 font-medium">
            <li>{t.caveat1}</li>
            <li>{t.caveat2}</li>
            <li>{t.caveat3}</li>
          </ul>

          <div className="pt-3 border-t border-slate-100 text-[10.5px] text-slate-400 leading-relaxed italic font-medium">
            {t.footerSource}
          </div>
        </section>

      </main>
    </div>
  );
}
