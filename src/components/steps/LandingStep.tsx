import React from 'react';
import { ArrowRight, FileSearch, GitCompare, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { THEME_PALETTES, ThemePaletteId, ThemePalette } from '../../styles/themeConfig';

interface Props {
  currentTheme: ThemePaletteId;
  onSelectTheme: (theme: ThemePaletteId) => void;
  onStart: () => void;
  onLoadSample: () => void;
  onOpenPhilosophyModal: () => void;
  themeConfig?: ThemePalette;
}

export const LandingStep: React.FC<Props> = ({
  currentTheme,
  onStart,
  onLoadSample,
  onOpenPhilosophyModal,
  themeConfig
}) => {
  const currentThemeObj = themeConfig || THEME_PALETTES.find((t) => t.id === currentTheme) || THEME_PALETTES[0];

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6 pb-6">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${currentThemeObj.badgeClass}`}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>신뢰할 수 있는 취업 준비 AI 코치 · {currentThemeObj.finishLabel} 스타일 적용 중</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] text-balance">
          내 자기소개서, <br className="sm:hidden" />
          <span className={currentThemeObj.accentTextClass}>
            AI가 대신 쓰지 않습니다.
          </span>
        </h1>

        <p className="text-lg sm:text-xl font-medium text-slate-700 max-w-2xl mx-auto leading-snug">
          채용공고와 내 경험을 비교해 <br className="hidden sm:inline" />
          무엇을 강조하고, 무엇을 보완해야 하는지 알려드립니다.
        </p>

        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          AI가 정답을 대신 작성하는 것이 아니라, <br />
          내 경험을 더 잘 보여줄 수 있도록 옆에서 코칭합니다.
        </p>

        {/* CTA Buttons - Fully styled by theme finish */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className={`w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer group ${currentThemeObj.primaryBtnClass}`}
          >
            <span>내 자기소개서 분석하기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onLoadSample}
            className={`w-full sm:w-auto px-6 py-4 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer ${currentThemeObj.secondaryBtnClass}`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>샘플 데이터로 즉시 체험</span>
          </button>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenPhilosophyModal}
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4 transition-colors cursor-pointer"
          >
            FitCoach가 자동 완성을 거부하는 이유 보기 →
          </button>
        </div>
      </div>

      {/* 3 Core Feature Cards - Formatted using theme cardClass */}
      <div className="grid sm:grid-cols-3 gap-6 pt-2">
        {/* Card 1 */}
        <div className={`p-6 sm:p-7 flex flex-col justify-between ${currentThemeObj.cardClass}`}>
          <div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              currentThemeObj.finish === 'glossy'
                ? 'bg-sky-50 text-sky-600 border border-sky-200/80 shadow-xs'
                : currentThemeObj.finish === 'matte'
                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                : 'bg-blue-50 text-blue-600'
            }`}>
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              채용공고 분석
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              지원하려는 회사의 채용공고에서 요구하는 핵심 자격요건, 기술 스택, 문제 해결 역량을 정확히 추출하여 분석 기준을 세웁니다.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
            #핵심역량 도출 #키워드 매핑
          </div>
        </div>

        {/* Card 2 */}
        <div className={`p-6 sm:p-7 flex flex-col justify-between ${currentThemeObj.cardClass}`}>
          <div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              currentThemeObj.finish === 'glossy'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs'
                : currentThemeObj.finish === 'matte'
                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                : 'bg-emerald-50 text-emerald-600'
            }`}>
              <GitCompare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              경험 매칭
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              내 이력서 속 수많은 프로젝트와 활동 중 이번 공고에서 강력하게 강조할 경험과 분량을 축소해야 할 경험을 이유와 함께 제안합니다.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
            #강조/축소 추천 #판단근거 투명공개
          </div>
        </div>

        {/* Card 3 */}
        <div className={`p-6 sm:p-7 flex flex-col justify-between ${currentThemeObj.cardClass}`}>
          <div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              currentThemeObj.finish === 'glossy'
                ? 'bg-purple-50 text-purple-600 border border-purple-200/80 shadow-xs'
                : currentThemeObj.finish === 'matte'
                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                : 'bg-purple-50 text-purple-600'
            }`}>
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              AI 자기소개서 코칭
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              팀의 행동 뒤에 가려진 지원자 본인의 액션을 발견하고, STAR 구조와 질문 프레임워크를 통해 스스로 매력적인 글을 완성하도록 돕습니다.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
            #STAR구조 점검 #직접수정 원칙
          </div>
        </div>
      </div>

      {/* Trust Quote Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 ${
        currentThemeObj.finish === 'matte'
          ? 'bg-slate-900 text-white border border-slate-800'
          : currentThemeObj.finish === 'glossy'
          ? 'bg-slate-950/90 text-white backdrop-blur-xl border border-slate-800 shadow-xl'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg'
      }`}>
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider block">
            The Philosophy of Genuine Voice
          </span>
          <p className="text-sm sm:text-base font-medium text-slate-200 leading-snug">
            &ldquo;합격 자기소개서의 차별점은 유려한 문장이 아니라, <br className="hidden sm:inline" />
            채용공고의 니즈에 부합하는 내 진짜 경험의 선명함입니다.&rdquo;
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          className={`shrink-0 px-6 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            currentThemeObj.finish === 'glossy'
              ? 'bg-white text-slate-950 hover:bg-slate-100 shadow-lg'
              : 'bg-white text-slate-900 hover:bg-slate-100 shadow-sm'
          }`}
        >
          시작하기
        </button>
      </div>
    </div>
  );
};
