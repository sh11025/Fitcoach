export type FinishStyle = 'gradient' | 'matte' | 'glossy';

export type ThemePaletteId =
  // 1. 그라데이션 (Gradient) 테마군: 역동적인 IT/테크, 그라데이션 배경 및 헤더
  | 'gradient_ocean'    // 비비드 오션 그라데이션 (블루 -> 인디고 -> 바이올렛)
  | 'gradient_sunset'   // 에너제틱 선셋 & 오렌지 (코랄 핑크 -> 앰버)
  | 'gradient_aurora'   // 미래지향 오로라 네온 (에메랄드 -> 시안)
  // 2. 무광 (Matte) 테마군: 차분하고 종이질감의 무광, 정밀한 선, 그림자 없는 플랫 에디터
  | 'matte_obsidian'    // 차분하고 단단한 흑요석 무광 챠콜 (스톤 매트)
  | 'matte_sage'        // 눈이 편안한 페이퍼 올리브 & 세이지 무광
  | 'matte_nordic'      // 미니멀 노르딕 클라우드 슬레이트
  // 3. 유광 / 글래스 (Glossy & Glass) 테마군: 반투명 글래스모피즘, 광택 하이라이트, 럭셔리 젬스톤
  | 'glossy_crystal'    // 투명하고 깨끗한 크리스탈 아쿠아 (유리 질감 + 하이라이트)
  | 'glossy_emerald'    // 반짝이는 프리미엄 에메랄드 젬스톤 (보석 광택)
  | 'glossy_onyx';      // 고급스러운 피아노 블랙 래커 유광

export interface ThemePalette {
  id: ThemePaletteId;
  name: string;
  finish: FinishStyle;
  finishLabel: string;
  concept: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  accentGradient?: string;
  // 전체적인 UI 적용 토큰
  appBgClass: string;          // 전체 배경 색상 및 텍스처
  headerClass: string;         // 헤더 배경 및 보더
  navIndicatorClass: string;   // 진행 단계 바 스타일
  cardClass: string;           // 콘텐츠 카드 전체 외형
  primaryBtnClass: string;     // 주요 액션 버튼 스타일
  secondaryBtnClass: string;   // 보조 버튼 스타일
  badgeClass: string;          // 강조 태그/뱃지 스타일
  accentTextClass: string;     // 강조 텍스트 색상
  focusRingClass: string;      // 인풋 포커스 링
}

export const THEME_PALETTES: ThemePalette[] = [
  // ==========================================
  // [1] 그라데이션 (Gradient) 테마군
  // ==========================================
  {
    id: 'gradient_ocean',
    name: '오션 하이퍼 그라데이션 (Ocean Flow)',
    finish: 'gradient',
    finishLabel: '그라데이션',
    concept: '스타트업 · IT 테크 유니콘 감성',
    description: '전체 화면에 부드러운 오션 블루-바이올렛 그라데이션 오버레이와 입체 카드 적용',
    previewBg: '#eff6ff',
    previewAccent: '#3b82f6',
    accentGradient: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
    appBgClass: 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900',
    headerClass: 'bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-xs',
    navIndicatorClass: 'bg-white/70 backdrop-blur-sm border-b border-indigo-100/70',
    cardClass: 'bg-white/90 backdrop-blur-xs border border-indigo-100 shadow-sm hover:border-indigo-300 transition-all rounded-2xl',
    primaryBtnClass: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md hover:shadow-indigo-500/25 hover:brightness-105 active:scale-[0.99] transition-all',
    secondaryBtnClass: 'bg-white/90 hover:bg-white text-slate-700 border border-indigo-200/70 hover:border-indigo-300 shadow-xs transition-colors',
    badgeClass: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border border-indigo-200 font-semibold',
    accentTextClass: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 font-black',
    focusRingClass: 'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
  },
  {
    id: 'gradient_sunset',
    name: '선셋 코랄 그라데이션 (Sunset Energy)',
    finish: 'gradient',
    finishLabel: '그라데이션',
    concept: '열정 · 도전 · 마케팅 / 기획직 채용',
    description: '화사한 코랄 핑크에서 따뜻한 앰버 오렌지로 이어지는 활력 넘치는 분위기',
    previewBg: '#fff7ed',
    previewAccent: '#f97316',
    accentGradient: 'linear-gradient(135deg, #e11d48 0%, #ea580c 50%, #f59e0b 100%)',
    appBgClass: 'bg-gradient-to-br from-stone-50 via-orange-50/30 to-amber-50/40 text-stone-900',
    headerClass: 'bg-white/85 backdrop-blur-md border-b border-orange-100 shadow-xs',
    navIndicatorClass: 'bg-white/70 backdrop-blur-sm border-b border-orange-100/70',
    cardClass: 'bg-white/95 backdrop-blur-xs border border-orange-100 shadow-sm hover:border-orange-300 transition-all rounded-2xl',
    primaryBtnClass: 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-md hover:shadow-orange-500/25 hover:brightness-105 active:scale-[0.99] transition-all',
    secondaryBtnClass: 'bg-white hover:bg-orange-50/40 text-stone-700 border border-orange-200 hover:border-orange-300 shadow-xs transition-colors',
    badgeClass: 'bg-gradient-to-r from-rose-50 to-orange-50 text-orange-800 border border-orange-200 font-semibold',
    accentTextClass: 'bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 font-black',
    focusRingClass: 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
  },
  {
    id: 'gradient_aurora',
    name: '오로라 퓨처 네온 (Aurora Tech)',
    finish: 'gradient',
    finishLabel: '그라데이션',
    concept: 'AI 연구소 · 딥테크 · 데이터 사이언스',
    description: '청량한 에메랄드 틸에서 사이언 블루로 유영하는 오로라 감성의 퓨처 테크 환경',
    previewBg: '#f0fdfa',
    previewAccent: '#06b6d4',
    accentGradient: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)',
    appBgClass: 'bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/40 text-slate-900',
    headerClass: 'bg-white/85 backdrop-blur-md border-b border-teal-100 shadow-xs',
    navIndicatorClass: 'bg-white/75 backdrop-blur-sm border-b border-teal-100/80',
    cardClass: 'bg-white/95 backdrop-blur-xs border border-teal-100 shadow-sm hover:border-teal-300 transition-all rounded-2xl',
    primaryBtnClass: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md hover:shadow-teal-500/25 hover:brightness-105 active:scale-[0.99] transition-all',
    secondaryBtnClass: 'bg-white hover:bg-teal-50/40 text-slate-700 border border-teal-200 hover:border-teal-300 shadow-xs transition-colors',
    badgeClass: 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-800 border border-teal-200 font-semibold',
    accentTextClass: 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 font-black',
    focusRingClass: 'focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
  },

  // ==========================================
  // [2] 무광 (Matte) 테마군: 지문과 반사 없는 플랫/매트/페이퍼
  // ==========================================
  {
    id: 'matte_obsidian',
    name: '옵시디언 챠콜 무광 (Matte Charcoal)',
    finish: 'matte',
    finishLabel: '무광 (Matte)',
    concept: '대기업 · 공기업 · 엔터프라이즈 사옥',
    description: '그림자와 반사를 배제한 솔리드 매트 챠콜과 정밀한 1px 라인으로 최고의 문서 집중력 제공',
    previewBg: '#f8fafc',
    previewAccent: '#1e293b',
    accentGradient: undefined,
    appBgClass: 'bg-slate-100 text-slate-900',
    headerClass: 'bg-slate-900 text-white border-b border-slate-800',
    navIndicatorClass: 'bg-slate-800/95 border-b border-slate-700 text-slate-200',
    cardClass: 'bg-white border border-slate-300/80 shadow-none hover:border-slate-500 transition-all rounded-xl',
    primaryBtnClass: 'bg-slate-900 hover:bg-black text-white shadow-none border border-slate-800 active:translate-y-0.5 transition-all',
    secondaryBtnClass: 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-none transition-colors',
    badgeClass: 'bg-slate-100 text-slate-900 border border-slate-400 font-medium',
    accentTextClass: 'text-slate-900 font-black',
    focusRingClass: 'focus:ring-1 focus:ring-slate-900 focus:border-slate-900'
  },
  {
    id: 'matte_sage',
    name: '세이지 페이퍼 무광 (Matte Sage Paper)',
    finish: 'matte',
    finishLabel: '무광 (Matte)',
    concept: '인문 · 교육계열 · 편안한 눈 건강',
    description: '눈부심 없는 인쇄 도서와 고급 크라프트 용지 같은 편안한 무광 매트 텍스처',
    previewBg: '#f4f6f0',
    previewAccent: '#4d6044',
    accentGradient: undefined,
    appBgClass: 'bg-[#f4f6f0] text-[#2c3727]',
    headerClass: 'bg-[#3b4735] text-[#fbfcf8] border-b border-[#2e3829]',
    navIndicatorClass: 'bg-[#475540] border-b border-[#3b4735] text-[#eef2e6]',
    cardClass: 'bg-[#fbfcf8] border border-[#d6dfc8] shadow-none hover:border-[#a8ba92] transition-all rounded-xl',
    primaryBtnClass: 'bg-[#43533c] hover:bg-[#34412e] text-[#fbfcf8] shadow-none border border-[#34412e]/50 active:translate-y-0.5 transition-all',
    secondaryBtnClass: 'bg-[#fbfcf8] hover:bg-[#eef2e6] text-[#34412e] border border-[#d6dfc8] shadow-none transition-colors',
    badgeClass: 'bg-[#eef2e6] text-[#34412e] border border-[#c5d3b3] font-medium',
    accentTextClass: 'text-[#34412e] font-black',
    focusRingClass: 'focus:ring-1 focus:ring-[#43533c] focus:border-[#43533c]'
  },
  {
    id: 'matte_nordic',
    name: '노르딕 클라우드 무광 (Matte Nordic Slate)',
    finish: 'matte',
    finishLabel: '무광 (Matte)',
    concept: '미니멀 · 개발자 에디터 · 노션 스타일',
    description: '북유럽의 안개 낀 암석 질감처럼 채도를 극도로 낮춘 미니멀 플랫 디자인',
    previewBg: '#f1f5f9',
    previewAccent: '#334155',
    accentGradient: undefined,
    appBgClass: 'bg-[#f1f4f8] text-slate-800',
    headerClass: 'bg-[#293548] text-slate-100 border-b border-slate-700',
    navIndicatorClass: 'bg-[#354359] border-b border-slate-600 text-slate-200',
    cardClass: 'bg-white border border-slate-200 shadow-none hover:border-slate-400 transition-all rounded-xl',
    primaryBtnClass: 'bg-slate-700 hover:bg-slate-800 text-white shadow-none border border-slate-600 active:translate-y-0.5 transition-all',
    secondaryBtnClass: 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-none transition-colors',
    badgeClass: 'bg-slate-100 text-slate-800 border border-slate-300 font-medium',
    accentTextClass: 'text-slate-800 font-black',
    focusRingClass: 'focus:ring-1 focus:ring-slate-700 focus:border-slate-700'
  },

  // ==========================================
  // [3] 유광 / 글래스 (Glossy & Glass) 테마군: 반투명 글래스, 광택 하이라이트
  // ==========================================
  {
    id: 'glossy_crystal',
    name: '크리스탈 아쿠아 유광 (Glossy Glass Aqua)',
    finish: 'glossy',
    finishLabel: '유광 (Glossy)',
    concept: '애플 글래스모피즘 · 반투명 광택',
    description: '상단 하이라이트 광택, 투명 블러 백드롭, 맑은 스카이 블루 빛으로 가득 찬 미래형 UI',
    previewBg: '#f0f9ff',
    previewAccent: '#0284c7',
    accentGradient: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
    appBgClass: 'bg-gradient-to-b from-sky-100/50 via-slate-50 to-sky-50/60 text-slate-900',
    headerClass: 'bg-white/70 backdrop-blur-xl border-b border-sky-200/80 shadow-sm',
    navIndicatorClass: 'bg-white/60 backdrop-blur-lg border-b border-sky-200/60',
    cardClass: 'bg-white/80 backdrop-blur-md border border-white/80 shadow-md shadow-sky-900/5 hover:border-sky-300 transition-all rounded-2xl ring-1 ring-sky-100',
    primaryBtnClass: 'bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 border-t border-white/70 hover:brightness-110 active:brightness-95 transition-all',
    secondaryBtnClass: 'bg-white/85 hover:bg-white text-sky-900 border border-sky-200 shadow-xs backdrop-blur-sm transition-colors',
    badgeClass: 'bg-sky-100/80 text-sky-800 border border-sky-300/80 shadow-2xs font-bold backdrop-blur-xs',
    accentTextClass: 'bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-700 font-black',
    focusRingClass: 'focus:ring-2 focus:ring-sky-400 focus:border-sky-400'
  },
  {
    id: 'glossy_emerald',
    name: '로열 에메랄드 젬 유광 (Glossy Gem Emerald)',
    finish: 'glossy',
    finishLabel: '유광 (Glossy)',
    concept: '서류 최종 합격 · 보석 광택 · 프리미엄',
    description: '빛을 머금은 에메랄드 보석 표면의 입체 광택과 반사 하이라이트로 합격의 기운 전달',
    previewBg: '#f0fdf4',
    previewAccent: '#16a34a',
    accentGradient: 'linear-gradient(180deg, #4ade80 0%, #15803d 100%)',
    appBgClass: 'bg-gradient-to-b from-emerald-100/40 via-slate-50 to-emerald-50/50 text-slate-900',
    headerClass: 'bg-white/75 backdrop-blur-xl border-b border-emerald-200/80 shadow-sm',
    navIndicatorClass: 'bg-white/65 backdrop-blur-lg border-b border-emerald-200/60',
    cardClass: 'bg-white/85 backdrop-blur-md border border-white/80 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all rounded-2xl ring-1 ring-emerald-100',
    primaryBtnClass: 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/30 border-t border-white/80 hover:brightness-110 active:brightness-95 transition-all',
    secondaryBtnClass: 'bg-white/85 hover:bg-white text-emerald-900 border border-emerald-200 shadow-xs backdrop-blur-sm transition-colors',
    badgeClass: 'bg-emerald-100/80 text-emerald-800 border border-emerald-300/80 shadow-2xs font-bold backdrop-blur-xs',
    accentTextClass: 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700 font-black',
    focusRingClass: 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
  },
  {
    id: 'glossy_onyx',
    name: '오닉스 래커 피아노 유광 (Glossy Piano Lacquer)',
    finish: 'glossy',
    finishLabel: '유광 (Glossy)',
    concept: '프리미엄 컨설팅 · 피아노 마감 · 블랙 광택',
    description: '하이엔드 피아노 건반처럼 매끄러운 래커 블랙 광택과 선명한 화이트 반사광',
    previewBg: '#f8fafc',
    previewAccent: '#0f172a',
    accentGradient: 'linear-gradient(180deg, #475569 0%, #020617 100%)',
    appBgClass: 'bg-gradient-to-b from-slate-200/60 via-slate-100/70 to-slate-200/50 text-slate-900',
    headerClass: 'bg-slate-950/90 text-white backdrop-blur-xl border-b border-slate-800 shadow-md',
    navIndicatorClass: 'bg-slate-900/85 backdrop-blur-md border-b border-slate-800 text-slate-200',
    cardClass: 'bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md shadow-slate-900/10 hover:border-slate-500 transition-all rounded-2xl ring-1 ring-slate-900/5',
    primaryBtnClass: 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 text-white shadow-xl shadow-slate-900/40 border-t border-white/50 hover:brightness-110 active:brightness-95 transition-all',
    secondaryBtnClass: 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 shadow-xs transition-colors',
    badgeClass: 'bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs font-bold',
    accentTextClass: 'text-slate-950 font-black',
    focusRingClass: 'focus:ring-2 focus:ring-slate-800 focus:border-slate-800'
  }
];
