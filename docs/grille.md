# La grille

La structure repose sur `.flex-x`, `.flex-y` et `.cell`. Sans classe de gouttière, les cellules se partagent l'espace sans espacement.

## Les bases <span class="gx-cfg" title="Nombre de colonnes : $flex-columns">gridaflex-settings.scss</span> {#les-bases}

<div class="gx-demo">
<div class="flex-x">
  <div class="cell">cellule pleine largeur</div>
</div>
<div class="flex-x">
  <div class="cell phone-6 alt">phone-6</div>
  <div class="cell phone-6 alt">phone-6</div>
</div>
<div class="flex-x">
  <div class="cell tablet-portrait-6 desktop-4">12 / 6 / 4</div>
  <div class="cell tablet-portrait-6 desktop-8 alt">12 / 6 / 8</div>
</div>
</div>

```html
<div class="flex-x">
  <div class="cell tablet-portrait-6 desktop-4">12 / 6 / 4</div>
  <div class="cell tablet-portrait-6 desktop-8">12 / 6 / 8</div>
</div>
```

## Conteneur <span class="gx-cfg" title="Largeur max : $flex-container">gridaflex-settings.scss</span> {#conteneur}

`.flex-container` centre le contenu et le limite à `$flex-container` (1200px par défaut). Variantes : `.fluid` (pleine largeur) et `.full` (pleine largeur sans padding).

```html
<div class="flex-container">
  <div class="flex-x">
    <div class="cell phone-4">cell</div>
    <div class="cell phone-4">cell</div>
    <div class="cell phone-4">cell</div>
  </div>
</div>
```

## Dimensionnement automatique

`.auto` occupe l'espace restant, `.shrink` se réduit au contenu.

<div class="gx-demo">
<div class="flex-x">
  <div class="cell phone-4">phone-4</div>
  <div class="cell auto alt">auto</div>
</div>
<div class="flex-x">
  <div class="cell shrink">shrink</div>
  <div class="cell auto alt">auto</div>
</div>
</div>

```html
<div class="flex-x">
  <div class="cell shrink">Shrink!</div>
  <div class="cell auto">Auto!</div>
</div>
```

## Ajustements responsive

Combinez les préfixes `phone-`, `tablet-portrait-`, `desktop-`… Ci-dessous : empilées en petit, équilibrées sur desktop.

<div class="gx-demo">
<div class="flex-x flex-gap-x">
  <div class="cell phone-12 desktop-auto alt">Un</div>
  <div class="cell phone-12 desktop-auto">Deux</div>
  <div class="cell phone-12 desktop-auto alt">Trois</div>
  <div class="cell phone-12 desktop-auto">Quatre</div>
</div>
</div>

```html
<div class="cell phone-12 desktop-auto">…</div>
```

## Offsets

Décalent une cellule vers la droite (axe X).

<div class="gx-demo">
<div class="flex-x flex-gap-x">
  <div class="cell phone-4 desktop-offset-2 alt">offset-2 sur desktop</div>
  <div class="cell phone-4">phone-4</div>
</div>
</div>

```html
<div class="cell phone-4 desktop-offset-2">…</div>
```

## Block grids <span class="gx-cfg" title="Maximum de cellules/ligne : $xy-block-flex-max">gridaflex-settings.scss</span> {#block-grids}

`.[bp]-up-[n]` définit le nombre de cellules par ligne au niveau de la grille.

<div class="gx-demo">
<div class="flex-x flex-gap-x phone-up-2 tablet-portrait-up-3 desktop-up-6">
  <div class="cell">cell</div><div class="cell alt">cell</div>
  <div class="cell">cell</div><div class="cell alt">cell</div>
  <div class="cell">cell</div><div class="cell alt">cell</div>
</div>
</div>

```html
<div class="flex-x flex-gap-x phone-up-2 tablet-portrait-up-3 desktop-up-6">
  …
</div>
```

## Grilles verticales

`.flex-y` répartit les cellules verticalement. La grille doit avoir une hauteur.

<div class="gx-demo">
<div class="flex-y flex-gap-y" style="height: 500px;">
  <div class="cell phone-6 desktop-2 alt">6 / 2</div>
  <div class="cell phone-6 desktop-10">6 / 10</div>
</div>
</div>

```html
<div class="flex-y flex-gap-y" style="height: 500px;">
  <div class="cell phone-6 desktop-2">…</div>
  <div class="cell phone-6 desktop-10">…</div>
</div>
```

## Grid frame

`.flex-frame` fixe la grille à 100 vh (ou 100 % si imbriquée), sans retour à la ligne ni débordement. `.cell-block` / `.cell-block-y` rendent une cellule scrollable.

```html
<div class="flex-y flex-frame">
  <div class="cell shrink">Header</div>
  <div class="cell auto cell-block-y">Contenu défilant</div>
  <div class="cell shrink">Footer</div>
</div>
```

!!! note
    Variantes responsive : `.tablet-portrait-flex-frame`, `.desktop-flex-frame`, …
