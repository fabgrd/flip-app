import React from 'react';

import { SwipeableCard as BaseSwipeableCard } from '../../../components';
import { PurityPlayer } from '../types';

interface SwipeableCardProps {
  player: PurityPlayer;
  onSwipe: (direction: 'yes' | 'no' | 'mega') => void;
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
  const leftDirection = {
    key: 'no',
    color: '#9C1919',
    overlayColor: 'rgba(244, 67, 54, 0.9)',
    emoji: '❌',
    label: 'No',
  };

  const rightDirection = {
    key: 'yes',
    color: '#1B5E20',
    overlayColor: 'rgba(76, 175, 80, 0.9)',
    emoji: '✅',
    label: 'Yes',
  };

  const downDirection = {
    key: 'mega',
    color: '#6D28D9',
    overlayColor: 'rgba(109, 40, 217, 0.92)',
    emoji: '😈',
    label: 'MEGA ×2',
  };

  const handleSwipe = (direction: string) => {
    onSwipe(direction as 'yes' | 'no' | 'mega');
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
