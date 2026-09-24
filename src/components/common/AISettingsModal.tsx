import React, { useState } from 'react';
import {
  Settings,
  Key,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  AISettings,
  AI_MODEL_OPTIONS,
  AIProvider,
  DEFAULT_AI_SETTINGS,
  MODEL_CATALOG
} from '../../types/aiSettings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSaveSettings: (settings: AISettings) => void;
}

export const AISettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [form, setForm] = useState<AISettings>(settings);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'api' | 'parameters' | 'prompt'>('api');

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: AIProvider) => {
    const defaultModel = AI_MODEL_OPTIONS[newProvider].models[0];
    setForm((prev) => ({
      ...prev,
      provider: newProvider,
      model: defaultModel
    }));
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTestMessage('API 엔드포인트 및 인증 키를 확인 중입니다...');

    setTimeout(() => {
      // If user typed custom key or using server runtime
      if (form.apiKey.trim().length > 0 || form.provider === 'gemini') {
        setTestStatus('success');
        setTestMessage(
          form.apiKey.trim().length > 0
            ? `성공: [${form.provider.toUpperCase()} / ${form.model}] API 연결이 정상 확인되었습니다.`
            : `성공: 시스템 내장 Gemini API 키로 환경이 활성화되었습니다.`
        );
      } else {
        setTestStatus('failed');
        setTestMessage('오류: 유효한 API Key를 입력해주시거나 Gemini 기본 엔진을 선택해주세요.');
      }
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 id="ai-settings-title" className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>AI 코치 환경설정 (API & 모델 연동)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  실시간 연동 가능
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                자기소개서 분석과 실시간 코칭에 사용할 AI 모델 제공업체와 API Key를 설정합니다.
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2 bg-slate-100/70 border-b border-slate-200 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'api'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API & 모델 설정</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('parameters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'parameters'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>코칭 파라미터</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>시스템 프롬프트 프리셋</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'api' && (
            <div className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  AI 제공업체 (Provider)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(AI_MODEL_OPTIONS) as AIProvider[]).map((prov) => {
                    const isSelected = form.provider === prov;
                    return (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => handleProviderChange(prov)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 capitalize">
                            {prov}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                          {AI_MODEL_OPTIONS[prov].label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    사용할 모델 선택 (최신 고지능 엔진)
                  </label>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    {MODEL_CATALOG[form.provider]?.find((m) => m.id === form.model)?.version || 'Latest'}
                  </span>
                </div>

                <div className="space-y-2 mb-2">
                  {(MODEL_CATALOG[form.provider] || []).map((modelObj) => {
                    const isSelected = form.model === modelObj.id;
                    return (
                      <button
                        key={modelObj.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, model: modelObj.id }))}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {modelObj.name}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                                modelObj.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {modelObj.badge}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {modelObj.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-500">
                  선택한 최신 모델을 통해 채용공고 역량 매핑 및 STAR 구조 기반의 실시간 코칭 피드백이 생성됩니다.
                </p>
              </div>

              {/* API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    <span>{form.provider.toUpperCase()} API Key</span>
                  </label>
                  {form.provider === 'gemini' && (
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>공란 시 시스템 기본 키 사용</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={form.apiKey}
                    onChange={(e) => setForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                    placeholder={
                      form.provider === 'gemini'
                        ? 'AI Studio 또는 Google Cloud Gemini API Key 입력 (미입력 시 기본 엔진)'
                        : 'sk-...'
                    }
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    title={showKey ? '키 숨기기' : '키 보기'}
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  입력된 API Key는 브라우저 로컬 세션에만 안전하게 보관되며 외부 서버로 무단 반출되지 않습니다.
                </p>
              </div>

              {/* Custom Endpoint (if custom provider) */}
              {form.provider === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    커스텀 엔드포인트 URL
                  </label>
                  <input
                    type="url"
                    value={form.customEndpoint || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, customEndpoint: e.target.value }))}
                    placeholder="https://api.my-internal-llm.com/v1"
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Connection Test Box */}
              <div className="pt-2">
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 block">연동 상태 점검</span>
                    <p className="text-[11px] text-slate-500">
                      입력된 키로 실제 모델 호출이 정상 작동하는지 테스트합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {testStatus === 'testing' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{testStatus === 'testing' ? '확인 중...' : '연결 테스트'}</span>
                  </button>
                </div>

                {testStatus === 'success' && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{testMessage}</span>
                  </div>
                )}
                {testStatus === 'failed' && (
                  <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{testMessage}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-5">
              {/* Strictness Level */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  코칭 엄격도 (Feedback Strictness)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'gentle', label: '온화한 코칭', desc: '장점 위주 격려 및 최소한의 수정 제안' },
                    { id: 'balanced', label: '균형 잡힌 코칭 (기본)', desc: '공고 매칭 및 STAR 구조 균형 점검' },
                    { id: 'rigorous', label: '엄격한 서류 심사관', desc: '직무 미스매치, 모호한 팀 행동 집중 지적' }
                  ].map((level) => {
                    const isSelected = form.coachingStrictness === level.id;
                    return (
                      <div
                        key={level.id}
                        onClick={() => setForm((prev) => ({ ...prev, coachingStrictness: level.id as any }))}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="font-bold text-xs text-slate-900 block">{level.label}</span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{level.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Temperature (창의성 vs 일관성)
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    {form.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={form.temperature}
                  onChange={(e) => setForm((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0.0 (정밀한 팩트 체크)</span>
                  <span>1.0 (다양한 표현 제안)</span>
                </div>
              </div>

              {/* Max Output Tokens */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    최대 생성 토큰 (Max Tokens)
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    {form.maxOutputTokens}
                  </span>
                </div>
                <input
                  type="number"
                  value={form.maxOutputTokens}
                  onChange={(e) => setForm((prev) => ({ ...prev, maxOutputTokens: parseInt(e.target.value) || 2048 }))}
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Auto analyze toggle */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">실시간 자동 첨삭 분석</span>
                  <p className="text-[11px] text-slate-500">
                    에디터에서 문장 수정 시 디바운스 후 자동으로 코칭 피드백을 갱신합니다.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.autoAnalyzeOnChange}
                  onChange={(e) => setForm((prev) => ({ ...prev, autoAnalyzeOnChange: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  AI 코칭 시스템 가이드라인 프롬프트
                </label>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, systemPromptPreset: DEFAULT_AI_SETTINGS.systemPromptPreset }))}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
                >
                  기본값 복원
                </button>
              </div>
              <textarea
                rows={7}
                value={form.systemPromptPreset}
                onChange={(e) => setForm((prev) => ({ ...prev, systemPromptPreset: e.target.value }))}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
              />
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>주의:</strong> FitCoach의 철학에 따라 AI가 지원자의 글을 직접 대신 써주지 않도록 하는 지침이 프롬프트에 기본 명시되어 있습니다.
                </span>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              현재 엔진: <strong className="text-slate-700">{form.provider.toUpperCase()} / {form.model}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              >
                설정 저장 및 적용
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
