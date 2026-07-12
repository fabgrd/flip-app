import type { ContentItem } from '../../content';
import type { QuiPourraitTheme } from './constants';

export type QuiPourraitStep = 'rules' | 'prompt' | 'handoff' | 'vote' | 'tally' | 'result' | 'end';

export interface QuiPourraitPrompt extends ContentItem {
  theme: QuiPourraitTheme;
}
