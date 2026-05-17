export enum ProjectName {
  COMMON_PLATFORM = 'common-platform',
  MIND_PUSH = 'mind-push',
  CAFE_RYNN = 'cafe-rynn',
}

export const PROJECT_DISPLAY_NAME: Record<ProjectName, string> = {
  [ProjectName.COMMON_PLATFORM]: '공통 플랫폼',
  [ProjectName.MIND_PUSH]: '마인드 푸시',
  [ProjectName.CAFE_RYNN]: '카페 린',
};