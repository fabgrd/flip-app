import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GameState } from '../../types/game';
import { VerticalGameLine } from './VerticalGameLine';
import { Colors } from '../../constants';

interface VerticalGameBoardProps {
    gameState: GameState;
    onLineSelect?: (lineId: number) => void;
}

export function VerticalGameBoard({ gameState, onLineSelect }: VerticalGameBoardProps) {
    return (
        <View style={styles.container}>
            {gameState.lines.map((line, index) => (
                <React.Fragment key={line.id}>
                    <VerticalGameLine
                        line={line}
                        isSelectable={gameState.selectingLine}
                        onSelect={() => onLineSelect?.(line.id)}
                    />
                    {index < gameState.lines.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.background,
        paddingHorizontal: 10,
        justifyContent: 'space-around',
    },
    divider: {
        width: 1,
        backgroundColor: Colors.surface,
    },
}); 