/**
 * 한국어 자기소개서 문장 가독성(Readability) 및 복잡도(Complexity) 분석기
 */

export interface SentenceAnalysis {
  id: string;
  originalText: string;
  charCount: number;
  wordCount: number;
  clauseCount: number; // 절(clause) 개수 추정 ('-고', '-며', '-는데', '-하여' 등 연결어미)
  status: 'optimal' | 'moderate' | 'too_long' | 'complex';
  issueType?: 'length' | 'clauses' | 'double_subject';
  suggestion?: {
    reason: string;
    splitPreview?: string[];
  };
}

export interface ReadabilityMetrics {
  score: number; // 0 ~ 100점 (가독성 지수)
  level: '매우 우수' | '양호' | '개선 권장' | '주의';
  averageLength: number; // 평균 문장 글자수
  totalSentences: number;
  tooLongCount: number; // 60자 이상 만연체 문장 수
  complexClauseCount: number; // 연결어미가 3개 이상 중첩된 문장 수
  sentences: SentenceAnalysis[];
  topRecommendations: string[];
}

// 한국어 문장 분리
export function extractSentences(text: string): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

// 연결어미 기반 절(clause) 분할 추천 휴리스틱
const CONNECTIVE_ENDINGS = [
  '하였으나,', '하였고,', '하며,', '하지만,', '있었으며,', '있었고,',
  '되었고,', '되었으며,', '진행하였는데,', '발생하여,', '때문에,',
  '바탕으로,', '인하여,', '통하여,', '하고,', '하여,'
];

export function analyzeReadability(text: string): ReadabilityMetrics {
  const rawSentences = extractSentences(text);

  if (rawSentences.length === 0) {
    return {
      score: 100,
      level: '양호',
      averageLength: 0,
      totalSentences: 0,
      tooLongCount: 0,
      complexClauseCount: 0,
      sentences: [],
      topRecommendations: ['자기소개서 문장을 작성하면 가독성이 측정됩니다.']
    };
  }

  let totalChars = 0;
  let tooLongCount = 0;
  let complexClauseCount = 0;

  const analyzedSentences: SentenceAnalysis[] = rawSentences.map((s, idx) => {
    const charCount = s.length;
    totalChars += charCount;
    const wordCount = s.split(/\s+/).filter(Boolean).length;

    // 연결어미 등장 빈도로 복잡도 계산
    let clauses = 1;
    CONNECTIVE_ENDINGS.forEach((ending) => {
      const matches = s.split(ending).length - 1;
      clauses += matches;
    });

    let status: SentenceAnalysis['status'] = 'optimal';
    let suggestion: SentenceAnalysis['suggestion'];

    // 1. 만연체 판정 기준: 한국어 서류 평가 시 한 문장 65자 이상은 호흡이 가빠짐 (80자 초과는 분할 필수)
    if (charCount >= 85 || clauses >= 4) {
      status = 'too_long';
      tooLongCount++;

      // 분할 시뮬레이션
      let splitDraft: string[] = [];
      for (const ending of CONNECTIVE_ENDINGS) {
        if (s.includes(ending)) {
          const parts = s.split(ending);
          if (parts.length >= 2 && parts[0].length > 15 && parts[1].length > 15) {
            splitDraft = [
              parts[0].trim() + '했습니다.',
              parts.slice(1).join(' ').trim()
            ];
            break;
          }
        }
      }

      suggestion = {
        reason: `한 문장이 ${charCount}자로 너무 깁니다. 접속사나 쉼표가 많아 채용관이 핵심 주장을 놓치기 쉽습니다.`,
        splitPreview: splitDraft.length > 0 ? splitDraft : undefined
      };
    } else if (charCount >= 60 || clauses >= 3) {
      status = 'complex';
      complexClauseCount++;
      suggestion = {
        reason: '연결 어미가 여러 번 중첩되어 있습니다. 한 문장에는 하나의 핵심 메시지만 담아보세요.'
      };
    } else if (charCount < 20 && idx !== 0) {
      status = 'moderate';
    }

    return {
      id: `sent_${idx}`,
      originalText: s,
      charCount,
      wordCount,
      clauseCount: clauses,
      status,
      suggestion
    };
  });

  const averageLength = Math.round(totalChars / rawSentences.length);

  // 가독성 점수 계산 (이상적인 평균 문장 길이: 35~50자)
  let score = 100;
  // 너무 긴 문장 하나당 -8점
  score -= tooLongCount * 8;
  // 복잡한 문장 하나당 -4점
  score -= complexClauseCount * 4;
  // 평균 길이가 55자 초과 시 감점
  if (averageLength > 55) {
    score -= Math.min(20, (averageLength - 55) * 1.5);
  }
  score = Math.max(25, Math.min(100, Math.round(score)));

  let level: ReadabilityMetrics['level'] = '매우 우수';
  if (score < 60) level = '주의';
  else if (score < 75) level = '개선 권장';
  else if (score < 90) level = '양호';

  const topRecommendations: string[] = [];
  if (tooLongCount > 0) {
    topRecommendations.push(`80자 이상의 만연체 문장이 ${tooLongCount}개 있습니다. 두 문장으로 쪼개면 전달력이 2배 높아집니다.`);
  }
  if (complexClauseCount > 0) {
    topRecommendations.push(`연결어미(~하고, ~하며)가 중복된 복합문이 ${complexClauseCount}개 있습니다. 단문 중심의 호흡을 추천합니다.`);
  }
  if (averageLength <= 45 && tooLongCount === 0) {
    topRecommendations.push('평균 문장 길이가 약 40자로 간결하여 모바일 및 서류 평가관 화면에서 시인성이 매우 뛰어납니다.');
  }

  return {
    score,
    level,
    averageLength,
    totalSentences: rawSentences.length,
    tooLongCount,
    complexClauseCount,
    sentences: analyzedSentences,
    topRecommendations
  };
}
