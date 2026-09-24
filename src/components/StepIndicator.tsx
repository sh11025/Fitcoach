import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { AppStep, StepItem } from '../types';
import { THEME_PALETTES, ThemePaletteId, ThemePalette } from '../styles/themeConfig';

interface Props {
  currentStep: AppStep;
  currentTheme?: ThemePaletteId;
  themeConfig?: ThemePalette;
  onNavigate: (step: AppStep) => void;
}

export const STEPS: StepItem[] = [
  { id: 'landing', stepNumber: 1, label: '시작', shortDesc: '서비스 소개' },
  { id: 'upload', stepNumber: 2, label: '자료 등록', shortDesc: '이력서/채용공고' },
  { id: 'analysis', stepNumber: 3, label: 'AI 분석', shortDesc: '역량 및 공고 분석' },
  { id: 'matching_setup', stepNumber: 4, label: '경험 매칭 & 세팅', shortDesc: '강조/축소 판단' },
  { id: 'editor_coach', stepNumber: 5, label: '편집 & AI 코치', shortDesc: '실시간 가이드' },
  { id: 'final_review', stepNumber: 6, label: '최종 점검', shortDesc: '체크리스트 확인' }
];

export const StepIndicator: React.FC<Props> = ({ currentStep, currentTheme = 'gradient_ocean', themeConfig, onNavigate }) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const currentThemeObj = themeConfig || THEME_PALETTES.find((t) => t.id === currentTheme) || THEME_PALETTES[0];

  return (
    <div className={`w-full transition-all ${currentThemeObj.navIndicatorClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav aria-label="진행 단계" className="overflow-x-auto scrollbar-none py-3">
          <ol className="flex items-center gap-1 sm:gap-2 min-w-max">
            {STEPS.map((step, idx) => {
              const isCurrent = step.id === currentStep;
              const isPast = idx < currentIndex;
              const isClickable = true;

              return (
                <li key={step.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => isClickable && onNavigate(step.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? currentThemeObj.finish === 'glossy'
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 border-t border-white/60 ring-1 ring-sky-300'
                          : currentThemeObj.finish === 'matte'
                          ? 'bg-slate-900 text-white ring-1 ring-slate-700'
                          : 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/40'
                        : isPast
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-black/5'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono tabular-nums font-bold ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isPast
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : 'bg-black/5 text-slate-500'
                      }`}
                    >
                      {isPast ? <Check className="w-3 h-3 stroke-[2.5]" /> : step.stepNumber}
                    </span>
                    <span className="whitespace-nowrap">{step.label}</span>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300/80 mx-1 shrink-0" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
