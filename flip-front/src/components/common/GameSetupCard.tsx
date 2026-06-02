import React, { Children, Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { T } from '../../constants/flipTokens';

interface GameSetupCardProps {
  accentColor?: string;
  title?: string;
  children: React.ReactNode;
}

export function GameSetupCard({ accentColor = T.lemon, title, children }: GameSetupCardProps) {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View style={s.card}>
      {title ? (
        <View style={[s.header, { backgroundColor: accentColor }]}>
          <Text style={s.headerText}>{title}</Text>
        </View>
      ) : null}
      {items.map((child, i) => (
        <Fragment key={i}>
          {i > 0 ? <View style={s.divider} /> : null}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

interface SetupSectionProps {
  label: string;
  children: React.ReactNode;
}

export function GameSetupSection({ label, children }: SetupSectionProps) {
  return (
    <View style={s.section}>
      <Text style={s.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 20,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: T.ink,
  },
  headerText: {
    color: T.ink,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: T.ink,
    opacity: 0.12,
    marginHorizontal: 12,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  sectionLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
