# Premium architecture — guide pour gater un jeu

Ce document explique **comment intégrer le système premium dans un jeu** de Fl!p. Le pattern de référence est `PurityTestScreen` (niveaux Hot/Hard gated derrière `spicy_content` / `hardcore_content`).

> **Règle produit n°1** — Un seul abonnement Premium. **Premium débloque TOUT.** Le paywall est **strictement identique partout** dans l'app. On ne montre jamais un paywall "Mode Spicy" vs "Mode Hardcore" — toujours le même pitch "Fl!p VIP unlocks everything".
>
> Les `Entitlement` granulaires (`spicy_content`, `drinks_mode`, etc.) existent **uniquement pour le gating interne** : ils permettent à l'app de savoir _ce qui est bloqué_, pas _ce qui s'affiche_ dans le paywall. En production, tous les entitlements sont accordés ou révoqués ensemble par l'achat d'un seul plan.

---

## 1. Vue d'ensemble

L'architecture est en 5 couches découplées :

```
┌─────────────────────────────────────────────────────────┐
│ 1. Sources (adapters)                                   │
│    SubscriptionAdapter · RemoteConfigAdapter · DevOverrides │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Entitlements (vérité unique)                         │
│    useEntitlements() → { has(flag), tier, variant() }   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Catalog (déclaratif)                                 │
│    src/config/games.config.ts                           │
│    src/content/  (ContentItem, tiers, useGameContent)   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. UI primitives                                         │
│    <Gate>, useEntitlement(), useGatedFeature()           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Paywall (UNIFIÉ)                                      │
│    usePaywall().open() → PaywallModal (toujours le même) │
└─────────────────────────────────────────────────────────┘
```

**Conséquence** : un écran ne lit jamais `isPremium`. Il appelle `useEntitlement('flag')` et c'est tout. Le paywall ne sait pas non plus depuis quelle feature il est ouvert (sauf pour les métriques).

---

## 2. Vocabulaire

| Concept | Type / API | Rôle |
|---|---|---|
| **Entitlement** | `'drinks_mode' \| 'spicy_content' \| 'hardcore_content' \| 'extra_questions' \| 'premium_themes' \| 'unlimited_players'` | Un flag interne. Tous accordés ensemble par "Premium". |
| **Tier** (content) | `'free' \| 'spicy' \| 'hardcore'` | Niveau de pimentage d'un item de contenu. Mappé sur un Entitlement. |
| **Variant** | `string` (libre) | Slot d'A/B test ou de mode dans un jeu. Ex : `{ id: 'drinks', requires: 'drinks_mode' }` dans le catalog. |
| **Préférence** | `UserPreferences` (AsyncStorage) | Choix utilisateur (ex : `drinksEnabled`). Séparé des entitlements. |

---

## 3. Le checklist : gater un nouveau jeu

### Pré-requis — implémenter les modes s'ils manquent

**⚠️ Avant tout gating, vérifie que le jeu implémente déjà :**

- **Des niveaux ou modes de difficulté** (Soft / Spicy / Hardcore) — sans ça, il n'y a rien à gater pour `spicy_content` / `hardcore_content`.
- **Le mode jeu à boire** (gorgées) — si le jeu peut conceptuellement distribuer des pénalités/points, alors il doit avoir une lecture "verbes alcool" et une lecture "verbes neutres" (voir Apero/Medusa/Casting pour le pattern).

Si le jeu **n'a pas** ces modes, **il faut les créer d'abord**. Le système premium gate l'accès à des modes existants ; il ne les invente pas. Concrètement :

- Pas de niveaux ? Définis-en (au moins free + spicy, idéalement free + spicy + hardcore) et tagge le contenu.
- Pas de drinking mode ? Ajoute la lecture via `useDrinksMode().enabled` (cf. `src/utils/drinks.ts` pour les helpers `drinkUnit`, `drinkColumnLabel`, etc.).

---

### Étape 1 — Déclarer les variants dans le catalog

`src/config/games.config.ts` :

```ts
{
  id: 'my-game',
  // ...
  variants: [
    { id: 'spicy', requires: 'spicy_content' },
    { id: 'hardcore', requires: 'hardcore_content' },
    { id: 'drinks', requires: 'drinks_mode' },
  ],
}
```

Ces variants documentent l'intention. Ils sont lus par d'autres systèmes (analytics, futur A/B).

### Étape 2 — Tagger le contenu

Deux patterns possibles selon la structure du jeu :

**Pattern A — Tag par item** (Paranoïa-style) : chaque question porte son `tier`.

```json
{
  "questions": [
    { "id": "p_001", "text": "...", "tier": "free", "tags": [] },
    { "id": "p_042", "text": "...", "tier": "spicy", "tags": [] },
    { "id": "p_087", "text": "...", "tier": "hardcore", "tags": [] }
  ]
}
```

Dans l'écran :
```tsx
import { useGameContent, ContentItem } from '../content';

const all = t('my-game:questions', { returnObjects: true }) as ContentItem[];
const questions = useGameContent(all); // filtré automatiquement
```

**Pattern B — Tag par niveau/catégorie** (Purity-style) : un map `LevelKey → ContentTier`.

```ts
// src/games/my-game/levelTiers.ts
import { ContentTier } from '../../content';
import { Entitlement } from '../../entitlements';

export const LEVEL_TIER: Record<MyLevelKey, ContentTier> = {
  soft: 'free',
  spicy: 'spicy',
  hardcore: 'hardcore',
};

const TIER_ENTITLEMENT: Record<ContentTier, Entitlement | null> = {
  free: null,
  spicy: 'spicy_content',
  hardcore: 'hardcore_content',
};

export function levelRequiredEntitlement(level: MyLevelKey): Entitlement | null {
  return TIER_ENTITLEMENT[LEVEL_TIER[level]];
}
```

Choisis A quand chaque item a son propre niveau (questions individuelles). Choisis B quand le contenu est groupé en buckets/niveaux/catégories homogènes.

### Étape 3 — Hook d'accès du jeu

Pour Pattern B, écrire un hook miroir de `usePurityLevelAccess` :

```ts
// src/games/my-game/useMyGameLevelAccess.ts
import { useCallback, useMemo } from 'react';
import { useEntitlements } from '../../entitlements';
import { usePaywall } from '../../paywall';
import { levelRequiredEntitlement } from './levelTiers';

export function useMyGameLevelAccess() {
  const { has } = useEntitlements();
  const { open } = usePaywall();

  const isLevelAllowed = useCallback(
    (level: MyLevelKey) => {
      const req = levelRequiredEntitlement(level);
      return req === null || has(req);
    },
    [has],
  );

  const requestUnlockFor = useCallback(
    (level: MyLevelKey) => {
      const req = levelRequiredEntitlement(level);
      if (req) open(req); // 'source' pour analytics — modal toujours identique
    },
    [open],
  );

  const highestAllowedLevel = useMemo(() => {
    // logique de fallback : retourner le plus haut niveau accessible
  }, [isLevelAllowed]);

  return { isLevelAllowed, requestUnlockFor, highestAllowedLevel };
}
```

### Étape 4 — Couche défensive dans le hook de jeu

**Ne fais jamais confiance à l'UI seule.** Le hook qui génère le contenu doit re-filtrer.

```ts
// src/games/my-game/hooks/useMyGame.ts
import { useEntitlements, Entitlement } from '../../../entitlements';
import { levelRequiredEntitlement } from '../levelTiers';

function sanitizeConfigForEntitlements(
  config: MyConfig,
  has: (e: Entitlement) => boolean,
): MyConfig {
  // mettre à 0 (ou retirer) les buckets que has() refuse
  // ...
}

export function useMyGame(players, config) {
  const { has } = useEntitlements();
  const safe = sanitizeConfigForEntitlements(config, has);
  // ... génère le contenu à partir de `safe`
}
```

**Pourquoi ?** Si le user était premium puis a expiré, ou si une config stale arrive depuis AsyncStorage, l'UI peut bypass. La couche défensive garantit qu'aucune question payante ne sort.

### Étape 5 — Gating de l'UI

Dans l'écran de règles / settings du jeu, les boutons des niveaux/modes lockés doivent :

1. **Afficher un cadenas** (`<Feather name="lock" />`).
2. **Avoir un style "désactivé"** (opacity réduite, couleur grise).
3. **Au tap, appeler `requestUnlockFor(level)`** au lieu d'activer le niveau.

```tsx
const { isLevelAllowed, requestUnlockFor } = useMyGameLevelAccess();

LEVELS.map((level) => {
  const allowed = isLevelAllowed(level);
  return (
    <TouchableOpacity
      onPress={() => (allowed ? selectLevel(level) : requestUnlockFor(level))}
      style={[styles.btn, !allowed && styles.btnLocked]}
    >
      {!allowed && <Feather name="lock" size={10} />}
      <Text>{LABEL[level]}</Text>
    </TouchableOpacity>
  );
});
```

### Étape 6 — Default state

L'état initial du jeu doit pointer vers **le plus haut niveau accessible**, jamais vers un niveau locké :

```tsx
const { highestAllowedLevel } = useMyGameLevelAccess();
const [maxLevel, setMaxLevel] = useState(highestAllowedLevel);
```

Sinon un free user atterrit sur un niveau verrouillé et voit "0 questions". UX cassée.

### Étape 7 — Drinking mode (si le jeu en a un)

Si le jeu distribue des pénalités/points narrativement liés à "boire" :

```tsx
import { useDrinksMode } from '../hooks';
import { drinkColumnLabel, drinkUnit, drinkUnitLower } from '../utils/drinks';

const { enabled: drinksEnabled } = useDrinksMode();

// Dans les règles :
const ruleText = drinksEnabled
  ? "X boit 2 gorgées"
  : "X prend 2 points";

// Dans les résultats :
<Text>{drinkColumnLabel(drinksEnabled)}</Text> // "GORGÉES" ou "POINTS"
<Text>{drinkUnit(count, drinksEnabled)}</Text>   // "3 GORGÉES" ou "3 POINTS"
```

`useDrinksMode().enabled` = entitled **ET** toggle utilisateur on (cf. Settings). Le toggle est géré globalement, le jeu ne le manage pas.

---

## 4. Le paywall — règles strictes

### Le modal est unique

`PaywallModal` est monté **une seule fois** par `PaywallProvider` (dans `App.tsx`). Personne d'autre ne doit l'importer.

### Ouvrir le paywall

```tsx
const { open } = usePaywall();

open();                    // ouvre le paywall générique
open('spicy_content');     // 'source' pour analytics seulement — modal IDENTIQUE
open('drinks_mode');       // idem
```

L'argument optionnel est **strictement** un signal d'origine pour les métriques. **Il ne change pas le contenu affiché.** Le titre, le pitch, les bénéfices, le CTA et les plans sont **identiques quelle que soit la feature**.

### Helper hook (pratique)

`useGatedFeature(feature)` combine entitlement + paywall :

```tsx
const { canAccess, requestUnlock } = useGatedFeature('hardcore_content');

return canAccess
  ? <HardcoreContent />
  : <LockedButton onPress={requestUnlock} />;
```

### Ce qu'il ne faut JAMAIS faire

- ❌ Créer un autre composant `PaywallModal` ou variante.
- ❌ Faire varier le contenu du paywall en fonction de `feature`.
- ❌ Faire un paywall "léger" inline (un modal alternatif au full paywall).
- ❌ Mettre `if (isPremium)` dans un écran : utilise `useEntitlement` ou `useGatedFeature`.
- ❌ Hardcoder des prix ou plans dans un jeu — tout passe par `paywall.json` (i18n).

---

## 5. Dev tools — tester sans IAP

`src/entitlements/devTools.ts` expose (compilé out en prod) :

```ts
import { setDevTier, setDevOverride, clearDevOverrides } from './src/entitlements';

setDevTier('premium');                 // tout débloqué
setDevTier('free');                    // tout verrouillé (sauf overrides)
setDevOverride('spicy_content', true); // débloquer un seul flag
setDevOverride('spicy_content', null); // retirer l'override
clearDevOverrides();                   // reset overrides
```

Pattern recommandé pour les tests : ajoute un menu debug derrière un long-press dans le Home, ou appelle directement depuis la console dev.

---

## 6. Où se trouve quoi

| Domaine | Fichier(s) clé |
|---|---|
| Liste des entitlements | `src/entitlements/types.ts` (`ENTITLEMENTS`) |
| Provider + hooks principaux | `src/entitlements/EntitlementsContext.tsx` |
| Outils dev | `src/entitlements/devTools.ts` |
| Catalogue des jeux | `src/config/games.config.ts` |
| Tier de contenu (free/spicy/hardcore) | `src/content/types.ts` |
| Sélecteur générique | `src/content/selectContent.ts` + `useGameContent.ts` |
| Préférences utilisateur (drinks toggle, etc.) | `src/contexts/PreferencesContext.tsx` |
| Drinks helpers | `src/hooks/useDrinksMode.ts`, `src/utils/drinks.ts` |
| Paywall (modal unique) | `src/components/common/PaywallModal.tsx` |
| Paywall (provider + hook) | `src/paywall/PaywallContext.tsx` |
| Contenu paywall (i18n) | `src/i18n/locales/{fr,en}/paywall.json` |
| `useGatedFeature` | `src/paywall/useGatedFeature.ts` |
| Exemple de référence | `src/games/purity-test/levelTiers.ts` + `usePurityLevelAccess.ts` |

---

## 7. Récap : check-list par jeu

Avant de merger l'intégration premium d'un jeu :

- [ ] Le jeu a des **modes/niveaux** (spicy + hardcore au minimum) — sinon, les créer d'abord.
- [ ] Si applicable : le jeu a un **drinking mode** propre via `useDrinksMode()`.
- [ ] Les **variants** sont déclarés dans `games.config.ts`.
- [ ] Le contenu est **taggé** (Pattern A ou B selon la structure).
- [ ] Un **hook d'accès** existe : `useMyGameLevelAccess()` ou équivalent.
- [ ] Le hook de jeu (`useMyGame`) applique le **filtre défensif**.
- [ ] L'UI affiche un **cadenas** sur les modes lockés ; tap → `requestUnlockFor()`.
- [ ] L'état initial pointe vers `highestAllowedLevel` — pas vers un niveau locké.
- [ ] **Aucun composant paywall custom n'a été créé.** `usePaywall().open()` partout.
- [ ] Testé en `free`, `premium`, et state intermédiaire (override d'un seul flag).
