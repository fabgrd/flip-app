import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { T } from '../../constants/flipTokens';
import { Player } from '../../types';
import { ChunkyButton } from './ChunkyButton';
import { DotBackground } from './DotBackground';
import { GameHeader } from './GameHeader';
import { GameCard, StickerBadge } from './GamePrimitives';
import { InitialAvatar } from './InitialAvatar';

export interface PodiumEntry {
  /** The player shown on this podium row. */
  player: Player;
  /** Original index in the players array (drives the avatar color). */
  index: number;
  /** The metric shown on the right (score, explosions, …). */
  value: number;
}

export interface GamePodiumProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  /** Full ranking, already sorted descending. The component shows the top 3. */
  entries: PodiumEntry[];
  /** Emoji medals for ranks 1-3. Defaults to the classic gold/silver/bronze. */
  medals?: string[];
  /** Screen background (usually the game accent). */
  backgroundColor: string;
  /** When the background is dark, render the hero title/subtitle in white. */
  onDark?: boolean;
  /** Accent color forwarded to the header's rules sheet. */
  accentColor: string;
  /** Color of the per-row metric value. */
  countColor: string;
  badge: { text: string; color: string; textColor?: string };
  title: string;
  subtitle: string;
  /** Small caption under each row's metric value. */
  scoreLabel: string;
  rules: { title: string; steps: { n: string; title: string; desc: string }[] };
  playAgainLabel: string;
  backLabel: string;
  onReplay: () => void;
  onExit: () => void;
  onSettings: () => void;
}

const DEFAULT_MEDALS = ['🥇', '🥈', '🥉'];

/**
 * Shared end-of-game podium. Renders the header (with rules + player menu),
 * a hero badge/title/subtitle, the top-3 cards and the replay/back buttons.
 * Extracted from the per-game podiums which were byte-for-byte identical apart
 * from colors, medals and copy.
 */
export function GamePodium({
  players,
  onPlayersChange,
  entries,
  medals = DEFAULT_MEDALS,
  backgroundColor,
  onDark = false,
  accentColor,
  countColor,
  badge,
  title,
  subtitle,
  scoreLabel,
  rules,
  playAgainLabel,
  backLabel,
  onReplay,
  onExit,
  onSettings,
}: GamePodiumProps) {
  const top3 = entries.slice(0, 3);
  const titleColor = onDark ? '#fff' : T.ink;
  const subtitleColor = onDark ? 'rgba(255,255,255,0.92)' : T.inkSoft;

  return (
    <SafeAreaView style={[pd.screen, { backgroundColor }]}>
      <DotBackground color={T.ink} opacity={0.08} gap={16} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{ title: rules.title, rules: rules.steps, accentColor }}
        players={players}
        onPlayersChange={onPlayersChange}
      />

      <ScrollView contentContainerStyle={pd.content} showsVerticalScrollIndicator={false}>
        <View style={pd.hero}>
          <StickerBadge color={badge.color} rotation={-5} textColor={badge.textColor}>
            {badge.text}
          </StickerBadge>
          <Text style={[pd.title, { color: titleColor }]}>{title}</Text>
          <Text style={[pd.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
        </View>

        <View style={pd.cards}>
          {top3.map(({ player, index, value }, idx) => (
            <GameCard key={player.id} color={T.paper} style={pd.card}>
              <View style={pd.cardRow}>
                <Text style={pd.medal}>{medals[idx]}</Text>
                <InitialAvatar index={index} size={48} radius={14} />
                <Text style={pd.playerName}>{player.name}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[pd.count, { color: countColor }]}>{value}</Text>
                  <Text style={pd.countLabel}>{scoreLabel}</Text>
                </View>
              </View>
            </GameCard>
          ))}
        </View>

        <View style={pd.btnStack}>
          <ChunkyButton full color={T.ink} textColor="#fff" size="lg" onPress={onReplay}>
            {playAgainLabel}
          </ChunkyButton>
          <ChunkyButton full color={T.paper} size="md" onPress={onExit}>
            {backLabel}
          </ChunkyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const pd = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 40 },
  hero: { paddingHorizontal: 20, paddingTop: 14, alignItems: 'center' },
  title: {
    marginTop: 22,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 46,
    textAlign: 'center',
  },
  subtitle: { marginTop: 12, fontSize: 15, textAlign: 'center' },
  cards: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  card: { borderRadius: 22, padding: 14 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  medal: { fontSize: 30, width: 36, textAlign: 'center' },
  playerName: {
    flex: 1,
    color: T.ink,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  count: { fontSize: 26, fontWeight: '800', lineHeight: 28 },
  countLabel: { color: T.muted, fontSize: 9.5, letterSpacing: 0.5 },
  btnStack: { paddingHorizontal: 20, paddingTop: 26, gap: 10 },
});
