# FL!P - Jeu d'alcool entre amis 🍻

Une application mobile de jeux d'alcool inspirée de TOZ, développée avec React Native et Expo.

## 🚀 Fonctionnalités

### ✅ Implémentées
- **Écran d'accueil** : Ajout/suppression de joueurs (2-10 maximum)
- **Interface intuitive** : Design moderne avec couleurs vives et animations
- **Feedback haptique** : Vibrations lors des interactions
- **Persistance** : Sauvegarde des noms avec AsyncStorage
- **Navigation** : Navigation entre les écrans avec React Navigation
- **Écran de sélection** : Choix des jeux disponibles

### 🔄 En cours de développement
- **Jeu "6 qui prend !"** : Premier jeu disponible
- **Moteur de jeu** : Logique et règles des jeux
- **Plus de jeux** : Extension avec d'autres jeux d'alcool

## 🛠️ Stack technique

- **React Native** (0.79.5)
- **Expo** (~53.0.20)
- **TypeScript**
- **React Navigation** (Stack)
- **AsyncStorage** (persistance)
- **React Native Reanimated** (animations)
- **React Native Haptic Feedback** (vibrations)

## 📱 Installation et développement

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd flip-app/flip-front

# Installer les dépendances
pnpm install

# Lancer l'application
pnpm start

# Sur iOS
pnpm ios

# Sur Android
pnpm android

# Version web
pnpm web
```

## 📁 Structure du projet

```
flip-front/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── PlayerInput.tsx  # Saisie des noms de joueurs
│   │   └── PlayersList.tsx  # Liste des joueurs
│   ├── screens/             # Écrans de l'application
│   │   ├── HomeScreen.tsx   # Écran d'accueil
│   │   └── GameSelectScreen.tsx # Sélection des jeux
│   ├── contexts/            # Contextes React
│   │   └── PlayersContext.tsx # Gestion globale des joueurs
│   ├── constants/           # Constantes et configuration
│   │   ├── colors.ts        # Palette de couleurs
│   │   ├── styles.ts        # Styles globaux
│   │   └── games.ts         # Jeux disponibles
│   └── types/               # Types TypeScript
│       └── index.ts         # Interfaces principales
└── App.tsx                  # Point d'entrée
```

## 🎮 Utilisation

1. **Ajout de joueurs** : Saisissez les prénoms dans l'écran d'accueil
2. **Validation** : Au moins 2 joueurs requis, 10 maximum
3. **Navigation** : Cliquez sur "Jouer !" pour accéder aux jeux
4. **Sélection** : Choisissez "6 qui prend !" (d'autres jeux arrivent bientôt)

## 🎨 Design

L'interface s'inspire de l'esthétique de TOZ avec :
- **Couleurs vives** : Rouge, turquoise, bleu ciel
- **Typographie fun** : Police grasse et contrastée
- **Animations fluides** : Transitions et feedback visuel
- **UX intuitive** : Navigation simple et claire

## 🔮 Roadmap

- [ ] Implémentation complète du jeu "6 qui prend !"
- [ ] Ajout d'autres jeux d'alcool populaires
- [ ] Mode multijoueur en réseau
- [ ] Personnalisation des avatars
- [ ] Statistiques et historique
- [ ] Sons et musiques d'ambiance

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Reporter des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer le code existant
- Ajouter de nouveaux jeux

## 📄 Licence

Ce projet est sous licence MIT.
