/**
 * STAR 기법 (Situation, Task, Action, Result) 텍스트 분석기
 */

export interface StarAnalysis {
  situation: {
    percentage: number;
    sentences: string[];
    status: 'good' | 'too_long' | 'too_short';
    feedback: string;
  };
  task: {
    percentage: number;
    sentences: string[];
    status: 'good' | 'needs_clarity';
    feedback: string;
  };
  action: {
    percentage: number;
    sentences: string[];
    status: 'optimal' | 'needs_more' | 'critical';
    feedback: string;
  };
  result: {
    percentage: number;
    sentences: string[];
    status: 'has_metrics' | 'qualitative_only' | 'missing';
    feedback: string;
  };
  goldenRatioMatch: number; // 0 ~ 100% (권장 비율: S 10~15%, T 10~15%, A 50~60%, R 15~20%)
  summaryMessage: string;
}

// 문장 분리 헬퍼
function splitSentences(text: string): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

// 키워드 기반 정밀 분석기 (클라이언트 측 즉시 시각화 + 서버 AI 보강)
export function analyzeStarStructure(text: string): StarAnalysis {
  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    return {
      situation: { percentage: 0, sentences: [], status: 'too_short', feedback: '상황 문장을 입력하세요.' },
      task: { percentage: 0, sentences: [], status: 'needs_clarity', feedback: '해결 과제를 기술하세요.' },
      action: { percentage: 0, sentences: [], status: 'critical', feedback: '본인의 구체적 액션이 필요합니다.' },
      result: { percentage: 0, sentences: [], status: 'missing', feedback: '정량적/정성적 성과를 기술하세요.' },
      goldenRatioMatch: 0,
      summaryMessage: '자기소개서 문장을 작성하면 STAR 비율이 분석됩니다.'
    };
  }

  const sSentences: string[] = [];
  const tSentences: string[] = [];
  const aSentences: string[] = [];
  const rSentences: string[] = [];

  // 상황 키워드
  const situationKeywords = ['당시', '시절', '프로젝트에서', '배경', '상황에서', '참여하여', '문제에 직면', '어려움이', '인턴', '동아리', '학부', '재학'];
  // 과제 키워드
  const taskKeywords = ['목표는', '과제는', '요구되었습니다', '필요성을', '책임을 맡아', '해결해야', '개선하기 위해', '요청받았', '미션'];
  // 행동 키워드 (가장 중요)
  const actionKeywords = ['직접', '설계하였', '구현했', '리팩토링', '최적화했', '제안하여', '설득하였', '도입했', '적용하여', '분석하고', '소통하여', '디버깅', '주도적으로', '개발했', '해결책으로'];
  // 결과 키워드
  const resultKeywords = ['%', '퍼센트', '배', '단축', '향상', '절감', '달성', '수상', '평가를 받았', '결과', '성과를', '성공적으로', '기여할 수 있었'];

  sentences.forEach((s) => {
    let matched = false;

    // 우선순위 1: 수치 및 성과
    if (resultKeywords.some((kw) => s.includes(kw))) {
      rSentences.push(s);
      matched = true;
    }
    // 우선순위 2: 본인 행동
    else if (actionKeywords.some((kw) => s.includes(kw))) {
      aSentences.push(s);
      matched = true;
    }
    // 우선순위 3: 과제/목표
    else if (taskKeywords.some((kw) => s.includes(kw))) {
      tSentences.push(s);
      matched = true;
    }
    // 우선순위 4: 배경/상황
    else if (situationKeywords.some((kw) => s.includes(kw))) {
      sSentences.push(s);
      matched = true;
    }

    // 매칭되지 않은 경우 문장 위치 기반 추정 (앞부분은 S/T, 중간은 A, 끝은 R)
    if (!matched) {
      const idx = sentences.indexOf(s);
      const ratio = idx / sentences.length;
      if (ratio < 0.25) sSentences.push(s);
      else if (ratio < 0.4) tSentences.push(s);
      else if (ratio < 0.85) aSentences.push(s);
      else rSentences.push(s);
    }
  });

  const total = sentences.length;
  const sPct = Math.round((sSentences.length / total) * 100);
  const tPct = Math.round((tSentences.length / total) * 100);
  const aPct = Math.round((aSentences.length / total) * 100);
  const rPct = 100 - (sPct + tPct + aPct);

  // 이상적인 황금비율: S(15%) + T(15%) + A(50%) + R(20%)
  const sDiff = Math.abs(sPct - 15);
  const tDiff = Math.abs(tPct - 15);
  const aDiff = Math.abs(aPct - 50);
  const rDiff = Math.abs(rPct - 20);
  const totalDiff = sDiff + tDiff + aDiff + rDiff;
  const goldenRatioMatch = Math.max(20, Math.min(100, Math.round(100 - totalDiff * 0.8)));

  let summaryMessage = '';
  if (aPct >= 45 && rPct >= 15) {
    summaryMessage = '🏆 훌륭한 STAR 구조: 지원자 본인의 주도적 행동과 성과가 돋보입니다.';
  } else if (aPct < 35) {
    summaryMessage = '⚠️ Action 부족: 상황 설명이 길고 본인이 직접 어떤 고민과 행동을 했는지가 부족합니다.';
  } else if (rPct < 10) {
    summaryMessage = '💡 Result 보완 필요: 활동의 최종 수치적 성과나 교훈을 마지막에 명시해보세요.';
  } else {
    summaryMessage = '균형 잡힌 구조입니다. 본인의 직무 기술 스택과 문제해결 과정을 더 명확히 다듬어보세요.';
  }

  return {
    situation: {
      percentage: sPct,
      sentences: sSentences,
      status: sPct > 30 ? 'too_long' : 'good',
      feedback: sPct > 30 ? '상황 배경 설명이 다소 깁니다. 1~2문장으로 압축하는 것을 권장합니다.' : '적절한 배경 설명입니다.'
    },
    task: {
      percentage: tPct,
      sentences: tSentences,
      status: 'good',
      feedback: '해결해야 할 문제와 과제가 명확합니다.'
    },
    action: {
      percentage: aPct,
      sentences: aSentences,
      status: aPct >= 45 ? 'optimal' : aPct >= 30 ? 'needs_more' : 'critical',
      feedback: aPct >= 45 ? '지원자 본인의 주도적 행동이 글의 50% 이상을 차지하여 이상적입니다.' : '팀 전체 행동 대신 "내가 어떤 가설로 어떻게 해결했는지" 본인 행동을 추가하세요.'
    },
    result: {
      percentage: rPct,
      sentences: rSentences,
      status: rPct >= 15 ? 'has_metrics' : 'qualitative_only',
      feedback: rPct >= 15 ? '성과와 결과가 잘 정리되어 있습니다.' : '처리 속도 향상, 오류율 감소 등 정량적 수치를 덧붙이면 설득력이 배가됩니다.'
    },
    goldenRatioMatch,
    summaryMessage
  };
}
