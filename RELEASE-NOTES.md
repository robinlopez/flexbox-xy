# Notes de version

Notes de version narratives de **Gridaflex**, orientées utilisateur — le « pourquoi »
et le « comment migrer » derrière chaque version. Pour le détail exhaustif des
changements, voir le [CHANGELOG](CHANGELOG.md).

> Convention : on écrit ici **après** publication, pour expliquer la version à
> quelqu'un qui découvre la mise à jour. Le suivi au fil de l'eau se fait dans le
> `CHANGELOG.md`, section `[Unreleased]`.

---

## 1.0.0 — Première version stable {#100}

**Gridaflex** reprend l'ergonomie de la grille **XY de Foundation** (mêmes noms de
classes, même mental model `flex-x` / `cell` / tailles responsive) mais remplace son
moteur par du **flexbox + `gap` moderne**. Concrètement :

- **Plus de marges négatives.** Les gouttières historiques simulaient l'espacement
  avec des marges/paddings négatifs, source de conflits avec vos propres `gap`,
  `flex` ou CSS Grid. Gridaflex utilise directement `column-gap` / `row-gap`.
- **Des largeurs exactes.** La largeur d'une cellule est calculée en tenant compte
  de la gouttière (`calc(f·100% − (1−f)·gap)`), sans approximation ni override.
- **Deux axes indépendants.** `flex-gap-x` ne touche que l'horizontal, `flex-gap-y`
  que le vertical ; combinables, ou raccourci `flex-gap-xy`.

### Pour qui ?

- Vous démarrez un projet et voulez une grille responsive légère, sans framework.
- Vous maintenez un projet Foundation XY et voulez vous débarrasser des conflits de
  gouttières : **dans la quasi-totalité des cas, on remplace la feuille de styles,
  rien d'autre.**

### Démarrer

```bash
npm install gridaflex
```

```scss
@use 'gridaflex/src/settings' with ($flex-columns: 12);
@use 'gridaflex/src/classes';
```

Voir le [guide de démarrage](docs/demarrage.md) pour la configuration complète, et
les [ressources IA](docs/assistant-ia.md) pour faire maîtriser le système à votre
assistant de code.

### Notes de migration depuis Foundation XY

- `flex-gap-x` collé aux bords ne nécessite plus `body { overflow-x: hidden }`.
- Push / Pull non repris (déprécié côté Foundation) → utilisez `[bp]-order-[n]`.
- Les anciens noms (`$grid-*`, `flex-margin-*`, `xy-grid-*`) restent acceptés en
  alias dépréciés : votre config existante continue de compiler.
