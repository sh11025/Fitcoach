import React from 'react';
import { RecommendationType } from '../../types';

interface Props {
  status: RecommendationType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RecommendationBadge: React.FC<Props> = ({
  status,
  showIcon = true,
  size = 'md'
}) => {
  const configs = {
    highlight: {
      label: '강조 추천',
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    keep: {
      label: '유지',
      dotColor: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    complement: {
      label: '보완 필요',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    reduce: {
      label: '축소 추천',
      dotColor: 'bg-slate-400',
      textColor: 'text-slate-600',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200'
    }
  };

  const config = configs[status] || configs.keep;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}
    >
      {showIcon && (
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${config.dotColor}`}
          aria-hidden="true"
        />
      )}
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
};
