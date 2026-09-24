import { useState, useEffect, useRef } from 'react';
import {
  FolderOpen,
  Save,
  Download,
  Upload,
  Trash2,
  Clock,
  X,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { AppStep, JobInfo, ExperienceItem, ParagraphSetting, FeedbackItem } from '../../types';
import { SavedProgressItem } from '../../types/storage';
import {
  getSavedProgressList,
  saveProgress,
  deleteSavedProgress,
  getAutoSaveSlot,
  exportSingleItemToJson,
  exportAllToJson,
  parseJsonBackupFile
} from '../../utils/localStorageHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Current App State to Save
  currentState: {
    step: AppStep;
    jobInfo: JobInfo;
    draftText: string;
    experiences: ExperienceItem[];
    paragraphSettings: ParagraphSetting[];
    feedbackItems?: FeedbackItem[];
  };
  // Callback when a saved item is loaded
  onLoadState: (item: SavedProgressItem) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warn') => void;
}

const STEP_LABELS: Record<AppStep, { label: string; color: string }> = {
  landing: { label: '시작 화면', color: 'bg-slate-100 text-slate-700' },
  upload: { label: '공고/초안 입력', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  analysis: { label: '경험 분해 및 매핑', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  matching_setup: { label: '문단 구성 전략', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  editor_coach: { label: '실시간 코칭 에디터', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  final_review: { label: '최종 제출 검토', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
};

export const LocalSaveLoadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentState,
  onLoadState,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'save_now' | 'file_backup'>('list');
  const [savedList, setSavedList] = useState<SavedProgressItem[]>([]);
  const [autoSaveItem, setAutoSaveItem] = useState<SavedProgressItem | null>(null);

  // New Save Form State
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // File import ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const refreshList = () => {
    setSavedList(getSavedProgressList());
    setAutoSaveItem(getAutoSaveSlot());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      const now = new Date();
      const comp = currentState.jobInfo.company || '작업';
      const role = currentState.jobInfo.role || '자기소개서';
      const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setNewTitle(`[${comp}] ${role} (${timeStr})`);
      setNewNotes('');
      setSelectedSlotId(null);
    }
  }, [isOpen, currentState]);

  if (!isOpen) return null;

  // Handle Save
  const handlePerformSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) {
      onShowToast('저장할 제목을 입력해주세요.', 'warn');
      return;
    }

    const saved = saveProgress(
      {
        title: newTitle.trim(),
        step: currentState.step,
        jobInfo: currentState.jobInfo,
        draftText: currentState.draftText,
        experiences: currentState.experiences,
        paragraphSettings: currentState.paragraphSettings,
        feedbackItems: currentState.feedbackItems,
        notes: newNotes.trim() || undefined
      },
      selectedSlotId || undefined
    );

    refreshList();
    onShowToast(`'${saved.title}' 로컬 저장이 완료되었습니다.`, 'success');
    setActiveTab('list');
  };

  // Handle Load
  const handleLoadItem = (item: SavedProgressItem) => {
    const isConfirmed = window.confirm(
      `'${item.title}' (${item.savedAtFormatted}) 작업본을 불러오시겠습니까?\n현재 화면의 내용이 저장된 작업본 내용으로 전환됩니다.`
    );
    if (!isConfirmed) return;

    onLoadState(item);
    onShowToast(`'${item.title}' 작업본을 성공적으로 불러왔습니다.`, 'success');
    onClose();
  };

  // Handle Delete
  const handleDeleteItem = (id: string, title: string) => {
    const isConfirmed = window.confirm(`'${title}' 저장본을 정말 삭제하시겠습니까?`);
    if (!isConfirmed) return;

    deleteSavedProgress(id);
    refreshList();
    onShowToast('저장본이 삭제되었습니다.', 'info');
  };

  // Handle File Upload Import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const items = await parseJsonBackupFile(files[0]);
      if (items.length === 0) {
        onShowToast('가져올 작업 데이터가 파일에 없습니다.', 'warn');
        return;
      }

      // If single item, directly offer to load or save to list
      if (items.length === 1) {
        const item = items[0];
        saveProgress({
          title: `[가져옴] ${item.title}`,
          step: item.step,
          jobInfo: item.jobInfo,
          draftText: item.draftText,
          experiences: item.experiences,
          paragraphSettings: item.paragraphSettings,
          feedbackItems: item.feedbackItems,
          notes: item.notes
        });
        refreshList();
        onShowToast(`'${item.title}' 백업 파일을 성공적으로 가져왔습니다.`, 'success');
      } else {
        // Multiple items
        for (const it of items) {
          saveProgress({
            title: it.title,
            step: it.step,
            jobInfo: it.jobInfo,
            draftText: it.draftText,
            experiences: it.experiences,
            paragraphSettings: it.paragraphSettings,
            feedbackItems: it.feedbackItems,
            notes: it.notes
          });
        }
        refreshList();
        onShowToast(`${items.length}개의 백업 작업본을 목록에 추가했습니다.`, 'success');
      }
      setActiveTab('list');
    } catch (err: any) {
      onShowToast(err.message || '백업 파일 읽기에 실패했습니다.', 'warn');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="storage-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 id="storage-modal-title" className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>진행상황 로컬 저장 및 불러오기</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                  내 브라우저 로컬 저장
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                작성 중인 공고 분석, 경험 매핑, 자기소개서 본문을 로컬에 안전하게 보관하고 언제든 불러옵니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2 bg-slate-100/70 border-b border-slate-200 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>저장된 목록 불러오기 ({savedList.length + (autoSaveItem ? 1 : 0)})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('save_now')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'save_now'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>현재 상태 저장하기</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file_backup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'file_backup'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON 백업 파일 내보내기/가져오기</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: LIST / LOAD */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              {/* Auto-save Item Banner (if exists) */}
              {autoSaveItem && (
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                        최근 자동 임시보관본
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {autoSaveItem.jobInfo.company || '작업'} - {autoSaveItem.jobInfo.role || '자기소개서'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {autoSaveItem.savedAtFormatted}
                      </span>
                      <span>·</span>
                      <span>{autoSaveItem.charCount.toLocaleString()}자</span>
                      <span>·</span>
                      <span className="text-amber-800 font-medium">
                        {STEP_LABELS[autoSaveItem.step]?.label || autoSaveItem.step}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLoadItem(autoSaveItem)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>임시보관본 복원</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Manual Slots List */}
              {savedList.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <Save className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">로컬에 저장된 작업본이 없습니다.</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      &apos;현재 상태 저장하기&apos; 탭을 눌러 작성 중인 자기소개서와 공고 분석 내용을 저장해보세요. (단축키: Ctrl + S)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('save_now')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    지금 현재 상태 저장하기
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>저장된 슬롯 목록 ({savedList.length}개)</span>
                    <span className="text-[11px] text-slate-400">클릭 시 해당 진행 단계로 복원됩니다.</span>
                  </div>

                  {savedList.map((item) => {
                    const stepConf = STEP_LABELS[item.step] || {
                      label: item.step,
                      color: 'bg-slate-100 text-slate-700'
                    };

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {item.title}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${stepConf.color}`}
                            >
                              {stepConf.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.savedAtFormatted}
                            </span>
                            <span>·</span>
                            <span className="font-semibold text-slate-700">
                              {item.jobInfo.company || '회사 미정'}
                            </span>
                            <span>/</span>
                            <span>{item.jobInfo.role || '직무 미정'}</span>
                            <span>·</span>
                            <span className="font-mono text-slate-600">
                              {item.charCount.toLocaleString()}자
                            </span>
                            <span>·</span>
                            <span>경험 {item.experiences?.length || 0}개</span>
                          </div>

                          {item.notes && (
                            <p className="text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 italic">
                              📝 {item.notes}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => exportSingleItemToJson(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="이 작업본을 JSON 파일로 다운로드"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="저장본 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadItem(item)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer ml-1"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>불러오기</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVE CURRENT PROGRESS */}
          {activeTab === 'save_now' && (
            <form onSubmit={handlePerformSave} className="space-y-4">
              {/* Snapshot Summary Card */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2.5">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  현재 저장될 진행 스냅샷 정보
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/60">
                    <span className="text-[10px] text-slate-400 block">진행 단계</span>
                    <span className="font-bold text-slate-800">
                      {STEP_LABELS[currentState.step]?.label || currentState.step}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/60">
                    <span className="text-[10px] text-slate-400 block">회사 및 직무</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {currentState.jobInfo.company || '미입력'} / {currentState.jobInfo.role || '미입력'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/60">
                    <span className="text-[10px] text-slate-400 block">초안 글자수</span>
                    <span className="font-bold text-indigo-600 font-mono">
                      {currentState.draftText.length.toLocaleString()}자
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/60">
                    <span className="text-[10px] text-slate-400 block">분석된 경험 개수</span>
                    <span className="font-bold text-slate-800">
                      {currentState.experiences.length}개
                    </span>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 block">
                  저장본 제목 (식별용 이름) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: [네이버] 데이터 엔지니어 1차 수정본"
                  required
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Memo / Notes Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 block">
                  메모 / 보완 포인트 (선택 사항)
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="예: 2문단 STAR 행동 수치 보완 필요, 오탈자 교정 완료 등"
                  rows={2}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Overwrite or New Slot selector */}
              {savedList.length > 0 && (
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    저장 방식 선택
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedSlotId(null)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        selectedSlotId === null
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      ✨ 새 슬롯으로 추가 저장
                    </button>
                    <select
                      value={selectedSlotId || ''}
                      onChange={(e) => setSelectedSlotId(e.target.value || null)}
                      className={`p-2 rounded-lg border text-xs cursor-pointer ${
                        selectedSlotId !== null
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <option value="">기존 슬롯에 덮어쓰기 (선택 안 함)</option>
                      {savedList.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          덮어쓰기: {slot.title} ({slot.savedAtFormatted})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>지금 로컬에 저장하기</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FILE BACKUP (IMPORT / EXPORT) */}
          {activeTab === 'file_backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <span>로컬 JSON 백업 파일이란?</span>
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  브라우저 캐시 삭제 시 데이터가 유실되지 않도록 하거나, 다른 PC(학교, 도서관, PC방)로
                  작업을 옮겨갈 때 사용할 수 있는 독립된 파일 백업 기능입니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Export All */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Download className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">전체 저장본 파일 다운로드</h5>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      현재 로컬에 저장된 모든 작업본({savedList.length}개)을 하나의 .json 파일로 PC에 저장합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      exportAllToJson();
                      onShowToast('전체 백업 파일이 다운로드되었습니다.', 'success');
                    }}
                    disabled={savedList.length === 0}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>전체 백업 다운로드 (.json)</span>
                  </button>
                </div>

                {/* Import File */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                      <Upload className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">백업 파일 불러오기 (복원)</h5>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      다운로드해 두었던 FitCoach 백업 .json 파일을 선택하여 로컬 작업 목록에 즉시 복원합니다.
                    </p>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileChange}
                      className="hidden"
                      id="backup-file-input"
                    />
                    <label
                      htmlFor="backup-file-input"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer text-center block"
                    >
                      <Upload className="w-3.5 h-3.5 inline mr-1" />
                      <span>JSON 파일 선택하기</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <span>💡 단축키:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">Ctrl+S</kbd>
            <span>를 누르면 언제든 즉시 로컬 저장됩니다.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
