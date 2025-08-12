## Caméléon — Guide Technique

### Objectif
Jeu de déduction: les civils partagent un mot, les imposteurs (Undercover et Mr White) tentent de ne pas se faire démasquer. Mr White peut tenter de deviner le mot au moment de son élimination.

### Rôles
- **Civil**: reçoit `secretWord` (mot civil).
- **Undercover (cameleon)**: reçoit un mot différent (mot imposteur).
- **Mr White**: ne reçoit pas de mot; s’il est éliminé, il peut soumettre un guess. Si correct, il gagne un bonus de points.

### Phases du jeu
1. **settings**: réglage du nombre d’imposteurs (UC + Mr White) avec contrainte `total ≤ floor(n/2)`.
2. **reveal**: distribution et révélation des mots, carte centrée et animée.
3. **clues**: chaque joueur donne un indice dans l’ordre aléatoire.
4. **vote**: sélection d’un joueur à éliminer.
5. **results**: affiche l’éliminé, le gagnant de la manche, met à jour le score.

### Conditions de victoire (par manche)
- Les imposteurs sont `role in { 'cameleon', 'mrWhite' }`.
- Victoire civils si `impostorsAlive === 0`.
- Victoire imposteurs si `impostorsAlive >= civiliansAlive` (parité comprise).

### Barème des points
- Victoire imposteurs: **+6** pour Undercover/Mr White.
- Victoire civils: **+2** pour Civils.
- Mr White: **+5** bonus temporaire si guess correct au moment de son élimination (champ `scoreBonus`).
- À la reprise (« Rejouer »), `score += (roundPoints + scoreBonus)` puis `scoreBonus` remis à 0.

### Flux spécial Mr White (élimination)
- Ouverture d’une **modal bloquante** centrée avec input et message i18n.
- Normalisation de la saisie (accents/majuscules/ponctuation) avant comparaison.
- Si correct: `player.scoreBonus += 5`, `player.mrWhiteGuess`, `player.mrWhiteGuessCorrect = true`.
- La partie reprend et passe à `results` (le jeu ne s’arrête pas). Les clics hors modal ne la ferment pas.

### Structure du code
- Types/Constantes/Hook
  - `src/games/cameleon/types.ts`: types (`CameleonAssignedPlayer`, `CameleonWordPair`, etc.). Champs supplémentaires: `scoreBonus?`, `mrWhiteGuess?`, `mrWhiteGuessCorrect?`.
  - `src/games/cameleon/constants.ts`: répartition par défaut et paires de mots.
  - `src/games/cameleon/hooks/useCameleon.ts`: logique d’état et flux (phases, élimination, parité, Mr White guess, démarrage).
- Composants UI
  - `src/games/cameleon/components/RevealCard.tsx`: carte de révélation centrée (faces animées et superposées).
  - `src/games/cameleon/components/SettingsPanel.tsx`: réglages UC/Mr White avec contrainte d’imposteurs (`≤ floor(n/2)`).
  - `src/games/cameleon/components/PlayerGrid.tsx`: grille joueurs (indices/vote/résultats) avec état sélection stylé.
  - `src/games/cameleon/components/ActionBar.tsx`: actions contextuelles (« Passer au vote » / « Éliminer »).
  - `src/games/cameleon/components/MrWhiteGuessModal.tsx`: modal de guess Mr White.
  - `src/components/common/PopModal.tsx`: modal générique, fond bloquant, badge emoji optionnel (ex: ❌ animé sur éliminé).
  - `src/components/common/Confetti.tsx`: confettis (si besoin de feedback).
- Écrans
  - `src/screens/CameleonScreen.tsx`: orchèstre les phases et compose les composants.
  - `src/screens/CameleonResultsScreen.tsx`: résultats de manche; affiche les rôles, mots, points, guess Mr White (+ badge « +5 » si correct).

### Navigation et routes
- `RootStackParamList` (in `src/types/games.ts`):
  - `Cameleon: { players: Player[] }`
  - `CameleonResults: { players: CameleonAssignedPlayer[] }`

### i18n
- Dossier: `src/i18n/locales/{fr,en,zh}/cameleon.json`.
- Clés notables:
  - `cameleon:actions.*` (reveal, goToVote, eliminate, submit)
  - `cameleon:reveal.*` (titres révélation)
  - `cameleon:roles.*` (libellés)
  - `cameleon:modals.firstPlayer` ("{{name}} commence")
  - `cameleon:notices.eliminatedRole`
  - `cameleon:mrWhite.guessTitle|guessPrompt|placeholder`
  - `cameleon:outcome.*`, `cameleon:counters.*`

### Contraintes et validations
- Paramétrage: `UC + MrWhite ≤ floor(n/2)` côté UI (steppers) et au démarrage (`startGame`) côté logique.
- Mr White traité comme imposteur dans tous les calculs (parité et fin de manche).

### Points d’extension (pour IA/futurs ajouts)
- Mots: enrichir `WORD_PAIRS` ou externaliser via backend/content.
- Règles: rendre le barème configurable (feature flag).
- Logs/analytics: tracer votes, indices, ordre des indices.
- Accessibilité: annonces vocales, tailles dynamiques.
- Multijoueur réseau: synchroniser `gameState` via socket/service.

### Démarrage & scripts
- Racine `flip-front/` (Expo):
  - `pnpm i` ou `npm i`
  - `npm run start` (ou `npm run ios` / `npm run android` / `npm run web`)
- Type-check: `npx tsc --noEmit`

### Résumé API du hook `useCameleon`
- Retourne: `gameState`, `phase`, `startGame`, `resetGame`, `currentRevealPlayer`, `revealNext`, `clueOrder`, `beginVote`, `selectedForElimination`, `selectElimination`, `confirmElimination`, `gameOver`, `winner`, `proceedAfterResults`, `mrWhiteToGuessId`, `submitMrWhiteGuess`.
- `gameState.players`: tableau de `CameleonAssignedPlayer` incluant `role`, `secretWord`, `isEliminated`, `scoreBonus?`, `mrWhiteGuess?`, `mrWhiteGuessCorrect?`.

### UI/UX notables
- Cartes de révélation centrées (faces superposées, flip propre).
- Sélection vote: fond teinté + bordure primaire.
- Modals fun: premier joueur (nom dans le titre), éliminé (badge ❌ animé sur l’avatar), Mr White (input bloquant). 