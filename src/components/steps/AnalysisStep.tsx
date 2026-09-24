import React, { useState, useEffect } from 'react';
import { Check, Loader2, ArrowRight, Building2, Briefcase, FileSearch, Sparkles, CheckCircle2 } from 'lucide-react';
import { JobInfo } from '../../types';
import { KeywordChip } from '../common/KeywordChip';

interface Props {
  jobInfo: JobInfo;
  onNext: () => void;
}

const ANALYSIS_PIPELINE_STEPS = [
  { id: 1, label: '채용공고 확인', desc: 'ABC Tech 백엔드 포지션 공고 원문 수신' },
  { id: 2, label: '핵심 역량 분석', desc: '자격요건 및 우대사항에서 필수 기술 스택과 태도 추출' },
  { id: 3, label: '이력서 분석', desc: '후보자의 주요 프로젝트 경험 및 기여 역할 구조화' },
  { id: 4, label: '자기소개서 분석', desc: '기존 작성 초안의 문단별 주제 및 STAR 구조 검증' },
  { id: 5, label: '경험과 직무 연결', desc: '채용공고 핵심 역량과 지원자 프로젝트 간의 적합도 매핑' }
];

export const AnalysisStep: React.FC<Props> = ({ jobInfo, onNext }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (currentStepIndex < ANALYSIS_PIPELINE_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true);
    }
  }, [currentStepIndex]);

  const handleSkipAnimation = () => {
    setCurrentStepIndex(ANALYSIS_PIPELINE_STEPS.length);
    setIsCompleted(true);
  };

  return (
    <div className="w-full py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* Progressing state */}
      {!isCompleted ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-xs text-center max-w-xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              자료를 심층 분석하고 있습니다
            </h3>
            <p className="text-xs text-slate-500">
              채용공고의 요구조건과 지원자의 경험을 교차 비교하여 코칭 포인트를 도출합니다.
            </p>
          </div>

          {/* Sequential Checklist */}
          <div className="space-y-3 text-left max-w-sm mx-auto">
            {ANALYSIS_PIPELINE_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                    isDone
                      ? 'text-slate-800'
                      : isCurrent
                      ? 'text-blue-900 bg-blue-50/70 font-semibold'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isDone ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-slate-200 text-slate-300 flex items-center justify-center text-[10px]">
                        {step.id}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-medium">{step.label}</div>
                    <div className="text-[11px] text-slate-500 font-normal leading-tight">
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <button
              type="button"
              onClick={handleSkipAnimation}
              className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              대기 없이 바로 결과 보기
            </button>
          </div>
        </div>
      ) : (
        /* Completed Analysis Results View */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>채용공고 핵심 역량 분석 및 교차 매칭 준비가 완료되었습니다.</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs">
              분석 완료
            </span>
          </div>

          {/* Job Overview Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    지원 기업 & 직무
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {jobInfo.company}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{jobInfo.role}</span>
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 self-start sm:self-auto">
                <span className="block text-[11px] text-slate-400 mb-0.5">공고 평가 중점</span>
                <span className="font-semibold text-slate-800">
                  트러블슈팅 역량 및 API 성능 최적화
                </span>
              </div>
            </div>

            {/* AI Extracted Key Competencies */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>채용공고에서 발견한 핵심 요구 역량</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  총 {jobInfo.keyCompetencies.length}개 키워드 도출
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {jobInfo.keyCompetencies.map((comp) => (
                  <KeywordChip key={comp} keyword={comp} variant="accent" />
                ))}
              </div>
            </div>

            {/* AI Evaluation Criteria Summary */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-2">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileSearch className="w-4 h-4 text-slate-500" />
                <span>채용공고 요구사항 요약 및 코칭 기준</span>
              </h5>
              <p className="text-slate-600 leading-relaxed text-xs">
                ABC Tech의 이번 백엔드 포지션은 <strong>&apos;Java/Spring 기반 대용량 트래픽 처리&apos;</strong>와 <strong>&apos;API 성능 병목 진단 및 개선&apos;</strong>을 가장 중요한 합격 요건으로 제시하고 있습니다. 단순 협업이나 이론 스터디보다는, 실제 쿼리 튜닝이나 캐싱 아키텍처를 도입해 문제를 해결했던 경험이 최우선 평가 대상이 됩니다.
              </p>
            </div>
          </div>

          {/* Action to Next Step */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              다음 단계에서 내 경험 중 무엇을 강조하고 축소할지 구체적 이유를 확인합니다.
            </div>
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>경험 매칭 및 초기 세팅 확인하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
