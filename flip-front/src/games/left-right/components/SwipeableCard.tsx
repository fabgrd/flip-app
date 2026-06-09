import React from 'react';
import { useTranslation } from 'react-i18next';

import { SwipeableCard as BaseSwipeableCard } from '../../../components';
import { POLITICAL_COLORS, POLITICAL_EMOJIS } from '../constants';
import { PoliticalOrientation, PoliticalPlayer } from '../types';

interface SwipeableCardProps {
  player: PoliticalPlayer;
  onSwipe: (direction: PoliticalOrientation) => void;
  onSwipeComplete?: () => void;
  isActive?: boolean;
  zIndex?: number;
}

export function SwipeableCard({
  player,
  onSwipe,
  onSwipeComplete,
  isActive = true,
  zIndex = 1,
}: SwipeableCardProps) {
  const { t } = useTranslation();

  const leftDirection = {
    key: 'left',
    color: POLITICAL_COLORS.left,
    overlayColor: 'rgba(244, 67, 54, 0.9)',
    emoji: POLITICAL_EMOJIS.left,
    label: t('leftRight:game.leftChoice'),
  };

  const rightDirection = {
    key: 'right',
    color: POLITICAL_COLORS.right,
    overlayColor: 'rgba(76, 175, 80, 0.9)',
    emoji: POLITICAL_EMOJIS.right,
    label: t('leftRight:game.rightChoice'),
  };

  const downDirection = {
    key: 'center',
    color: POLITICAL_COLORS.center,
    overlayColor: 'rgba(155, 89, 182, 0.92)',
    emoji: POLITICAL_EMOJIS.center,
    label: t('leftRight:game.centerChoice'),
    hideOverlay: true,
  };

  const handleSwipe = (direction: string) => {
    onSwipe(direction as PoliticalOrientation);
  };

  return (
    <BaseSwipeableCard
      player={player}
      leftDirection={leftDirection}
      rightDirection={rightDirection}
      downDirection={downDirection}
      onSwipe={handleSwipe}
      onSwipeComplete={onSwipeComplete}
      isActive={isActive}
      zIndex={zIndex}
    />
  );
}
