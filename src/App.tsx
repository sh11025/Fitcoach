import { useState, useEffect } from 'react';
import { AppStep, JobInfo, ExperienceItem, ParagraphSetting, ParagraphPriority } from './types';
import {
  INITIAL_JOB_INFO,
  INITIAL_DRAFT_TEXT,
  MOCK_EXPERIENCES,
  MOCK_PARAGRAPH_SETTINGS,
  MOCK_FEEDBACK_ITEMS
} from './data/mockData';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { PhilosophyModal } from './components/common/PhilosophyModal';
import { ThemeSelectorModal } from './components/common/ThemeSelectorModal';
import { AISettingsModal } from './components/common/AISettingsModal';
import { THEME_PALETTES, ThemePaletteId } from './styles/themeConfig';
import { AISettings, DEFAULT_AI_SETTINGS } from './types/aiSettings';
import { TextScaleSettings, DEFAULT_TEXT_SCALE_SETTINGS } from './types/textScale';
import { TypographySettingsModal } from './components/common/TypographySettingsModal';
import { LocalSaveLoadModal } from './components/common/LocalSaveLoadModal';
import { SavedProgressItem } from './types/storage';
import { saveProgress, saveAutoSaveSlot } from './utils/localStorageHelper';
import { CheckCircle2, AlertCircle, Info, HardDrive } from 'lucide-react';
import { LandingStep } from './components/steps/LandingStep';
import { UploadStep } from './components/steps/UploadStep';
import { AnalysisStep } from './components/steps/AnalysisStep';
import { MatchingSetupStep } from './components/steps/MatchingSetupStep';
import { EditorCoachStep } from './components/steps/EditorCoachStep';
import { FinalReviewStep } from './components/steps/FinalReviewStep';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [currentTheme, setCurrentTheme] = useState<ThemePaletteId>('gradient_ocean');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    try {
      const saved = localStorage.getItem('fitcoach_ai_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Auto-upgrade deprecated or invalid models from previous sessions
        if (
          !parsed.model ||
          parsed.model.includes('1.5') ||
          parsed.model.includes('2.0') ||
          parsed.model === 'gemini-pro'
        ) {
          parsed.model = DEFAULT_AI_SETTINGS.model;
        }
        return { ...DEFAULT_AI_SETTINGS, ...parsed };
      }
      return DEFAULT_AI_SETTINGS;
    } catch {
      return DEFAULT_AI_SETTINGS;
    }
  });

  const [jobInfo, setJobInfo] = useState<JobInfo>(INITIAL_JOB_INFO);
  const [draftText, setDraftText] = useState<string>(INITIAL_DRAFT_TEXT);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(MOCK_EXPERIENCES);
  const [paragraphSettings, setParagraphSettings] = useState<ParagraphSetting[]>(MOCK_PARAGRAPH_SETTINGS);
  const [feedbackItems] = useState(MOCK_FEEDBACK_ITEMS);
  const [isPhilosophyModalOpen, setIsPhilosophyModalOpen] = useState(false);
  const [isTypographyModalOpen, setIsTypographyModalOpen] = useState(false);
  const [isSaveLoadModalOpen, setIsSaveLoadModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'warn';
    id: number;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  const handleQuickSave = () => {
    saveProgress({
      step: currentStep,
      jobInfo,
      draftText,
      experiences,
      paragraphSettings,
      feedbackItems
    });
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLastSavedTime(timeStr);
    showToast(`로컬 저장 완료 (${timeStr})`, 'success');
  };

  const handleLoadSavedItem = (item: SavedProgressItem) => {
    setCurrentStep(item.step);
    setJobInfo(item.jobInfo);
    setDraftText(item.draftText);
    setExperiences(item.experiences || []);
    setParagraphSettings(item.paragraphSettings || []);
    const timeStr = item.savedAtFormatted.split(' ')[1] || item.savedAtFormatted;
    setLastSavedTime(timeStr);
  };

  // Keyboard shortcut Ctrl+S / Cmd+S for instant local save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleQuickSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, jobInfo, draftText, experiences, paragraphSettings, feedbackItems]);

  // Periodic Auto-save in editor coach step
  useEffect(() => {
    if (currentStep !== 'editor_coach' || !draftText || draftText.trim().length === 0) {
      return;
    }
    const timer = setTimeout(() => {
      saveAutoSaveSlot({
        step: currentStep,
        jobInfo,
        draftText,
        experiences,
        paragraphSettings,
        feedbackItems
      });
    }, 15000); // 15 seconds after typing or state change

    return () => clearTimeout(timer);
  }, [currentStep, draftText, jobInfo, experiences, paragraphSettings, feedbackItems]);

  const [textScaleSettings, setTextScaleSettings] = useState<TextScaleSettings>(() => {
    try {
      const saved = localStorage.getItem('fitcoach_text_scale');
      return saved ? JSON.parse(saved) : DEFAULT_TEXT_SCALE_SETTINGS;
    } catch {
      return DEFAULT_TEXT_SCALE_SETTINGS;
    }
  });

  const currentThemeObj = THEME_PALETTES.find((t) => t.id === currentTheme) || THEME_PALETTES[0];

  // Save AI Settings to local storage when changed
  const handleSaveAISettings = (newSettings: AISettings) => {
    setAiSettings(newSettings);
    try {
      localStorage.setItem('fitcoach_ai_settings', JSON.stringify(newSettings));
    } catch {
      // storage unavailable
    }
  };

  const handleSaveTextScaleSettings = (newSettings: TextScaleSettings) => {
    setTextScaleSettings(newSettings);
    try {
      localStorage.setItem('fitcoach_text_scale', JSON.stringify(newSettings));
    } catch {
      // storage unavailable
    }
  };

  // Sync data-theme and data-text-scale attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-text-scale', textScaleSettings.scale);
  }, [textScaleSettings.scale]);

  // Experience status override
  const handleUpdateExperienceStatus = (id: string, newStatus: ExperienceItem['status']) => {
    setExperiences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Paragraph priority override
  const handleUpdateParagraphPriority = (id: string, newPriority: ParagraphPriority) => {
    setParagraphSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priority: newPriority } : item))
    );
  };

  // Quick reset
  const handleReset = () => {
    setJobInfo(INITIAL_JOB_INFO);
    setDraftText(INITIAL_DRAFT_TEXT);
    setExperiences(MOCK_EXPERIENCES);
    setParagraphSettings(MOCK_PARAGRAPH_SETTINGS);
    setCurrentStep('landing');
  };

  // Quick sample fill
  const handleLoadSample = () => {
    setJobInfo(INITIAL_JOB_INFO);
    setDraftText(INITIAL_DRAFT_TEXT);
    setExperiences(MOCK_EXPERIENCES);
    setParagraphSettings(MOCK_PARAGRAPH_SETTINGS);
    setCurrentStep('upload');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 selection:bg-indigo-100 selection:text-indigo-900 ${currentThemeObj.appBgClass}`}>
      {/* Top Bar with dynamic theme design and AI Settings button */}
      <Header
        currentTheme={currentTheme}
        aiSettings={aiSettings}
        textScaleSettings={textScaleSettings}
        themeConfig={currentThemeObj}
        onNavigate={setCurrentStep}
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        onOpenPhilosophyModal={() => setIsPhilosophyModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenAISettingsModal={() => setIsAISettingsModalOpen(true)}
        onOpenTypographyModal={() => setIsTypographyModalOpen(true)}
        onOpenSaveLoadModal={() => setIsSaveLoadModalOpen(true)}
        lastSavedTime={lastSavedTime}
      />

      {/* Step Indicator with finish styling */}
      <StepIndicator
        currentStep={currentStep}
        currentTheme={currentTheme}
        themeConfig={currentThemeObj}
        onNavigate={setCurrentStep}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-start">
        {currentStep === 'landing' && (
          <LandingStep
            currentTheme={currentTheme}
            themeConfig={currentThemeObj}
            onSelectTheme={setCurrentTheme}
            onStart={() => setCurrentStep('upload')}
            onLoadSample={handleLoadSample}
            onOpenPhilosophyModal={() => setIsPhilosophyModalOpen(true)}
          />
        )}

        {currentStep === 'upload' && (
          <UploadStep
            jobInfo={jobInfo}
            draftText={draftText}
            onUpdateJobInfo={setJobInfo}
            onUpdateDraftText={setDraftText}
            onNext={() => setCurrentStep('analysis')}
            onLoadSample={handleLoadSample}
          />
        )}

        {currentStep === 'analysis' && (
          <AnalysisStep
            jobInfo={jobInfo}
            onNext={() => setCurrentStep('matching_setup')}
          />
        )}

        {currentStep === 'matching_setup' && (
          <MatchingSetupStep
            experiences={experiences}
            paragraphSettings={paragraphSettings}
            onUpdateExperienceStatus={handleUpdateExperienceStatus}
            onUpdateParagraphPriority={handleUpdateParagraphPriority}
            onNext={() => setCurrentStep('editor_coach')}
          />
        )}

        {currentStep === 'editor_coach' && (
          <EditorCoachStep
            jobInfo={jobInfo}
            draftText={draftText}
            feedbackItems={feedbackItems}
            aiSettings={aiSettings}
            textScaleSettings={textScaleSettings}
            onUpdateDraftText={setDraftText}
            onUpdateJobInfo={setJobInfo}
            onNext={() => setCurrentStep('final_review')}
            onQuickSave={handleQuickSave}
            onOpenSaveLoadModal={() => setIsSaveLoadModalOpen(true)}
          />
        )}

        {currentStep === 'final_review' && (
          <FinalReviewStep
            jobInfo={jobInfo}
            draftText={draftText}
            aiSettings={aiSettings}
            textScaleSettings={textScaleSettings}
            onBackToEdit={() => setCurrentStep('editor_coach')}
            onResetAll={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-auto py-6 transition-all ${
        currentThemeObj.finish === 'matte'
          ? 'bg-slate-900 text-slate-400 border-t border-slate-800'
          : currentThemeObj.finish === 'glossy'
          ? 'bg-slate-950/80 text-slate-300 backdrop-blur-xl border-t border-slate-800'
          : 'bg-white/80 backdrop-blur-sm border-t border-indigo-100 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${currentThemeObj.finish === 'matte' || currentThemeObj.finish === 'glossy' ? 'text-white' : 'text-slate-800'}`}>
              FitCoach
            </span>
            <span>·</span>
            <span>한국 취업 준비생을 위한 AI 자기소개서 코칭 프로토타입</span>
            <span>·</span>
            <span className="font-semibold text-indigo-400">[{currentThemeObj.finishLabel} 테마]</span>
            <span>·</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200/50 text-slate-700 font-mono">
              AI: {aiSettings.provider} ({aiSettings.model})
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] opacity-75">
            <button
              type="button"
              onClick={() => setIsSaveLoadModalOpen(true)}
              className="hover:underline cursor-pointer font-semibold text-emerald-600 flex items-center gap-1"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>로컬 저장/불러오기</span>
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsAISettingsModalOpen(true)}
              className="hover:underline cursor-pointer font-semibold text-indigo-500"
            >
              AI API 환경설정 ⚙️
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsPhilosophyModalOpen(true)}
              className="hover:underline cursor-pointer"
            >
              코칭 원칙 및 AI 역할 안내
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              className="hover:underline cursor-pointer font-medium"
            >
              UI 스타일 변경 ({currentThemeObj.finishLabel})
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-700'
                : toast.type === 'warn'
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-indigo-600 text-white border-indigo-500'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warn' && <AlertCircle className="w-4 h-4 text-amber-200 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-200 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Local Save & Load Modal */}
      <LocalSaveLoadModal
        isOpen={isSaveLoadModalOpen}
        onClose={() => setIsSaveLoadModalOpen(false)}
        currentState={{
          step: currentStep,
          jobInfo,
          draftText,
          experiences,
          paragraphSettings,
          feedbackItems
        }}
        onLoadState={handleLoadSavedItem}
        onShowToast={showToast}
      />

      {/* Philosophy Modal */}
      <PhilosophyModal
        isOpen={isPhilosophyModalOpen}
        onClose={() => setIsPhilosophyModalOpen(false)}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* AI API & Provider Configuration Modal */}
      <AISettingsModal
        isOpen={isAISettingsModalOpen}
        onClose={() => setIsAISettingsModalOpen(false)}
        settings={aiSettings}
        onSaveSettings={handleSaveAISettings}
      />

      {/* Typography & Text Scale Modal */}
      <TypographySettingsModal
        isOpen={isTypographyModalOpen}
        onClose={() => setIsTypographyModalOpen(false)}
        settings={textScaleSettings}
        onUpdateSettings={handleSaveTextScaleSettings}
      />
    </div>
  );
}
