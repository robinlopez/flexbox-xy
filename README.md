# Gridaflex

> Un système de **mise en page flexbox** à axes **X / Y** : des groupes horizontaux ou verticaux (`flex-x` / `flex-y`) remplis de cellules (`cell`), sur un moteur **`gap`** moderne, sans marges ni paddings négatifs.

Le préfixe est `flex-` (pas `grid-`) car c'est bien du **flexbox**, à distinguer de CSS Grid Layout.

> **D'où ça vient.** Gridaflex reprend l'API et les noms de classes d'une grille historique très répandue (la grille **XY de Foundation**), pour que les équipes n'aient rien à réapprendre — mais son moteur est entièrement modernisé. Là où l'ancienne grille simulait les gouttières avec des **marges/paddings négatifs** (sources de conflits avec `gap`/`flex`/CSS Grid), Gridaflex utilise directement `column-gap` / `row-gap`.

## Le moteur en bref

| Concept | Approche héritée | Gridaflex |
|---|---|---|
| Gouttières (gap) | marges négatives + marges sur cellules | `column-gap` / `row-gap` par axe |
| Gouttières padding | padding + marge négative de compensation | `padding` interne (`border-box`) |
| Valeur de gouttière | recopiée dans chaque media-query | variables CSS d'axe `--flex-gap-x` / `--flex-gap-y` |
| Largeur d'une cellule | `calc(% - gutter)` (approximatif) | `calc(f·100% − (1−f)·gap)` — exact, *gap-aware*, sans override |

La formule clé : pour une cellule de fraction `f`, dans une grille à gouttière `g`,
la largeur exacte est `f·100% − (1−f)·g`. Vérifiable : 3 cellules `desktop-4` (`f = 1/3`)
donnent chacune `33.33% − 0.667g`, soit `(100% − 2g) / 3`. ✔

## Installation

```bash
npm install gridaflex
```

### Quel mode choisir ?

| Votre besoin | Mode | Comment |
|---|---|---|
| Juste les classes, sans build Sass | **CSS compilé** | un `<link>` vers le `.min.css` |
| Les classes, mais avec **vos** réglages (colonnes, breakpoints, gouttières) | **Sass + config** | un fichier de config (voir plus bas) |
| Une grille **sémantique** (vos propres sélecteurs, pas de classes utilitaires) | **API Sass** | les mixins `xy-flex*` |

=== "CSS compilé"

    ```html
    <link rel="stylesheet" href="node_modules/gridaflex/dist/gridaflex.min.css">
    ```

=== "Sass + config (recommandé)"

    ```scss
    // Surcharger les réglages AVANT d'émettre les classes
    @use 'gridaflex/src/settings' with ($flex-columns: 12);
    @use 'gridaflex/src/classes';
    ```

=== "API Sass sémantique"

    ```scss
    @use 'gridaflex' as flex;

    .galerie {
      @include flex.xy-flex;
      @include flex.xy-flex-margin(xy);
      @include flex.xy-flex-layout(3, '.item');
    }
    ```

> 🤖 **Vous codez avec un assistant IA ?** Le package fournit `llms.txt` et
> `gridaflex.skill.md` à embarquer dans votre projet pour qu'il maîtrise la grille —
> voir [Assistant IA](docs/assistant-ia.md).

## Classes disponibles

- **Groupes** : `flex-x`, `flex-y`, `cell`
- **Gouttières (gap, par axe)** : `flex-gap-x` (= `column-gap`), `flex-gap-y` (= `row-gap`), `flex-gap` / `flex-gap-xy` (les deux). Padding : `flex-padding-x/y/xy`. Alias de compat : `flex-margin-*`.
- **Conteneur** : `flex-container`, `.fluid`, `.full`
- **Tailles** : `phone-1`…`phone-12` (et `tablet-portrait-`, `desktop-`, … selon vos breakpoints)
- **Auto** : `auto`, `shrink`, `[bp]-auto`, `[bp]-shrink`
- **Offsets** : `[bp]-offset-[n]`
- **Block grid** : `[bp]-up-[n]`
- **Collapse** : `[bp]-gap-collapse` (alias `[bp]-margin-collapse`), `[bp]-padding-collapse`
- **Frame** : `flex-frame`, `[bp]-flex-frame`, `cell-block`, `cell-block-y`, `cell-block-container`
- **Alignement** : `align-left/right/center/justify/spaced`, `align-top/middle/bottom/stretch`, `align-self-*`, `align-center-middle`
- **Ordre** : `[bp]-order-[n]`
- **Helpers flex** : `flex-box`, `flex-dir-*`, `flex-child-*` (+ variantes responsive)
- **Visibilité** : `show-for-[bp]`, `hide-for-[bp]`, `show-for-[bp]-only`, `hide-for-[bp]-only`, `hide`, `invisible`, `visible`

## Exemple

```html
<div class="flex-container">
  <div class="flex-x flex-gap-x">
    <div class="cell tablet-portrait-6 desktop-4">12 / 6 / 4</div>
    <div class="cell tablet-portrait-6 desktop-8">12 / 6 / 8</div>
  </div>
</div>
```

## Breakpoints : sémantique & responsive

Les breakpoints sont **renommables** et **extensibles**. Les classes de grille et le mixin `breakpoint()` se génèrent à partir de vos noms.

```scss
@use 'gridaflex/src/settings' with (
  $breakpoints: (
    'phone': 0,             // le premier DOIT valoir 0
    'tablet-portrait': 600px,
    'tablet-landscape': 900px,
    'desktop': 1200px,
    'big-desktop': 1800px,
  ),
  $breakpoint-classes: (phone tablet-portrait tablet-landscape desktop big-desktop)
);
@use 'gridaflex/src/classes';
```

Vous obtenez alors `phone-12`, `desktop-6`, `tablet-portrait-up-3`, `desktop-offset-2`, `big-desktop-auto`… Ajouter un breakpoint = ajouter une clé.

### Le mixin `breakpoint()`

Reprend la logique Foundation (limites en `em`, compatibles zoom) :

```scss
@use 'gridaflex' as flex;

.menu {
  @include flex.breakpoint(tablet-portrait only) { flex-direction: column; }
  @include flex.breakpoint(desktop)              { gap: 24px; }       // et au-dessus
  @include flex.breakpoint(desktop down)         { padding: 8px; }
  @include flex.breakpoint(768px)                { font-size: 14px; } // valeur brute → em
  @include flex.breakpoint(landscape)            { height: 100vh; }
  @include flex.breakpoint(retina)               { /* @2x */ }
}
```

| Forme | Génère |
|---|---|
| `breakpoint(X)` | X et au-dessus (`min-width`) |
| `breakpoint(X down)` | X et en-dessous (`max-width`) |
| `breakpoint(X only)` | la plage exacte |
| `breakpoint(768px)` | valeur px/rem/em → em |
| `breakpoint(landscape\|portrait)` | orientation |
| `breakpoint(retina)` | résolution HiDPI |

## Visibilité responsive

Mêmes classes que Foundation : `show-for-[bp]`, `hide-for-[bp]`, `show-for-[bp]-only`, `hide-for-[bp]-only`, plus `.hide` / `.invisible` / `.visible` et les variantes `landscape`/`portrait`. Mixins équivalents : `show-for($bp)`, `hide-for($bp)`, `show-for-only($bp)`, `hide-for-only($bp)`.

## Fichier de configuration

Le principe : **un seul fichier** d'entrée qui (1) règle les variables puis (2) émet
les classes. C'est le seul endroit où configurer Gridaflex.

**1. Copiez le template** [`gridaflex.config.example.scss`](gridaflex.config.example.scss)
dans votre projet, par ex. `_gridaflex-settings.scss` :

```bash
cp node_modules/gridaflex/gridaflex.config.example.scss src/styles/_gridaflex-settings.scss
```

**2. Ajustez vos réglages** dans le `with (…)` (colonnes, breakpoints, gouttières).

**3. Importez ce fichier** depuis votre bundle principal — et **lui seul** (il émet
déjà les classes) :

```scss
// main.scss
@use 'gridaflex-settings';
```

Le contenu type du fichier de config :

```scss
// _gridaflex-settings.scss
@use 'gridaflex/src/settings' with (
  $flex-columns: 12,
  $breakpoints: ('phone': 0, 'tablet': 768px, 'desktop': 1200px),
  $breakpoint-classes: (phone tablet desktop),
  $flex-margin-gutters: ('phone': 16px, 'desktop': 24px),
);
@use 'gridaflex/src/classes';   // ← émet toutes les classes avec VOS réglages
```

> ⚠️ **Ordre des `@use` (piège Sass classique).** `@use … with (…)` doit être dans
> le **premier** fichier qui charge `settings`. Mettez donc le `with (…)` **et**
> l'`@use 'src/classes'` dans ce même fichier. Un `with (…)` placé après coup, ou
> dans un autre fichier, sera ignoré (erreur Sass « module already loaded »).

## Gestion des axes

`flex-gap-x` ne gère **que** l'axe horizontal (`column-gap`), `flex-gap-y` **que** le vertical (`row-gap`). Combinez-les, ou prenez le raccourci. Gap et padding sont indépendants et cumulables :

```html
<div class="flex-x flex-gap-x">…</div>              <!-- horizontal seul -->
<div class="flex-x flex-gap-x flex-gap-y">…</div>    <!-- les deux, indépendamment -->
<div class="flex-x flex-gap-xy">…</div>              <!-- les deux d'un coup -->
<div class="flex-x flex-gap-xy flex-padding-y">…</div> <!-- gap horizontal + padding vertical -->
```

> Les classes `flex-margin-*` existent en alias de compatibilité (comportement identique) ; privilégiez `flex-gap-*` dans le code neuf.

## Surcharge à la volée

Les gouttières vivent dans des variables CSS d'axe, surchargeables par instance :

```html
<div class="flex-x flex-gap-x"  style="--flex-gap-x: 8px">…</div>
<div class="flex-x flex-gap-xy" style="--flex-gap-x: 8px; --flex-gap-y: 16px">…</div>
```

## Réglages (`src/_settings.scss`)

| Variable | Défaut |
|---|---|
| `$flex-container` | `1200px` |
| `$flex-columns` | `12` |
| `$breakpoints` | `phone 0, tablet-portrait 600px, tablet-landscape 900px, desktop 1200px, medium-desktop 1440px, big-desktop 1800px` |
| `$breakpoints-hidpi` | `hidpi-1 1, hidpi-1-5 1.5, hidpi-2 2, retina 2, hidpi-3 3` |
| `$breakpoint-classes` | `phone tablet-portrait tablet-landscape desktop medium-desktop big-desktop` |
| `$print-breakpoint` | `null` (désactivé) |
| `$flex-margin-gutters` | `phone 16px, tablet-portrait 24px` |
| `$flex-padding-gutters` | `$flex-margin-gutters` |
| `$gutters` | `default → $flex-margin-gutters` *(tailles de gap nommées)* |
| `$padding-gutters` | `default → $flex-padding-gutters` *(tailles de padding nommées)* |
| `$xy-block-flex-max` | `8` |

> **Compatibilité :** les anciens noms `$grid-container`, `$grid-columns`, `$grid-margin-gutters`, `$grid-padding-gutters`, `$grid-container-padding`, `$xy-block-grid-max` restent acceptés en **alias dépréciés** (un `with ($grid-columns: …)` existant compile toujours). Préférez le préfixe `$flex-`.

## Migration depuis Foundation XY

Dans la quasi-totalité des cas : **on remplace la feuille de styles, rien d'autre**.

- `flex-margin-x` collé aux bords ne nécessite plus `body { overflow-x: hidden }`.
- Push/Pull non repris (déprécié côté Foundation) → utilisez `[bp]-order-[n]`.
- Plus aucun conflit avec vos `gap` maison — c'est tout l'objectif.

## Build

```bash
npm run build      # dist/gridaflex.css + dist/gridaflex.min.css
npm run watch      # recompilation à la volée
```

## Documentation

Le site de documentation est construit avec [Zensical](https://zensical.org) (équipe Material for MkDocs). Sources Markdown dans `docs/`, configuration dans `zensical.toml`. Il inclut un **constructeur de grille interactif** (`docs/builder.md`).

```bash
# Outils (une fois) : Python + Zensical
python3 -m venv .venv && .venv/bin/pip install zensical

# Aperçu local (recompile le CSS puis sert avec live-reload)
npm run docs:css && .venv/bin/zensical serve

# Build statique → site/
npm run docs:css && .venv/bin/zensical build
```

### Publication GitHub Pages

La documentation est versionnée et publiée sur GitHub Pages via [`mike`](https://github.com/jimporter/mike). Le détail du process (build, déploiement d'une version, version par défaut) est décrit dans [`docs/demarrage.md`](docs/demarrage.md#deploiement-de-la-documentation) et [`VERSIONING.md`](VERSIONING.md). Pensez à ajuster `site_url` dans `zensical.toml`.

## Licence

MIT
