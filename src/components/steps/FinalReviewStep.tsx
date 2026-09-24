import { useState } from 'react';
import {
  Check,
  AlertTriangle,
  Copy,
  Printer,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  FileText,
  Download,
  FileCode,
  File
} from 'lucide-react';
import { JobInfo, FinalCheckItem } from '../../types';
import { AISettings } from '../../types/aiSettings';
import { TextScaleSettings } from '../../types/textScale';
import { MOCK_FINAL_CHECKLIST, MOCK_COMPETENCY_MAPPING } from '../../data/mockData';
import { exportAsMarkdown, exportAsWordDoc, printOrSavePdf } from '../../utils/exportDocs';
import { calculateTextMetrics } from '../../utils/textMetrics';
import { AIDetectorModal } from '../common/AIDetectorModal';

interface Props {
  jobInfo: JobInfo;
  draftText: string;
  aiSettings?: AISettings;
  textScaleSettings?: TextScaleSettings;
  onBackToEdit: () => void;
  onResetAll: () => void;
}

export const FinalReviewStep: React.FC<Props> = ({
  jobInfo,
  draftText,
  aiSettings,
  textScaleSettings,
  onBackToEdit,
  onResetAll
}) => {
  const [copied, setCopied] = useState(false);
  const [checklist] = useState<FinalCheckItem[]>(MOCK_FINAL_CHECKLIST);
  const [isDetectorOpen, setIsDetectorOpen] = useState(false);

  const metrics = calculateTextMetrics(draftText);

  const handleCopyText = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    exportAsMarkdown({
      company: jobInfo.company,
      role: jobInfo.role,
      question: jobInfo.question,
      charLimit: jobInfo.charLimit,
      draftText,
      charCount: metrics.charWithSpaces
    });
  };

  const handleExportWord = () => {
    exportAsWordDoc({
      company: jobInfo.company,
      role: jobInfo.role,
      question: jobInfo.question,
      charLimit: jobInfo.charLimit,
      draftText,
      charCount: metrics.charWithSpaces
    });
  };

  const handlePrint = () => {
    printOrSavePdf();
  };

  const passedCount = checklist.filter((item) => item.status === 'passed').length;
  const warningCount = checklist.filter((item) => item.status === 'warning').length;

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-blue-600 block mb-1">STEP 06</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            최종 점검, 내보내기 & AI 안전 검사
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            원클릭 PDF / Word / Markdown 내보내기와 기업 채용 서류 통과용 AI 대필 검사를 제공합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* AI Detector Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsDetectorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI 대필 감지 안전 검사</span>
          </button>

          <button
            type="button"
            onClick={onBackToEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>편집기로 돌아가기</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>완성본 복사하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Export Action Bar (Word, PDF, Markdown, Copy) */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Download className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900 text-sm">
              원클릭 서식 내보내기 & 제출 준비
            </span>
          </div>
          <p className="text-xs text-slate-600">
            공백 포함 {metrics.charWithSpaces}자 ({metrics.bytesEucKr} Byte) · 채용공고 제출 규격에 맞게 저장하세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Word .doc */}
          <button
            type="button"
            onClick={handleExportWord}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Microsoft Word (.doc) 파일로 다운로드"
          >
            <File className="w-3.5 h-3.5 text-blue-600" />
            <span>Word (.doc) 다운</span>
          </button>

          {/* PDF / Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="인쇄 및 PDF 파일로 저장"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span>PDF 저장 / 인쇄</span>
          </button>

          {/* Markdown .md */}
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="마크다운 (.md) 서식으로 다운로드"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-600" />
            <span>Markdown (.md)</span>
          </button>
        </div>
      </div>

      {/* Honest Assessment Notice */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">
              정직한 자가 점검 (Checklist-First)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            채용 평가자의 합격 기준은 회사의 니즈와 경쟁률에 따라 달라집니다. <br className="hidden sm:inline" />
            근거 없는 &lsquo;합격률 92%&rsquo; 같은 인위적 점수 대신, 객관적 체크리스트를 확인합니다.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center px-3 py-1 bg-white/10 rounded-lg">
            <span className="block text-[10px] text-slate-400">통과 항목</span>
            <span className="text-base font-bold text-emerald-400">{passedCount}개</span>
          </div>
          <div className="text-center px-3 py-1 bg-white/10 rounded-lg">
            <span className="block text-[10px] text-slate-400">주의 필요</span>
            <span className="text-base font-bold text-amber-400">{warningCount}개</span>
          </div>
        </div>
      </div>

      {/* Section 1: 최종 체크리스트 */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>제출 전 6대 핵심 체크리스트</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.status === 'passed'
                  ? 'bg-white border-slate-200'
                  : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.status === 'passed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{item.summary}</p>
                </div>
                {item.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{item.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: 직무 역량 반영 매핑표 */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          채용공고 요구 역량 매핑 결과
        </h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">요구 핵심 역량</th>
                <th className="py-3 px-4">공고 중요도</th>
                <th className="py-3 px-4">매칭된 내 프로젝트/경험</th>
                <th className="py-3 px-4">자기소개서 반영 위치</th>
                <th className="py-3 px-4 text-center">반영 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_COMPETENCY_MAPPING.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {row.competency}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {row.importance}
                  </td>
                  <td className="py-3 px-4 text-blue-700 font-medium">
                    {row.matchedExperience}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {row.reflectionStatus}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        row.statusBadge === '반영 완료'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.statusBadge === '적정 반영'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {row.statusBadge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: 최종 작성된 자기소개서 프리뷰 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              최종 검토용 자기소개서 전문
            </h3>
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums">
            공백포함 <strong className="text-slate-800">{metrics.charWithSpaces}</strong>자 / {jobInfo.charLimit}자 · EUC-KR <strong className="text-indigo-700">{metrics.bytesEucKr}</strong> Byte
          </div>
        </div>

        <div
          className={`bg-slate-50/70 border border-slate-200 rounded-lg p-5 ${
            textScaleSettings?.editorFontSize === 'sm'
              ? 'text-sm'
              : textScaleSettings?.editorFontSize === 'lg'
              ? 'text-lg'
              : textScaleSettings?.editorFontSize === 'xl'
              ? 'text-xl'
              : 'text-base'
          } ${
            textScaleSettings?.lineHeight === 'normal'
              ? 'leading-normal'
              : textScaleSettings?.lineHeight === 'loose'
              ? 'leading-loose'
              : 'leading-relaxed'
          } text-slate-800 font-sans whitespace-pre-line transition-all`}
        >
          {draftText}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            최종 제출 전 맞춤법과 본인의 진솔한 경험이 잘 표현되었는지 다시 한 번 정독하세요.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄 / PDF 저장</span>
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>본문 복사</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onResetAll}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>새로운 자기소개서 분석 시작하기</span>
        </button>

        <button
          type="button"
          onClick={onBackToEdit}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          추가 수정하러 에디터로 돌아가기
        </button>
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
