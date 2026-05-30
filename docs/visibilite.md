# Visibilité responsive

Basé sur le même moteur de breakpoints.

| Classe | Effet |
|---|---|
| `.show-for-[bp]` | visible à partir de ce breakpoint |
| `.hide-for-[bp]` | caché à partir de ce breakpoint |
| `.show-for-[bp]-only` / `.hide-for-[bp]-only` | sur la plage exacte |
| `.hide` · `.invisible` · `.visible` | basiques |
| `.show-for-landscape` · `.show-for-portrait` | orientation |

```html
<p class="show-for-desktop">Visible uniquement sur desktop et plus</p>
<p class="hide-for-phone-only">Masqué sur la plage phone uniquement</p>
```

## Équivalents Sass

```scss
@use 'gridaflex' as flex;

.sidebar { @include flex.hide-for(desktop); }          // masquée à partir de desktop
.badge   { @include flex.show-for-only(tablet-portrait); }
```

- `show-for($bp)` · `hide-for($bp)`
- `show-for-only($bp)` · `hide-for-only($bp)`
