export type RFCategoryId = 'stalker' | 'manipulateur' | 'narcisse' | 'drama' | 'collant';

export type RFLevelKey = 'soft' | 'chill' | 'hot' | 'hard';

export type RFQuestionConfig = {
  catCounts: Record<RFCategoryId, number>;
  maxLevel: RFLevelKey;
};
