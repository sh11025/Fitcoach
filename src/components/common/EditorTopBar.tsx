import React, { useState } from 'react';
import { calculateTextMetrics, TextMetrics } from '../../utils/textMetrics';
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Save,
  FolderOpen
} from 'lucide-react';
import { JobInfo } from '../../types';

interface Props {
  jobInfo: JobInfo;
  draftText: string;
  onUpdateLimit?: (newLimit: number) => void;
  onQuickSave?: () => void;
  onOpenSaveLoadModal?: () => void;
}

export const EditorTopBar: React.FC<Props> = ({
  jobInfo,
  draftText,
  onUpdateLimit,
  onQuickSave,
  onOpenSaveLoadModal
}) => {
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false);
  const metrics: TextMetrics = calculateTextMetrics(draftText);
  const charLimit = jobInfo.charLimit || 1000;
  const isOverChar = metrics.charWithSpaces > charLimit;
  const isOptimalChar = metrics.charWithSpaces >= charLimit * 0.85 && !isOverChar;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Primary Bar: Company + Role + Question + Char Count summary */}
      <div className="p-3.5 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{jobInfo.company}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">{jobInfo.role}</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5" title={jobInfo.question}>
              {jobInfo.question}
            </p>
          </div>
        </div>

        {/* Right side: Real-time Count & Metric Expand Button */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          {/* Main Progress Indicator */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="font-mono text-xs tabular-nums">
                <span className={`font-bold ${isOverChar ? 'text-rose-600' : 'text-slate-900'}`}>
                  {metrics.charWithSpaces.toLocaleString()}
                </span>
                <span className="text-slate-400"> / {charLimit.toLocaleString()}자</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                EUC-KR <strong className="text-indigo-600">{metrics.bytesEucKr.toLocaleString()}</strong> B
              </div>
            </div>

            <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden shrink-0">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverChar ? 'bg-rose-500' : isOptimalChar ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(100, (metrics.charWithSpaces / charLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Quick Save Action Button */}
          {onQuickSave && (
            <button
              type="button"
              onClick={onQuickSave}
              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="현재 작성 내용 로컬 즉시 저장 (단축키: Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5 text-emerald-600" />
              <span>로컬 저장</span>
            </button>
          )}

          {onOpenSaveLoadModal && (
            <button
              type="button"
              onClick={onOpenSaveLoadModal}
              className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="저장된 작업본 목록 및 불러오기"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">불러오기</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
            className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="글자수 및 바이트 상세 보기"
          >
            <span>상세 바이트</span>
            {isMetricsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Detailed Metrics Drawer */}
      {isMetricsExpanded && (
        <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 block">공백 포함</span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {metrics.charWithSpaces.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">자</span>
              </span>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 block">공백 제외</span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {metrics.charWithoutSpaces.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">자</span>
              </span>
            </div>

            <div className="p-2 rounded-lg bg-indigo-50/50 border border-indigo-100">
              <span className="text-[10px] text-indigo-700 font-semibold block">EUC-KR (대기업 포털)</span>
              <span className="font-mono font-bold text-indigo-900 text-sm">
                {metrics.bytesEucKr.toLocaleString()} <span className="text-[10px] font-normal text-indigo-400">Byte</span>
              </span>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between px-2.5">
              <span className="text-[10px] text-slate-500">제한 글자수:</span>
              <input
                type="number"
                value={charLimit}
                onChange={(e) => onUpdateLimit && onUpdateLimit(parseInt(e.target.value) || 1000)}
                className="w-16 px-1 py-0.5 text-xs text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">자</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
