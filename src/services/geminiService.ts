import { GoogleGenAI } from '@google/genai';
import { JobInfo } from '../types';

export interface CoachingFeedbackResponse {
  feedbacks: Array<{
    id: string;
    type: 'star' | 'detail' | 'job' | 'reduce' | 'typo';
    title: string;
    targetExcerpt: string;
    explanation: string;
    guidingQuestions: string[];
    replacementCandidate?: string;
    factCheckWarning?: string;
    starInfo?: {
      s: 'good' | 'warn';
      t: 'good' | 'warn';
      a: 'good' | 'warn';
      r: 'good' | 'warn';
      advice: string;
    };
  }>;
  starBreakdown?: {
    situationPercent: number;
    taskPercent: number;
    actionPercent: number;
    resultPercent: number;
    assessment: string;
  };
  overallSummary?: string;
}

export interface DetectionResult {
  humanScore: number;
  aiLikelihood: 'low' | 'medium' | 'high';
  riskLevel: 'safe' | 'caution' | 'danger';
  perplexityScore: string;
  burstinessScore: string;
  clichePhrasesDetected: Array<{
    phrase: string;
    reason: string;
    betterHumanAlternative: string;
  }>;
  humanTouchHighlights: string[];
  detectorPassTip: string;
}

// Helper: resolve and validate Gemini model name (auto-upgrade deprecated models)
export function resolveModelName(requestedModel?: string): string {
  if (!requestedModel || requestedModel.trim() === '') {
    return 'gemini-flash-latest';
  }

  const trimmed = requestedModel.trim();
  const deprecated = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-2.0-flash',
    'gemini-2.0-pro',
    'gemini-2.0-flash-thinking'
  ];

  if (deprecated.includes(trimmed) || trimmed.startsWith('gemini-1.5') || trimmed.startsWith('gemini-2.0')) {
    return 'gemini-flash-latest';
  }

  return trimmed;
}

// Client factory (Browser BYOK)
function getGeminiClient(apiKey: string) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API 키가 입력되지 않았습니다. 상단 [AI 설정]에서 API 키를 입력해 주세요.');
  }

  return new GoogleGenAI({
    apiKey: apiKey.trim()
  });
}

// 1. AI 코칭 피드백 생성
export async function requestAiCoaching(params: {
  draftText: string;
  jobInfo: JobInfo;
  coachingStrictness?: 'balanced' | 'rigorous' | 'gentle';
  temperature?: number;
  maxOutputTokens?: number;
  model?: string;
  apiKey: string;
}): Promise<CoachingFeedbackResponse> {
  const {
    draftText,
    jobInfo,
    coachingStrictness = 'balanced',
    temperature = 0.7,
    maxOutputTokens = 2048,
    model = 'gemini-flash-latest',
    apiKey
  } = params;

  if (!draftText || !jobInfo) {
    throw new Error('자기소개서 초안과 채용공고 정보가 필요합니다.');
  }

  const ai = getGeminiClient(apiKey);
  const targetModel = resolveModelName(model);

  const prompt = `
당신은 한국 취업 준비생을 위한 전문 'AI 자기소개서 코치'입니다.
절대로 자기소개서를 대신 작성(대필)하지 마십시오. 지원자가 본인의 경험에서 어떤 구체적인 행동(Action)과 문제해결 결과(Result)를 더 드러내야 하는지 조언과 코칭 질문을 제공하십시오.

[채용공고 정보]
- 지원 회사: ${jobInfo.company || '미지정'}
- 지원 직무: ${jobInfo.role || '미지정'}
- 문항 내용: ${jobInfo.question || '미지정'}
- 핵심 요구역량: ${(jobInfo.keyCompetencies || []).join(', ') || '직무 문제해결 역량'}

[작성된 자기소개서 초안]
"""
${draftText}
"""

[코칭 엄격도]: ${coachingStrictness} (balanced, rigorous, gentle 중 하나)

다음 JSON 형식으로만 응답하십시오. markdown 블록 (\`\`\`json ... \`\`\`) 없이 순수 JSON 문자열만 출력하십시오.
{
  "feedbacks": [
    {
      "id": "fb_1",
      "type": "star" | "detail" | "job" | "reduce" | "typo",
      "title": "핵심 코칭 제목",
      "targetExcerpt": "초안 중에서 개선이 필요한 대상 문장 발췌",
      "explanation": "해당 문장이 왜 보완되어야 하는지 명확한 이유",
      "guidingQuestions": [
        "지원자가 답변하며 구체화할 수 있는 질문 1",
        "지원자가 답변하며 구체화할 수 있는 질문 2"
      ],
      "replacementCandidate": "원문보다 본인 행동이 돋보이도록 하는 방향 가이드 힌트 (대필이 아닌 힌트)",
      "factCheckWarning": "과장되었거나 근거 수치가 모호한 경우 주의사항 (없으면 생략)",
      "starInfo": {
        "s": "good" | "warn",
        "t": "good" | "warn",
        "a": "good" | "warn",
        "r": "good" | "warn",
        "advice": "STAR 구조 관점 조언"
      }
    }
  ],
  "starBreakdown": {
    "situationPercent": 15,
    "taskPercent": 15,
    "actionPercent": 50,
    "resultPercent": 20,
    "assessment": "상황보다 본인의 주도적 행동이 잘 드러나고 있습니다."
  },
  "overallSummary": "전체적인 초안에 대한 강점과 핵심 보완점 요약"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        maxOutputTokens: maxOutputTokens || 2048,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text?.trim() || '{}';
    let data: CoachingFeedbackResponse;
    try {
      data = JSON.parse(text);
    } catch {
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      data = JSON.parse(cleanJson);
    }

    return data;
  } catch (error: any) {
    // Sanitize any key leaking in error messages
    const safeMsg = (error?.message || 'AI 코칭 피드백 생성 중 오류가 발생했습니다.')
      .replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=***');
    throw new Error(safeMsg);
  }
}

// 2. AI 대필 감지 (AI Detector 안전 검사)
export async function requestAiDetection(params: {
  draftText: string;
  jobInfo?: JobInfo;
  model?: string;
  apiKey: string;
}): Promise<DetectionResult> {
  const { draftText, jobInfo, model = 'gemini-flash-latest', apiKey } = params;

  if (!draftText) {
    throw new Error('검사할 자기소개서 본문이 필요합니다.');
  }

  const ai = getGeminiClient(apiKey);
  const targetModel = resolveModelName(model);

  const prompt = `
당신은 대기업 및 공기업 채용 서류 평가 시 사용되는 'AI 자기소개서 대필/표절 분석관'입니다.
지원자가 작성한 자기소개서가 ChatGPT나 LLM에 의해 기계적으로 생성된 상투적 문체인지, 아니면 본인의 생생하고 구체적인 인간적 경험(Human Voice)이 담겨 있는지 정밀 진단하십시오.

[분석 대상 텍스트]
"""
${draftText}
"""

[기업/직무 컨텍스트]
- 회사: ${jobInfo?.company || '일반'}
- 직무: ${jobInfo?.role || '일반'}

다음 JSON 형식으로만 응답하십시오. markdown 블록 없이 순수 JSON만 출력하십시오.
{
  "humanScore": 85, // 0~100 사이 (높을수록 사람의 고유한 진짜 경험 문체)
  "aiLikelihood": "low" | "medium" | "high", // low는 안전, high는 AI 대필 의심
  "riskLevel": "safe" | "caution" | "danger",
  "perplexityScore": "높음 (다양한 어휘 구조)" | "보통" | "낮음 (예측하기 쉬운 AI 상투구)",
  "burstinessScore": "높음 (문장 길이의 자연스러운 굴곡)" | "보통" | "낮음 (일정한 기계적 문장 길이)",
  "clichePhrasesDetected": [
    {
      "phrase": "발견된 상투적/AI 단골 표현",
      "reason": "왜 AI 대필 문체로 오인받을 수 있는지 이유",
      "betterHumanAlternative": "나만의 진솔한 문체로 바꾸는 제안"
    }
  ],
  "humanTouchHighlights": [
    "구체적인 수치나 고유한 문제해결 행동이 잘 드러난 인간적인 부분 1",
    "실제 시행착오나 고민이 묻어난 부분 2"
  ],
  "detectorPassTip": "서류 전형 AI 필터링을 완벽히 통과하기 위한 핵심 조언 1~2문장"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text?.trim() || '{}';
    let data: DetectionResult;
    try {
      data = JSON.parse(text);
    } catch {
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      data = JSON.parse(cleanJson);
    }

    return data;
  } catch (error: any) {
    const safeMsg = (error?.message || 'AI 대필 감지 검사 중 오류가 발생했습니다.')
      .replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=***');
    throw new Error(safeMsg);
  }
}
