import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function SettingsScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { theme, preference, setPreference, toggleDarkMode } = useTheme();

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const isDark = theme.mode === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          {t('settings:title')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            {t('settings:appearance.title', 'Apparence')}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
            {t('settings:appearance.subtitle', 'Thème clair/sombre')}
          </Text>

          <View
            style={[
              styles.rowBetween,
              { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.rowText, { color: theme.colors.text.primary }]}>
              {t('settings:appearance.darkMode', 'Dark Mode')}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ true: theme.colors.primary }}
              thumbColor={isDark ? theme.colors.primary : '#fff'}
            />
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            {t('settings:language.title')}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
            {t('settings:language.subtitle')}
          </Text>

          <View
            style={[
              styles.languageOptions,
              { backgroundColor: theme.colors.background, borderRadius: 12 },
            ]}
          >
            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  { borderBottomColor: theme.colors.border },
                  i18n.language === language.code && {
                    backgroundColor: `${theme.colors.primary}10`,
                  },
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text
                  style={[
                    styles.languageName,
                    { color: theme.colors.text.primary },
                    i18n.language === language.code && { color: theme.colors.primary },
                  ]}
                >
                  {language.name}
                </Text>
                {i18n.language === language.code && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            {t('settings:about.title')}
          </Text>
          <Text style={[styles.aboutDescription, { color: theme.colors.text.secondary }]}>
            {t('settings:about.description')}
          </Text>
          <Text style={[styles.version, { color: theme.colors.text.secondary }]}>
            {t('settings:about.version', { version: '1.0.0' })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  aboutDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
  },
  languageOption: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 16,
  },
  languageOptions: {
    overflow: 'hidden',
  },
  placeholder: {
    width: 40,
  },
  rowBetween: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
