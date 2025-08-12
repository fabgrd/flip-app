import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import en from './locales/en';
import fr from './locales/fr';
import zh from './locales/zh';

const LANGUAGE_DETECTOR = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            const language = await AsyncStorage.getItem('user-language');
            if (language) {
                callback(language);
            } else {
                callback('fr'); // Default to French
            }
        } catch (error) {
            callback('fr');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem('user-language', language);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    },
};

const NAMESPACES = ['common', 'navigation', 'home', 'games', 'purityTest', 'settings', 'cameleon'] as const;

i18n
    .use(LANGUAGE_DETECTOR)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        fallbackLng: 'fr',
        debug: __DEV__,
        defaultNS: 'common',
        ns: NAMESPACES as unknown as string[],
        fallbackNS: 'common',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en,
            fr,
            zh,
        },
        returnNull: false,
    });

export default i18n; 