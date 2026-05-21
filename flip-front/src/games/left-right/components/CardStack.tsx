import React from 'react';
import { SwipeableCardStack } from '../../../components';
import { PoliticalOrientation, PoliticalPlayer } from '../types';
import { SwipeableCard } from './SwipeableCard';

interface CardStackProps {
  players: PoliticalPlayer[];
  onSwipe: (playerId: string, direction: PoliticalOrientation) => void;
  onComplete?: () => void;
}

export function CardStack({ players, onSwipe, onComplete }: CardStackProps) {
  return (
    <SwipeableCardStack
      items={players}
      heightRatio={0.6}
      onSwipe={(player, direction) => onSwipe(player.id, direction)}
      onComplete={onComplete}
      CardComponent={({ item, ...props }) => <SwipeableCard player={item} {...props} />}
    />
  );
}
