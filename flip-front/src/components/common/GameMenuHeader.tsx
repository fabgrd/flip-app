import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { T } from '../../constants/flipTokens';
import { usePlayers } from '../../contexts/PlayersContext';
import { Player } from '../../types';
import { Avatar } from './Avatar';
import { FlatChunkyButton } from './FlatChunkyButton';
import { RulesButton } from './RulesModal';

export interface GameRule {
  n: string;
  title: string;
  desc: string;
}

// ─── Players Modal ────────────────────────────────────────────────────────────

export function PlayersModal({
  visible,
  onClose,
  onPlayersChange,
  hint,
}: {
  visible: boolean;
  onClose: () => void;
  onPlayersChange: (players: Player[]) => void;
  hint?: string;
}) {
  const { players, addPlayer, removePlayer } = usePlayers();
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const ok = addPlayer(trimmed);
    if (!ok) {
      Alert.alert(t('common:errors.playerNameAlreadyExists'));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setName('');
  };

  const handleRemove = (id: string) => {
    removePlayer(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // sync parent game state whenever context players change
  React.useEffect(() => {
    if (visible) onPlayersChange(players);
  }, [players, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View entering={FadeIn.duration(180)} style={pm.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          entering={SlideInDown.springify().damping(20).stiffness(140)}
          exiting={SlideOutDown.duration(200)}
          style={pm.sheet}
        >
          {/* Handle */}
          <View style={pm.handle} />

          {/* Header */}
          <View style={pm.header}>
            <Text style={pm.title}>{t('common:labels.players')}</Text>
            <View style={pm.countBadge}>
              <Text style={pm.countText}>{players.length}</Text>
            </View>
          </View>

          {hint ? <Text style={pm.hint}>{hint}</Text> : null}

          {/* Input */}
          <View style={pm.inputRow}>
            <TextInput
              style={pm.input}
              placeholder={t('common:labels.playerName')}
              placeholderTextColor={T.muted}
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              maxLength={20}
              autoFocus={false}
            />
            <TouchableOpacity
              style={[pm.addBtn, !name.trim() && pm.addBtnDisabled]}
              onPress={handleAdd}
              activeOpacity={0.8}
              disabled={!name.trim()}
            >
              <Text style={pm.addBtnText}>{t('common:buttons.addPlus')}</Text>
            </TouchableOpacity>
          </View>

          {/* Players list */}
          <ScrollView
            style={pm.list}
            contentContainerStyle={pm.listContent}
            showsVerticalScrollIndicator={false}
          >
            {players.length === 0 ? (
              <View style={pm.empty}>
                <Text style={pm.emptyText}>{t('common:messages.noPlayersAdded')}</Text>
              </View>
            ) : (
              players.map((p) => (
                <View key={p.id} style={pm.playerRow}>
                  <Avatar name={p.name} avatar={p.avatar} size={26} />
                  <Text style={pm.playerName} numberOfLines={1} ellipsizeMode="tail">{p.name}</Text>
                  <TouchableOpacity
                    style={pm.removeBtn}
                    onPress={() => handleRemove(p.id)}
                    activeOpacity={0.7}
                    hitSlop={8}
                  >
                    <Text style={pm.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          {/* Close */}
          <TouchableOpacity style={pm.closeBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={pm.closeBtnText}>{t('common:buttons.close')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const pm = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(24,22,19,0.55)',
  },
  sheet: {
    backgroundColor: T.paper,
    borderTopLeftRadius: T.rLg,
    borderTopRightRadius: T.rLg,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: T.ink,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    height: '60%',
    shadowColor: T.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.inkSoft,
    opacity: 0.2,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: T.ink,
    letterSpacing: -0.8,
  },
  countBadge: {
    backgroundColor: T.tomato,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    minWidth: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: { color: '#fff', fontSize: 13, fontWeight: '900' },

  hint: {
    color: T.ink,
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: T.lemon,
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.bg,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    padding: 6,
    marginBottom: 14,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  input: {
    flex: 1,
    color: T.ink,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  addBtn: {
    backgroundColor: T.ink,
    borderRadius: T.rSm,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addBtnDisabled: { opacity: 0.35 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  list: { flex: 1 },
  listContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 4,
  },

  empty: {
    paddingVertical: 24,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: { color: T.muted, fontSize: 14, fontStyle: 'italic' },

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingLeft: 6,
    paddingRight: 10,
    paddingVertical: 5,
    shadowColor: T.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  playerName: {
    color: T.ink,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    maxWidth: 90,
  },
  removeBtn: {
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${T.muted}30`,
  },
  removeBtnText: { color: T.inkSoft, fontSize: 11, fontWeight: '700' },

  closeBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: T.rMd,
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  closeBtnText: { fontSize: 16, fontWeight: '900', color: T.paper, letterSpacing: -0.3 },
});

// ─── GameMenuActions ──────────────────────────────────────────────────────────

export interface GameMenuActionsProps {
  onPressDice?: () => void;
  showDice?: boolean;
  onPressSettings: () => void;
  rules: {
    title: string;
    rules: GameRule[];
    accentColor?: string;
  };
  players?: Player[];
  onPlayersChange?: (players: Player[]) => void;
  style?: StyleProp<ViewStyle>;
}

export function GameMenuActions({
  onPressDice,
  showDice = true,
  onPressSettings,
  rules,
  players,
  onPlayersChange,
  style,
}: GameMenuActionsProps) {
  const [playersModalVisible, setPlayersModalVisible] = useState(false);

  return (
    <View style={[styles.actions, style]}>
      {showDice && onPressDice && (
        <FlatChunkyButton size="xs" square color={T.paper} textColor={T.ink} onPress={onPressDice}>
          <MaterialCommunityIcons name="dice-5-outline" size={18} color={T.ink} />
        </FlatChunkyButton>
      )}
      {players !== undefined && onPlayersChange !== undefined && (
        <FlatChunkyButton
          size="xs"
          square
          color={T.paper}
          textColor={T.ink}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setPlayersModalVisible(true);
          }}
        >
          <AntDesign name="usergroup-add" size={18} color={T.ink} />
        </FlatChunkyButton>
      )}
      <FlatChunkyButton
        size="xs"
        square
        color={T.paper}
        textColor={T.ink}
        onPress={onPressSettings}
      >
        <MaterialCommunityIcons name="cog-outline" size={18} color={T.ink} />
      </FlatChunkyButton>
      <RulesButton rules={rules.rules} title={rules.title} accentColor={rules.accentColor} />
      {players !== undefined && onPlayersChange !== undefined && (
        <PlayersModal
          visible={playersModalVisible}
          onClose={() => setPlayersModalVisible(false)}
          onPlayersChange={onPlayersChange}
        />
      )}
    </View>
  );
}

export interface GameMenuHeaderProps extends GameMenuActionsProps {
  chipLabel?: string;
  tagline?: string;
  title: string;
  titleColor?: string;
  chipColor?: string;
  chipTextColor?: string;
}

export function GameMenuHeader({
  chipLabel,
  tagline,
  title,
  titleColor = T.ink,
  chipColor = T.paper,
  chipTextColor = T.ink,
  ...actionsProps
}: GameMenuHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {chipLabel ? (
          <View style={[styles.chip, { backgroundColor: chipColor, borderColor: T.ink }]}>
            <Text style={[styles.chipText, { color: chipTextColor }]}>{chipLabel}</Text>
          </View>
        ) : null}
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}
      </View>
      <GameMenuActions {...actionsProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingTop: 4,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
    overflow: 'hidden',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 50,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600',
    color: T.inkSoft,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
});
