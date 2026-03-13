/**
 * Company Strategy / Master Plan — typed config for super admin strategy page
 * Single source of truth for strategic content. Update as company evolves.
 */

export interface StrategyLayer {
  number: number;
  title: string;
  description: string;
}

export const strategyLayers: StrategyLayer[] = [
  { number: 1, title: 'Product', description: 'Identity transformation and inner-development product — affirmations, meditations, rituals.' },
  { number: 2, title: 'Monetization', description: 'Premium creation, credits, subscriptions. Practice is free; creation drives revenue.' },
  { number: 3, title: 'Ecosystem', description: 'Creator and practitioner layer — verified creators, marketplace distribution.' },
  { number: 4, title: 'Distribution', description: 'Partner and institutional channels — studios, coaches, organizations.' },
  { number: 5, title: 'Access / Impact', description: 'Broader access infrastructure — scholarship, sponsored, funded models.' },
  { number: 6, title: 'Platform Advantage', description: 'Scale-level infrastructure — data, brand, ecosystem compounding.' },
];

export type RevenueTiming = 'now' | 'next' | 'later';

export interface RevenueLayer {
  label: string;
  description: string;
  whyPay: string;
  businessValue: string;
  marginSignal: 'low' | 'medium' | 'high';
  timing: RevenueTiming;
}

export const revenueLayers: RevenueLayer[] = [
  { label: 'Free practice / habit', description: 'Unlimited replay of owned content', whyPay: 'N/A — retention driver', businessValue: 'Habit formation, retention', marginSignal: 'low', timing: 'now' },
  { label: 'Paid creation / credits', description: 'Credits consumed when creating affirmations, meditations, rituals', whyPay: 'Personalized content in own voice', businessValue: 'Primary revenue', marginSignal: 'medium', timing: 'now' },
  { label: 'Subscription / continuity', description: 'Monthly credits, premium paths', whyPay: 'Regular creation, reduced friction', businessValue: 'Recurring revenue, predictability', marginSignal: 'high', timing: 'next' },
  { label: 'Premium paths / advanced', description: 'Advanced tools, higher-quality output', whyPay: 'Professional or intensive use', businessValue: 'Higher ARPU', marginSignal: 'high', timing: 'later' },
  { label: 'Creator / practitioner layer', description: 'Creators distribute and monetize through waQup', whyPay: 'Reach, credibility, revenue share', businessValue: 'Distribution leverage, content flywheel', marginSignal: 'medium', timing: 'later' },
  { label: 'Partner / enterprise / institutional', description: 'B2B, studios, organizations license or white-label', whyPay: 'Client outcomes, scaled delivery', businessValue: 'High-ticket, predictable', marginSignal: 'high', timing: 'later' },
];

export interface FlywheelStep {
  id: string;
  label: string;
}

export const flywheelSteps: FlywheelStep[] = [
  { id: '1', label: 'Transformative user experience' },
  { id: '2', label: 'Retention / trust' },
  { id: '3', label: 'Monetization' },
  { id: '4', label: 'Better product / content / infrastructure' },
  { id: '5', label: 'Creator + partner adoption' },
  { id: '6', label: 'Broader reach' },
  { id: '7', label: 'Stronger data / ecosystem / brand' },
  { id: '8', label: 'More effective transformation outcomes' },
];

export interface RoadmapPhase {
  phase: number;
  title: string;
  objective: string;
  builds: string[];
  monetizationMove: string;
  distributionMove: string;
  gateCondition: string;
  majorRisk: string;
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'Prove Core Transformation',
    objective: 'Demonstrate that the product produces felt, measurable transformation.',
    builds: ['Core create flows', 'Own-voice audio', 'Practice habit loop'],
    monetizationMove: 'Credits + early subscription',
    distributionMove: 'Direct user acquisition',
    gateCondition: 'Users truly retain after first creation; repeat engagement exists.',
    majorRisk: 'Value proposition unclear; churn before habit.',
  },
  {
    phase: 2,
    title: 'Strengthen Monetization & Retention',
    objective: 'Build sustainable revenue and prove repeat paid behavior.',
    builds: ['Subscription tiers', 'Win-back mechanics', 'Usage analytics'],
    monetizationMove: 'Hybrid credits + subscription',
    distributionMove: 'Referral, content-led growth',
    gateCondition: 'Repeat paid behavior; unit economics positive.',
    majorRisk: 'AI/audio costs erode margin.',
  },
  {
    phase: 3,
    title: 'Enable Creator / Practitioner Layer',
    objective: 'Allow creators to distribute and monetize through waQup.',
    builds: ['Creator verification', 'Marketplace', 'Revenue share'],
    monetizationMove: 'Creator revenue share',
    distributionMove: 'Creator-led distribution',
    gateCondition: 'Creators want to distribute; clear ROI for them.',
    majorRisk: 'Operational burden; quality control.',
  },
  {
    phase: 4,
    title: 'Expand Through Partners / Institutions',
    objective: 'B2B and institutional distribution for broader reach.',
    builds: ['Partner onboarding', 'Licensing', 'White-label options'],
    monetizationMove: 'Enterprise / institutional licensing',
    distributionMove: 'Partner channels',
    gateCondition: 'Partners have clear ROI or value case.',
    majorRisk: 'Slow sales cycles; customization demands.',
  },
  {
    phase: 5,
    title: 'Widen Access',
    objective: 'Fund and deliver access beyond premium users.',
    builds: ['Scholarship model', 'Sponsored distribution', 'Funded access'],
    monetizationMove: 'Premium engine funds access expansion',
    distributionMove: 'Sponsored / subsidized channels',
    gateCondition: 'Access expansion can be funded sustainably.',
    majorRisk: 'Subsidized access too early without sustainable engine.',
  },
  {
    phase: 6,
    title: 'Become Platform Infrastructure',
    objective: 'Company operates as scalable transformation infrastructure.',
    builds: ['Platform APIs', 'Multi-channel delivery', 'Ecosystem data'],
    monetizationMove: 'Infrastructure fees, ecosystem revenue',
    distributionMove: 'Platform-level distribution',
    gateCondition: 'Ecosystem self-reinforcing; brand and data advantages compound.',
    majorRisk: 'Mission drift; overexpansion before proof.',
  },
];

export interface CapitalAllocationBucket {
  id: string;
  label: string;
  description: string;
}

export const capitalAllocationBuckets: CapitalAllocationBucket[] = [
  { id: 'product', label: 'Product improvement', description: 'Core experience, creation flows, quality.' },
  { id: 'ai-audio', label: 'AI / audio infrastructure', description: 'TTS, voice cloning, reliability, cost efficiency.' },
  { id: 'acquisition', label: 'User acquisition', description: 'Paid and organic growth.' },
  { id: 'creator-tools', label: 'Creator tools', description: 'Marketplace, distribution, analytics.' },
  { id: 'partnerships', label: 'Partnerships / B2B distribution', description: 'Institutional channels, sales.' },
  { id: 'access', label: 'Access programs / scholarships', description: 'Sponsored distribution, funded access (later).' },
];

export interface AccessArchitectureItem {
  id: string;
  title: string;
  description: string;
}

export const accessArchitectureItems: AccessArchitectureItem[] = [
  { id: '1', title: 'Premium funds innovation', description: 'Premium users generate margin that funds product and infrastructure improvement.' },
  { id: '2', title: 'Creator / partner layers increase efficiency', description: 'Creator and partner distribution reduces acquisition cost and widens reach.' },
  { id: '3', title: 'Institutional channels widen reach', description: 'B2B and institutional channels extend access to populations we cannot reach directly.' },
  { id: '4', title: 'Scholarship / sponsored models later', description: 'Funded access becomes possible once the premium engine is sustainable.' },
  { id: '5', title: 'Long-term aim', description: 'Transformative tools more widely available without breaking the company.' },
];

export interface CheckpointItem {
  id: string;
  label: string;
}

export const checkpointItems: CheckpointItem[] = [
  { id: '1', label: 'Users truly retain after first creation' },
  { id: '2', label: 'Repeat paid behavior exists' },
  { id: '3', label: 'The system improves lives in a felt way' },
  { id: '4', label: 'Creators want to distribute through it' },
  { id: '5', label: 'Partners have a clear ROI or value case' },
  { id: '6', label: 'Access expansion can be funded sustainably' },
];

export interface RiskItem {
  id: string;
  risk: string;
  mitigation: string;
}

export const riskItems: RiskItem[] = [
  { id: '1', risk: 'Weak real retention', mitigation: 'Invest in habit formation, onboarding, and win-back mechanics.' },
  { id: '2', risk: 'Expensive AI/audio economics', mitigation: 'Batch APIs, caching, usage caps, cost monitoring.' },
  { id: '3', risk: 'Brand confusion', mitigation: 'Clear positioning; avoid diluting core identity.' },
  { id: '4', risk: 'Overexpansion before proof', mitigation: 'Gate phases rigorously; do not advance without proof points.' },
  { id: '5', risk: 'Operational burden from creator layer', mitigation: 'Automate verification, moderation; start small.' },
  { id: '6', risk: 'Slow institutional sales cycles', mitigation: 'Pilot programs; clear ROI narratives.' },
  { id: '7', risk: 'Mission drift', mitigation: 'Regular alignment on North Star; resist feature creep.' },
  { id: '8', risk: 'Subsidized access too early', mitigation: 'Only expand access once premium engine is sustainable.' },
];

export interface NextMove {
  id: string;
  label: string;
  priority: 'now' | 'next' | 'wait';
}

export interface CurrentPosition {
  phase: number;
  phaseTitle: string;
  summary: string;
  nextMoves: NextMove[];
}

export const currentPosition: CurrentPosition = {
  phase: 1,
  phaseTitle: 'Prove Core Transformation',
  summary: 'waQup is in early product-market fit exploration. Core creation flows and practice loops are live. Focus is on retention, habit formation, and proving that users experience meaningful transformation.',
  nextMoves: [
    { id: '1', label: 'Measure and improve Day 7 / Day 30 retention after first creation', priority: 'now' },
    { id: '2', label: 'Strengthen onboarding and intention-setting', priority: 'now' },
    { id: '3', label: 'Stabilize monetization (credits + early subscription)', priority: 'now' },
    { id: '4', label: 'Creator layer — defer until retention proven', priority: 'wait' },
    { id: '5', label: 'Institutional / B2B — defer until product proven', priority: 'wait' },
  ],
};
