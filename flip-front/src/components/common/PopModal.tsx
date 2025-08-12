import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Colors } from '../../constants';
import { Avatar } from './Avatar';

export interface PopModalProps {
    visible: boolean;
    title?: string;
    name?: string;
    avatar?: string;
    children?: React.ReactNode;
    badgeEmoji?: string;
    badgeColor?: string;
}

export function PopModal({ visible, title, name, avatar, children, badgeEmoji, badgeColor }: PopModalProps) {
    if (!visible) return null;
    return (
        <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} />
            <View style={styles.card} pointerEvents="auto">
                {name && (
                    <View style={styles.avatarWrapper}>
                        <Avatar name={name} avatar={avatar} size={84} />
                        {!!badgeEmoji && (
                            <Animated.Text entering={ZoomIn} style={[styles.badge, { color: badgeColor ?? '#C62828' }]}>
                                {badgeEmoji}
                            </Animated.Text>
                        )}
                    </View>
                )}
                {!!title && <Text style={styles.title}>{title}</Text>}
                {children}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
    card: { backgroundColor: Colors.background, borderRadius: 20, paddingVertical: 20, paddingHorizontal: 22, borderWidth: 3, borderColor: Colors.secondary, alignItems: 'center', shadowColor: Colors.secondary, shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 8, maxWidth: '86%' },
    avatarWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
    badge: { position: 'absolute', right: -6, bottom: -6, fontSize: 24 },
    title: { color: Colors.text.primary, fontWeight: '900', fontSize: 20, marginTop: 10, textAlign: 'center' },
}); 