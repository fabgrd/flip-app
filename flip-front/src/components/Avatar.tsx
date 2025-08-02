import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../constants';

interface AvatarProps {
    name: string;
    avatar?: string;
    size?: number;
    onPress?: () => void;
    showEditIcon?: boolean;
}

export function Avatar({ name, avatar, size = 50, onPress, showEditIcon = false }: AvatarProps) {
    const getInitials = (fullName: string) => {
        return fullName
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getBackgroundColor = (fullName: string) => {
        const colors = [
            Colors.primary,
            Colors.secondary,
            Colors.accent,
            Colors.success,
            Colors.warning,
            Colors.danger,
        ];
        let hash = 0;
        for (let i = 0; i < fullName.length; i++) {
            hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const containerStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
    };

    if (avatar) {
        return (
            <TouchableOpacity onPress={onPress} disabled={!onPress}>
                <View style={[styles.container, containerStyle]}>
                    <Image
                        source={{ uri: avatar }}
                        style={[styles.image, containerStyle]}
                        contentFit="cover"
                    />
                    {showEditIcon && (
                        <View style={styles.editIcon}>
                            <Text style={styles.editIconText}>📷</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={!onPress}>
            <View style={[
                styles.container,
                styles.defaultAvatar,
                containerStyle,
                { backgroundColor: getBackgroundColor(name) }
            ]}>
                <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
                    {getInitials(name)}
                </Text>
                {showEditIcon && (
                    <View style={styles.editIcon}>
                        <Text style={styles.editIconText}>📷</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        borderWidth: 2,
        borderColor: Colors.background,
    },
    defaultAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.background,
    },
    initials: {
        color: Colors.text.white,
        fontWeight: 'bold',
    },
    editIcon: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.background,
    },
    editIconText: {
        fontSize: 10,
    },
}); 