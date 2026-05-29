import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { T } from '../constants/flipTokens';
import { captureException } from '../lib/sentry';
import { randomUUID } from '../lib/uuid';
import { Player } from '../types';

interface PlayersContextType {
  players: Player[];
  addPlayer: (name: string) => boolean;
  removePlayer: (id: string) => void;
  clearPlayers: () => void;
  loadPlayers: () => Promise<void>;
  savePlayers: () => Promise<void>;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

const PLAYERS_STORAGE_KEY = 'flip_players';
const MAX_PLAYERS = 20;

const PLAYER_COLORS: string[] = [
  T.tomato,
  T.cobalt,
  T.mint,
  T.violet,
  T.lemon,
  T.pink,
  T.teal,
  T.crimson,
  T.sky,
  T.lime,
];

function pickAvailableColor(used: string[]): string {
  const free = PLAYER_COLORS.find((c) => !used.includes(c));
  if (free) return free;
  return PLAYER_COLORS[used.length % PLAYER_COLORS.length];
}

function parsePlayers(raw: string): Player[] | null {
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    const players: Player[] = [];
    const usedColors: string[] = [];
    for (const entry of data) {
      if (!entry || typeof entry !== 'object') return null;
      const { id, name, color } = entry as Record<string, unknown>;
      if (typeof id !== 'string' || id.length === 0) return null;
      if (typeof name !== 'string' || name.length === 0) return null;
      const resolvedColor =
        typeof color === 'string' && color.length > 0 ? color : pickAvailableColor(usedColors);
      usedColors.push(resolvedColor);
      players.push({ id, name, color: resolvedColor });
    }
    return players.slice(0, MAX_PLAYERS);
  } catch {
    return null;
  }
}

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);

  const addPlayer = (name: string): boolean => {
    if (players.length >= MAX_PLAYERS) return false;

    const trimmedName = name.trim();
    if (trimmedName === '') return false;

    if (players.some((player) => player.name.toLowerCase() === trimmedName.toLowerCase())) {
      return false;
    }

    const newPlayer: Player = {
      id: randomUUID(),
      name: trimmedName,
      color: pickAvailableColor(players.map((p) => p.color)),
    };

    setPlayers((prev) => [newPlayer, ...prev]);
    return true;
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  };

  const clearPlayers = () => {
    setPlayers([]);
  };

  const loadPlayers = async () => {
    try {
      const storedPlayers = await AsyncStorage.getItem(PLAYERS_STORAGE_KEY);
      if (!storedPlayers) return;
      const parsed = parsePlayers(storedPlayers);
      if (parsed) {
        setPlayers(parsed);
      } else {
        await AsyncStorage.removeItem(PLAYERS_STORAGE_KEY);
      }
    } catch (error) {
      captureException(error, { scope: 'players.load' });
    }
  };

  const savePlayers = async () => {
    try {
      await AsyncStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
    } catch (error) {
      captureException(error, { scope: 'players.save' });
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      savePlayers();
    }
  }, [players]);

  const value: PlayersContextType = {
    players,
    addPlayer,
    removePlayer,
    clearPlayers,
    loadPlayers,
    savePlayers,
  };

  return <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>;
}

export function usePlayers(): PlayersContextType {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
}
