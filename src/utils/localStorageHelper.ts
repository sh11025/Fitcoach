import { SavedProgressItem, StorageExportBundle } from '../types/storage';
import { AppStep, JobInfo, ExperienceItem, ParagraphSetting, FeedbackItem } from '../types/index';

const STORAGE_LIST_KEY = 'fitcoach_saved_progress_list';
const AUTOSAVE_KEY = 'fitcoach_autosave_slot';

export function formatDateTime(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}.${m}.${d} ${hh}:${mm}:${ss}`;
}

export function getSavedProgressList(): SavedProgressItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_LIST_KEY);
    if (!raw) return [];
    const list: SavedProgressItem[] = JSON.parse(raw);
    return Array.isArray(list) ? list.sort((a, b) => b.timestamp - a.timestamp) : [];
  } catch (err) {
    console.error('Failed to load saved progress list:', err);
    return [];
  }
}

export function saveProgress(
  data: {
    title?: string;
    step: AppStep;
    jobInfo: JobInfo;
    draftText: string;
    experiences: ExperienceItem[];
    paragraphSettings: ParagraphSetting[];
    feedbackItems?: FeedbackItem[];
    notes?: string;
    isAutoSave?: boolean;
  },
  customId?: string
): SavedProgressItem {
  const list = getSavedProgressList();
  const now = new Date();
  const id = customId || `save_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  const defaultTitle = `${data.jobInfo.company || '작업'} - ${data.jobInfo.role || '자기소개서'} (${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')})`;

  const newItem: SavedProgressItem = {
    id,
    title: data.title?.trim() || defaultTitle,
    timestamp: now.getTime(),
    savedAtFormatted: formatDateTime(now),
    step: data.step,
    charCount: data.draftText.length,
    jobInfo: data.jobInfo,
    draftText: data.draftText,
    experiences: data.experiences,
    paragraphSettings: data.paragraphSettings,
    feedbackItems: data.feedbackItems,
    notes: data.notes,
    isAutoSave: !!data.isAutoSave
  };

  // If overwriting existing customId, replace it; otherwise add to front
  const existingIdx = list.findIndex((x) => x.id === id);
  if (existingIdx >= 0) {
    list[existingIdx] = newItem;
  } else {
    list.unshift(newItem);
  }

  // Keep up to 20 manual save slots
  const trimmed = list.slice(0, 20);
  try {
    localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Storage quota exceeded, trying to remove older saves', e);
    const reduced = trimmed.slice(0, 10);
    localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(reduced));
  }

  return newItem;
}

export function deleteSavedProgress(id: string): void {
  try {
    const list = getSavedProgressList().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to delete saved progress:', err);
  }
}

export function getAutoSaveSlot(): SavedProgressItem | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAutoSaveSlot(data: {
  step: AppStep;
  jobInfo: JobInfo;
  draftText: string;
  experiences: ExperienceItem[];
  paragraphSettings: ParagraphSetting[];
  feedbackItems?: FeedbackItem[];
}): SavedProgressItem {
  const now = new Date();
  const item: SavedProgressItem = {
    id: 'autosave_latest',
    title: `[자동 임시보관] ${data.jobInfo.company || '작업'} ${data.jobInfo.role || ''}`,
    timestamp: now.getTime(),
    savedAtFormatted: formatDateTime(now),
    step: data.step,
    charCount: data.draftText.length,
    jobInfo: data.jobInfo,
    draftText: data.draftText,
    experiences: data.experiences,
    paragraphSettings: data.paragraphSettings,
    feedbackItems: data.feedbackItems,
    isAutoSave: true
  };

  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(item));
  } catch (err) {
    console.warn('Failed to save auto-save slot:', err);
  }

  return item;
}

// Download single item as JSON
export function exportSingleItemToJson(item: SavedProgressItem): void {
  const bundle: StorageExportBundle = {
    version: '1.0',
    app: 'FitCoach',
    exportedAt: new Date().toISOString(),
    items: [item]
  };

  const safeCompany = (item.jobInfo.company || '자기소개서').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
  const fileName = `FitCoach_${safeCompany}_${new Date().toISOString().slice(0, 10)}.json`;

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download all items as JSON
export function exportAllToJson(): void {
  const list = getSavedProgressList();
  const bundle: StorageExportBundle = {
    version: '1.0',
    app: 'FitCoach',
    exportedAt: new Date().toISOString(),
    items: list
  };

  const fileName = `FitCoach_Backup_All_${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import JSON file into localStorage
export async function parseJsonBackupFile(file: File): Promise<SavedProgressItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Case 1: StorageExportBundle format
        if (parsed.app === 'FitCoach' && Array.isArray(parsed.items)) {
          resolve(parsed.items);
          return;
        }

        // Case 2: Single SavedProgressItem format
        if (parsed.jobInfo && typeof parsed.draftText === 'string') {
          const item: SavedProgressItem = {
            id: parsed.id || `imported_${Date.now()}`,
            title: parsed.title || '가져온 자기소개서 작업본',
            timestamp: parsed.timestamp || Date.now(),
            savedAtFormatted: parsed.savedAtFormatted || formatDateTime(),
            step: parsed.step || 'editor_coach',
            charCount: parsed.draftText.length,
            jobInfo: parsed.jobInfo,
            draftText: parsed.draftText,
            experiences: parsed.experiences || [],
            paragraphSettings: parsed.paragraphSettings || [],
            feedbackItems: parsed.feedbackItems || [],
            notes: parsed.notes
          };
          resolve([item]);
          return;
        }

        // Case 3: Array of items
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].jobInfo) {
          resolve(parsed);
          return;
        }

        reject(new Error('올바른 FitCoach 백업 JSON 파일 형식이 아닙니다.'));
      } catch (err) {
        reject(new Error('JSON 파일 구문 분석 실패: ' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류가 발생했습니다.'));
    reader.readAsText(file);
  });
}
