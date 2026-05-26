import AsyncStorage from '@react-native-async-storage/async-storage';
import { PortalProvider } from '@gorhom/portal';
import {
  DefaultTheme,
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './src/i18n';

import { ErrorBoundary } from './src/components';
import { PlayersProvider } from './src/contexts/PlayersContext';
import { PreferencesProvider } from './src/contexts/PreferencesContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { EntitlementsProvider } from './src/entitlements';
import { linking } from './src/lib/linking';
import { initSentry } from './src/lib/sentry';
import { PaywallProvider } from './src/paywall';
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

initSentry();

const Stack = createStackNavigator<RootStackParamList>();

const NAV_STATE_STORAGE_KEY = 'flip_nav_state_v1';
// If the saved nav state is older than this, restart at Home rather than mid-game.
const NAV_STATE_MAX_AGE_MS = 1000 * 60 * 60 * 6;

type PersistedNavState = {
  state: NavigationState;
  savedAt: number;
};

function ThemedAppNavigator() {
  const { theme } = useTheme();
  const [initialState, setInitialState] = useState<NavigationState | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(NAV_STATE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedNavState;
          if (
            parsed?.state &&
            typeof parsed.savedAt === 'number' &&
            Date.now() - parsed.savedAt < NAV_STATE_MAX_AGE_MS
          ) {
            if (!cancelled) setInitialState(parsed.state);
          } else {
            await AsyncStorage.removeItem(NAV_STATE_STORAGE_KEY);
          }
        }
      } catch {
        await AsyncStorage.removeItem(NAV_STATE_STORAGE_KEY).catch(() => {});
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer
        theme={DefaultTheme}
        linking={linking}
        initialState={initialState}
        onStateChange={(state) => {
          if (!state) return;
          const route = state.routes[state.index];
          // Don't persist Home — that's the natural restart point.
          if (!route || route.name === 'Home') {
            AsyncStorage.removeItem(NAV_STATE_STORAGE_KEY).catch(() => {});
            return;
          }
          const payload: PersistedNavState = { state, savedAt: Date.now() };
          AsyncStorage.setItem(NAV_STATE_STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
        }}
      >
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
    <ErrorBoundary>
      <SafeAreaProvider>
        <PortalProvider>
          <ThemeProvider>
            <EntitlementsProvider>
              <PreferencesProvider>
                <PaywallProvider>
                  <PlayersProvider>
                    <ThemedAppNavigator />
                  </PlayersProvider>
                </PaywallProvider>
              </PreferencesProvider>
            </EntitlementsProvider>
          </ThemeProvider>
        </PortalProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
