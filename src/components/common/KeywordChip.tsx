import React from 'react';

interface Props {
  keyword: string;
  variant?: 'default' | 'accent' | 'subtle';
  onClick?: () => void;
}

export const KeywordChip: React.FC<Props> = ({
  keyword,
  variant = 'default',
  onClick
}) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200',
    accent: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 font-medium',
    subtle: 'bg-white text-slate-600 border-slate-200'
  };

  const displayText = keyword.startsWith('#') ? keyword : `#${keyword}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${styles[variant]}`}
      >
        {displayText}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs rounded-md border ${styles[variant]}`}
    >
      {displayText}
    </span>
  );
};
