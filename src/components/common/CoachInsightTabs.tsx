import React, { useState } from 'react';
import { StarAnalysis } from '../../utils/starAnalysis';
import { ReadabilityMetrics } from '../../utils/readabilityAnalysis';
import { CheckCircle2, ChevronRight, ChevronDown, Sparkles, Scissors, ArrowRight } from 'lucide-react';

interface Props {
  starData: StarAnalysis;
  readabilityMetrics: ReadabilityMetrics;
  onApplySplit?: (originalSentence: string, splitSentences: string[]) => void;
  onHighlightSentence?: (sentence: string) => void;
}

export const CoachInsightTabs: React.FC<Props> = ({
  starData,
  readabilityMetrics,
  onApplySplit,
  onHighlightSentence
}) => {
  const [activeTab, setActiveTab] = useState<'star' | 'readability'>('star');
  const [chartType, setChartType] = useState<'donut' | 'gauge'>('donut');
  const [selectedSegment, setSelectedSegment] = useState<'s' | 't' | 'a' | 'r'>('a');
  const [isReadabilityExpanded, setIsReadabilityExpanded] = useState(false);
  const [selectedSentenceId, setSelectedSentenceId] = useState<string | null>(null);

  const { situation, task, action, result, goldenRatioMatch } = starData;
  const { score, averageLength, totalSentences, tooLongCount, sentences, topRecommendations } = readabilityMetrics;

  // Pie/Donut Chart calculation
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const sLength = (situation.percentage / 100) * circumference;
  const tLength = (task.percentage / 100) * circumference;
  const aLength = (action.percentage / 100) * circumference;
  const rLength = (result.percentage / 100) * circumference;

  const sOffset = 0;
  const tOffset = sLength;
  const aOffset = tOffset + tLength;
  const rOffset = aOffset + aLength;

  const activeSegmentData =
    selectedSegment === 's'
      ? { label: 'Situation (상황)', pct: situation.percentage, target: '10~15%', color: 'text-blue-700', bg: 'bg-blue-50/70 border-blue-200', desc: situation.feedback }
      : selectedSegment === 't'
      ? { label: 'Task (과제/목표)', pct: task.percentage, target: '10~15%', color: 'text-amber-700', bg: 'bg-amber-50/70 border-amber-200', desc: task.feedback }
      : selectedSegment === 'a'
      ? { label: 'Action (본인 행동)', pct: action.percentage, target: '50% 이상', color: 'text-emerald-700', bg: 'bg-emerald-50/70 border-emerald-200', desc: action.feedback }
      : { label: 'Result (결과/성과)', pct: result.percentage, target: '15~20%', color: 'text-purple-700', bg: 'bg-purple-50/70 border-purple-200', desc: result.feedback };

  const problematicSentences = sentences.filter(
    (s) => s.status === 'too_long' || s.status === 'complex'
  );

  return (
    <div className="border-b border-slate-200 bg-white">
      {/* Tab Switcher Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('star')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'star'
                ? 'bg-white text-indigo-900 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>STAR 구조</span>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
              {goldenRatioMatch}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('readability')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'readability'
                ? 'bg-white text-indigo-900 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>가독성 & 분할</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
              score >= 70 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {score}점
            </span>
          </button>
        </div>

        {/* Sub-view Controls */}
        {activeTab === 'star' ? (
          <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg text-[10px]">
            <button
              type="button"
              onClick={() => setChartType('donut')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                chartType === 'donut' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              파이
            </button>
            <button
              type="button"
              onClick={() => setChartType('gauge')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                chartType === 'gauge' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              게이지
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsReadabilityExpanded(!isReadabilityExpanded)}
            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer font-medium"
          >
            <span>{isReadabilityExpanded ? '간략히' : '문장별 진단'}</span>
            {isReadabilityExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Tab 1: STAR Structure */}
      {activeTab === 'star' && (
        <div className="p-4 space-y-3 animate-in fade-in duration-150">
          {chartType === 'donut' ? (
            <div className="flex items-center justify-between gap-4">
              {/* Donut Chart */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="50" cy="50" r={r} fill="transparent" stroke="#60a5fa" strokeWidth="12" strokeDasharray={`${sLength} ${circumference}`} strokeDashoffset={-sOffset} onClick={() => setSelectedSegment('s')} className="cursor-pointer hover:opacity-80 transition-all" />
                  <circle cx="50" cy="50" r={r} fill="transparent" stroke="#fbbf24" strokeWidth="12" strokeDasharray={`${tLength} ${circumference}`} strokeDashoffset={-tOffset} onClick={() => setSelectedSegment('t')} className="cursor-pointer hover:opacity-80 transition-all" />
                  <circle cx="50" cy="50" r={r} fill="transparent" stroke="#10b981" strokeWidth="14" strokeDasharray={`${aLength} ${circumference}`} strokeDashoffset={-aOffset} onClick={() => setSelectedSegment('a')} className="cursor-pointer hover:opacity-80 transition-all" />
                  <circle cx="50" cy="50" r={r} fill="transparent" stroke="#c084fc" strokeWidth="12" strokeDasharray={`${rLength} ${circumference}`} strokeDashoffset={-rOffset} onClick={() => setSelectedSegment('r')} className="cursor-pointer hover:opacity-80 transition-all" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Action</span>
                  <span className="text-sm font-black text-emerald-600 font-mono -mt-0.5">{action.percentage}%</span>
                </div>
              </div>

              {/* 4 Quadrants Selector */}
              <div className="flex-1 grid grid-cols-2 gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedSegment('s')}
                  className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedSegment === 's' ? 'border-blue-400 bg-blue-50/80 ring-1 ring-blue-400/20' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-[10px] font-bold text-slate-700">S (상황)</span>
                  </div>
                  <div className="flex justify-between pl-3 mt-0.5">
                    <span className="font-mono font-bold text-blue-700">{situation.percentage}%</span>
                    <span className="text-[9px] text-slate-400">15%</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSegment('t')}
                  className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedSegment === 't' ? 'border-amber-400 bg-amber-50/80 ring-1 ring-amber-400/20' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-bold text-slate-700">T (과제)</span>
                  </div>
                  <div className="flex justify-between pl-3 mt-0.5">
                    <span className="font-mono font-bold text-amber-700">{task.percentage}%</span>
                    <span className="text-[9px] text-slate-400">15%</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSegment('a')}
                  className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedSegment === 'a' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/20' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-900">★ A (행동)</span>
                  </div>
                  <div className="flex justify-between pl-3 mt-0.5">
                    <span className="font-mono font-bold text-emerald-700">{action.percentage}%</span>
                    <span className="text-[9px] text-emerald-600 font-semibold">50%+</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSegment('r')}
                  className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedSegment === 'r' ? 'border-purple-400 bg-purple-50/80 ring-1 ring-purple-400/20' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-[10px] font-bold text-slate-700">R (성과)</span>
                  </div>
                  <div className="flex justify-between pl-3 mt-0.5">
                    <span className="font-mono font-bold text-purple-700">{result.percentage}%</span>
                    <span className="text-[9px] text-slate-400">20%</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Gauge Bars */
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between font-mono">
                <span className="text-slate-600">S (상황) {situation.percentage}%</span>
                <span className="text-slate-600">T (과제) {task.percentage}%</span>
                <span className="text-emerald-700 font-bold">★ A (행동) {action.percentage}%</span>
                <span className="text-slate-600">R (성과) {result.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden">
                <div className="bg-blue-400 h-full" style={{ width: `${Math.max(2, situation.percentage)}%` }} />
                <div className="bg-amber-400 h-full" style={{ width: `${Math.max(2, task.percentage)}%` }} />
                <div className="bg-emerald-500 h-full" style={{ width: `${Math.max(2, action.percentage)}%` }} />
                <div className="bg-purple-400 h-full" style={{ width: `${Math.max(2, result.percentage)}%` }} />
              </div>
            </div>
          )}

          {/* Selected Advice */}
          <div className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${activeSegmentData.bg}`}>
            <span className={`font-bold block mb-0.5 ${activeSegmentData.color}`}>
              {activeSegmentData.label} 진단
            </span>
            <p className="text-slate-700">{activeSegmentData.desc}</p>
          </div>
        </div>
      )}

      {/* Tab 2: Readability & Sentences */}
      {activeTab === 'readability' && (
        <div className="p-4 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">
              평균 문장 <strong className="font-mono text-slate-900">{averageLength}자</strong> · 만연체 {tooLongCount}개
            </span>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              총 {totalSentences}개 문장
            </span>
          </div>

          {topRecommendations.length > 0 && (
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] leading-relaxed text-slate-700 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>{topRecommendations[0]}</span>
            </div>
          )}

          {/* Sentence Split Suggestions */}
          {isReadabilityExpanded && (
            <div className="pt-1 space-y-2 max-h-[220px] overflow-y-auto">
              {problematicSentences.length === 0 ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>만연체 문장이 없으며 문장 호흡이 안정적입니다.</span>
                </div>
              ) : (
                problematicSentences.map((sent) => (
                  <div
                    key={sent.id}
                    onClick={() => {
                      setSelectedSentenceId(selectedSentenceId === sent.id ? null : sent.id);
                      if (onHighlightSentence) onHighlightSentence(sent.originalText);
                    }}
                    className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/40 text-[11px] space-y-1.5 cursor-pointer hover:bg-rose-50/70 transition-all"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-rose-800">문장 길이 {sent.charCount}자 (분할 권장)</span>
                      <Scissors className="w-3 h-3 text-rose-500" />
                    </div>
                    <p className="text-slate-700 italic truncate">&ldquo;{sent.originalText}&rdquo;</p>

                    {selectedSentenceId === sent.id && sent.suggestion?.splitPreview && (
                      <div className="pt-2 border-t border-rose-200/60 space-y-1.5">
                        <div className="space-y-1 pl-2 border-l-2 border-indigo-500 text-slate-800">
                          {sent.suggestion.splitPreview.map((part, pIdx) => (
                            <p key={pIdx}>
                              <span className="font-bold text-indigo-600 mr-1">{pIdx + 1}.</span>
                              {part}
                            </p>
                          ))}
                        </div>
                        {onApplySplit && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApplySplit(sent.originalText, sent.suggestion!.splitPreview!);
                            }}
                            className="w-full mt-1 py-1 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>이 문장 분할 적용하기</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
