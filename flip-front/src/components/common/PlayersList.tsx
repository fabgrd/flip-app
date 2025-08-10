import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Player } from '../../types';
import { Colors } from '../../constants';
import { Avatar } from './Avatar';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useTranslation } from 'react-i18next';

interface PlayersListProps {
    players: Player[];
    onRemovePlayer: (id: string) => void;
    onUpdateAvatar: (id: string, avatar: string) => void;
}

export function PlayersList({ players, onRemovePlayer, onUpdateAvatar }: PlayersListProps) {
    const { showImagePicker } = useImagePicker();
    const { t } = useTranslation();
    const handleAvatarPress = async (player: Player) => {
        const imageUri = await showImagePicker();
        if (imageUri) {
            onUpdateAvatar(player.id, imageUri);
        }
    };

    if (players.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('messages.noPlayersAdded')}</Text>
                <Text style={styles.emptySubText}>{t('messages.addAtLeastOnePlayerToStart')}</Text>
            </View>
        );
    }

    const renderPlayer = ({ item, index }: { item: Player; index: number }) => (
        <Animated.View
            entering={FadeInRight.delay(index * 100)}
            exiting={FadeOutLeft}
            style={styles.playerItem}
        >
            <View style={styles.playerInfo}>
                <Avatar
                    name={item.name}
                    avatar={item.avatar}
                    size={50}
                    onPress={() => handleAvatarPress(item)}
                    showEditIcon={true}
                />
                <Text style={styles.playerName}>{item.name}</Text>
            </View>

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemovePlayer(item.id)}
            >
                <Ionicons name="close" size={20} color={Colors.danger} />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.listTitle}>{t('labels.players')} ({players.length})</Text>
            <FlatList
                data={players}
                renderItem={renderPlayer}
                keyExtractor={(item) => item.id}
                // @ts-ignore
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },

    listTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 15,
    },

    listContent: {
        gap: 12,
    },

    playerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },

    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },

    playerName: {
        fontSize: 16,
        color: Colors.text.primary,
        fontWeight: '500',
    },

    removeButton: {
        padding: 8,
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },

    emptyText: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginBottom: 5,
    },

    emptySubText: {
        fontSize: 14,
        color: Colors.text.light,
        textAlign: 'center',
    },
}); 