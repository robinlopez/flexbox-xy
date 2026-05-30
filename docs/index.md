# Gridaflex

Système de mise en page Flexbox organisé autour de deux axes, horizontal (`flex-x`) et vertical (`flex-y`). Chaque conteneur est composé de cellules (`cell`) et intègre nativement la gestion des gouttières, de l’alignement et du responsive. L’ensemble repose sur le moteur moderne `gap`, sans recours aux marges artificielles ni aux paddings négatifs.

!!! info "D'où ça vient & pourquoi"
    Gridaflex reprend l'API et la logique des classes d'une grille historique très répandue (la grille **XY de Foundation**), pour que les équipes n'aient **rien à réapprendre**. Mais son moteur, lui, est entièrement modernisé : là où l'ancienne grille simulait les gouttières avec des **marges/paddings négatifs** ; ce qui entre en conflit dès qu'on utilise du CSS moderne (`gap`, `flex`, CSS Grid), Gridaflex s'appuie directement sur `column-gap` / `row-gap`. D'où le changement de nom : on garde les idées, on abandonne les hacks.

## Le moteur en bref

| Concept | Approche héritée | Gridaflex                                                    |
|---|---|---------------------------------------------------------------|
| Gouttières (gap) | marges négatives + marges sur cellules | `column-gap` / `row-gap` par axe                              |
| Gouttières padding | padding + marge négative de compensation | `padding` interne (`border-box`)                              |
| Valeur de gouttière | recopiée dans chaque media-query | variables CSS d'axe `--flex-gap-x` / `--flex-gap-y`           |
| Largeur d'une cellule | `calc(% - gutter)` (approximatif) | `calc(f·100% − (1−f)·gap)`, exact, *gap-aware*, sans override |

La formule clé : pour une cellule de fraction `f`, dans une grille à gouttière `g`, la largeur exacte est `f·100% − (1−f)·g`. Pour 3 cellules `desktop-4` (`f = 1/3`) : chacune `33.33% − 0.667g`, soit `(100% − 2g)/3`. ✔

!!! success "Résultat"
    Plus aucun débordement parasite, compatible avec `gap`, `row-gap`, CSS Grid imbriquée, et chaque gouttière est surchargeable à la volée via `--flex-gap-x` / `--flex-gap-y`.

## Aperçu

<div class="flex-y flex-gap-y gx-demo">
    <div class="cell shrink flex-x flex-gap-xy">
      <div class="cell desktop-4">desktop-4</div>
      <div class="cell desktop-8 alt">desktop-8</div>
    </div>
    <div class="cell shrink flex-x flex-gap-xy tablet-portrait-up-3">
      <div class="cell">cell</div>
      <div class="cell alt">cell</div>
      <div class="cell">cell</div>
    </div>
</div>

```html
<div class="flex-x flex-gap-xy">
  <div class="cell desktop-4">desktop-4</div>
  <div class="cell desktop-8">desktop-8</div>
</div>
```

## Pour commencer

- [Démarrage](demarrage.md) : installation, configuration, breakpoints sémantiques
- [La grille](grille.md) : cellules, conteneur, auto/shrink, responsive, frame
- [Gouttières & axes](gouttieres.md) : `flex-gap-x/y/xy`, padding, axes indépendants
- [Constructeur de grille](builder.md) : un outil interactif pour générer votre markup
