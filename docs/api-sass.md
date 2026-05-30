# API Sass & référentiel des classes

Gridaflex s'utilise de deux façons, documentées sur cette page :

- le **référentiel des classes** utilitaires (ci-dessous), pour composer une grille directement dans le HTML ;
- l'**API Sass** (mixins & fonctions), pour bâtir une grille *sémantique* dans vos propres sélecteurs.

---

## Anatomie : 3 niveaux d'éléments

Une grille Gridaflex s'imbrique toujours en trois niveaux. **Chaque classe vit sur l'élément de son niveau** : une taille (`desktop-4`) sur une cellule, une gouttière (`flex-gap-x`) sur le groupe, jamais l'inverse.

<div class="gx-legend" markdown>
<span class="gx-lvl gx-lvl--container">Conteneur</span>
<span class="gx-lvl gx-lvl--track">Groupe</span>
<span class="gx-lvl gx-lvl--cell">Cellule</span>
<span class="gx-lvl gx-lvl--any">Tout élément</span>
</div>

```html
<div class="flex-container">                       <!-- Conteneur : largeur max + centrage -->
  <div class="flex-x flex-gap-x align-middle">     <!-- Groupe : direction + gouttière + alignement -->
    <div class="cell phone-12 desktop-4">…</div>   <!-- Cellule : taille responsive -->
    <div class="cell phone-12 desktop-8">…</div>
  </div>
</div>
```

!!! note "Conventions de lecture"
    - `[bp]` = un de **vos** breakpoints (`phone`, `desktop`, … selon `$breakpoint-classes`).
    - `[n]` = un entier de `1` à `$flex-columns` (12 par défaut).
    - `{size}` = une taille nommée de `$gutters` / `$padding-gutters` (`sm`, `lg`, …).

---

## Référentiel des classes

### <span class="gx-lvl gx-lvl--container">Conteneur</span> {#conteneur}

À poser sur l'élément englobant. Optionnel (un groupe peut occuper toute la largeur sans conteneur).

| Classe | Effet |
|---|---|
| `flex-container` | Largeur max (`$flex-container`) + centrage horizontal |
| `flex-container fluid` | Conteneur pleine largeur (annule la `max-width`) |
| `flex-container full` | Pleine largeur **sans** padding latéral |

### <span class="gx-lvl gx-lvl--track">Groupe</span> {#groupe}

À poser sur `flex-x` / `flex-y` : direction, gouttières, alignement du contenu, block grid.

| Catégorie                 | Classe(s) | Effet |
|---------------------------|---|---|
| **Direction**             | `flex-x`<br>`flex-y` | Groupe horizontal (lignes)<br>vertical (colonnes) |
| **Gouttière : gap**       | `flex-gap-x`<br>`flex-gap-y`<br>`flex-gap-xy` | `column-gap`<br>`row-gap`<br>les deux |
|                           | `flex-gap-{size}-x/y/xy` | Gap d'une taille nommée (ex. `flex-gap-sm-x`) |
|                           | `[bp]-flex-gap[-{size}]-x/y/xy` | Gap appliqué à partir d'un breakpoint |
|                           | `flex-margin-x/y/xy` | *Alias de compatibilité* de `flex-gap-*` |
| **Gouttière : padding**   | `flex-padding-x`<br>`-y`<br>`-xy` | Padding interne des cellules (indépendant du gap) |
|                           | `flex-padding-{size}-*`<br>`[bp]-flex-padding[-{size}]-*` | Taille nommée<br>variante responsive |
| **Suppression**           | `[bp]-gap-collapse` | Annule les gouttières à partir d'un breakpoint (alias `[bp]-margin-collapse`) |
|                           | `[bp]-padding-collapse` | Annule le padding interne |
| **Alignement horizontal** | `align-left`<br>`align-right`<br>`align-center`<br>`align-justify`<br>`align-spaced` | `justify-content` du contenu |
| **Alignement vertical**   | `align-top`<br>`align-middle`<br>`align-bottom`<br>`align-stretch` | `align-items` du contenu |
| **Combiné**               | `align-center-middle` | Centre sur les deux axes |
| **Block grid**            | `[bp]-up-[n]` | `n` cellules par ligne (l'alternative au dimensionnement cellule par cellule) |
| **Frame (plein écran)**   | `flex-frame`<br>`[bp]-flex-frame` | Groupe 100 vh sans débordement (layout type application) |
|                           | `cell-block-container`<br>`[bp]-cell-block-container` | Conteneur transmettant les contraintes de hauteur |

!!! tip "Gap vs Padding"
    Les deux sont **indépendants et cumulables** : `flex-gap-xy` espace les cellules entre elles, `flex-padding-y` ajoute du padding *à l'intérieur* de chaque cellule. Voir [Gouttières & axes](gouttieres.md).

### <span class="gx-lvl gx-lvl--cell">Cellule</span> {#cellule}

À poser sur `cell` : taille, décalage, ordre, alignement individuel.

| Catégorie | Classe(s) | Effet |
|---|---|---|
| **Base** | `cell` | Élément de grille (obligatoire) |
| **Taille** | `[bp]-[n]` | Largeur = `n / $flex-columns` (ex. `phone-12`, `desktop-4`), *gap-aware* |
| **Largeur automatique** | `auto`<br>`[bp]-auto` | Absorbe l'espace restant |
| | `shrink`<br>`[bp]-shrink` | Se réduit à son contenu |
| **Décalage** | `[bp]-offset-[n]` | Pousse la cellule de `n` colonnes vers la droite |
| **Ordre** | `[bp]-order-[n]` | Réordonne visuellement (`order`), `n` de 0 à `$flex-columns` |
| **Alignement individuel** | `align-self-top`<br>`-middle`<br>`-bottom`<br>`-stretch` | `align-self` de cette seule cellule |
| **Zone scrollable** | `cell-block`<br>`cell-block-y` (+ `[bp]-`) | Cellule défilante (avec `flex-frame`) |

### <span class="gx-lvl gx-lvl--any">Tout élément</span> {#tout-element}

Utilitaires indépendants de la grille, posables sur n'importe quel élément.

| Catégorie | Classe(s) | Effet |
|---|---|---|
| **Visibilité responsive** | `show-for-[bp]`<br>`hide-for-[bp]` | Afficher / masquer à partir d'un breakpoint |
| | `show-for-[bp]-only`<br>`hide-for-[bp]-only` | …sur la plage exacte du breakpoint |
| | `show-for-landscape`<br>`show-for-portrait` (+ `hide-`) | Selon l'orientation |
| **Visibilité simple** | `hide`<br>`invisible`<br>`visible` | `display:none`<br>`visibility:hidden`<br>visible |
| **Helpers flex bruts** | `flex-box` (+ `[bp]-`) | `display:flex` |
| | `flex-dir-row/-row-reverse/-column/-column-reverse` (+ `[bp]-`) | `flex-direction` |
| | `flex-child-auto/-grow/-shrink` (+ `[bp]-`) | Raccourcis `flex` sur un enfant |

Voir aussi : [La grille](grille.md), [Breakpoints & responsive](responsive.md), [Visibilité](visibilite.md), [Alignement & ordre](alignement.md).

---

## API Sass

Toutes les classes ci-dessus sont construites à partir de ces mixins, que vous pouvez aussi utiliser pour bâtir une grille **sémantique** (sans classes utilitaires dans le HTML).

```scss
@use 'gridaflex' as flex;
```

### Mixins

| Mixin | Niveau | Rôle                                                             |
|---|---|------------------------------------------------------------------|
| `xy-flex-container($width, $padding)` | <span class="gx-lvl gx-lvl--container">Conteneur</span> | Conteneur max-width centré                                       |
| `xy-flex($direction, $wrap)` | <span class="gx-lvl gx-lvl--track">Groupe</span> | Conteneur flex (`horizontal` / `vertical`)                       |
| `xy-flex-margin($axis, $gutters)` | <span class="gx-lvl gx-lvl--track">Groupe</span> | Gouttières `gap`, `$axis` : `x` / `y` / `xy`                     |
| `xy-flex-padding($axis, $gutters)` | <span class="gx-lvl gx-lvl--track">Groupe</span> | Gouttières en padding interne                                    |
| `xy-flex-layout($n, $selector, $vertical)` | <span class="gx-lvl gx-lvl--track">Groupe</span> | Block grid sémantique (N par ligne)                              |
| `xy-flex-frame($vertical, $nested)` | <span class="gx-lvl gx-lvl--track">Groupe</span> | Comportement « frame » 100 vh                                    |
| `flex-align($x, $y)` | <span class="gx-lvl gx-lvl--track">Groupe</span> | Alignement du contenu                                            |
| `xy-cell($size, $vertical)` | <span class="gx-lvl gx-lvl--cell">Cellule</span> | Cellule complète (base + taille)                                 |
| `xy-cell-size($size, $vertical)` | <span class="gx-lvl gx-lvl--cell">Cellule</span> | Largeur/hauteur (gap-aware)                                      |
| `xy-cell-base($size)` | <span class="gx-lvl gx-lvl--cell">Cellule</span> | Propriétés flex de base                                          |
| `xy-cell-offset($n, $vertical)` | <span class="gx-lvl gx-lvl--cell">Cellule</span> | Décalage d'une cellule                                           |
| `flex-align-self($y)`<br>`flex-order($n)` | <span class="gx-lvl gx-lvl--cell">Cellule</span> | Alignement individuel<br>ordre                                   |
| `xy-cell-block($vertical)`<br>`xy-cell-block-container` | <span class="gx-lvl gx-lvl--cell">Cellule</span> | Zones scrollables                                                |
| `breakpoint($value…)` | <span class="gx-lvl gx-lvl--any">Tout</span> | Media query (named, px/rem/em, only/down/up, orientation, hidpi) |
| `show-for($bp)`<br>`hide-for($bp)`<br>`*-only` | <span class="gx-lvl gx-lvl--any">Tout</span> | Visibilité responsive                                            |

!!! note "Compatibilité : `xy-grid-*`"
    Les mixins historiques de Foundation (`xy-grid`, `xy-grid-container`, `xy-grid-margin`, `xy-grid-padding`, `xy-grid-layout`, `xy-grid-frame`) restent disponibles en **alias dépréciés** des `xy-flex-*`. Le nommage `xy-flex` est à privilégier dans les nouveaux développements.

### Fonctions

| Fonction | Retour |
|---|---|
| `xy-cell-size($size)` | Pourcentage d'une taille (ex. `50%`) |
| `gx-fraction($size)` | Fraction 0..1 (accepte `6`, `50%`, `1 of 2`) |
| `gx-gap-x-var()`<br>`gx-gap-y-var()` | Référence `var(--flex-gap-x)` / `var(--flex-gap-y)` |

### Exemples

```scss
.galerie {
  @include flex.xy-flex;
  @include flex.xy-flex-margin(xy);
  @include flex.xy-flex-layout(3, '.item');
}

.barre-laterale {
  @include flex.xy-cell(1 of 4);          // 25 %, gap-aware
  @include flex.breakpoint(desktop) {
    @include flex.xy-cell(3);             // 3/12 sur desktop
  }
}
```
