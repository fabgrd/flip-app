import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants';

const LANGUAGES = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function SettingsScreen() {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();

    const handleLanguageChange = async (languageCode: string) => {
        await i18n.changeLanguage(languageCode);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('settings:title')}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Language Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings:language.title')}</Text>
                    <Text style={styles.sectionSubtitle}>{t('settings:language.subtitle')}</Text>

                    <View style={styles.languageOptions}>
                        {LANGUAGES.map((language) => (
                            <TouchableOpacity
                                key={language.code}
                                style={[
                                    styles.languageOption,
                                    i18n.language === language.code && styles.languageOptionSelected
                                ]}
                                onPress={() => handleLanguageChange(language.code)}
                            >
                                <Text style={styles.languageFlag}>{language.flag}</Text>
                                <Text style={[
                                    styles.languageName,
                                    i18n.language === language.code && styles.languageNameSelected
                                ]}>
                                    {language.name}
                                </Text>
                                {i18n.language === language.code && (
                                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings:about.title')}</Text>
                    <Text style={styles.aboutDescription}>
                        {t('settings:about.description')}
                    </Text>
                    <Text style={styles.version}>
                        {t('settings:about.version', { version: '1.0.0' })}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 16,
    },
    languageOptions: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        overflow: 'hidden',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    languageOptionSelected: {
        backgroundColor: `${Colors.primary}10`,
    },
    languageFlag: {
        fontSize: 24,
        marginRight: 12,
    },
    languageName: {
        flex: 1,
        fontSize: 16,
        color: Colors.text.primary,
    },
    languageNameSelected: {
        color: Colors.primary,
        fontWeight: '600',
    },
    aboutDescription: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    version: {
        fontSize: 12,
        color: Colors.text.secondary,
        fontStyle: 'italic',
    },
}); 