export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'custom';

export interface ModelInfo {
  id: string;
  name: string;
  badge: string;
  badgeColor?: string;
  description: string;
  isLatest: boolean;
  version: string;
}

export interface AISettings {
  provider: AIProvider;
  model: string;
  apiKey: string;
  customEndpoint?: string;
  temperature: number;
  maxOutputTokens: number;
  coachingStrictness: 'balanced' | 'rigorous' | 'gentle'; // 코칭 엄격도
  autoAnalyzeOnChange: boolean;
  systemPromptPreset: string;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: 'gemini',
  model: 'gemini-flash-latest',
  apiKey: '',
  customEndpoint: '',
  temperature: 0.7,
  maxOutputTokens: 2048,
  coachingStrictness: 'balanced',
  autoAnalyzeOnChange: true,
  systemPromptPreset: `당신은 한국 취업 준비생을 위한 전문 'AI 자기소개서 코치'입니다.
핵심 원칙:
1. 절대로 자기소개서를 대신 작성하거나 통째로 바꿔 쓰지 마십시오.
2. 지원자가 본인의 실제 경험 속에서 어떤 구체적인 행동(Action)과 문제 해결 성과(Result)를 드러내야 하는지 질문과 힌트로 코칭하십시오.
3. 채용공고의 자격요건 및 인재상과 비교하여 강조할 점, 축소할 점을 분석하십시오.`
};

export const MODEL_CATALOG: Record<AIProvider, ModelInfo[]> = {
  gemini: [
    {
      id: 'gemini-flash-latest',
      name: 'Gemini Flash (상시 최신 갱신)',
      badge: '공식 권장 · 최신',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Google의 최신 Gemini Flash 엔진으로 상시 자동 유지되어 초고속 응답과 최신 첨삭 지능을 제공합니다.',
      isLatest: true,
      version: 'Latest Flash'
    },
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash',
      badge: '3.8 차세대 플래그십',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: '한국어 문맥 분석 및 STAR 행동 지표(Action Ratio) 정량 추출 능력이 강화된 최신 플래그십 모델입니다.',
      isLatest: true,
      version: 'v3.8'
    },
    {
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro Preview',
      badge: '심층 역량 추론',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: '직무 기술서와 경험의 적합성을 복합 추론하며, 깊이 있는 코칭 질문을 도출하는 최고 성능 프로 모델입니다.',
      isLatest: true,
      version: 'v3.1 Pro'
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash-Lite',
      badge: '초경량 · 초고속',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      description: '타이핑 중 실시간 문장 진단 및 오탈자/만연체 감지에 최적화된 저지연 고효율 모델입니다.',
      isLatest: true,
      version: 'v3.1 Lite'
    }
  ],
  openai: [
    {
      id: 'gpt-4o',
      name: 'GPT-4o (최신 옴니)',
      badge: '플래그십',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: '복합 멀티모달 및 고속 텍스트 생성 지원 플래그십 모델',
      isLatest: true,
      version: 'Latest Omni'
    },
    {
      id: 'o3-mini',
      name: 'o3-mini (최신 추론 엔진)',
      badge: '최신 추론',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: '사고 과정을 거쳐 엄밀한 논리와 설득력 있는 자기소개서 피드백 생성',
      isLatest: true,
      version: 'v-o3'
    },
    {
      id: 'o1',
      name: 'o1 (고지능 추론 모델)',
      badge: '심층 추론 최고봉',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: '복잡한 구조 분석 및 심층 비판적 피드백 제공',
      isLatest: true,
      version: 'v-o1'
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o mini',
      badge: '경량 고속',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      description: '경제적인 토큰 소비와 빠른 응답 속도',
      isLatest: true,
      version: 'Mini'
    }
  ],
  anthropic: [
    {
      id: 'claude-3-7-sonnet',
      name: 'Claude 3.7 Sonnet',
      badge: '최신 하이브리드',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: '즉각적인 응답과 심층 확장 추론을 동시에 지원하는 최신 플래그십 모델',
      isLatest: true,
      version: 'v3.7'
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      badge: '자연스러운 문장력',
      badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
      description: '한국어 자기소개서 어조와 작문 스타일 교정에 탁월한 성능',
      isLatest: false,
      version: 'v3.5'
    },
    {
      id: 'claude-3-5-haiku',
      name: 'Claude 3.5 Haiku',
      badge: '초고속',
      badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
      description: '신속한 문장 분석 및 오탈자 피드백',
      isLatest: false,
      version: 'v3.5 Haiku'
    }
  ],
  custom: [
    {
      id: 'custom-model',
      name: '사용자 지정 모델',
      badge: '커스텀',
      badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
      description: '사내 온프레미스 또는 vLLM/Ollama 호환 엔드포인트 연동',
      isLatest: false,
      version: 'Custom'
    }
  ]
};

export const AI_MODEL_OPTIONS: Record<AIProvider, { label: string; models: string[] }> = {
  gemini: {
    label: 'Google Gemini (추천)',
    models: MODEL_CATALOG.gemini.map((m) => m.id)
  },
  openai: {
    label: 'OpenAI GPT',
    models: MODEL_CATALOG.openai.map((m) => m.id)
  },
  anthropic: {
    label: 'Anthropic Claude',
    models: MODEL_CATALOG.anthropic.map((m) => m.id)
  },
  custom: {
    label: '커스텀 엔드포인트 / 사내 LLM',
    models: MODEL_CATALOG.custom.map((m) => m.id)
  }
};

