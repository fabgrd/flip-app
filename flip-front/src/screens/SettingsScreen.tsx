import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChunkyButton, DotBackground, SuggestButton } from '../components';
import { T } from '../constants/flipTokens';
import { useDrinksMode } from '../hooks';
import { usePaywall } from '../paywall';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export function SettingsScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const drinks = useDrinksMode();
  const { open: openPaywall } = usePaywall();

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDrinksToggle = (value: boolean) => {
    if (!drinks.available) {
      openPaywall('drinks_mode');
      return;
    }
    drinks.setEnabled(value);
  };

  const handleDrinksRowPress = () => {
    if (!drinks.available) openPaywall('drinks_mode');
  };

  return (
    <SafeAreaView style={styles.container}>
      <DotBackground opacity={0.06} />
      <View style={styles.header}>
        <ChunkyButton
          size="sm"
          square
          color={T.paper}
          textColor={T.ink}
          onPress={handleBackPress}
        >
          <Feather name="arrow-left" size={18} color={T.ink} />
        </ChunkyButton>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{t('settings:title')}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Drinks mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings:drinks.title')}</Text>
          <TouchableOpacity
            activeOpacity={drinks.available ? 1 : 0.85}
            onPress={handleDrinksRowPress}
            disabled={drinks.available}
            style={styles.card}
          >
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <View style={styles.toggleLabelLine}>
                  <Text style={styles.toggleLabel}>{t('settings:drinks.label')}</Text>
                  {!drinks.available && (
                    <View style={styles.proBadge}>
                      <Feather name="lock" size={10} color="#fff" />
                      <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.toggleDescription}>
                  {drinks.available
                    ? t('settings:drinks.description')
                    : t('settings:drinks.lockedHint')}
                </Text>
              </View>
              <Switch
                value={drinks.enabled}
                onValueChange={handleDrinksToggle}
                trackColor={{ false: T.paper, true: T.mint }}
                thumbColor={T.ink}
                ios_backgroundColor={T.paper}
              />
            </View>
          </TouchableOpacity>
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

        {/* Suggest */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings:suggest.label')}</Text>
          <View style={styles.card}>
            <SuggestButton />
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

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTextWrap: { flex: 1, gap: 4 },
  toggleLabelLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { color: T.ink, fontSize: 16, fontWeight: '900' },
  toggleDescription: { color: T.inkSoft, fontSize: 12, lineHeight: 16 },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  proBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

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
