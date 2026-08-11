import React from 'react';
import { KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native';

/**
 * Lifts its children above the software keyboard.
 *
 * Needed wherever a TextInput sits inside a modal or an absolutely-positioned
 * overlay: Android's window-level `adjustResize` does not reach those, so the
 * keyboard covers the field. `padding` is the behaviour that works for centred
 * cards and bottom sheets on iOS; Android wants `height` instead.
 */
export function KeyboardAvoider({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={style}
      pointerEvents="box-none"
    >
      {children}
    </KeyboardAvoidingView>
  );
}
