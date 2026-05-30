---
name: gridaflex
description: Système de mise en page Gridaflex (axes X/Y, moteur gap). Utiliser pour produire du HTML/CSS/SCSS de grille responsive avec les classes flex-x / cell / [bp]-[n] et l'API Sass xy-flex.
---

# Gridaflex — Guide pour assistant de code

Ressource à copier dans un projet pour qu'un assistant IA utilise **correctement**
la librairie [`gridaflex`](https://www.npmjs.com/package/gridaflex). C'est un
système de grille **flexbox** à deux axes, sur moteur `gap` moderne (jamais de
marges négatives). Préfixe des classes : `flex-` (ce n'est PAS CSS Grid).

## Modèle mental (à respecter)

1. Un **conteneur** optionnel `.flex-container` centre et limite la largeur.
2. Un **groupe** définit l'axe : `.flex-x` (horizontal) ou `.flex-y` (vertical).
3. Les **cellules** `.cell` se placent dans le groupe et reçoivent une **taille
   responsive** `[breakpoint]-[n]` (n sur `$flex-columns`, 12 par défaut).
4. Les **gouttières** sont des classes posées **sur le groupe** : `.flex-gap-x`
   (horizontal), `.flex-gap-y` (vertical), `.flex-gap-xy` (les deux).

> Règle d'or : la taille (`desktop-4`) va sur la **cellule** ; la gouttière
> (`flex-gap-x`) va sur le **groupe**. Ne pas inverser.

## Squelette canonique

```html
<div class="flex-container">
  <div class="flex-x flex-gap-x">
    <div class="cell phone-12 tablet-portrait-6 desktop-4">A</div>
    <div class="cell phone-12 tablet-portrait-6 desktop-8">B</div>
  </div>
</div>
```

- Mobile-first : `phone-*` s'applique partout, puis surchargé vers le haut.
- Le premier breakpoint vaut toujours `0` (`phone` par défaut).
- Les fractions sont **gap-aware** : 3× `desktop-4` tiennent exactement, gouttière comprise.

## Breakpoints par défaut

`phone` (0) · `tablet-portrait` (600px) · `tablet-landscape` (900px) ·
`desktop` (1200px) · `medium-desktop` (1440px) · `big-desktop` (1800px).

Tout est renommable côté config — n'invente JAMAIS un breakpoint absent de la
config du projet. En l'absence d'info, utilise les noms ci-dessus.

## Cheatsheet des classes

| Besoin                              | Classe(s) | Posée sur |
|-------------------------------------|---|---|
| Conteneur centré                    | `flex-container` (+ `.fluid`, `.full`) | wrapper |
| Groupe horizontal / vertical      | `flex-x` / `flex-y` | groupe |
| Gouttière gap                       | `flex-gap-x` / `flex-gap-y` / `flex-gap-xy` | groupe |
| Gouttière padding interne           | `flex-padding-x` / `-y` / `-xy` | groupe |
| Gouttière nommée (si configurée)    | `flex-gap-sm-x`, `[bp]-flex-gap-lg-xy`… | groupe |
| Cellule                             | `cell` | cellule |
| Taille responsive                   | `[bp]-[1..12]` (ex. `desktop-4`) | cellule |
| Largeur auto / au contenu           | `auto` / `shrink` (ou `[bp]-auto` / `[bp]-shrink`) | cellule |
| Décalage                            | `[bp]-offset-[n]` | cellule |
| Block grid (N par ligne)            | `[bp]-up-[n]` | groupe |
| Supprimer la gouttière              | `[bp]-gap-collapse` / `[bp]-padding-collapse` | groupe |
| Réordonner                          | `[bp]-order-[n]` | cellule |
| Frame plein écran / zone scrollable | `flex-frame`, `cell-block`, `cell-block-container` | voir doc |
| Alignement (parent)                 | `align-left/right/center/justify/spaced`, `align-top/middle/bottom/stretch`, `align-center-middle` | groupe |
| Alignement (cellule)                | `align-self-top/middle/bottom/stretch` | cellule |
| Helpers flex bruts                  | `flex-box`, `flex-dir-*`, `flex-child-*` (+ `[bp]-`) | élément |
| Visibilité                          | `show-for-[bp]`, `hide-for-[bp]`, `*-only`, `hide`, `invisible`, `visible` | élément |

## Axes : indépendants

`flex-gap-x` = `column-gap` (horizontal) uniquement ; `flex-gap-y` = `row-gap`
(vertical) uniquement ; `flex-gap-xy` = les deux. Gap et padding sont cumulables :

```html
<div class="flex-x flex-gap-x">…</div>                 <!-- horizontal seul -->
<div class="flex-x flex-gap-xy flex-padding-y">…</div>  <!-- gap des deux + padding vertical -->
```

## Surcharge ponctuelle (variables CSS)

```html
<div class="flex-x flex-gap-x"  style="--flex-gap-x: 8px">…</div>
<div class="flex-x flex-gap-xy" style="--flex-gap-x: 8px; --flex-gap-y: 16px">…</div>
```

## Configuration Sass (avant d'émettre les classes)

L'ordre des `@use` est **critique** : `with (…)` doit être dans le premier fichier
qui charge `settings`, **dans le même fichier** que l'`@use 'src/classes'`.

```scss
@use 'gridaflex/src/settings' with (
  $flex-columns: 12,
  $breakpoints: ('phone': 0, 'tablet': 768px, 'desktop': 1200px),
  $breakpoint-classes: (phone tablet desktop),
  $flex-margin-gutters: ('phone': 16px, 'desktop': 24px),
  $gutters: ('default': 16px, 'sm': 8px, 'lg': 32px),
);
@use 'gridaflex/src/classes';   // émet les classes AVEC cette config
```

## API Sass sémantique (sans classes utilitaires)

```scss
@use 'gridaflex' as flex;

.galerie {
  @include flex.xy-flex;                 // display:flex + wrap
  @include flex.xy-flex-margin(xy);      // gouttière sur les 2 axes
  @include flex.xy-flex-layout(3, '.item'); // 3 items par ligne
}
.sidebar {
  @include flex.xy-cell(1 of 4);         // 25 %, gap-aware
  @include flex.breakpoint(desktop) { @include flex.xy-cell(3); }
}
```

Mixins clés : `xy-flex-container`, `xy-flex($direction)`, `xy-flex-margin($axis)`,
`xy-flex-padding($axis)`, `xy-cell($size)`, `xy-cell-offset($n)`,
`xy-flex-layout($n, $sel)`, `xy-flex-frame`, `flex-align($x,$y)`, `breakpoint(…)`,
`show-for($bp)` / `hide-for($bp)`.

## Mixin `breakpoint()`

```scss
@include flex.breakpoint(tablet-portrait only) { … } // plage exacte
@include flex.breakpoint(desktop)              { … } // desktop et au-dessus
@include flex.breakpoint(desktop down)         { … } // desktop et en-dessous
@include flex.breakpoint(768px)                { … } // valeur brute → em
@include flex.breakpoint(landscape)            { … } // orientation
@include flex.breakpoint(retina)               { … } // HiDPI
```

## Erreurs à NE PAS commettre

- ❌ Mettre la taille (`desktop-4`) sur le groupe, ou la gouttière (`flex-gap-x`) sur la cellule.
- ❌ Utiliser des marges négatives ou `overflow-x: hidden` pour « corriger » des débordements : inutile, le moteur `gap` n'en crée pas.
- ❌ Confondre avec CSS Grid (`grid-template-*`) : c'est du **flexbox**.
- ❌ Inventer des breakpoints/tailles hors de la config du projet (n va de 1 à `$flex-columns`).
- ❌ Utiliser les noms `grid-*` / `flex-margin-*` / `xy-grid-*` en code neuf : ce sont des **alias dépréciés** de compat Foundation. Préférer `flex-*` / `flex-gap-*` / `xy-flex-*`.
- ❌ Placer le `@use … with (…)` après l'`@use 'src/classes'` (la config serait ignorée).

## Compatibilité Foundation XY

L'API reprend les noms de la grille XY de Foundation. Pour migrer : on remplace
généralement la feuille de styles, rien d'autre. Push/Pull non repris → `[bp]-order-[n]`.
