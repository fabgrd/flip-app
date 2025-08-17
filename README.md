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

## 🧹 Qualité de code (Lint & Format)

- **Sur VS Code (déjà préconfiguré dans `.vscode/settings.json`)**

  - Formatage auto: `editor.formatOnSave: true`
  - Corrections ESLint auto: `editor.codeActionsOnSave: ["source.fixAll.eslint", "source.organizeImports"]`
  - Effet: suppression des imports inutilisés, organisation des imports, formatage Prettier.

- **Commandes utiles**

  - Linter (lecture seule):
    ```bash
    pnpm lint
    ```
  - Linter + auto-fix:
    ```bash
    pnpm lint:fix
    ```
  - Formater tout le projet (Prettier):
    ```bash
    pnpm format
    ```
  - Vérifier le formatage sans modifier:
    ```bash
    pnpm format:check
    ```
  - Cibler un dossier/fichier:
    ```bash
    pnpm exec eslint src/screens --ext .ts,.tsx --fix
    pnpm exec eslint src/screens/CameleonScreen.tsx --fix
    ```

- **Hook pre-commit (auto sur fichiers stagés)**

  - Le projet utilise Husky + lint-staged (auto-fix + format sur `git commit`).
  - Si nécessaire après un clone, pointez les hooks Git vers `flip-front/.husky`:
    ```bash
    git config core.hooksPath flip-front/.husky
    ```
  - Pour lancer le même traitement à la main sur fichiers stagés:
    ```bash
    pnpm exec lint-staged
    ```

- **Ce qui est auto-fixé vs manuel**
  - Auto: imports inutilisés, organisation des imports, style Prettier.
  - Manuel:
    - Variables non utilisées → supprimer ou préfixer avec `_` (ex: `_event`).
    - Chaînes FR détectées → déplacer dans l'i18n ou, temporairement, désactiver la règle ligne par ligne:
      ```ts
      // eslint-disable-next-line no-restricted-syntax
      const label = "Mon texte temporaire";
      ```

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
