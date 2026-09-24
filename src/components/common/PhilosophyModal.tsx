import React from 'react';
import { X, ShieldCheck, Check, Ban } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PhilosophyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="philosophy-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="philosophy-title" className="font-bold text-slate-900 text-sm">
                FitCoach 서비스 철학과 원칙
              </h3>
              <p className="text-[11px] text-slate-500">
                AI는 지원자를 대신하지 않고, 지원자의 본래 역량이 빛나도록 코칭합니다.
              </p>
            </div>
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-950 text-sm mb-1">
              &ldquo;내 자기소개서, AI가 대신 쓰지 않습니다.&rdquo;
            </h4>
            <p className="text-blue-900 leading-relaxed text-xs">
              AI가 작성해준 매끄러운 글은 면접관의 날카로운 질문 하나에 무너집니다. 진짜 합격하는 자기소개서는 본인의 땀과 고민이 담긴 솔직한 경험에서 나옵니다. FitCoach는 글을 대신 지어내지 않고, 여러분이 가진 경험을 채용공고의 눈높이에 맞춰 가장 매력적으로 다듬도록 옆에서 조언합니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* What AI does */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>AI 코치가 하는 일</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>채용공고의 핵심 요구 역량과 키워드 도출</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>어떤 경험을 강조하고 어떤 경험을 축소할지 추천</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>추천하는 이유를 채용공고 기준으로 투명하게 설명</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>STAR(상황-과제-행동-결과) 구조 및 본인 기여도 점검</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>모호한 표현에 대해 구체적 질문 던지기</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>오타 및 맞춤법 점검 및 수정 후보 제시</span>
                </li>
              </ul>
            </div>

            {/* What AI NEVER does */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-800">
                <Ban className="w-4 h-4 text-red-600" />
                <span>AI 코치가 절대 하지 않는 일</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>사용자의 자기소개서를 통째로 자동 생성하거나 교체</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>실제 경험하지 않은 거짓된 성과나 숫자 조작 생성</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>&apos;합격 확률 85%&apos; 등 근거 없는 합격률 및 점수 매기기</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>사용자 동의 없는 일방적 텍스트 자동 수정</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>추천을 강제화하기 (모든 결정권은 지원자에게 있습니다)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            철학에 동의하며 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};
