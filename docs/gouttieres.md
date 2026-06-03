# Gouttières & axes

`.flex-gap-x` espace les cellules avec `column-gap` (axe horizontal). `.flex-padding-xy` applique un rembourrage interne à chaque cellule.

<div class="gx-demo">
    <div class="flex-x flex-gap-x flex-gap-y">
      <div class="cell auto">flex-gap-x</div>
      <div class="cell auto alt">flex-gap-x</div>
      <div class="cell auto">flex-gap-x</div>
    </div>
    <div class="flex-x flex-gap-xy flex-padding-xy flex-gap-y gx-frame">
      <div class="cell auto"><span class="box">flex-padding-x</span></div>
      <div class="cell auto alt"><span class="box">flex-padding-x</span></div>
      <div class="cell auto"><span class="box">flex-padding-x</span></div>
    </div>
</div>

## Gestion des axes

`x` = gouttière **horizontale** (`column-gap`), `y` = **verticale** (`row-gap`). Combinez-les, ou utilisez le raccourci `xy`.

| Classe | Effet |
|---|---|
| `flex-gap-x` | `column-gap` uniquement |
| `flex-gap-y` | `row-gap` uniquement |
| `flex-gap-x flex-gap-y` | les deux, indépendamment |
| `flex-gap` *(ou `flex-gap-xy`)* | les deux d'un coup |

```html
<div class="flex-x flex-gap-x">…</div>             <!-- horizontal seul -->
<div class="flex-x flex-gap-x flex-gap-y">…</div>   <!-- les deux, indépendamment -->
<div class="flex-x flex-gap-xy">…</div>             <!-- les deux d'un coup -->
<div class="flex-x flex-gap">…</div>                <!-- raccourci équivalent -->
```

!!! note "Compatibilité : `flex-margin-*`"
    Les classes `flex-margin-x` / `flex-margin-y` / `flex-margin-xy` existent en **alias** de `flex-gap-*` (comportement identique). Elles facilitent la reprise de code existant, mais le nommage **`gap`** est à privilégier dans les nouveaux développements.

## Padding par axe

Symétrique : `flex-padding-x`, `flex-padding-y`, `flex-padding-xy`. Gap et padding sont **indépendants** et cumulables, par exemple `flex-gap-xy flex-padding-y`.


## Collapse

`.[bp]-gap-collapse` / `.[bp]-padding-collapse` suppriment les gouttières à partir d'un breakpoint.

```html
<div class="flex-x flex-gap-x desktop-gap-collapse">
  <div class="cell phone-6">Gouttières avant desktop, collées sur desktop+</div>
  <div class="cell phone-6">…</div>
</div>
```

## Tailles de gouttières <span class="gx-cfg" title="Tailles nommées : $gutters / $padding-gutters">gridaflex-settings.scss</span> {#tailles-de-gouttieres}

Plutôt que de coder une valeur en dur, définissez une **map de tailles nommées**, comme la map des breakpoints. La taille `default` (16px) alimente les classes sans suffixe ; chaque autre clé génère ses propres classes.

```scss
@use 'gridaflex/src/settings' with (
  $gutters: (
    'default': 16px,   // → flex-gap-x / -y / -xy
    'sm': 8px,         // → flex-gap-sm-x / -sm-y / -sm-xy
    'lg': 32px,        // → flex-gap-lg-x / …
  ),
  // $padding-gutters: même principe pour flex-padding-{size}-{axis}
);
@use 'gridaflex/src/classes';
```

| Classe | Effet |
|---|---|
| `flex-gap-x` | taille `default` sur l'axe X |
| `flex-gap-sm-x` | taille `sm` sur l'axe X |
| `flex-gap-lg-xy` | taille `lg` sur les deux axes |
| `flex-padding-sm-y` | padding taille `sm` sur l'axe Y |

!!! warning "Noms réservés"
    Ne nommez **jamais** une taille `x`, `y` ou `xy` : ces suffixes désignent les axes.

### Tailles responsive

Préfixez par un breakpoint, exactement comme `phone-12` ou `desktop-offset-2`, pour appliquer une taille **à partir** de ce breakpoint :

```
{bp}-flex-gap-{size}-{axis}        ex. desktop-flex-gap-sm-x
{bp}-flex-padding-{size}-{axis}    ex. phone-flex-padding-lg-y
```

```html
<!-- gap par défaut, puis 'sm' à partir de desktop -->
<div class="flex-x flex-gap-x desktop-flex-gap-sm-x">…</div>

<!-- 'sm' dès phone, 'lg' sur les deux axes à partir de desktop -->
<div class="flex-x phone-flex-gap-sm-x desktop-flex-gap-lg-xy">…</div>
```

Une taille dont la valeur est elle-même une *map* par breakpoint est déjà responsive : elle ne génère pas de variantes `{bp}-` (ce serait redondant). C'est le cas de `default` par défaut.

## Surcharge à la volée *(échappatoire)*

En dernier recours, les gouttières restent surchargeables par instance via leurs variables CSS d'axe :

```html
<div class="flex-x flex-gap-xy" style="--flex-gap-x: 8px; --flex-gap-y: 16px">…</div>
```

C'est pratique pour un cas isolé, mais **déconseillé** au quotidien : préférez une **taille nommée** (`flex-gap-sm-x`), qui reste cadrée, responsive et lisible dans le markup. Comme la largeur des cellules lit ces variables (`calc(% − part·--flex-gap-x)`), changer la gouttière suffit : aucune règle par cellule à régénérer.
