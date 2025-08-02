import { GameCard, GameLine, GamePlayer, PlayedCard } from '../types/game';

// Génère le deck complet de 104 cartes avec leurs têtes de bœuf
export function createDeck(): GameCard[] {
    const deck: GameCard[] = [];

    for (let i = 1; i <= 104; i++) {
        let bulls = 1; // Par défaut 1 tête de bœuf

        // Règles spéciales pour les têtes de bœuf
        if (i === 55) bulls = 7;        // Le 55 vaut 7 têtes de bœuf
        else if (i % 11 === 0) bulls = 5; // Multiples de 11 valent 5 têtes de bœuf
        else if (i % 10 === 0) bulls = 3; // Multiples de 10 valent 3 têtes de bœuf
        else if (i % 5 === 0) bulls = 2;  // Multiples de 5 valent 2 têtes de bœuf

        deck.push({ number: i, bulls });
    }

    return shuffleArray(deck);
}

// Mélange un tableau de façon aléatoire
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Distribue les cartes aux joueurs
export function dealCards(deck: GameCard[], playerCount: number): {
    playerHands: GameCard[][];
    remainingDeck: GameCard[];
} {
    const cardsPerPlayer = 10;
    const playerHands: GameCard[][] = [];

    for (let i = 0; i < playerCount; i++) {
        playerHands.push(deck.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer));
    }

    const remainingDeck = deck.slice(playerCount * cardsPerPlayer);
    return { playerHands, remainingDeck };
}

// Crée les 4 lignes initiales
export function createInitialLines(deck: GameCard[]): {
    lines: GameLine[];
    remainingDeck: GameCard[];
} {
    const lines: GameLine[] = [];

    for (let i = 0; i < 4; i++) {
        lines.push({
            id: i,
            cards: [deck[i]]
        });
    }

    console.log('lines', lines);

    return {
        lines,
        remainingDeck: deck.slice(4)
    };
}

// Trouve la ligne appropriée pour une carte
export function findTargetLine(card: GameCard, lines: GameLine[]): number | null {
    let bestLineIndex: number | null = null;
    let smallestDiff = Infinity;

    for (let i = 0; i < lines.length; i++) {
        const lastCard = lines[i].cards[lines[i].cards.length - 1];

        // La carte doit être plus grande que la dernière carte de la ligne
        if (card.number > lastCard.number) {
            const diff = card.number - lastCard.number;
            if (diff < smallestDiff) {
                smallestDiff = diff;
                bestLineIndex = i;
            }
        }
    }

    console.log('---------------bestLineIndex', bestLineIndex);

    return bestLineIndex;
}

// Place une carte sur une ligne
export function placeCardOnLine(
    card: GameCard,
    lineIndex: number,
    lines: GameLine[]
): {
    newLines: GameLine[];
    collectedCards: GameCard[];
} {
    const newLines = lines.map(line => ({ ...line, cards: [...line.cards] }));
    let collectedCards: GameCard[] = [];

    const targetLine = newLines[lineIndex];

    // Si la ligne contient déjà 5 cartes, le joueur ramasse toutes les cartes
    if (targetLine.cards.length === 5) {
        collectedCards = [...targetLine.cards];
        targetLine.cards = [card];
    } else {
        targetLine.cards.push(card);
    }

    console.log('newLines', newLines);
    console.log('collectedCards', collectedCards);
    return { newLines, collectedCards };
}

// Traite toutes les cartes jouées dans l'ordre croissant
export function processPlayedCards(
    playedCards: PlayedCard[],
    lines: GameLine[]
): {
    newLines: GameLine[];
    cardResults: Array<{
        playerId: string;
        card: GameCard;
        targetLine: number | null;
        collectedCards: GameCard[];
        needsLineChoice: boolean;
    }>;
} {
    console.log('CA CALCULE OU QUOI LA TEAM : ', playedCards);
    // Trier les cartes jouées par ordre croissant
    const sortedCards = [...playedCards].sort((a, b) => a.card.number - b.card.number);

    let currentLines = lines.map(line => ({ ...line, cards: [...line.cards] }));
    const cardResults = [];

    for (const playedCard of sortedCards) {
        const targetLineIndex = findTargetLine(playedCard.card, currentLines);

        if (targetLineIndex !== null) {
            const { newLines, collectedCards } = placeCardOnLine(
                playedCard.card,
                targetLineIndex,
                currentLines
            );

            currentLines = newLines;
            cardResults.push({
                playerId: playedCard.playerId,
                card: playedCard.card,
                targetLine: targetLineIndex,
                collectedCards,
                needsLineChoice: false,
            });
        } else {
            // Le joueur doit choisir une ligne à prendre
            cardResults.push({
                playerId: playedCard.playerId,
                card: playedCard.card,
                targetLine: null,
                collectedCards: [],
                needsLineChoice: true,
            });
        }
    }

    console.log('cardResults', cardResults);

    return { newLines: currentLines, cardResults };
}

// Calcule le score total d'un joueur (têtes de bœuf)
export function calculatePlayerScore(collectedCards: GameCard[]): number {
    console.log('collectedCards', collectedCards);
    return collectedCards.reduce((total, card) => total + card.bulls, 0);
}

// Détermine si le jeu est terminé
export function isGameEnded(players: GamePlayer[], turn: number, maxTurns: number): boolean {
    // Jeu terminé si quelqu'un a plus de 66 points ou si toutes les cartes ont été jouées
    return turn >= maxTurns || players.some(player => player.score >= 66);
}

// Trouve le gagnant (celui avec le moins de têtes de bœuf)
export function findWinner(players: GamePlayer[]): GamePlayer {
    return players.reduce((winner, player) =>
        player.score < winner.score ? player : winner
    );
} 