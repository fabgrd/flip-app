# PlayingCard

Composants visuels pour cartes à jouer (jeu français 52 cartes). Réutilisables dans n'importe quel jeu.

## Composants

### `PlayingCardFace`

Carte face visible. Rouge automatique pour ♥ et ♦.

```tsx
// Taille par défaut (100×140)
<PlayingCardFace value="7" suit="♥" />

// Taille réduite, sans ombre (ex: traversée)
<PlayingCardFace value="R" suit="♠" width={44} height={60} shadow={false} borderWidth={1.5} />

// Ombre colorée (ex: carte trouvée)
<PlayingCardFace value="A" suit="♦" shadowColor={T.mint} />
```

| Prop          | Type      | Défaut  | Description                                     |
| ------------- | --------- | ------- | ----------------------------------------------- |
| `value`       | `string`  | —       | Valeur affichée (`2`…`10`, `V`, `D`, `R`, `A`)  |
| `suit`        | `string`  | —       | Couleur (`♠` `♥` `♦` `♣`)                   |
| `width`       | `number`  | `100`   |                                                 |
| `height`      | `number`  | `140`   | Pilote le scale général (fontes, radius, ombre) |
| `borderWidth` | `number`  | auto    | `3` à h=140, scale sinon                        |
| `shadowColor` | `string`  | `T.ink` |                                                 |
| `shadow`      | `boolean` | `true`  |                                                 |

---

### `PlayingCardBack`

Dos de carte : fond rose + motif croisillon + `?`.

```tsx
<PlayingCardBack />
<PlayingCardBack width={44} height={60} shadow={false} />
```

Mêmes props que `PlayingCardFace` sauf `value`/`suit`/`shadowColor`.

---

### `CardCrosshatch`

Pattern SVG seul, utile pour superposer sur un fond custom (ex: carte retournée dans la traversée).

```tsx
<View style={{ backgroundColor: T.pink, overflow: 'hidden' }}>
  <CardCrosshatch width={44} height={60} opacity={0.22} />
</View>
```

---

### `isRedSuit`

```tsx
isRedSuit('♥'); // true
isRedSuit('♠'); // false
```
