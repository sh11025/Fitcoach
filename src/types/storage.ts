import { AppStep, JobInfo, ExperienceItem, ParagraphSetting, FeedbackItem } from './index';

export interface SavedProgressItem {
  id: string;
  title: string;
  timestamp: number;
  savedAtFormatted: string;
  step: AppStep;
  charCount: number;
  jobInfo: JobInfo;
  draftText: string;
  experiences: ExperienceItem[];
  paragraphSettings: ParagraphSetting[];
  feedbackItems?: FeedbackItem[];
  notes?: string;
  isAutoSave?: boolean;
}

export interface StorageExportBundle {
  version: '1.0';
  app: 'FitCoach';
  exportedAt: string;
  items: SavedProgressItem[];
}
