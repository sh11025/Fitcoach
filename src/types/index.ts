export type AppStep =
  | 'landing'
  | 'upload'
  | 'analysis'
  | 'matching_setup'
  | 'editor_coach'
  | 'final_review';

export interface StepItem {
  id: AppStep;
  stepNumber: number;
  label: string;
  shortDesc: string;
}

export interface JobInfo {
  company: string;
  role: string;
  url: string;
  question: string;
  charLimit: number;
  keyCompetencies: string[];
}

export type RecommendationType =
  | 'highlight'   // 🟢 강조 추천
  | 'keep'        // 🔵 유지
  | 'complement'  // 🟡 보완 필요
  | 'reduce';     // ⚪ 축소 추천

export interface ExperienceItem {
  id: string;
  title: string;
  status: RecommendationType;
  importance: '높음 ↑↑' | '보통 →' | '보완 △' | '낮음 ↓';
  keywords: string[];
  summary: string;
  aiReason: {
    headline: string;
    details: string;
    actionableAdvice: string;
  };
}

export type ParagraphPriority =
  | 'very_high' // ↑↑ 매우 강조
  | 'high'      // ↑ 강조
  | 'keep'      // → 유지
  | 'complement'// △ 보완
  | 'reduce';   // ↓ 축소

export interface ParagraphSetting {
  id: string;
  originalText: string;
  priority: ParagraphPriority;
  aiReason: string;
  suggestion: string;
  starState: {
    situation: boolean;
    task: boolean;
    action: 'sufficient' | 'needs_detail' | 'missing';
    result: boolean;
  };
}

export type FeedbackType = 'typo' | 'detail' | 'job' | 'star' | 'reduce';

export interface FeedbackItem {
  id: string;
  type: FeedbackType;
  title: string;
  targetExcerpt: string;
  explanation: string;
  guidingQuestions?: string[];
  replacementCandidate?: string;
  factCheckWarning?: string;
  starInfo?: {
    s: 'good' | 'warn';
    t: 'good' | 'warn';
    a: 'good' | 'warn';
    r: 'good' | 'warn';
    advice: string;
  };
}

export interface FinalCheckItem {
  id: string;
  category: '직무 연결' | '본인의 행동' | '결과' | '구체성' | '맞춤법' | '반복 표현';
  status: 'passed' | 'warning';
  title: string;
  summary: string;
  note: string;
}
