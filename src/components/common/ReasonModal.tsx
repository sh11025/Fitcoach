import React from 'react';
import { X, HelpCircle, Check, Lightbulb } from 'lucide-react';
import { ExperienceItem } from '../../types';
import { RecommendationBadge } from './RecommendationBadge';
import { KeywordChip } from './KeywordChip';

interface Props {
  experience: ExperienceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReasonModal: React.FC<Props> = ({
  experience,
  isOpen,
  onClose
}) => {
  if (!isOpen || !experience) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reason-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span id="reason-modal-title">AI 판단 이유 및 코칭 근거</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Target Experience summary */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <h4 className="font-bold text-slate-900 text-base">{experience.title}</h4>
              <RecommendationBadge status={experience.status} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {experience.summary}
            </p>
          </div>

          {/* Connected JD Keywords */}
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1.5">
              연결된 채용공고 핵심 키워드
            </span>
            <div className="flex flex-wrap gap-1.5">
              {experience.keywords.map((kw) => (
                <KeywordChip key={kw} keyword={kw} variant="accent" />
              ))}
            </div>
          </div>

          {/* AI Judgment Breakdown */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              {experience.aiReason.headline}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {experience.aiReason.details}
            </p>
          </div>

          {/* Actionable Advice */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              추천 작성 방향 (작성 팁)
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              {experience.aiReason.actionableAdvice}
            </p>
          </div>

          {/* Principle notice */}
          <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400">
            <Check className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              AI는 문장을 대신 작성하지 않습니다. 지원자 본인의 언어로 경험의 전후 맥락과 주체적 행동을 채워 넣어보세요.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            현재 추천 상태: <strong className="text-slate-800">{experience.importance}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
