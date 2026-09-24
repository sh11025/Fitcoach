import React from 'react';
import { X, Type, Check } from 'lucide-react';
import { TextScaleSettings, AppTextScale, SCALE_CONFIGS } from '../../types/textScale';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: TextScaleSettings;
  onUpdateSettings: (newSettings: TextScaleSettings) => void;
}

export const TypographySettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  const handleScaleSelect = (scale: AppTextScale) => {
    onUpdateSettings({ ...settings, scale });
  };

  const handleEditorFontSize = (editorFontSize: TextScaleSettings['editorFontSize']) => {
    onUpdateSettings({ ...settings, editorFontSize });
  };

  const handleLineHeight = (lineHeight: TextScaleSettings['lineHeight']) => {
    onUpdateSettings({ ...settings, lineHeight });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                텍스트 크기 및 가독성 설정
              </h3>
              <p className="text-xs text-slate-500">
                작업 환경(모니터, 노트북 크기)과 시력에 맞춰 UI와 에디터 글자 크기를 조절합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Entire UI Scale Classification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>1. 전체 UI 텍스트 스케일 분류</span>
                <span className="text-[10px] font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  앱 전체 적용
                </span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                현재: {SCALE_CONFIGS[settings.scale].badge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(SCALE_CONFIGS) as AppTextScale[]).map((key) => {
                const conf = SCALE_CONFIGS[key];
                const isSelected = settings.scale === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleScaleSelect(key)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                          {key === 'compact' ? 'A- 컴팩트' : key === 'standard' ? 'A 표준' : 'A+ 크게'}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block">{conf.badge}</span>
                      <p className="text-[11px] text-slate-500 leading-snug pt-1">
                        {conf.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Editor Text Size Classification */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>2. 자기소개서 본문 에디터 전용 크기</span>
                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  작성 집중
                </span>
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { size: 'sm', label: '작게 (14px)', desc: '한눈에 많은 문단 확인' },
                { size: 'base', label: '보통 (16px)', desc: '일반적인 서류 작성 권장' },
                { size: 'lg', label: '크게 (18px)', desc: '눈이 편안한 여유로운 크기' },
                { size: 'xl', label: '아주 크게 (20px)', desc: '최종 교정 및 오탈자 확인' }
              ].map((item) => {
                const isSelected = settings.editorFontSize === item.size;
                return (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => handleEditorFontSize(item.size as any)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 ring-1 ring-indigo-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block font-bold">{item.label.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      {item.label.split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Line Height (줄 간격) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              3. 문장 줄 간격 (Line Height)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'normal', label: '보통 (1.5배)', desc: '일반 문서' },
                { val: 'relaxed', label: '여유있게 (1.75배)', desc: '권장 표준' },
                { val: 'loose', label: '넓게 (2.0배)', desc: '정밀 교정' }
              ].map((item) => {
                const isSelected = settings.lineHeight === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleLineHeight(item.val as any)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 ring-1 ring-indigo-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              실시간 미리보기 (Live Preview)
            </span>
            <div
              className={`p-3 bg-white border border-slate-200 rounded-lg text-slate-800 ${
                settings.editorFontSize === 'sm'
                  ? 'text-sm'
                  : settings.editorFontSize === 'base'
                  ? 'text-base'
                  : settings.editorFontSize === 'lg'
                  ? 'text-lg'
                  : 'text-xl'
              } ${
                settings.lineHeight === 'normal'
                  ? 'leading-normal'
                  : settings.lineHeight === 'relaxed'
                  ? 'leading-relaxed'
                  : 'leading-loose'
              }`}
            >
              &ldquo;데이터 엔지니어링 파이프라인 최적화를 통해 쿼리 지연시간을 42% 단축하고, 일일 300만 건의 트래픽을 무중단 처리했습니다.&rdquo;
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({
                scale: 'standard',
                editorFontSize: 'base',
                lineHeight: 'relaxed'
              })
            }
            className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
          >
            기본값으로 초기화
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};
