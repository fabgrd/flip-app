import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);

  const addPlayer = (name: string): boolean => {
    if (players.length >= 10) return false;
    
    const trimmedName = name.trim();
    if (trimmedName === '') return false;
    
    // Vérifier si le nom existe déjà
    if (players.some(player => player.name.toLowerCase() === trimmedName.toLowerCase())) {
      return false;
    }
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: trimmedName,
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    return true;
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  };

  const clearPlayers = () => {
    setPlayers([]);
  };

  const loadPlayers = async () => {
    try {
      const storedPlayers = await AsyncStorage.getItem(PLAYERS_STORAGE_KEY);
      if (storedPlayers) {
        setPlayers(JSON.parse(storedPlayers));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error);
    }
  };

  const savePlayers = async () => {
    try {
      await AsyncStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des joueurs:', error);
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

  return (
    <PlayersContext.Provider value={value}>
      {children}
    </PlayersContext.Provider>
  );
}

export function usePlayers(): PlayersContextType {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
} 