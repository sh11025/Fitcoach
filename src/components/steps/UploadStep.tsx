import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Link2, Sparkles, ArrowRight, Building2, Briefcase, Trash2 } from 'lucide-react';
import { JobInfo } from '../../types';

interface Props {
  jobInfo: JobInfo;
  draftText: string;
  onUpdateJobInfo: (info: JobInfo) => void;
  onUpdateDraftText: (text: string) => void;
  onNext: () => void;
  onLoadSample: () => void;
}

export const UploadStep: React.FC<Props> = ({
  jobInfo,
  draftText,
  onUpdateJobInfo,
  onUpdateDraftText,
  onNext,
  onLoadSample
}) => {
  // Resume upload state
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string; uploadedAt: string } | null>({
    name: '김지원_이력서_백엔드_2026.pdf',
    size: '1.2 MB',
    uploadedAt: '방금 전 완료'
  });
  const [isDragging, setIsDragging] = useState(false);

  // Cover letter input mode: 'paste' | 'file'
  const [coverLetterMode, setCoverLetterMode] = useState<'paste' | 'file'>('paste');

  // URL loading mock state
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const handleSimulateResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setResumeFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: '방금 전 업로드됨'
      });
    }
  };

  const handleFetchJobPosting = () => {
    setIsUrlLoading(true);
    setTimeout(() => {
      setIsUrlLoading(false);
      onUpdateJobInfo({
        ...jobInfo,
        company: 'ABC Tech',
        role: 'Backend Developer (백엔드 개발자)',
        url: jobInfo.url || 'https://careers.abctech.example.com/jobs/backend-2026'
      });
    }, 700);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-blue-600 block mb-1">STEP 02</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            자료 등록
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            분석에 필요한 이력서, 기존 자기소개서, 지원하려는 채용공고를 입력해주세요.
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadSample}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>샘플 자료 채우기</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Section 1: 이력서 업로드 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>1. 내 이력서 등록</span>
            </label>
            <span className="text-xs text-slate-400">지원 형식: PDF, DOCX</span>
          </div>

          {!resumeFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleSimulateResumeDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700 mb-1">
                이력서 파일을 드래그하여 놓거나 클릭하여 업로드
              </p>
              <p className="text-[11px] text-slate-400">
                PDF 또는 Word 파일 (최대 20MB)
              </p>
              <button
                type="button"
                onClick={() =>
                  setResumeFile({
                    name: '김지원_이력서_백엔드_2026.pdf',
                    size: '1.2 MB',
                    uploadedAt: '업로드 완료'
                  })
                }
                className="mt-3 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                샘플 이력서 선택
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{resumeFile.name}</span>
                    <span className="inline-flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" />
                      {resumeFile.uploadedAt}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{resumeFile.size}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveResume}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                title="파일 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Section 2: 채용공고 정보 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>2. 지원 채용공고 정보</span>
            </label>
            <span className="text-xs text-slate-400">URL 링크 또는 직접 입력</span>
          </div>

          {/* URL Input & Fetch Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-slate-400" />
              <span>채용공고 URL</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={jobInfo.url}
                onChange={(e) => onUpdateJobInfo({ ...jobInfo, url: e.target.value })}
                placeholder="https://careers.company.com/job/12345"
                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-white"
              />
              <button
                type="button"
                onClick={handleFetchJobPosting}
                disabled={isUrlLoading}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {isUrlLoading ? '공고 분석 중...' : '채용공고 불러오기'}
              </button>
            </div>
          </div>

          {/* Company & Role Inputs */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>지원 회사</span>
              </label>
              <input
                type="text"
                value={jobInfo.company}
                onChange={(e) => onUpdateJobInfo({ ...jobInfo, company: e.target.value })}
                placeholder="예: ABC Tech, 카카오, 토스 등"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>지원 직무</span>
              </label>
              <input
                type="text"
                value={jobInfo.role}
                onChange={(e) => onUpdateJobInfo({ ...jobInfo, role: e.target.value })}
                placeholder="예: Backend Developer (백엔드 개발자)"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: 기존 자기소개서 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>3. 기존 자기소개서 초안</span>
            </label>

            {/* Toggle Mode */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setCoverLetterMode('paste')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  coverLetterMode === 'paste'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                직접 붙여넣기
              </button>
              <button
                type="button"
                onClick={() => setCoverLetterMode('file')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  coverLetterMode === 'file'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                파일 업로드
              </button>
            </div>
          </div>

          {coverLetterMode === 'paste' ? (
            <div className="space-y-1.5">
              <textarea
                value={draftText}
                onChange={(e) => onUpdateDraftText(e.target.value)}
                rows={8}
                placeholder="작성해둔 자기소개서 문단을 붙여넣으세요..."
                className="w-full p-3.5 text-xs text-slate-800 leading-relaxed border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 bg-slate-50/30 font-sans"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>현재 문항: &ldquo;{jobInfo.question}&rdquo;</span>
                <span className="font-mono tabular-nums">
                  글자 수: <strong className="text-slate-700">{draftText.length}</strong> / {jobInfo.charLimit}자
                </span>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700 mb-1">
                기존 자기소개서 파일을 첨부하세요
              </p>
              <p className="text-[11px] text-slate-400 mb-3">
                TXT, DOCX, HWP 지원
              </p>
              <button
                type="button"
                onClick={() => setCoverLetterMode('paste')}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                붙여넣기 모드로 전환
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          💡 입력한 데이터는 채용공고와의 매칭 분석에만 활용되며 안전하게 처리됩니다.
        </p>
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>AI 분석 시작</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
