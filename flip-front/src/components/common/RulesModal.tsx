import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { T } from '../../constants/flipTokens';
import { ChunkyButton } from './ChunkyButton';
import { FlatChunkyButton } from './FlatChunkyButton';

interface Rule {
  n: string;
  title: string;
  desc: string;
}

interface RulesModalProps {
  rules: Rule[];
  title: string;
  accentColor?: string;
}

export function RulesButton({ rules, title, accentColor = T.mint }: RulesModalProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <FlatChunkyButton
        size="xs"
        square
        color={T.paper}
        textColor={T.ink}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.triggerText}>?</Text>
      </FlatChunkyButton>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          style={styles.overlay}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
          <Animated.View
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(150)}
            style={styles.card}
          >
            {/* Header */}
            <View style={[styles.cardHeader, { backgroundColor: accentColor }]}>
              <Text style={styles.cardTitle}>{title}</Text>
              <FlatChunkyButton
                size="xs"
                square
                color={T.paper}
                textColor={T.ink}
                metrics={{ height: 30, radius: 9, paddingH: 0, fontSize: 13 }}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </FlatChunkyButton>
            </View>

            <ScrollView
              contentContainerStyle={styles.rulesContent}
              showsVerticalScrollIndicator={false}
            >
              {rules.map((rule) => (
                <View key={rule.n} style={styles.ruleRow}>
                  <View style={styles.ruleNum}>
                    <Text style={styles.ruleNumText}>{rule.n}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ruleTitle}>{rule.title}</Text>
                    <Text style={styles.ruleDesc}>{rule.desc}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <ChunkyButton
              full
              size="sm"
              color={T.ink}
              textColor="#fff"
              shadowColor={T.ink}
              metrics={{ fontSize: 16 }}
              style={styles.doneBtn}
              onPress={() => setVisible(false)}
            >
              {"OK, j'ai compris !"}
            </ChunkyButton>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerText: { color: T.ink, fontSize: 16, fontWeight: '900' },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24,22,19,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: T.ink,
  },
  cardTitle: { color: T.ink, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  closeBtnText: { color: T.ink, fontSize: 13, fontWeight: '900' },

  rulesContent: { padding: 18, gap: 4 },

  ruleRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: `${T.muted}30`,
    alignItems: 'flex-start',
  },
  ruleNum: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: T.tomato,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  ruleNumText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  ruleTitle: { color: T.ink, fontSize: 15, fontWeight: '800' },
  ruleDesc: { color: T.inkSoft, fontSize: 13, marginTop: 2, lineHeight: 18 },

  doneBtn: { margin: 16, marginTop: 8 },
});
