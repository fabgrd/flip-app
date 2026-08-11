import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

/**
 * Swallows Android's hardware/gesture back while the screen is focused.
 *
 * Screens declared with `gestureEnabled: false` are already unpoppable on iOS,
 * but that option says nothing about Android's back button — without this the
 * back button drops the player straight out of a results screen. No-op on iOS,
 * where BackHandler never fires.
 */
export function useBlockHardwareBack(enabled = true): void {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return undefined;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [enabled]),
  );
}
