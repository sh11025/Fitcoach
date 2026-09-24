import React from 'react';
import { HelpCircle, Tag } from 'lucide-react';
import { ExperienceItem } from '../../types';
import { RecommendationBadge } from './RecommendationBadge';
import { KeywordChip } from './KeywordChip';

interface Props {
  experience: ExperienceItem;
  onOpenReason: (item: ExperienceItem) => void;
  onStatusChange?: (id: string, newStatus: ExperienceItem['status']) => void;
}

export const ExperienceCard: React.FC<Props> = ({
  experience,
  onOpenReason,
  onStatusChange
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header: Title and Status */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm leading-snug">
              {experience.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>현재 중요도:</span>
              <strong className="text-slate-800 font-medium">{experience.importance}</strong>
            </div>
          </div>
          <RecommendationBadge status={experience.status} />
        </div>

        {/* Short Summary */}
        <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {experience.summary}
        </p>

        {/* Connected Keywords */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            연결된 채용공고 키워드
          </div>
          <div className="flex flex-wrap gap-1.5">
            {experience.keywords.map((kw) => (
              <KeywordChip key={kw} keyword={kw} variant="subtle" />
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Action button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onOpenReason(experience)}
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors py-1 px-2 rounded hover:bg-blue-50"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>왜 이렇게 판단했나요?</span>
        </button>

        {/* Quick preference override selector */}
        {onStatusChange && (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>내 판단:</span>
            <select
              value={experience.status}
              onChange={(e) => onStatusChange(experience.id, e.target.value as ExperienceItem['status'])}
              className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-hidden focus:border-blue-400 cursor-pointer"
            >
              <option value="highlight">강조</option>
              <option value="keep">유지</option>
              <option value="complement">보완</option>
              <option value="reduce">축소</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
