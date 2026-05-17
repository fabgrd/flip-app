import React from 'react';
import { SwipeableCardStack } from '../../../components';
import { SwipeableCard } from './SwipeableCard';
import { PurityPlayer } from '../types';

interface CardStackProps {
  players: PurityPlayer[];
  onSwipe: (playerId: string, direction: 'yes' | 'no') => void;
  onComplete?: () => void;
}

export function CardStack({ players, onSwipe, onComplete }: CardStackProps) {
  return (
    <SwipeableCardStack
      items={players}
      heightRatio={0.8}
      onSwipe={(player, direction) => onSwipe(player.id, direction)}
      onComplete={onComplete}
      CardComponent={({ item, ...props }) => (
        <SwipeableCard player={item} {...props} />
      )}
    />
  );
}
