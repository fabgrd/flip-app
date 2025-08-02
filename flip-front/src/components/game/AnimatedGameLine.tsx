import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { GameLine as IGameLine } from '../../types/game';
import { AnimatedCard } from './AnimatedCard';
import { Colors } from '../../constants';
import * as Haptics from 'expo-haptics';

interface AnimatedGameLineProps {
    line: IGameLine;
    isSelectable?: boolean;
    isDragTarget?: boolean; // Zone de drop active
    onSelect?: () => void;
    onLayout?: (layout: { x: number; y: number; width: number; height: number }) => void;
}

export function AnimatedGameLine({
    line,
    isSelectable = false,
    isDragTarget = false,
    onSelect,
    onLayout
}: AnimatedGameLineProps) {

    const containerRef = useRef<View>(null);

    // Valeurs partagées pour les animations
    const scale = useSharedValue(1);
    const borderWidth = useSharedValue(2);
    const shadowOpacity = useSharedValue(0.1);

    // Animation quand la ligne devient une zone de drop active
    useEffect(() => {
        if (isDragTarget) {
            scale.value = withSequence(
                withSpring(1.05, { damping: 15 }),
                withSpring(1.02, { damping: 10 })
            );
            borderWidth.value = withTiming(3, { duration: 200 });
            shadowOpacity.value = withTiming(0.3, { duration: 200 });

            // Feedback haptique
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            scale.value = withSpring(1, { damping: 15 });
            borderWidth.value = withTiming(2, { duration: 200 });
            shadowOpacity.value = withTiming(0.1, { duration: 200 });
        }
    }, [isDragTarget]);

    // Animation au toucher pour la sélection
    const handlePressIn = () => {
        if (isSelectable) {
            scale.value = withSpring(0.98, { damping: 10 });
        }
    };

    const handlePressOut = () => {
        if (isSelectable) {
            scale.value = withSpring(1, { damping: 10 });
        }
    };

    const handlePress = () => {
        if (isSelectable && onSelect) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSelect();
        }
    };

    // Mesurer la position de la ligne pour le drag & drop
    const handleLayout = () => {
        if (containerRef.current && onLayout) {
            containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                onLayout({
                    x: pageX,
                    y: pageY,
                    width,
                    height,
                });
            });
        }
    };

    // Calculer les statistiques de la ligne
    const totalBulls = line.cards.reduce((sum, card) => sum + card.bulls, 0);
    const isFull = line.cards.length >= 5;
    const isEmpty = line.cards.length === 0;

    // Style animé pour le conteneur
    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        borderWidth: borderWidth.value,
        shadowOpacity: shadowOpacity.value,
    }));

    // Rendu du contenu
    const content = (
        <Animated.View
            ref={containerRef}
            style={[
                styles.container,
                animatedContainerStyle,
                {
                    borderColor: isDragTarget ? Colors.accent :
                        isSelectable ? Colors.primary :
                            isFull ? Colors.warning : 'transparent',
                    shadowColor: isDragTarget ? Colors.accent : Colors.primary,
                }
            ]}
            onLayout={handleLayout}
        >
            {/* En-tête de la ligne */}
            <View style={styles.header}>
                <Text style={styles.lineNumber}>Ligne {line.id + 1}</Text>
                <View style={styles.info}>
                    <Text style={styles.cardCount}>{line.cards.length}/5 cartes</Text>
                    <Text style={styles.bullCount}>{totalBulls} 🐮</Text>
                </View>
            </View>

            {/* Conteneur des cartes */}
            <View style={styles.cardsContainer}>
                {line.cards.map((card, index) => (
                    <View key={`${card.number}-${index}`} style={styles.cardWrapper}>
                        <AnimatedCard
                            card={card}
                            size="small"
                            isFaceUp={true}
                        />
                    </View>
                ))}

                {/* Emplacements vides avec animation */}
                {Array(5 - line.cards.length).fill(null).map((_, index) => (
                    <View key={`empty-${index}`} style={styles.cardWrapper}>
                        <View style={[
                            styles.emptyCard,
                            isDragTarget && index === 0 && styles.emptyCardHighlighted
                        ]}>
                            {isDragTarget && index === 0 && (
                                <Text style={styles.dropHint}>📤</Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            {/* Indicateur de sélection */}
            {isSelectable && (
                <View style={styles.selectPrompt}>
                    <Text style={styles.selectText}>
                        {isDragTarget ? 'Zone de dépôt' : 'Touchez pour sélectionner'}
                    </Text>
                </View>
            )}

            {/* Indicateur visuel pour les lignes pleines */}
            {isFull && (
                <View style={styles.fullIndicator}>
                    <Text style={styles.fullText}>⚠️ Ligne pleine</Text>
                </View>
            )}
        </Animated.View>
    );

    // Si sélectionnable, envelopper avec TouchableOpacity
    if (isSelectable && !isDragTarget) {
        return (
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1} // Géré par l'animation
            >
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 15,
        marginVertical: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 8,
        elevation: 6,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    lineNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },

    info: {
        alignItems: 'flex-end',
    },

    cardCount: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginBottom: 2,
    },

    bullCount: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.danger,
    },

    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        minHeight: 85, // Hauteur des petites cartes
    },

    cardWrapper: {
        marginRight: 4,
        marginBottom: 4,
    },

    emptyCard: {
        width: 60,
        height: 85,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.text.light,
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },

    emptyCardHighlighted: {
        borderColor: Colors.accent,
        backgroundColor: Colors.accent + '10',
        borderStyle: 'solid',
    },

    dropHint: {
        fontSize: 24,
    },

    selectPrompt: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.accent,
        borderRadius: 8,
        alignItems: 'center',
    },

    selectText: {
        color: Colors.text.white,
        fontWeight: '600',
        fontSize: 14,
    },

    fullIndicator: {
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: Colors.warning,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },

    fullText: {
        color: Colors.text.primary,
        fontSize: 12,
        fontWeight: '600',
    },
}); 