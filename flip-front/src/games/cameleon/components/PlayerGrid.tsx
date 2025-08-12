import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../constants';
import type { CameleonAssignedPlayer } from '../types';
import { Avatar } from '../../../components/common/Avatar';

interface PlayerGridProps {
    players: CameleonAssignedPlayer[];
    isVote: boolean;
    clueOrder?: string[];
    selectedForElimination?: string | null;
    onSelect?: (id: string) => void;
    t: (key: string, opts?: any) => string;
}

export function PlayerGrid({ players, isVote, clueOrder = [], selectedForElimination, onSelect, t }: PlayerGridProps) {
    const ordered = clueOrder.length > 0 ? clueOrder.map(id => players.find(p => p.id === id)!).filter(Boolean) as CameleonAssignedPlayer[] : players;

    return (
        <View style={{ paddingHorizontal: 12, flex: 1 }}>
            <FlatList
                style={{ flex: 1 }}
                data={ordered}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item, index }) => {
                    const inner = (
                        <>
                            <Avatar name={item.name} avatar={item.avatar} size={72} />
                            <View style={styles.statusContainer}>
                                {item.isEliminated ? (
                                    <View style={styles.eliminatedPill}><Text style={styles.eliminatedPillText}>{t('cameleon:badges.eliminated')}</Text></View>
                                ) : (
                                    <Text style={styles.gridOrder}>{index + 1}</Text>
                                )}
                            </View>
                            <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
                        </>
                    );
                    const selected = selectedForElimination === item.id && isVote;
                    if (isVote && !item.isEliminated && onSelect) {
                        return (
                            <TouchableOpacity style={[styles.gridItem, selected && styles.selectedItem]} onPress={() => onSelect(item.id)}>
                                {inner}
                            </TouchableOpacity>
                        );
                    }
                    return (
                        <View style={[styles.gridItem, selected && styles.selectedItem]}>
                            {inner}
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    gridItem: { flexBasis: '33.333%', alignSelf: 'stretch', alignItems: 'center', paddingVertical: 14, height: 134, borderRadius: 12 },
    gridOrder: { fontSize: 13, color: Colors.primary },
    statusContainer: { height: 24, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
    gridName: { fontSize: 13, color: Colors.text.primary, marginTop: 6, maxWidth: 100, textAlign: 'center' },
    eliminatedPill: { paddingHorizontal: 10, paddingVertical: 3, backgroundColor: Colors.danger, borderRadius: 12 },
    eliminatedPillText: { color: Colors.text.white, fontSize: 11, fontWeight: '800' },
    selectedItem: { backgroundColor: 'rgba(255,107,107,0.10)', borderColor: Colors.primary, borderWidth: 1.5 },
}); 