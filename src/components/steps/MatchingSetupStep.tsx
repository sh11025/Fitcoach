import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Sliders, Info } from 'lucide-react';
import { ExperienceItem, ParagraphSetting, ParagraphPriority } from '../../types';
import { ExperienceCard } from '../common/ExperienceCard';
import { ReasonModal } from '../common/ReasonModal';

interface Props {
  experiences: ExperienceItem[];
  paragraphSettings: ParagraphSetting[];
  onUpdateExperienceStatus: (id: string, newStatus: ExperienceItem['status']) => void;
  onUpdateParagraphPriority: (id: string, newPriority: ParagraphPriority) => void;
  onNext: () => void;
}

export const MatchingSetupStep: React.FC<Props> = ({
  experiences,
  paragraphSettings,
  onUpdateExperienceStatus,
  onUpdateParagraphPriority,
  onNext
}) => {
  // Selected experience for reason modal
  const [selectedExpForReason, setSelectedExpForReason] = useState<ExperienceItem | null>(null);

  // Active view tab: 'experiences' | 'paragraphs'
  const [activeTab, setActiveTab] = useState<'experiences' | 'paragraphs'>('experiences');

  // Selected paragraph for detail panel
  const [selectedParagraphId, setSelectedParagraphId] = useState<string>(paragraphSettings[0]?.id || 'p-1');

  const selectedParagraph = paragraphSettings.find((p) => p.id === selectedParagraphId) || paragraphSettings[0];

  const priorityConfigs: Record<
    ParagraphPriority,
    { label: string; symbol: string; badgeClass: string; desc: string }
  > = {
    very_high: {
      label: '매우 강조',
      symbol: '↑↑',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      desc: '채용공고 핵심 역량이 집약된 문단으로 가장 많은 글자 수를 배분해야 합니다.'
    },
    high: {
      label: '강조',
      symbol: '↑',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold',
      desc: '직무 연관성이 높으며, 본인의 주체적 행동을 보강하면 훌륭한 문단이 됩니다.'
    },
    keep: {
      label: '유지',
      symbol: '→',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      desc: '기본기와 협업 태도를 보여주는 적정 분량의 문단입니다.'
    },
    complement: {
      label: '보완',
      symbol: '△',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
      desc: '소재는 좋으나 실무 연계나 구체적 Action이 부족하여 보완이 필요합니다.'
    },
    reduce: {
      label: '축소',
      symbol: '↓',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      desc: '직무 연관성이 상대적으로 낮아 글자 수를 아끼기 위해 요약하거나 축소해야 합니다.'
    }
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-blue-600 block mb-1">STEP 04</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            경험 매칭 & AI 초기 세팅
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            채용공고 기준으로 내 경험의 적합도를 점검하고, 문단별 강조/축소 비중을 세팅합니다.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('experiences')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'experiences'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. 경험 매칭 ({experiences.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paragraphs')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'paragraphs'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. 문단별 비중 세팅 ({paragraphSettings.length})
          </button>
        </div>
      </div>

      {/* Principle Callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-800">모든 판단에는 투명한 이유가 제공됩니다.</strong>
          <p className="text-[11px] text-slate-500">
            AI의 강조/축소 추천은 강제가 아니며, 각 카드의 상태를 사용자가 직접 변경할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Tab 1: 경험 매칭 카드 목록 */}
      {activeTab === 'experiences' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>내 이력서 경험 분석 결과</span>
              <span className="text-xs text-slate-400 font-normal">
                (카드를 클릭하거나 &apos;왜 이렇게 판단했나요?&apos;를 눌러 상세 이유 확인)
              </span>
            </h3>
            <span className="text-xs text-slate-500">
              추천: 🟢 강조 1건 · 🔵 유지 1건 · 🟡 보완 1건 · ⚪ 축소 1건
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onOpenReason={(item) => setSelectedExpForReason(item)}
                onStatusChange={onUpdateExperienceStatus}
              />
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('paragraphs')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>문단별 비중 세팅으로 이동</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: 자소서 문단별 초기 세팅 */}
      {activeTab === 'paragraphs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                문단별 우선순위 및 강조 가이드
              </h3>
              <p className="text-xs text-slate-500">
                문단을 선택하면 오른쪽에 AI의 판단 이유와 STAR 분석 상태가 표시됩니다.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              자유롭게 우선순위를 재설정할 수 있습니다.
            </span>
          </div>

          {/* Master-Detail Layout for Paragraphs */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left: Paragraph list with priority indicator (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {paragraphSettings.map((item, idx) => {
                const isSelected = item.id === selectedParagraphId;
                const pConfig = priorityConfigs[item.priority];

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedParagraphId(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/40 border-blue-400 shadow-2xs ring-1 ring-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          문단 0{idx + 1}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md border ${pConfig.badgeClass}`}
                        >
                          {pConfig.symbol} {pConfig.label}
                        </span>
                      </div>

                      {/* Priority selector override */}
                      <select
                        value={item.priority}
                        onChange={(e) => {
                          e.stopPropagation();
                          onUpdateParagraphPriority(item.id, e.target.value as ParagraphPriority);
                        }}
                        className="text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 cursor-pointer focus:outline-hidden"
                      >
                        <option value="very_high">↑↑ 매우 강조</option>
                        <option value="high">↑ 강조</option>
                        <option value="keep">→ 유지</option>
                        <option value="complement">△ 보완</option>
                        <option value="reduce">↓ 축소</option>
                      </select>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                      {item.originalText}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Paragraph Detail & Reason Panel (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase">
                    선택 문단 AI 코칭 진단
                  </h4>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded border ${
                    priorityConfigs[selectedParagraph.priority].badgeClass
                  }`}
                >
                  {priorityConfigs[selectedParagraph.priority].symbol}{' '}
                  {priorityConfigs[selectedParagraph.priority].label}
                </span>
              </div>

              {/* Rationale explanation */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-600 block">
                  AI 판단 이유
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedParagraph.aiReason}
                </p>
              </div>

              {/* Actionable Suggestion */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-blue-700 block">
                  💡 추천 편집 방향
                </span>
                <p className="text-xs text-blue-900 leading-relaxed bg-blue-50/60 p-3 rounded-lg border border-blue-100">
                  {selectedParagraph.suggestion}
                </p>
              </div>

              {/* STAR status preview */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-600 block mb-2">
                  문단 구조(STAR) 분석
                </span>
                <div className="grid grid-cols-4 gap-1 text-center text-xs">
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">S (상황)</span>
                    <span className="font-bold text-emerald-600 text-xs">✓ 충족</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">T (과제)</span>
                    <span className="font-bold text-emerald-600 text-xs">✓ 충족</span>
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      selectedParagraph.starState.action === 'sufficient'
                        ? 'bg-slate-50 border-slate-100 text-emerald-600'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-400">A (행동)</span>
                    <span className="font-bold text-xs">
                      {selectedParagraph.starState.action === 'sufficient'
                        ? '✓ 양호'
                        : '△ 부족'}
                    </span>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                    <span className="block text-[10px] text-slate-400">R (결과)</span>
                    <span className="font-bold text-emerald-600 text-xs">
                      {selectedParagraph.starState.result ? '✓ 충족' : '△ 미흡'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary CTA: 이 설정으로 편집 시작 */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          다음 단계에서 왼쪽 에디터에서 직접 문장을 수정하고, 오른쪽 AI 코치 패널에서 실시간 피드백을 확인합니다.
        </p>
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>이 설정으로 편집 시작</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Reason Modal */}
      <ReasonModal
        experience={selectedExpForReason}
        isOpen={Boolean(selectedExpForReason)}
        onClose={() => setSelectedExpForReason(null)}
      />
    </div>
  );
};
