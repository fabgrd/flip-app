import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GlobalStyles } from '../../constants';

interface GameRulesProps {
    visible: boolean;
    onClose: () => void;
}

export function GameRules({ visible, onClose }: GameRulesProps) {
    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>6 qui prend ! - Règles</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={Colors.text.white} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎯 Objectif</Text>
                        <Text style={styles.text}>
                            Évitez de récupérer des cartes ! Chaque carte collectée vous fait gagner des points de pénalité (têtes de bœuf 🐮).
                            Le joueur avec le moins de points gagne.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🃏 Préparation</Text>
                        <Text style={styles.text}>
                            • Chaque joueur reçoit 10 cartes numérotées de 1 à 104{'\n'}
                            • 4 cartes sont placées au centre pour former 4 lignes{'\n'}
                            • Les cartes contiennent des têtes de bœuf (points de pénalité)
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎮 Déroulement d'un tour</Text>
                        <Text style={styles.text}>
                            1. Chaque joueur choisit secrètement une carte de sa main{'\n'}
                            2. Toutes les cartes sont révélées simultanément{'\n'}
                            3. Les cartes sont placées dans l'ordre croissant sur les lignes{'\n'}
                            4. Chaque carte va sur la ligne dont la dernière carte est la plus proche (mais inférieure)
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>⚠️ Règles spéciales</Text>
                        <Text style={styles.text}>
                            • Si une ligne contient déjà 5 cartes, la 6ème remplace toute la ligne{'\n'}
                            • Le joueur qui place cette 6ème carte ramasse les 5 précédentes{'\n'}
                            • Si votre carte est trop petite pour toutes les lignes, vous devez choisir une ligne à ramasser
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🐮 Points de pénalité</Text>
                        <Text style={styles.text}>
                            • La plupart des cartes valent 1 tête de bœuf{'\n'}
                            • Les multiples de 5 : 2 têtes de bœuf{'\n'}
                            • Les multiples de 10 : 3 têtes de bœuf{'\n'}
                            • Les multiples de 11 : 5 têtes de bœuf{'\n'}
                            • Le 55 : 7 têtes de bœuf (le plus dangereux !)
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🏆 Fin de partie</Text>
                        <Text style={styles.text}>
                            Le jeu se termine quand :{'\n'}
                            • Toutes les cartes ont été jouées (10 tours){'\n'}
                            • Un joueur atteint 66 points ou plus{'\n\n'}
                            Le gagnant est celui qui a le moins de têtes de bœuf !
                        </Text>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[GlobalStyles.buttonPrimary, styles.gotItButton]}
                    onPress={onClose}
                >
                    <Text style={GlobalStyles.buttonText}>J'ai compris !</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    container: {
        backgroundColor: Colors.background,
        borderRadius: 20,
        maxHeight: '90%',
        width: '100%',
        maxWidth: 500,
    },

    header: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.white,
    },

    closeButton: {
        padding: 5,
    },

    content: {
        padding: 20,
    },

    section: {
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },

    text: {
        fontSize: 14,
        color: Colors.text.primary,
        lineHeight: 20,
    },

    gotItButton: {
        margin: 20,
        marginTop: 0,
    },
}); 