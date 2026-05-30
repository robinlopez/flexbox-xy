# Changelog

Toutes les évolutions notables de **Gridaflex** sont documentées dans ce fichier.

Le format s'appuie sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et le projet suit le [Semantic Versioning](https://semver.org/lang/fr/).

Catégories : `Ajouté`, `Modifié`, `Déprécié`, `Retiré`, `Corrigé`, `Sécurité`.

<!--
GUIDE DE TENUE (pour les humains et l'IA) :
- Notez les changements sous `## [Unreleased]` au fur et à mesure.
- À la publication : renommez `[Unreleased]` en `## [X.Y.Z] - AAAA-MM-JJ`,
  recréez une section `[Unreleased]` vide, mettez à jour les liens en bas.
- Une ligne = un changement, à l'impératif, orientée utilisateur.
- Référencez les PR/issues : `(#123)`.
-->

## [Unreleased]

### Ajouté

- …

---

## [1.0.0] - 2026-05-29

Première version stable. Voir les [notes de version](RELEASE-NOTES.md#100) pour le détail narratif.

### Ajouté

- Moteur de gouttières `gap` par axe (`column-gap` / `row-gap`) piloté par les variables CSS `--flex-gap-x` / `--flex-gap-y`, surchargeables par instance.
- Largeur de cellule exacte et *gap-aware* : `calc(f·100% − (1−f)·gap)`, sans marge négative ni override.
- Jeu complet de classes utilitaires : `flex-x` / `flex-y` / `cell`, tailles responsive (`phone-12`, `desktop-6`…), `offset`, block grid (`[bp]-up-[n]`), `auto` / `shrink`, alignement, `order`, `collapse`, `frame`.
- Gouttières en padding interne (`flex-padding-x/y/xy`) indépendantes du `gap`.
- Gouttières nommées via `$gutters` / `$padding-gutters` → `flex-gap-{size}-{axis}` + variantes responsive.
- Breakpoints sémantiques, renommables et extensibles ; mixin `breakpoint()` (named, px/rem/em, `only` / `down` / `up`, orientation, hidpi).
- API Sass sémantique : `xy-flex`, `xy-cell`, `xy-flex-layout`, `xy-flex-container`, `xy-flex-frame`, `flex-align`, etc.
- Visibilité responsive : `show-for-[bp]`, `hide-for-[bp]`, variantes `-only`, `landscape` / `portrait`, `.hide` / `.invisible` / `.visible`.
- Distribution multiple : CSS compilé (`dist/`), point d'entrée Sass (`@use 'gridaflex'`) et sous-modules (`gridaflex/src/settings`, `gridaflex/src/classes`) — `exports` NPM incluant `src/` pour la résolution Sass.
- Documentation Zensical avec constructeur de grille interactif, et ressources IA (`llms.txt`, skill markdown).

### Déprécié

- Noms historiques conservés en alias rétrocompatibles : variables `$grid-*`, classes `flex-margin-*`, mixins `xy-grid-*`. Préférer les noms `$flex-*` / `flex-gap-*` / `xy-flex-*`.

[Unreleased]: https://github.com/robinlopez/gridaflex/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/robinlopez/gridaflex/releases/tag/v1.0.0
