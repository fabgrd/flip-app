import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import './src/i18n';

import { PortalProvider } from '@gorhom/portal';
import { View } from 'react-native';
import { PlayersProvider } from './src/contexts/PlayersContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import {
  AperoScreen,
  CameleonResultsScreen,
  CameleonScreen,
  CastingScreen,
  GameSelectScreen,
  HomeScreen,
  LeftRightResultsScreen,
  LeftRightScreen,
  MedusaScreen,
  ParanoiaScreen,
  PurityResultsScreen,
  PurityTestScreen,
  RedFlagScreen,
  SettingsScreen,
} from './src/screens';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

function ThemedAppNavigator() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer theme={DefaultTheme}>
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
          <Stack.Screen name="LeftRight" component={LeftRightScreen} />
          <Stack.Screen
            name="LeftRightResults"
            component={LeftRightResultsScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Paranoia" component={ParanoiaScreen} />
          <Stack.Screen name="Medusa" component={MedusaScreen} />
          <Stack.Screen name="Apero" component={AperoScreen} />
          <Stack.Screen name="Casting" component={CastingScreen} />
          <Stack.Screen name="RedFlag" component={RedFlagScreen} />
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
