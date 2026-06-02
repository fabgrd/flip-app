import React from 'react';
import { SwipeableCardStack } from '../../../components';
import { PurityPlayer } from '../types';
import { SwipeableCard } from './SwipeableCard';

interface CardStackProps {
  players: PurityPlayer[];
  onSwipe: (playerId: string, direction: 'yes' | 'no' | 'mega') => void;
  onComplete?: () => void;
}

export function CardStack({ players, onSwipe, onComplete }: CardStackProps) {
  return (
    <SwipeableCardStack<PurityPlayer, 'yes' | 'no' | 'mega'>
      items={players}
      heightRatio={0.8}
      onSwipe={(player, direction) => onSwipe(player.id, direction)}
      onComplete={onComplete}
      CardComponent={({ item, ...props }) => <SwipeableCard player={item} {...props} />}
    />
  );
}
