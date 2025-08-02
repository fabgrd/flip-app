# 🎮 Exemple d'utilisation - Système Drag & Drop

## 🚀 Intégration rapide

Voici comment intégrer le nouveau système **drag & drop** dans votre écran de jeu existant :

### 1. **Imports**
```typescript
// Nouveaux composants animés
import { 
  AnimatedGameBoard, 
  AnimatedPlayerHand 
} from '../components/game';

// Hooks pour le drag & drop
import { useDropZones } from '../hooks';
import type { DropZone } from '../hooks';
```

### 2. **Setup dans votre screen**
```typescript
export function TakeSixGameScreen() {
  const { state, actions } = useGame();
  const { getDropZones, registerDropZone } = useDropZones();
  
  // État local pour les zones de drop
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  
  // Gestion du drop d'une carte
  const handleCardDrop = (card: GameCard, targetLineId: number) => {
    // Logique de validation existante
    actions.selectCard(currentPlayer.id, card);
    
    // Transition automatique vers la phase suivante
    setTimeout(() => {
      actions.nextPhase();
    }, 500);
  };

  // Gestion des drops invalides
  const handleInvalidDrop = () => {
    Alert.alert(
      'Drop invalide',
      'Cette ligne ne peut pas recevoir votre carte',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Plateau avec zones de drop */}
      <AnimatedGameBoard
        gameState={state}
        onLineSelect={actions.selectLine}
        onCardDropped={handleCardDrop} // ← Nouveau callback
      />
      
      {/* Main du joueur avec drag & drop */}
      <AnimatedPlayerHand
        player={currentPlayer}
        currentPlayerId={currentPlayer.id}
        canSelectCards={state.phase === 'selection'}
        dropZones={getDropZones()} // ← Zones de drop actives
        onCardDrop={handleCardDrop} // ← Callback de drop
        onInvalidDrop={handleInvalidDrop} // ← Callback d'erreur
      />
    </SafeAreaView>
  );
}
```

### 3. **Configuration des zones de drop**
```typescript
// Les zones sont automatiquement enregistrées par AnimatedGameBoard
// via le hook useDropZones et les callbacks onLayout

const AnimatedGameBoard = ({ gameState, onCardDropped }) => {
  const { registerDropZone } = useDropZones();
  
  return (
    <View>
      {gameState.lines.map(line => (
        <AnimatedGameLine
          key={line.id}
          line={line}
          onLayout={(layout) => {
            // Auto-registration de la zone de drop
            const callback = registerDropZone(line.id);
            callback(layout);
          }}
        />
      ))}
    </View>
  );
};
```

## 🎯 Cas d'usage avancés

### **Validation personnalisée**
```typescript
const handleCardDrop = (card: GameCard, targetLineId: number) => {
  const targetLine = state.lines.find(l => l.id === targetLineId);
  const lastCard = targetLine.cards[targetLine.cards.length - 1];
  
  // Règle du jeu : carte doit être plus grande
  if (card.number <= lastCard.number) {
    // Animation de rejet
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    
    // Forcer le choix de ligne
    showLineChoiceModal();
    return;
  }
  
  // Drop valide - continuer le jeu
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  actions.selectCard(currentPlayer.id, card);
};
```

### **Animation personnalisée**
```typescript
const CustomAnimatedCard = ({ card, onDrop }) => {
  return (
    <AnimatedCard
      card={card}
      draggable={true}
      size="medium"
      dropZones={dropZones}
      onDrop={(lineId) => {
        // Animation personnalisée avant le drop
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        onDrop(lineId);
      }}
    />
  );
};
```

### **Feedback visuel enrichi**
```typescript
const EnhancedGameLine = ({ line, isDragTarget }) => {
  return (
    <AnimatedGameLine
      line={line}
      isDragTarget={isDragTarget}
      onLayout={measureLine}
      // Animation personnalisée quand c'est une cible
      style={{
        borderColor: isDragTarget ? Colors.success : 'transparent',
        backgroundColor: isDragTarget ? Colors.success + '10' : Colors.surface,
      }}
    />
  );
};
```

## 🎨 Personnalisation UI

### **Thème des cartes**
```typescript
// Couleurs personnalisées pour les cartes
const customCardTheme = {
  background: '#1a1a2e',
  border: '#16213e',
  text: '#0f4c75',
  accent: '#3282b8',
};

<AnimatedCard
  card={card}
  style={{
    backgroundColor: customCardTheme.background,
    borderColor: customCardTheme.border,
  }}
/>
```

### **Animations personnalisées**
```typescript
// Hook personnalisé pour des animations spécifiques
const useCustomCardAnimation = (card) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  
  const animateSpecialCard = () => {
    if (card.bulls >= 5) {
      // Animation spéciale pour les cartes dangereuses
      rotate.value = withSequence(
        withTiming(5, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  };
  
  return { scale, rotate, animateSpecialCard };
};
```

## 🔧 Performance Tips

### **Optimisation des re-renders**
```typescript
// Mémoisation des callbacks
const handleCardDrop = useCallback((card: GameCard, lineId: number) => {
  // logique de drop
}, [state.phase, currentPlayer.id]);

// Mémoisation des zones de drop
const memoizedDropZones = useMemo(() => getDropZones(), [state.lines]);
```

### **Gestion mémoire**
```typescript
// Cleanup automatique
useEffect(() => {
  return () => {
    // Les hooks gèrent automatiquement le cleanup
    clearDropZones();
  };
}, []);
```

## 📱 Responsive & Accessibility

### **Adaptation mobile**
```typescript
const { width } = Dimensions.get('window');
const cardSize = width < 400 ? 'small' : 'medium';

<AnimatedCard
  card={card}
  size={cardSize} // Taille adaptive
  draggable={width > 350} // Drag seulement sur écrans suffisants
/>
```

### **Support accessibilité**
```typescript
<AnimatedCard
  card={card}
  accessibilityLabel={`Carte ${card.number} avec ${card.bulls} têtes de bœuf`}
  accessibilityHint="Glissez vers une ligne pour jouer cette carte"
  accessibilityRole="button"
/>
```

---

## 🎉 **Et voilà !**

Votre jeu est maintenant équipé d'un **système drag & drop professionnel** ! Les joueurs peuvent glisser leurs cartes intuitivement, avec des animations fluides et un feedback haptique riche. 

**🎯 Le jeu n'a jamais été aussi immersif !** ✨ 