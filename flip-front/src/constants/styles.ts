import { StyleSheet } from 'react-native';
import { T } from './flipTokens';
import { Theme } from './themes';

export const createGlobalStyles = (theme: Theme) =>
  StyleSheet.create({
    // Chunky primary button — 2px border + hard offset shadow
    buttonPrimary: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: T.rMd,
      borderWidth: 2,
      borderColor: T.ink,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      shadowColor: T.ink,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },

    buttonSecondary: {
      alignItems: 'center',
      backgroundColor: theme.colors.secondary,
      borderRadius: T.rMd,
      borderWidth: 2,
      borderColor: T.ink,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      shadowColor: T.ink,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },

    buttonText: {
      color: T.ink,
      fontSize: 17,
      fontWeight: '800',
      letterSpacing: -0.3,
    },

    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },

    input: {
      backgroundColor: theme.colors.surface,
      borderColor: T.ink,
      borderRadius: T.rSm,
      borderWidth: 2,
      fontSize: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },

    inputFocused: {
      borderColor: theme.colors.primary,
    },

    screen: {
      flex: 1,
      padding: 20,
      paddingTop: 60,
    },

    subtitle: {
      color: theme.colors.text.secondary,
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 12,
    },

    title: {
      color: theme.colors.text.primary,
      fontSize: 40,
      fontWeight: '900',
      letterSpacing: -1.5,
      lineHeight: 40,
      marginBottom: 16,
    },
  });
