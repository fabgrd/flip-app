import { StyleSheet } from 'react-native';
import { Theme } from './themes';

export const createGlobalStyles = (theme: Theme) =>
  StyleSheet.create({
    buttonPrimary: {
      alignItems: 'center',
      backgroundColor: theme.colors.button.primary,
      borderRadius: 25,
      elevation: 6,
      justifyContent: 'center',
      paddingHorizontal: 30,
      paddingVertical: 15,
      shadowColor: theme.colors.button.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },

    buttonSecondary: {
      alignItems: 'center',
      backgroundColor: theme.colors.button.secondary,
      borderRadius: 25,
      elevation: 6,
      justifyContent: 'center',
      paddingHorizontal: 30,
      paddingVertical: 15,
      shadowColor: theme.colors.button.secondary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },

    buttonText: {
      color: theme.colors.text.white,
      fontSize: 18,
      fontWeight: 'bold',
    },

    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },

    input: {
      backgroundColor: theme.colors.surface,
      borderColor: 'transparent',
      borderRadius: 15,
      borderWidth: 2,
      fontSize: 16,
      paddingHorizontal: 20,
      paddingVertical: 15,
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
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 15,
    },

    title: {
      color: theme.colors.text.primary,
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
  });
