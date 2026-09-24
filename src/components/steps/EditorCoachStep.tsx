import { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Check,
  ShieldCheck,
  Eye,
  Edit2,
  RefreshCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { JobInfo, FeedbackItem } from '../../types';
import { AISettings } from '../../types/aiSettings';
import { TextScaleSettings } from '../../types/textScale';
import { EditorTopBar } from '../common/EditorTopBar';
import { CoachInsightTabs } from '../common/CoachInsightTabs';
import { AIDetectorModal } from '../common/AIDetectorModal';
import { analyzeStarStructure } from '../../utils/starAnalysis';
import { analyzeReadability } from '../../utils/readabilityAnalysis';
import { requestAiCoaching } from '../../services/geminiService';

interface Props {
  jobInfo: JobInfo;
  draftText: string;
  feedbackItems: FeedbackItem[];
  aiSettings?: AISettings;
  textScaleSettings?: TextScaleSettings;
  onUpdateDraftText: (text: string) => void;
  onUpdateJobInfo?: (info: JobInfo) => void;
  onNext: () => void;
  onQuickSave?: () => void;
  onOpenSaveLoadModal?: () => void;
}

export const EditorCoachStep: React.FC<Props> = ({
  jobInfo,
  draftText,
  feedbackItems: initialFeedbacks,
  aiSettings,
  textScaleSettings,
  onUpdateDraftText,
  onUpdateJobInfo,
  onNext,
  onQuickSave,
  onOpenSaveLoadModal
}) => {
  const [currentFeedbacks, setCurrentFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string>(
    initialFeedbacks[0]?.id || 'fb-3'
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [editorMode, setEditorMode] = useState<'interactive' | 'raw'>('interactive');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isDetectorOpen, setIsDetectorOpen] = useState(false);

  // Real-time STAR Structure Analysis
  const starData = useMemo(() => analyzeStarStructure(draftText), [draftText]);

  // Real-time Readability & Complexity Analysis
  const readabilityMetrics = useMemo(() => analyzeReadability(draftText), [draftText]);

  // Local or Inherited Editor Typography
  const [localFontSize, setLocalFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | null>(null);
  const activeEditorFontSize = localFontSize || textScaleSettings?.editorFontSize || 'base';

  // Dynamic Typography Classes for Editor Content
  const editorFontSizeClass =
    activeEditorFontSize === 'sm'
      ? 'text-sm'
      : activeEditorFontSize === 'lg'
      ? 'text-lg'
      : activeEditorFontSize === 'xl'
      ? 'text-xl'
      : 'text-base';

  const editorLineHeightClass =
    textScaleSettings?.lineHeight === 'normal'
      ? 'leading-normal'
      : textScaleSettings?.lineHeight === 'loose'
      ? 'leading-loose'
      : 'leading-relaxed';

  const fontSizesOrder: Array<'sm' | 'base' | 'lg' | 'xl'> = ['sm', 'base', 'lg', 'xl'];
  const handleZoomOut = () => {
    const curIdx = fontSizesOrder.indexOf(activeEditorFontSize);
    if (curIdx > 0) setLocalFontSize(fontSizesOrder[curIdx - 1]);
  };
  const handleZoomIn = () => {
    const curIdx = fontSizesOrder.indexOf(activeEditorFontSize);
    if (curIdx < fontSizesOrder.length - 1) setLocalFontSize(fontSizesOrder[curIdx + 1]);
  };

  const handleApplySplit = (originalSentence: string, splitSentences: string[]) => {
    const combined = splitSentences.join(' ');
    const updated = draftText.replace(originalSentence, combined);
    onUpdateDraftText(updated);
  };

  // Counts of each category
  const typoCount = currentFeedbacks.filter((f) => f.type === 'typo').length;
  const detailCount = currentFeedbacks.filter((f) => f.type === 'detail').length;
  const jobCount = currentFeedbacks.filter((f) => f.type === 'job').length;
  const starCount = currentFeedbacks.filter((f) => f.type === 'star').length;

  const filteredFeedbacks = currentFeedbacks.filter((item) => {
    if (activeCategoryFilter === 'all') return true;
    return item.type === activeCategoryFilter;
  });

  const selectedFeedback =
    currentFeedbacks.find((f) => f.id === selectedFeedbackId) || currentFeedbacks[0];

  const handleSelectFeedback = (id: string) => {
    setSelectedFeedbackId(id);
  };

  const handleResolveFeedback = (id: string) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handlePostponeFeedback = (id: string) => {
    const currentIndex = currentFeedbacks.findIndex((f) => f.id === id);
    const nextItem = currentFeedbacks[(currentIndex + 1) % currentFeedbacks.length];
    if (nextItem) {
      setSelectedFeedbackId(nextItem.id);
    }
  };

  const handleApplySpellCheck = (original: string, fixed: string) => {
    const updated = draftText.replace(original, fixed);
    onUpdateDraftText(updated);
    if (selectedFeedback) {
      handleResolveFeedback(selectedFeedback.id);
    }
  };

  // Real Gemini API Calling for real-time coach feedback (Browser-side BYOK)
  const handleRequestAiCoaching = async () => {
    if (!aiSettings?.apiKey || aiSettings.apiKey.trim().length === 0) {
      setAiError('Gemini API 키가 설정되지 않았습니다. 상단 헤더의 [AI 환경설정]에서 본인의 API Key를 입력하시면 실시간 맞춤 코칭을 받으실 수 있습니다.');
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
      const data = await requestAiCoaching({
        draftText,
        jobInfo,
        coachingStrictness: aiSettings?.coachingStrictness || 'balanced',
        temperature: aiSettings?.temperature || 0.7,
        maxOutputTokens: aiSettings?.maxOutputTokens || 2048,
        model: aiSettings?.model || 'gemini-flash-latest',
        apiKey: aiSettings.apiKey
      });

      if (data.feedbacks && Array.isArray(data.feedbacks) && data.feedbacks.length > 0) {
        setCurrentFeedbacks(data.feedbacks);
        setSelectedFeedbackId(data.feedbacks[0].id);
      }
    } catch (err: any) {
      const safeMsg = (err?.message || 'AI 코칭 호출 중 오류가 발생했습니다.').replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=***');
      setAiError(safeMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-5">
      {/* Top Banner & Job Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-600">STEP 05</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">
              자기소개서 직접 편집 & AI 코치
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            스마트 자기소개서 에디터 & 실시간 코치
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* AI Detector Button */}
          <button
            type="button"
            onClick={() => setIsDetectorOpen(true)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI 대필 감지 안전 검사</span>
          </button>

          {/* Real Gemini Coaching Refresh Button */}
          <button
            type="button"
            onClick={handleRequestAiCoaching}
            disabled={isAiLoading}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="현재 작성된 글을 바탕으로 실제 Gemini AI 코칭 피드백 갱신"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Gemini 분석 중...' : '실시간 AI 코칭 갱신'}</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>최종 점검으로 이동</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {aiError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{aiError}</span>
          </span>
          <button
            type="button"
            onClick={() => setAiError(null)}
            className="text-amber-600 hover:text-amber-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Split Layout: Left 65% & Right 35% */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: 자기소개서 편집기 (컴팩트 상단바 + 고효율 에디터) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Integrated Clean Top Bar (Company + Role + Char Count & Byte Expander) */}
          <EditorTopBar
            jobInfo={jobInfo}
            draftText={draftText}
            onUpdateLimit={(newLimit) => {
              if (onUpdateJobInfo) {
                onUpdateJobInfo({ ...jobInfo, charLimit: newLimit });
              }
            }}
            onQuickSave={onQuickSave}
            onOpenSaveLoadModal={onOpenSaveLoadModal}
          />

          {/* Editor Container */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col min-h-[500px]">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">본문 에디터</span>
                <span className="text-[11px] text-slate-400">
                  (우측 피드백을 참고하여 직접 수정하세요)
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Font Size Quick Adjuster */}
                <div className="flex items-center gap-1 bg-slate-200/60 p-0.5 rounded-lg text-slate-600">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={activeEditorFontSize === 'sm'}
                    className="p-1 rounded hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                    title="글씨 축소 (Ctrl -)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold px-1 text-slate-700 min-w-[28px] text-center">
                    {activeEditorFontSize === 'sm' ? '14px' : activeEditorFontSize === 'base' ? '16px' : activeEditorFontSize === 'lg' ? '18px' : '20px'}
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={activeEditorFontSize === 'xl'}
                    className="p-1 rounded hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                    title="글씨 확대 (Ctrl +)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEditorMode('interactive')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      editorMode === 'interactive'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>문장별 가이드 뷰</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('raw')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      editorMode === 'raw'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>자유 텍스트 편집</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mode 1: Interactive Sentence-Annotated Editor */}
            {editorMode === 'interactive' ? (
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className={`${editorFontSizeClass} ${editorLineHeightClass} text-slate-800 whitespace-pre-wrap font-sans transition-all`}>
                  {draftText.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="mb-4">
                      {paragraph.split(/(?<=[.?!])\s+/).map((sentence, sIdx) => {
                        const trimmed = sentence.trim();
                        if (!trimmed) return null;

                        const matchingFeedback = currentFeedbacks.find(
                          (fb) =>
                            trimmed.includes(fb.targetExcerpt) ||
                            fb.targetExcerpt.includes(trimmed)
                        );

                        const isSelected =
                          matchingFeedback && matchingFeedback.id === selectedFeedbackId;
                        const isResolved =
                          matchingFeedback && resolvedIds.has(matchingFeedback.id);

                        let highlightClass = 'hover:bg-slate-100 transition-colors';
                        if (matchingFeedback && !isResolved) {
                          if (matchingFeedback.type === 'typo') {
                            highlightClass = isSelected
                              ? 'bg-red-100 border-b-2 border-red-500 font-medium'
                              : 'bg-red-50/70 border-b border-red-300';
                          } else if (matchingFeedback.type === 'detail') {
                            highlightClass = isSelected
                              ? 'bg-amber-100 border-b-2 border-amber-500 font-medium'
                              : 'bg-amber-50/70 border-b border-amber-300';
                          } else if (matchingFeedback.type === 'job') {
                            highlightClass = isSelected
                              ? 'bg-blue-100 border-b-2 border-blue-500 font-medium'
                              : 'bg-blue-50/70 border-b border-blue-300';
                          } else if (matchingFeedback.type === 'star') {
                            highlightClass = isSelected
                              ? 'bg-purple-100 border-b-2 border-purple-500 font-medium'
                              : 'bg-purple-50/70 border-b border-purple-300';
                          } else if (matchingFeedback.type === 'reduce') {
                            highlightClass = isSelected
                              ? 'bg-slate-200 border-b-2 border-slate-500 line-through text-slate-500'
                              : 'bg-slate-100 border-b border-slate-300 text-slate-500';
                          }
                        }

                        return (
                          <span
                            key={sIdx}
                            onClick={() => {
                              if (matchingFeedback) {
                                setSelectedFeedbackId(matchingFeedback.id);
                              }
                            }}
                            className={`inline cursor-pointer px-1 py-0.5 rounded ${highlightClass} mr-1`}
                            title={
                              matchingFeedback
                                ? `[${matchingFeedback.title}] 클릭하여 우측 코칭 확인`
                                : undefined
                            }
                          >
                            {sentence}{' '}
                          </span>
                        );
                      })}
                    </p>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>💡 색칠된 문장을 클릭하면 우측 코칭 패널에서 상세 질문을 확인합니다.</span>
                  <button
                    type="button"
                    onClick={() => setEditorMode('raw')}
                    className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
                  >
                    글 직접 수정하기 (자유 편집 모드)
                  </button>
                </div>
              </div>
            ) : (
              /* Mode 2: Raw Direct Textarea Editor */
              <div className="p-4 flex-1 flex flex-col">
                <textarea
                  value={draftText}
                  onChange={(e) => onUpdateDraftText(e.target.value)}
                  className={`w-full flex-1 min-h-[380px] ${editorFontSizeClass} ${editorLineHeightClass} text-slate-800 border-0 focus:ring-0 p-2 font-sans resize-y focus:outline-none transition-all`}
                  placeholder="자기소개서 본문을 입력하세요..."
                />
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    타이핑 시 글자수와 STAR 분석이 실시간 반영됩니다.
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditorMode('interactive')}
                    className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
                  >
                    문장별 가이드 뷰로 돌아가기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: AI 코칭 피드백 패널 (~35%) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Coaching Card Container */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
            {/* Unified STAR Structure & Readability Tabs */}
            <CoachInsightTabs
              starData={starData}
              readabilityMetrics={readabilityMetrics}
              onApplySplit={handleApplySplit}
              onHighlightSentence={(sentence) => {
                const matched = currentFeedbacks.find(
                  (fb) => fb.targetExcerpt.includes(sentence) || sentence.includes(fb.targetExcerpt)
                );
                if (matched) {
                  setSelectedFeedbackId(matched.id);
                }
              }}
            />

            {/* Panel Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    AI 코칭 피드백 ({filteredFeedbacks.length})
                  </h3>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {resolvedIds.size} / {currentFeedbacks.length} 해결됨
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  전체 ({currentFeedbacks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('detail')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeCategoryFilter === 'detail'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  구체화 ({detailCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('job')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeCategoryFilter === 'job'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  직무연결 ({jobCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('star')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeCategoryFilter === 'star'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  STAR ({starCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('typo')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeCategoryFilter === 'typo'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
                  }`}
                >
                  맞춤법 ({typoCount})
                </button>
              </div>
            </div>

            {/* List of Feedback Cards */}
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {filteredFeedbacks.map((fb) => {
                const isSelected = fb.id === selectedFeedbackId;
                const isResolved = resolvedIds.has(fb.id);

                return (
                  <div
                    key={fb.id}
                    onClick={() => handleSelectFeedback(fb.id)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/60 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50'
                    } ${isResolved ? 'opacity-50' : ''}`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            fb.type === 'typo'
                              ? 'bg-red-100 text-red-700'
                              : fb.type === 'detail'
                              ? 'bg-amber-100 text-amber-800'
                              : fb.type === 'job'
                              ? 'bg-blue-100 text-blue-700'
                              : fb.type === 'star'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {fb.type}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {fb.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        &ldquo;{fb.targetExcerpt}&rdquo;
                      </p>
                    </div>

                    {isResolved && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Feedback Detail & Guiding Questions */}
            {selectedFeedback && (
              <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">
                      선택된 코칭 상세 가이드
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ID: {selectedFeedback.id}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {selectedFeedback.title}
                  </h4>
                </div>

                {/* Target Excerpt Quote */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 italic border-l-3 border-l-indigo-500">
                  &ldquo;{selectedFeedback.targetExcerpt}&rdquo;
                </div>

                {/* Explanation */}
                <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                  <span className="font-bold text-slate-800 block">💡 코칭 사유:</span>
                  <p>{selectedFeedback.explanation}</p>
                </div>

                {/* Typo Auto-replace if applicable */}
                {selectedFeedback.type === 'typo' && selectedFeedback.replacementCandidate && (
                  <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg space-y-2">
                    <span className="text-[11px] font-bold text-red-800 block">
                      맞춤법 권장 교정:
                    </span>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono line-through text-slate-400">
                        {selectedFeedback.targetExcerpt}
                      </span>
                      <span>→</span>
                      <span className="font-mono font-bold text-red-700">
                        {selectedFeedback.replacementCandidate}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplySpellCheck(
                          selectedFeedback.targetExcerpt,
                          selectedFeedback.replacementCandidate!
                        )
                      }
                      className="w-full mt-2 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-2xs transition-colors cursor-pointer"
                    >
                      이 교정 즉시 적용하기
                    </button>
                  </div>
                )}

                {/* Guiding Questions (The 핵심 of coaching over ghostwriting) */}
                {selectedFeedback.guidingQuestions &&
                  selectedFeedback.guidingQuestions.length > 0 && (
                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-lg space-y-2">
                      <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                        <span>생각을 구체화하는 코칭 질문:</span>
                      </span>
                      <ul className="space-y-1.5 text-xs text-indigo-950">
                        {selectedFeedback.guidingQuestions.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-indigo-500 font-bold shrink-0">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Direction Candidate Hint */}
                {selectedFeedback.replacementCandidate && selectedFeedback.type !== 'typo' && (
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>작성 방향 가이드 힌트 (대필 아님):</span>
                    </span>
                    <p className="text-emerald-950 text-[11px] leading-relaxed">
                      &ldquo;{selectedFeedback.replacementCandidate}&rdquo;
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleResolveFeedback(selectedFeedback.id)}
                    className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>해결 완료 처리</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePostponeFeedback(selectedFeedback.id)}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    다음 피드백
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Detector Modal */}
      <AIDetectorModal
        isOpen={isDetectorOpen}
        onClose={() => setIsDetectorOpen(false)}
        draftText={draftText}
        jobInfo={jobInfo}
        aiSettings={aiSettings}
      />
    </div>
  );
};
