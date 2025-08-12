import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import './src/i18n';

import { PlayersProvider } from './src/contexts/PlayersContext';
import { HomeScreen, GameSelectScreen, PurityTestScreen, PurityResultsScreen, SettingsScreen, CameleonScreen, CameleonResultsScreen } from './src/screens';
import { RootStackParamList } from './src/types';
import { PortalProvider } from '@gorhom/portal';


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PortalProvider>
      <PlayersProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="GameSelect" component={GameSelectScreen} />
            <Stack.Screen name="PurityTest" component={PurityTestScreen} />
            <Stack.Screen name="PurityResults" component={PurityResultsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Cameleon" component={CameleonScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="CameleonResults" component={CameleonResultsScreen} options={{ gestureEnabled: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PlayersProvider>
    </PortalProvider>
  );
}
