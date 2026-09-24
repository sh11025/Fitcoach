import React, { useState } from 'react';
import { Palette, Check, Sparkles, Layers, Shield, Droplets } from 'lucide-react';
import { THEME_PALETTES, ThemePaletteId, FinishStyle } from '../../styles/themeConfig';

interface Props {
  currentTheme: ThemePaletteId;
  onSelectTheme: (theme: ThemePaletteId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<Props> = ({
  currentTheme,
  onSelectTheme,
  isOpen,
  onClose
}) => {
  const [filterFinish, setFilterFinish] = useState<FinishStyle | 'all'>('all');

  if (!isOpen) return null;

  const filteredThemes = filterFinish === 'all'
    ? THEME_PALETTES
    : THEME_PALETTES.filter((t) => t.finish === filterFinish);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 id="theme-modal-title" className="font-bold text-slate-900 text-sm">
                서비스 UI 마감 질감 및 색상 테마 선택
              </h3>
              <p className="text-[11px] text-slate-500">
                그라데이션(Gradient), 무광(Matte), 유광(Glossy) 중 원하는 스타일을 선택하세요.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Finish Filter Tabs */}
        <div className="px-6 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center gap-2 text-xs font-semibold shrink-0">
          <span className="text-slate-400 text-[11px] mr-1">스타일 분류:</span>
          <button
            type="button"
            onClick={() => setFilterFinish('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterFinish === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            전체 ({THEME_PALETTES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterFinish('gradient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterFinish === 'gradient'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>그라데이션 (Gradient)</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterFinish('matte')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterFinish === 'matte'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>무광 (Matte)</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterFinish('glossy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterFinish === 'glossy'
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>유광 (Glossy)</span>
          </button>
        </div>

        {/* Theme List */}
        <div className="p-6 space-y-3.5 overflow-y-auto flex-1">
          {filteredThemes.map((theme) => {
            const isSelected = theme.id === currentTheme;

            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50/70 ring-2 ring-slate-900/10 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                }`}
              >
                {theme.finish === 'glossy' && (
                  <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                )}

                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Swatch */}
                  <div className="relative shrink-0 mt-0.5 sm:mt-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform ${
                        theme.finish === 'glossy'
                          ? 'border-t border-white/90 shadow-md'
                          : theme.finish === 'matte'
                          ? 'border border-slate-400/50 shadow-none'
                          : 'shadow-sm'
                      }`}
                      style={{
                        background: theme.accentGradient || theme.previewAccent
                      }}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {theme.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                          theme.finish === 'gradient'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : theme.finish === 'matte'
                            ? 'bg-slate-100 text-slate-800 border border-slate-300'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {theme.finishLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      {theme.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center ${theme.primaryBtnClass}`}>
                    스타일 예시
                  </div>

                  <button
                    type="button"
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '적용 완료' : '선택'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>선택한 질감과 테마 버튼 스타일은 브라우저 세션 동안 전체 화면에 즉시 적용됩니다.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
