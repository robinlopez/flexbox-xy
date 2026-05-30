# Breakpoints & responsive

Les breakpoints sont entièrement **renommables** et **extensibles**. Les classes de grille et le mixin `breakpoint()` sont générés à partir de vos noms.

## Sémantique personnalisée <span class="gx-cfg" title="Noms & seuils : $breakpoints / $breakpoint-classes">gridaflex-settings.scss</span> {#semantique-personnalisee}

Le premier breakpoint doit valoir `0`. Ajouter un breakpoint = ajouter une clé → vous obtenez automatiquement `big-desktop-auto`, `big-desktop-1`, `big-desktop-up-4`, etc.

```scss
@use 'gridaflex/src/settings' with (
  $breakpoints: (
    'phone': 0,
    'tablet-portrait': 600px,
    'tablet-landscape': 900px,
    'desktop': 1200px,
  ),
  $breakpoint-classes: (phone tablet-portrait tablet-landscape desktop)
);
@use 'gridaflex/src/classes';
```

## Le mixin `breakpoint()`

Reprend la logique d'un mixin de media-queries nommées. Les limites sont émises en `em` (compatibles avec le zoom navigateur).

```scss
@use 'gridaflex' as flex;

.menu {
  @include flex.breakpoint(tablet-portrait only) { flex-direction: column; }
  @include flex.breakpoint(desktop)              { gap: 24px; }        // et au-dessus
  @include flex.breakpoint(desktop down)         { padding: 8px; }
  @include flex.breakpoint(768px)                { font-size: 14px; }  // valeur brute → em
  @include flex.breakpoint(landscape)            { height: 100vh; }
  @include flex.breakpoint(retina)               { /* image @2x */ }
}
```

| Forme | Génère |
|---|---|
| `breakpoint(X)` | X *et au-dessus* (`min-width`) |
| `breakpoint(X down)` | X *et en-dessous* (`max-width`) |
| `breakpoint(X only)` | la plage exacte (`min` + `max`) |
| `breakpoint(768px)` | valeur px/rem/em convertie en em |
| `breakpoint(landscape)` / `portrait` | orientation |
| `breakpoint(retina)` | résolution (HiDPI) |

!!! example "Sortie réelle"
    `breakpoint(tablet-portrait only)` → `@media screen and (min-width: 37.5em) and (max-width: 56.24875em)`
    (600px = 37.5em ; borne haute = 900px − 0.02px).
