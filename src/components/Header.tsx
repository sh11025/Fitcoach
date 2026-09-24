import {
  Sparkles,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  Palette,
  Cpu,
  Type,
  HardDrive
} from 'lucide-react';
import { AppStep } from '../types';
import { THEME_PALETTES, ThemePaletteId, ThemePalette } from '../styles/themeConfig';
import { AISettings } from '../types/aiSettings';
import { TextScaleSettings, SCALE_CONFIGS } from '../types/textScale';

interface Props {
  currentTheme: ThemePaletteId;
  aiSettings?: AISettings;
  textScaleSettings?: TextScaleSettings;
  onNavigate: (step: AppStep) => void;
  onReset: () => void;
  onLoadSample: () => void;
  onOpenPhilosophyModal: () => void;
  onOpenThemeModal: () => void;
  onOpenAISettingsModal: () => void;
  onOpenTypographyModal?: () => void;
  onOpenSaveLoadModal?: () => void;
  lastSavedTime?: string | null;
  themeConfig?: ThemePalette;
}

export const Header: React.FC<Props> = ({
  currentTheme,
  aiSettings,
  textScaleSettings,
  onNavigate,
  onReset,
  onLoadSample,
  onOpenPhilosophyModal,
  onOpenThemeModal,
  onOpenAISettingsModal,
  onOpenTypographyModal,
  onOpenSaveLoadModal,
  lastSavedTime,
  themeConfig
}) => {
  const currentThemeObj = themeConfig || THEME_PALETTES.find((t) => t.id === currentTheme) || THEME_PALETTES[0];
  const isMatteDark = currentThemeObj.finish === 'matte' && (currentTheme === 'matte_obsidian' || currentTheme === 'matte_sage' || currentTheme === 'matte_nordic');
  const isGlossyDark = currentTheme === 'glossy_onyx';
  const hasDarkHeader = isMatteDark || isGlossyDark;

  return (
    <header className={`sticky top-0 z-40 transition-all ${currentThemeObj.headerClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-sm transition-all ${
                currentThemeObj.finish === 'glossy'
                  ? 'border-t border-white/80 shadow-md ring-1 ring-white/30'
                  : currentThemeObj.finish === 'matte'
                  ? 'border border-white/20 shadow-none'
                  : 'shadow-xs'
              }`}
              style={{ background: currentThemeObj.accentGradient || currentThemeObj.previewAccent }}
            >
              F
            </div>
            <div>
              <span className={`font-black text-base tracking-tight block ${hasDarkHeader ? 'text-white' : 'text-slate-900'}`}>
                FitCoach
              </span>
              <span className={`text-[10px] font-medium block -mt-0.5 ${hasDarkHeader ? 'text-slate-300' : 'text-slate-500'}`}>
                AI 자기소개서 코치
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation / Principle Tag */}
        <div className={`hidden lg:flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full transition-all ${
          hasDarkHeader
            ? 'text-slate-200 bg-white/10 border border-white/10 backdrop-blur-xs'
            : 'text-slate-600 bg-slate-50/80 border border-slate-200/80'
        }`}>
          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${hasDarkHeader ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <span>원칙: <strong>AI는 글을 대신 쓰지 않고, 내 경험의 강점을 코칭합니다</strong></span>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Local Save & Load Button */}
          {onOpenSaveLoadModal && (
            <button
              type="button"
              onClick={onOpenSaveLoadModal}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                hasDarkHeader
                  ? 'text-emerald-300 bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/40'
                  : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-2xs'
              }`}
              title="작업 진행상황 로컬 저장 및 불러오기 (단축키: Ctrl+S)"
            >
              <HardDrive className={`w-3.5 h-3.5 ${hasDarkHeader ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>저장/불러오기</span>
              {lastSavedTime && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600/10 text-emerald-700 font-mono hidden md:inline">
                  {lastSavedTime}
                </span>
              )}
            </button>
          )}

          {/* AI Settings Button (API & Model Configuration) */}
          <button
            type="button"
            onClick={onOpenAISettingsModal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              hasDarkHeader
                ? 'text-white bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-400/40'
                : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-2xs'
            }`}
            title="AI 모델 및 API 환경설정"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI 설정</span>
            {aiSettings && (
              <span
                className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-600/10 text-indigo-700 font-mono font-bold hidden sm:inline max-w-[130px] truncate"
                title={`현재 모델: ${aiSettings.model}`}
              >
                {aiSettings.model.replace('gemini-', '')}
              </span>
            )}
          </button>

          {/* Typography Scale Controller Button */}
          {onOpenTypographyModal && (
            <button
              type="button"
              onClick={onOpenTypographyModal}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                hasDarkHeader
                  ? 'text-white bg-white/10 hover:bg-white/20 border border-white/15'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs'
              }`}
              title="UI 및 에디터 텍스트 크기 조절"
            >
              <Type className={`w-3.5 h-3.5 ${hasDarkHeader ? 'text-slate-300' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">글자 크기</span>
              {textScaleSettings && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono font-bold hidden md:inline">
                  {SCALE_CONFIGS[textScaleSettings.scale].badge}
                </span>
              )}
            </button>
          )}

          {/* Theme Palette Switcher */}
          <button
            type="button"
            onClick={onOpenThemeModal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              hasDarkHeader
                ? 'text-white bg-white/10 hover:bg-white/20 border border-white/15'
                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
            title="UI 전체 스타일(그라데이션/무광/유광) 변경"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
              style={{ background: currentThemeObj.accentGradient || currentThemeObj.previewAccent }}
            />
            <span className="hidden sm:inline">테마</span>
            <Palette className={`w-3.5 h-3.5 ${hasDarkHeader ? 'text-slate-300' : 'text-slate-400'}`} />
          </button>

          <button
            type="button"
            onClick={onOpenPhilosophyModal}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              hasDarkHeader
                ? 'text-slate-200 bg-white/5 hover:bg-white/15 border border-white/10'
                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <HelpCircle className={`w-3.5 h-3.5 ${hasDarkHeader ? 'text-slate-300' : 'text-slate-400'}`} />
            <span>서비스 철학</span>
          </button>

          <button
            type="button"
            onClick={onLoadSample}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              hasDarkHeader
                ? 'text-white bg-white/20 hover:bg-white/30 border border-white/25'
                : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200'
            }`}
            title="테스트용 백엔드 개발자 채용공고 & 자기소개서 샘플 불러오기"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>샘플 채우기</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              hasDarkHeader
                ? 'text-slate-300 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="처음부터 다시 시작"
            aria-label="초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
