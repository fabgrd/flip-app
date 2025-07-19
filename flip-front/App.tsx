import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { PlayersProvider } from './src/contexts/PlayersContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameSelectScreen } from './src/screens/GameSelectScreen';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PlayersProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="GameSelect" component={GameSelectScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlayersProvider>
  );
}
