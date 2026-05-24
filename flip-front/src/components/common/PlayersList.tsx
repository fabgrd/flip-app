import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { T } from '../../constants/flipTokens';
import { useImagePicker } from '../../hooks/useImagePicker';
import { Player } from '../../types';
import { Avatar } from './Avatar';

interface PlayersListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
  onUpdateAvatar: (id: string, avatar: string) => void;
}

export function PlayersList({ players, onRemovePlayer, onUpdateAvatar }: PlayersListProps) {
  const { showImagePicker } = useImagePicker();

  const handleAvatarPress = async (player: Player) => {
    const imageUri = await showImagePicker();
    if (imageUri) onUpdateAvatar(player.id, imageUri);
  };

  if (players.length === 0) {
    return <CrewEmptyState />;
  }

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => {
    return (
      <Animated.View entering={FadeInRight.delay(index * 80)} exiting={FadeOutLeft}>
        <View style={styles.playerRow}>
          <Avatar
            name={item.name}
            avatar={item.avatar}
            size={40}
            onPress={() => handleAvatarPress(item)}
          />

          <Text style={styles.playerName} numberOfLines={1}>
            {item.name}
          </Text>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => onRemovePlayer(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.listLabel}>JOUEURS</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{players.length}</Text>
        </View>
      </View>
      <FlatList
        data={players}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

function CrewEmptyState() {
  const { t } = useTranslation();
  return (
    <View style={emptyStyles.wrapper}>
      {/* Formes déco */}
      <View style={[emptyStyles.deco, { top: 12, left: 20, transform: [{ rotate: '-15deg' }] }]}>
        <View style={[emptyStyles.decoShape, { width: 36, height: 36, borderRadius: 10, borderColor: T.tomato }]} />
      </View>
      <View style={[emptyStyles.deco, { top: 20, right: 30, transform: [{ rotate: '12deg' }] }]}>
        <View style={[emptyStyles.decoShape, { width: 28, height: 28, borderRadius: 999, borderColor: T.cobalt }]} />
      </View>
      <View style={[emptyStyles.deco, { bottom: 18, left: 50, transform: [{ rotate: '8deg' }] }]}>
        <View style={[emptyStyles.decoShape, { width: 24, height: 24, borderRadius: 6, borderColor: T.mint, transform: [{ rotate: '45deg' }] }]} />
      </View>
      <View style={[emptyStyles.deco, { bottom: 14, right: 40, transform: [{ rotate: '-10deg' }] }]}>
        <View style={[emptyStyles.decoShape, { width: 32, height: 32, borderRadius: 8, borderColor: T.violet }]} />
      </View>

      {/* Avatars fantômes */}
      <View style={emptyStyles.avatarRow}>
        {(['tomato', 'cobalt', 'lemon'] as const).map((c, i) => (
          <View key={i} style={[emptyStyles.ghostAvatar, { backgroundColor: T[c], marginLeft: i > 0 ? -12 : 0, transform: [{ rotate: `${(i - 1) * 6}deg` }] }]}>
            <Text style={emptyStyles.ghostQ}>?</Text>
          </View>
        ))}
      </View>

      <View style={emptyStyles.textBlock}>
        <Text style={emptyStyles.title}>{t('common:emptyPlayers.title')}</Text>
        <Text style={emptyStyles.sub}>{t('common:emptyPlayers.sub')}</Text>
      </View>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  wrapper: {
    margin: 8,
    marginHorizontal: 0,
    padding: 40,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: T.muted,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  deco: { position: 'absolute' },
  decoShape: { borderWidth: 2, opacity: 0.3 },
  avatarRow: { flexDirection: 'row' },
  ghostAvatar: {
    width: 56, height: 56, borderRadius: 16,
    borderWidth: 2, borderColor: T.ink,
    opacity: 0.2,
    alignItems: 'center', justifyContent: 'center',
  },
  ghostQ: {
    fontWeight: '800', fontSize: 24, color: T.ink,
  },
  textBlock: { alignItems: 'center' },
  title: {
    fontWeight: '800', fontSize: 20, color: T.ink,
    letterSpacing: -0.5, textAlign: 'center',
  },
  sub: {
    fontSize: 14, color: T.muted, marginTop: 4,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  listLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  countBadge: {
    backgroundColor: T.tomato,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: '#fff', fontSize: 11, fontWeight: '900' },

  list: { gap: 10, paddingRight: 4, paddingBottom: 4 },

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rSm,
    paddingLeft: 8,
    paddingRight: 14,
    paddingVertical: 8,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },

  playerName: {
    flex: 1,
    color: T.ink,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { color: T.muted, fontSize: 16 },

});
