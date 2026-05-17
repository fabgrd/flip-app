import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DotBackground, FlatChunkyButton } from '../components';
import { T } from '../constants/flipTokens';
import { useTheme } from '../contexts/ThemeContext';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function SettingsScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { theme, toggleDarkMode } = useTheme();
  const [isDark] = useState(theme.mode === 'dark');

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <DotBackground opacity={0.06} />
      {/* Header */}
      <View style={styles.header}>
        <FlatChunkyButton
          size="sm"
          square
          color={T.paper}
          textColor={T.ink}
          onPress={handleBackPress}
        >
          <Feather name="arrow-left" size={18} color={T.ink} />
        </FlatChunkyButton>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{t('settings:title')}</Text>
          <Text style={styles.headerSub}>{t('settings:appearance.subtitle')}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings:appearance.title')}</Text>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>{t('settings:appearance.darkMode')}</Text>
                <Text style={styles.rowSub}>Mode nuit, ambiance plus douce.</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ true: T.ink, false: `${T.ink}30` }}
                thumbColor={isDark ? T.lemon : T.paper}
              />
            </View>
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings:language.title')}</Text>
          <View style={styles.card}>
            {LANGUAGES.map((language, idx) => {
              const isActive = i18n.language === language.code;
              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageRow,
                    isActive && styles.languageRowActive,
                    idx === LANGUAGES.length - 1 && styles.languageRowLast,
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text style={[styles.languageName, isActive && styles.languageNameActive]}>
                    {language.name}
                  </Text>
                  {isActive && <Feather name="check" size={18} color={T.mint} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings:about.title')}</Text>
          <View style={[styles.card, styles.aboutCard]}>
            <Text style={styles.aboutDescription}>{t('settings:about.description')}</Text>
            <View style={styles.versionPill}>
              <Text style={styles.versionText}>
                {t('settings:about.version', { version: '1.0.0' })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTitleWrap: { flex: 1, paddingHorizontal: 12 },
  headerTitle: {
    color: T.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 30,
  },
  headerSub: { color: T.inkSoft, fontSize: 12, marginTop: 2 },
  headerSpacer: { width: 44 },

  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 18 },

  section: { gap: 10 },
  sectionTitle: {
    color: T.ink,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  card: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    padding: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowTextWrap: { flex: 1 },
  rowTitle: { color: T.ink, fontSize: 16, fontWeight: '800' },
  rowSub: { color: T.muted, fontSize: 12, marginTop: 4 },

  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: T.rMd,
    borderWidth: 2,
    borderColor: T.ink,
    backgroundColor: T.bg,
    marginBottom: 10,
  },
  languageRowActive: {
    backgroundColor: T.ink,
    transform: [{ translateX: 3 }, { translateY: 3 }],
  },
  languageRowLast: { marginBottom: 0 },
  languageFlag: { fontSize: 20 },
  languageName: { flex: 1, color: T.ink, fontSize: 16, fontWeight: '800' },
  languageNameActive: { color: '#fff' },

  aboutCard: { paddingVertical: 18 },
  aboutDescription: { color: T.inkSoft, fontSize: 14, lineHeight: 20 },
  versionPill: {
    alignSelf: 'flex-start',
    backgroundColor: T.lemon,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 12,
  },
  versionText: { color: T.ink, fontSize: 12, fontWeight: '900' },
});
