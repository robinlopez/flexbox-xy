# Alignement & ordre

## Horizontal (sur la grille)

`.align-left` / `.align-right` / `.align-center` / `.align-justify` / `.align-spaced`

<div class="gx-demo">
<div class="flex-x flex-gap-x align-spaced">
  <div class="cell phone-3 alt">A</div>
  <div class="cell phone-3 alt">B</div>
</div>
<div class="flex-x flex-gap-x align-center">
  <div class="cell phone-3 alt">A</div>
  <div class="cell phone-3 alt">B</div>
</div>
</div>

## Vertical (sur la grille ou la cellule)

`.align-top` / `.align-middle` / `.align-bottom` / `.align-stretch`, et au niveau cellule : `.align-self-top`, `.align-self-middle`…

<div class="gx-demo">
<div class="flex-x flex-gap-x align-middle gx-frame" style="min-height:120px;">
  <div class="cell phone-4 alt">align-middle</div>
  <div class="cell phone-8">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</div>
</div>
</div>

## Centrage total

`.align-center-middle` centre horizontalement **et** verticalement.

```html
<div class="flex-x align-center-middle" style="height: 200px;">
  <div class="cell phone-4">Au centre</div>
</div>
```

## Ordre des sources

Réorganisez sans hack de positionnement avec `.[bp]-order-[n]`.

<div class="gx-demo">
<div class="flex-x flex-gap-x">
  <div class="cell phone-6 phone-order-2 tablet-portrait-order-1 alt">DOM 1 → 2ᵉ en phone, 1ᵉʳ en tablette+</div>
  <div class="cell phone-6 phone-order-1 tablet-portrait-order-2">DOM 2 → 1ᵉʳ en phone, 2ᵉ en tablette+</div>
</div>
</div>

## Helpers flex

`.flex-container`, `.flex-dir-row|column[-reverse]`, `.flex-child-auto|grow|shrink`, tous déclinés en responsive (`.desktop-flex-dir-row`…).
