export type AppTextScale = 'compact' | 'standard' | 'large';

export interface TextScaleSettings {
  scale: AppTextScale; // compact: 87.5%, standard: 100%, large: 112.5%
  editorFontSize: 'sm' | 'base' | 'lg' | 'xl';
  lineHeight: 'normal' | 'relaxed' | 'loose';
}

export const DEFAULT_TEXT_SCALE_SETTINGS: TextScaleSettings = {
  scale: 'standard',
  editorFontSize: 'base',
  lineHeight: 'relaxed'
};

export const SCALE_CONFIGS: Record<
  AppTextScale,
  {
    name: string;
    description: string;
    bodyClass: string;
    badge: string;
  }
> = {
  compact: {
    name: '컴팩트 (한눈에 보기)',
    description: '작은 글씨로 더 많은 정보를 한 화면에 압축해서 보여줍니다. (노트북/좁은 화면 추천)',
    bodyClass: 'text-scale-compact',
    badge: '87.5%'
  },
  standard: {
    name: '표준 (기본 권장)',
    description: '가독성과 정보량의 균형이 가장 최적화된 표준 크기입니다.',
    bodyClass: 'text-scale-standard',
    badge: '100%'
  },
  large: {
    name: '크게 (시원한 가독성)',
    description: '눈의 피로를 줄이고 문맥을 또렷하게 파악할 수 있도록 텍스트가 시원하게 커집니다.',
    bodyClass: 'text-scale-large',
    badge: '112.5%'
  }
};
