import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme as NavTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import './src/i18n';

import { PortalProvider } from '@gorhom/portal';
import { View } from 'react-native';
import { PlayersProvider } from './src/contexts/PlayersContext';
import {
  HomeScreen,
  GameSelectScreen,
  PurityTestScreen,
  PurityResultsScreen,
  SettingsScreen,
  CameleonScreen,
  CameleonResultsScreen,
} from './src/screens';
import { RootStackParamList } from './src/types';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();

function ThemedAppNavigator() {
  const { theme } = useTheme();
  const navTheme: NavTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="GameSelect" component={GameSelectScreen} />
          <Stack.Screen name="PurityTest" component={PurityTestScreen} />
          <Stack.Screen name="PurityResults" component={PurityResultsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Cameleon" component={CameleonScreen} />
          <Stack.Screen
            name="CameleonResults"
            component={CameleonResultsScreen}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <ThemeProvider>
        <PlayersProvider>
          <ThemedAppNavigator />
        </PlayersProvider>
      </ThemeProvider>
    </PortalProvider>
  );
}
