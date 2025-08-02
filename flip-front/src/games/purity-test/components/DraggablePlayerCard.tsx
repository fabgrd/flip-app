import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Colors } from '../../../constants';
import { PurityPlayer } from '../types';
import { Avatar } from '../../../components';

const { width: screenWidth } = Dimensions.get('window');

interface DraggablePlayerCardProps {
    player: PurityPlayer;
    hasAnswered: boolean;
    onAnswer: (playerId: string, answer: 'yes' | 'no') => void;
}

export function DraggablePlayerCard({ player, hasAnswered, onAnswer }: DraggablePlayerCardProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const handleAnswer = (answer: 'yes' | 'no') => {
        onAnswer(player.id, answer);
    };

    const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart: () => {
            scale.value = withSpring(1.1);
        },
        onActive: (event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        },
        onEnd: (event) => {
            scale.value = withSpring(1);

            // Zones de drop basées sur la position
            const dropZoneWidth = screenWidth / 2;
            const finalX = event.absoluteX;

            // Zone de gauche = NON (rouge), Zone de droite = OUI (vert)
            if (finalX < dropZoneWidth) {
                runOnJS(handleAnswer)('no');
            } else {
                runOnJS(handleAnswer)('yes');
            }

            // Remettre la carte à sa position d'origine
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        };
    });

    if (hasAnswered) {
        return (
            <View style={[styles.playerCard, styles.answeredCard]}>
                <Avatar
                    name={player.name}
                    avatar={player.avatar}
                    size={40}
                />
                <View style={styles.playerContent}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.answeredText}>✓ Répondu</Text>
                </View>
            </View>
        );
    }

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.playerCard, animatedStyle]}>
                <Avatar
                    name={player.name}
                    avatar={player.avatar}
                    size={40}
                />
                <View style={styles.playerContent}>
                    <Text style={styles.playerName}>{player.name}</Text>
                </View>
            </Animated.View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    playerCard: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
        gap: 12,
    },
    answeredCard: {
        backgroundColor: Colors.success,
        borderColor: Colors.success,
        opacity: 0.7,
    },
    playerContent: {
        flex: 1,
        alignItems: 'center',
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.primary,
        textAlign: 'center',
    },
    answeredText: {
        fontSize: 12,
        color: Colors.text.white,
        fontWeight: 'bold',
        marginTop: 4,
    },
}); 