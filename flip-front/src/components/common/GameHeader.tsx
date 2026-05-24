import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '../../constants/flipTokens';
import type { Player } from '../../types';
import { FlatChunkyButton } from './FlatChunkyButton';
import { PlayersModal } from './GameMenuHeader';
import type { GameRule } from './GameMenuHeader';
import { RulesModalView } from './RulesModal';

export interface GameHeaderProps {
  onExit: () => void;
  onSettings?: () => void;
  rules?: { title: string; rules: GameRule[]; accentColor?: string };
  players?: Player[];
  onPlayersChange?: (players: Player[]) => void;
  /** 0-100. When provided, a progress bar is rendered between the back and menu buttons. */
  progress?: number;
  /** Track color for the progress bar (the background). */
  progressTrackColor?: string;
  /** Fill color for the progress bar. */
  progressFillColor?: string;
  /** Render absolutely positioned over the content (safe-area aware). */
  floating?: boolean;
  /** Background tint for the action buttons. */
  tint?: string;
  style?: StyleProp<ViewStyle>;
}

const MENU_WIDTH = 220;
const MENU_MARGIN = 12;
const BTN_SIZE = 36; // FlatChunkyButton size="xs" square = 36x36

export function GameHeader({
  onExit,
  onSettings,
  rules,
  players,
  onPlayersChange,
  progress,
  progressTrackColor = `${T.ink}1A`,
  progressFillColor = T.ink,
  floating = false,
  tint = T.paper,
  style,
}: GameHeaderProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const dotsRef = useRef<View>(null);
  const [menu, setMenu] = useState<{ top: number; right: number } | null>(null);
  const [rulesVisible, setRulesVisible] = useState(false);
  const [playersVisible, setPlayersVisible] = useState(false);

  const hasRules = !!rules;
  const hasPlayers = players !== undefined && onPlayersChange !== undefined;
  const hasSettings = !!onSettings;
  const hasMenu = hasRules || hasPlayers || hasSettings;

  const openMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dotsRef.current?.measureInWindow((x, y, w, h) => {
      const screenW = Dimensions.get('window').width;
      setMenu({ top: y + h + 8, right: Math.max(8, screenW - (x + w)) });
    });
  };

  const closeMenu = () => setMenu(null);

  const fire = (fn?: () => void) => {
    closeMenu();
    if (fn) {
      Haptics.selectionAsync();
      // defer so the menu close animation feels natural before the next action
      requestAnimationFrame(fn);
    }
  };

  return (
    <>
      <View
        style={[
          s.header,
          floating && [s.floating, { paddingTop: insets.top + 6 }],
          style,
        ]}
      >
        <FlatChunkyButton
          size="xs"
          square
          color={tint}
          textColor={T.ink}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onExit();
          }}
        >
          <Feather name="arrow-left" size={18} color={T.ink} />
        </FlatChunkyButton>

        {progress !== undefined && (
          <View style={s.progressWrap}>
            <View style={[s.progressTrack, { backgroundColor: progressTrackColor }]}>
              <View
                style={[
                  s.progressFill,
                  {
                    width: `${Math.max(0, Math.min(100, progress))}%` as `${number}%`,
                    backgroundColor: progressFillColor,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {hasMenu && (
          <View ref={dotsRef} collapsable={false}>
            <FlatChunkyButton
              size="xs"
              square
              color={tint}
              textColor={T.ink}
              onPress={openMenu}
            >
              <Feather name="more-vertical" size={18} color={T.ink} />
            </FlatChunkyButton>
          </View>
        )}
      </View>

      {/* Popover menu */}
      <Modal visible={!!menu} transparent animationType="none" onRequestClose={closeMenu}>
        <Animated.View
          entering={FadeIn.duration(120)}
          exiting={FadeOut.duration(100)}
          style={StyleSheet.absoluteFill}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
          {menu && (
            <Animated.View
              entering={ZoomIn.duration(140)}
              exiting={ZoomOut.duration(100)}
              style={[
                s.menu,
                {
                  top: menu.top,
                  right: menu.right,
                  width: MENU_WIDTH,
                  maxWidth: Dimensions.get('window').width - MENU_MARGIN * 2,
                },
              ]}
            >
              {hasSettings && (
                <MenuItem
                  icon={<MaterialCommunityIcons name="cog-outline" size={18} color={T.ink} />}
                  label={t('common:buttons.settings')}
                  onPress={() => fire(onSettings)}
                />
              )}
              {hasRules && (
                <MenuItem
                  icon={<Feather name="help-circle" size={18} color={T.ink} />}
                  label={t('common:buttons.howToPlay')}
                  onPress={() => fire(() => setRulesVisible(true))}
                />
              )}
              {hasPlayers && (
                <MenuItem
                  icon={<AntDesign name="usergroup-add" size={18} color={T.ink} />}
                  label={t('common:labels.addPlayer')}
                  onPress={() => fire(() => setPlayersVisible(true))}
                  last
                />
              )}
            </Animated.View>
          )}
        </Animated.View>
      </Modal>

      {hasRules && (
        <RulesModalView
          visible={rulesVisible}
          onClose={() => setRulesVisible(false)}
          rules={rules!.rules}
          title={rules!.title}
          accentColor={rules!.accentColor}
        />
      )}

      {hasPlayers && (
        <PlayersModal
          visible={playersVisible}
          onClose={() => setPlayersVisible(false)}
          onPlayersChange={onPlayersChange!}
        />
      )}
    </>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[s.item, !last && s.itemDivider]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={s.itemIcon}>{icon}</View>
      <Text style={s.itemLabel} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: T.ink,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  menu: {
    position: 'absolute',
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 6,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: `${T.muted}25`,
  },
  itemIcon: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    flex: 1,
    color: T.ink,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
