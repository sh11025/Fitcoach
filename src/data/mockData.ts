import { JobInfo, ExperienceItem, ParagraphSetting, FeedbackItem, FinalCheckItem } from '../types';

export const INITIAL_JOB_INFO: JobInfo = {
  company: 'ABC Tech',
  role: 'Backend Developer (백엔드 개발자)',
  url: 'https://careers.abctech.example.com/jobs/backend-2026',
  question: '지원 직무와 관련된 경험과 본인의 역량을 작성해주세요.',
  charLimit: 1000,
  keyCompetencies: [
    'Java/Spring',
    '문제 해결',
    '협업',
    'API 개발',
    '성능 개선',
    '대용량 트래픽'
  ]
};

export const INITIAL_DRAFT_TEXT = `[주문 처리 안정성을 2배 높인 백엔드 개발자]
대학 시절 중고거래 플랫폼을 개발하는 프로잭트에서 백엔드 개발을 담당했습니다.

서비스 출시 후 동시 주문이 몰릴 때마다 DB 락과 스레드 풀 고갈로 인해 API 응답이 지연되는 문제가 발생했습니다. 프로젝트에서 문제가 발생해서 팀원들과 문제를 해결했습니다. 저는 병목 원인을 찾기 위해 APM 툴을 도입하여 느린 쿼리를 프로파일링하고, Redis 분산 락 및 비동기 메시지 큐를 직접 적용했습니다. 그 결과 처리 속도를 크게 개선했습니다.

또한 학부 시절 전산학회에서 스터디장을 맡아 팀원들과 Spring MVC 아키텍처와 객체지향 설계를 공부하며 코드 리뷰 문화를 도입했습니다.

한편 대학교 3학년 축제 기간에는 운영위원회 부위원장으로서 총 12개 학과 부스의 부스 운영과 물품 조달을 담당하며 예산 조율 역할을 수행 하였습니다.

이러한 기술적 트러블슈팅 경험과 소통 능력을 바탕으로 ABC Tech의 안정적인 백엔드 시스템 구축에 기여하겠습니다.`;

export const MOCK_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: '주문 API 성능 개선 및 병목 해결 프로젝트',
    status: 'highlight',
    importance: '높음 ↑↑',
    keywords: ['API 개발', '성능 개선', '문제 해결', 'Java/Spring'],
    summary: '동시 주문 급증 시 DB 락 및 응답 지연 문제를 Redis 캐싱 및 비동기 처리로 최적화한 실무형 경험',
    aiReason: {
      headline: '채용공고의 핵심 요구 역량과 가장 직접적으로 맞닿아 있는 경험입니다.',
      details: '이번 ABC Tech 채용공고에서는 [API 개발 경험], [성능 개선 및 트러블슈팅 역량], [Spring 환경]을 최우선으로 평가하고 있습니다. 해당 프로젝트에서는 단순 기능 구현에 그치지 않고, 시스템 병목 원인을 진단하고 본인이 주도하여 개선 방안을 설계·적용한 전 과정이 드러나 있어 직무 적합도가 가장 높습니다.',
      actionableAdvice: '팀 차원의 결정보다는 "본인이 어떤 로그와 지표를 보고 왜 그 기술을 선택했는지" 액션 위주로 구체화하세요.'
    }
  },
  {
    id: 'exp-2',
    title: '중고거래 플랫폼 백엔드 REST API 설계 및 개발',
    status: 'keep',
    importance: '보통 →',
    keywords: ['Java/Spring', 'API 개발', '협업'],
    summary: 'Spring Boot와 JPA를 기반으로 회원, 상품, 주문 CRUD 도메인을 모델링하고 협업한 프로젝트',
    aiReason: {
      headline: '백엔드 엔지니어로서의 기본기(Spring, JPA, DB 설계)를 증명하기에 적절합니다.',
      details: '채용공고의 필수 자격 요건인 Java/Spring 생태계 활용 능력을 보여주기에 적합합니다. 다만 일반적인 기능 구현 나열은 다른 지원자와 차별화되기 어려우므로, 주문 API 성능 개선 프로젝트의 전후 맥락(배경)으로 간결하게 연결해 유지하는 것을 추천합니다.',
      actionableAdvice: '전체 기능을 다 나열하기보다는 아키텍처적 고민이나 협업 방식 1가지만 컴팩트하게 남기세요.'
    }
  },
  {
    id: 'exp-3',
    title: '알고리즘 스터디 운영 및 코드 리뷰 주도',
    status: 'complement',
    importance: '보완 △',
    keywords: ['문제 해결', '협업'],
    summary: '매주 5개의 백준/프로그래머스 알고리즘 문제를 풀고 상호 코드 리뷰를 진행한 스터디',
    aiReason: {
      headline: '지속적인 학습 태도는 긍정적이나, 실무 프로젝트 문제 해결과의 연계가 부족합니다.',
      details: '단순히 "알고리즘을 열심히 풀었다"는 서술은 채용공고에서 요구하는 시스템 문제 해결력과 거리감이 있습니다. 스터디에서 배운 자료구조나 시간복잡도 최적화 감각을 실제 개발 프로젝트의 쿼리 튜닝이나 로직 개선에 어떻게 적용했는지 브릿지 서술이 필요합니다.',
      actionableAdvice: '스터디 자체를 강조하기보다는 "복잡도 고민이 실제 코드 작성에 어떻게 투영되었는지"로 관점을 전환해보세요.'
    }
  },
  {
    id: 'exp-4',
    title: '대학 축제 운영위원회 기획 및 예산 조율',
    status: 'reduce',
    importance: '낮음 ↓',
    keywords: ['협업'],
    summary: '12개 학과 부스 일정 조율 및 물품 배정, 행사 예산 집행 관리',
    aiReason: {
      headline: '협업 경험이지만 개발 직무 요구역량(백엔드 엔지니어링)과의 직접 연관성이 낮습니다.',
      details: '의사소통 및 협업 태도를 보여줄 수 있는 소재이지만, 이번 채용공고는 기술적 역량과 트러블슈팅을 매우 높은 비중으로 보고 있습니다. 제한된 1,000자 분량 중 비개발 경험에 문단을 크게 할애하면 핵심 기술 역량을 설명할 공간이 부족해집니다.',
      actionableAdvice: '완전히 삭제할 필요는 없으나, 1~2문장으로 압축하거나 "개발 협업 시 이해관계자 조율 경험"으로 대체하는 것을 권장합니다.'
    }
  }
];

export const MOCK_PARAGRAPH_SETTINGS: ParagraphSetting[] = [
  {
    id: 'p-1',
    originalText: '대학 시절 중고거래 플랫폼을 개발하는 프로잭트에서 백엔드 개발을 담당했습니다.',
    priority: 'high',
    aiReason: '글의 도입부로서 직무와 관련된 핵심 프로젝트를 명확히 제시합니다. 다만 오타가 포함되어 있으며 본인의 구체적 포지션(역할)을 더 선명하게 드러낼 수 있습니다.',
    suggestion: '어떤 규모의 프로젝트였는지 또는 어떤 도메인을 맡았는지 한 줄로 선명하게 각인시키세요.',
    starState: {
      situation: true,
      task: true,
      action: 'needs_detail',
      result: false
    }
  },
  {
    id: 'p-2',
    originalText: '서비스 출시 후 동시 주문이 몰릴 때마다 DB 락과 스레드 풀 고갈로 인해 API 응답이 지연되는 문제가 발생했습니다. 프로젝트에서 문제가 발생해서 팀원들과 문제를 해결했습니다. 저는 병목 원인을 찾기 위해 APM 툴을 도입하여 느린 쿼리를 프로파일링하고, Redis 분산 락 및 비동기 메시지 큐를 직접 적용했습니다. 그 결과 처리 속도를 크게 개선했습니다.',
    priority: 'very_high',
    aiReason: '채용공고의 필수 역량인 [API 개발], [성능 개선], [문제 해결]이 집중된 가장 중요한 문단입니다. 매우 높은 비중으로 강조해야 합니다.',
    suggestion: '팀 전체의 모호한 행동("팀원들과 문제를 해결했습니다")을 줄이고, "본인이 어떤 가설을 세우고 어떤 행동을 했는지"와 "실제 측정 수치"를 명시하세요.',
    starState: {
      situation: true,
      task: true,
      action: 'sufficient',
      result: true
    }
  },
  {
    id: 'p-3',
    originalText: '또한 학부 시절 전산학회에서 스터디장을 맡아 팀원들과 Spring MVC 아키텍처와 객체지향 설계를 공부하며 코드 리뷰 문화를 도입했습니다.',
    priority: 'keep',
    aiReason: '기술적 기초 체력(Spring, 객체지향)과 동료와의 건강한 코드 리뷰 문화를 보여주는 무난하고 좋은 문단입니다.',
    suggestion: '현재 길이를 유지하되, 코드 리뷰를 통해 실제 프로젝트 품질이나 버그가 감소했던 체감 효과를 살짝 덧붙이면 좋습니다.',
    starState: {
      situation: true,
      task: true,
      action: 'sufficient',
      result: false
    }
  },
  {
    id: 'p-4',
    originalText: '한편 대학교 3학년 축제 기간에는 운영위원회 부위원장으로서 총 12개 학과 부스의 부스 운영과 물품 조달을 담당하며 예산 조율 역할을 수행 하였습니다.',
    priority: 'reduce',
    aiReason: '비개발 분야의 활동으로 채용공고의 백엔드 요구 스택과 직접적 접점이 약합니다. 글자 수 배분 상 비중을 축소할 필요가 있습니다.',
    suggestion: '해당 문단을 1문장으로 요약하거나, 개발 프로젝트 중 일정 충돌을 조율했던 기술 협업 경험으로 교체하는 것을 권장합니다.',
    starState: {
      situation: true,
      task: true,
      action: 'needs_detail',
      result: false
    }
  }
];

export const MOCK_FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: 'fb-1',
    type: 'typo',
    title: '오타 발견 (맞춤법)',
    targetExcerpt: '프로잭트',
    explanation: '올바른 표준 외래어 표기는 "프로젝트"입니다.',
    replacementCandidate: '프로젝트'
  },
  {
    id: 'fb-2',
    type: 'typo',
    title: '띄어쓰기 오류 (맞춤법)',
    targetExcerpt: '수행 하였습니다',
    explanation: '\'수행하다\'는 한 단어의 동사이므로 붙여 쓰는 것이 자연스럽습니다.',
    replacementCandidate: '수행하였습니다'
  },
  {
    id: 'fb-3',
    type: 'detail',
    title: '구체화 추천 (주체적 행동 불명확)',
    targetExcerpt: '프로젝트에서 문제가 발생해서 팀원들과 문제를 해결했습니다.',
    explanation: '팀 전체의 행동은 확인되지만 본인이 직접 수행한 기여와 구체적 판단 과정이 드러나지 않습니다. 채용 담당자는 "지원자 본인의 행동"을 보고 싶어 합니다.',
    guidingQuestions: [
      '어떤 구체적인 문제가 발생했나요? (예: 응답시간 지연, 오류율 상승)',
      '문제의 근본 원인을 어떻게 발견했나요? (예: 로그 추적, 모니터링 툴 사용)',
      '본인이 직접 제안한 해결 방법은 무엇인가요?',
      '팀원들을 어떻게 설득하거나 분업하여 실제로 어떤 행동을 했나요?'
    ]
  },
  {
    id: 'fb-4',
    type: 'detail',
    title: '구체화 추천 (성과 수치화 및 사실 확인)',
    targetExcerpt: '처리 속도를 크게 개선했습니다.',
    explanation: '\'크게 개선했다\'는 정성적 표현보다 객관적인 지표가 있다면 글의 신뢰도가 크게 높아집니다.',
    factCheckWarning: '성과를 실제 숫자로 표현할 수 있다면 글의 신뢰도를 높일 수 있습니다. (예: 평균 응답 속도 ms 단위, TPS 수치, 에러율 감축률 등)\n\n※ 주의: 실제로 본인이 측정하고 확인 가능한 숫자가 있는 경우에만 작성하세요. 과장되거나 확인되지 않은 수치는 면접 검증에서 치명적일 수 있습니다.',
    guidingQuestions: [
      '개선 전과 후의 응답 시간(ms) 차이가 있었나요?',
      '초당 처리량(TPS)이나 동시 접속 처리 건수의 변화가 있었나요?',
      '테스트를 통해 검증한 수치가 있다면 적어주세요.'
    ]
  },
  {
    id: 'fb-5',
    type: 'job',
    title: '직무 핵심 역량 연결 (긍정적 포인트)',
    targetExcerpt: '느린 쿼리를 프로파일링하고, Redis 분산 락 및 비동기 메시지 큐를 직접 적용했습니다.',
    explanation: 'ABC Tech 채용공고의 필수 역량인 [Java/Spring], [API 개발], [성능 개선]과 가장 밀접하게 연결되는 핵심 구절입니다. 이 부분의 비중을 살려주세요.'
  },
  {
    id: 'fb-6',
    type: 'star',
    title: 'STAR 구조 점검: Action(본인 행동) 보강 권장',
    targetExcerpt: '문단 2: 병목 해결 과정',
    explanation: '경험 서술에서 Situation(상황)과 Task(과제)는 잘 갖춰졌으나, Action(행동) 단계에서 "나는 왜 Redis와 비동기 큐를 선택했는가?"에 대한 기술적 근거가 더해지면 설득력이 배가됩니다.',
    starInfo: {
      s: 'good',
      t: 'good',
      a: 'warn',
      r: 'good',
      advice: '현재 문단에서는 발생한 문제(S, T)와 결과(R)는 명확합니다. 다만 Action에서 여러 대안 중 왜 그 기술을 선택했는지 "나의 생각과 행동"을 1문장 더 보완해보세요.'
    }
  },
  {
    id: 'fb-7',
    type: 'reduce',
    title: '내용 비중 축소 추천 (직무 관련성 낮음)',
    targetExcerpt: '총 12개 학과 부스의 부스 운영과 물품 조달을 담당하며 예산 조율 역할을 수행 하였습니다.',
    explanation: '해당 경험은 백엔드 개발자 채용공고의 핵심 역량과의 직접 연결 고리가 약합니다. 제한된 글자 수를 기술 역량 설명에 집중하기 위해 비중을 축소하거나 1문장으로 요약하는 것이 유리합니다.'
  }
];

export const MOCK_FINAL_CHECKLIST: FinalCheckItem[] = [
  {
    id: 'fc-1',
    category: '직무 연결',
    status: 'passed',
    title: '핵심 역량과 경험이 긴밀하게 연결되어 있습니다.',
    summary: '채용공고의 핵심 키워드인 [API 개발], [성능 개선], [Java/Spring] 경험이 서술 중심에 배치되어 있습니다.',
    note: '회사에서 요구하는 기술 스택과 지원자의 실무형 문제 해결 경험이 부합합니다.'
  },
  {
    id: 'fc-2',
    category: '본인의 행동',
    status: 'warning',
    title: '일부 문단에서 본인의 행동을 조금 더 구체적으로 설명할 수 있습니다.',
    summary: '\'팀원들과 함께 해결했습니다\' 등의 모호한 서술 대신 지원자 본인이 직접 제안하고 코드로 구현한 액션이 선명해야 합니다.',
    note: '"그래서 나는 무엇을 했는가?"를 기준으로 주어를 점검해보세요.'
  },
  {
    id: 'fc-3',
    category: '결과',
    status: 'passed',
    title: '경험의 결과와 변화가 포함되어 있습니다.',
    summary: '트러블슈팅 후 성능이 개선되었다는 결과 맥락이 제시되어 있습니다.',
    note: '실제 확인 가능한 수치(ms, 처리율 등)가 있다면 추가해 신뢰도를 더욱 높일 수 있습니다.'
  },
  {
    id: 'fc-4',
    category: '구체성',
    status: 'warning',
    title: '추상적인 표현 2개가 남아 있습니다.',
    summary: '\'문제가 발생해서\', \'크게 개선했습니다\' 등의 두루뭉술한 표현이 포함되어 있습니다.',
    note: '구체적인 문제 명칭(예: DB Connection Pool 고갈, Lock 충돌)을 명시하면 전문가다운 인상을 줍니다.'
  },
  {
    id: 'fc-5',
    category: '맞춤법',
    status: 'passed',
    title: '주요 맞춤법 검사가 완료되었습니다.',
    summary: '오타(\'프로잭트\' → \'프로젝트\') 및 띄어쓰기(\'수행 하였습니다\' → \'수행하였습니다\') 점검 완료.',
    note: '글의 가독성을 해치는 치명적인 오탈자가 교정되었습니다.'
  },
  {
    id: 'fc-6',
    category: '반복 표현',
    status: 'warning',
    title: '유사한 어미 및 단어가 연속 반복됩니다.',
    summary: '\'~문제가 발생했습니다. ~문제를 해결했습니다\' 문장에서 \'문제\' 단어가 연속 사용되었습니다.',
    note: '동일 어휘의 중복 사용을 피하고 간결한 문장 구조로 다듬어보세요.'
  }
];

export const MOCK_COMPETENCY_MAPPING = [
  {
    competency: '성능 개선 & 문제 해결',
    importance: '핵심 요구 (채용공고 1순위)',
    matchedExperience: '주문 API 성능 개선 및 병목 해결 프로젝트',
    reflectionStatus: '충실히 반영됨 (본문 2문단)',
    statusBadge: '반영 완료'
  },
  {
    competency: 'Java/Spring & API 개발',
    importance: '필수 스택',
    matchedExperience: '중고거래 플랫폼 백엔드 개발 & 성능 개선',
    reflectionStatus: 'Spring Boot, Redis, 쿼리 프로파일링 적용 서술',
    statusBadge: '반영 완료'
  },
  {
    competency: '협업 및 코드 리뷰',
    importance: '팀 문화 적합성',
    matchedExperience: '학부 전산학회 스터디장 및 코드 리뷰 도입',
    reflectionStatus: '간결하게 반영됨 (본문 3문단)',
    statusBadge: '적정 반영'
  },
  {
    competency: '대용량 트래픽 경험',
    importance: '우대 사항',
    matchedExperience: '동시 주문 트래픽 시뮬레이션 및 분산 락 적용',
    reflectionStatus: '성과 수치화(TPS 등) 추가 시 더욱 강점',
    statusBadge: '보완 권장'
  }
];
