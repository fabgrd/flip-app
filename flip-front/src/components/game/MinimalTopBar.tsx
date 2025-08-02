import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useAnimatedProps
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants';
import * as Haptics from 'expo-haptics';

interface MinimalTopBarProps {
    currentTurn: number;
    maxTurns: number;
    onGoBack: () => void;
    onShowRules: () => void;
}

export function MinimalTopBar({
    currentTurn,
    maxTurns,
    onGoBack,
    onShowRules
}: MinimalTopBarProps) {

    const progress = currentTurn / maxTurns;
    const progressWidth = useSharedValue(0);

    // Animer la progress bar
    React.useEffect(() => {
        progressWidth.value = withTiming(progress * 100, { duration: 800 });
    }, [progress]);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    const handleGoBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onGoBack();
    };

    const handleShowRules = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onShowRules();
    };

    return (
        <View style={styles.container}>
            {/* Bouton retour */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
            </TouchableOpacity>

            {/* Section centrale avec progress */}
            <View style={styles.centerSection}>
                <Text style={styles.turnText}>Tour {currentTurn}</Text>

                {/* Progress bar container */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <Animated.View style={[styles.progressBar, progressStyle]}>
                            <LinearGradient
                                colors={[Colors.primary, Colors.secondary]}
                                style={styles.progressGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </Animated.View>
                    </View>

                    {/* Points de progression */}
                    <View style={styles.progressDots}>
                        {Array(maxTurns).fill(null).map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index < currentTurn && styles.dotCompleted
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </View>

            {/* Bouton règles */}
            <TouchableOpacity
                style={styles.rulesButton}
                onPress={handleShowRules}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="help-circle-outline" size={22} color={Colors.text.secondary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surface,
        minHeight: 50,
    },

    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        minWidth: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },

    centerSection: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    turnText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },

    progressContainer: {
        width: '100%',
        position: 'relative',
    },

    progressTrack: {
        height: 4,
        backgroundColor: Colors.surface,
        borderRadius: 2,
        overflow: 'hidden',
    },

    progressBar: {
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
    },

    progressGradient: {
        flex: 1,
    },

    progressDots: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: -1,
        left: 0,
        right: 0,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.text.light,
    },

    dotCompleted: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },

    rulesButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        minWidth: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
}); 