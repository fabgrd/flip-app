import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const GlobalStyles = StyleSheet.create({
  buttonPrimary: {
    alignItems: 'center',
    backgroundColor: Colors.button.primary,
    borderRadius: 25,
    elevation: 6,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    shadowColor: Colors.button.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  buttonSecondary: {
    alignItems: 'center',
    backgroundColor: Colors.button.secondary,
    borderRadius: 25,
    elevation: 6,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    shadowColor: Colors.button.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  buttonText: {
    color: Colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },

  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },

  input: {
    backgroundColor: Colors.surface,
    borderColor: 'transparent',
    borderRadius: 15,
    borderWidth: 2,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  inputFocused: {
    borderColor: Colors.primary,
  },

  screen: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  subtitle: {
    color: Colors.text.secondary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },

  title: {
    color: Colors.text.primary,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
});
