import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  screen: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 15,
  },
  
  buttonPrimary: {
    backgroundColor: Colors.button.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.button.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  buttonSecondary: {
    backgroundColor: Colors.button.secondary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.button.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  buttonText: {
    color: Colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  inputFocused: {
    borderColor: Colors.primary,
  },
}); 