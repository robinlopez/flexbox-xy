# Releases

Historique des versions de Gridaflex. Chaque version est documentée avec ses nouveautés et, le cas échéant, ses corrections et changements cassants.

!!! tip "Versioning"
    Gridaflex suit le [Semantic Versioning](https://semver.org/lang/fr/) : `MAJEUR.MINEUR.PATCH`.

    - **MAJEUR** : changements cassants (breaking changes)
    - **MINEUR** : nouvelles fonctionnalités rétrocompatibles
    - **PATCH** : corrections de bugs rétrocompatibles

---

## v1.0.0 <small>: Première version stable</small> {#v1-0-0}

Première version stable de **Gridaflex** : un système de mise en page flexbox à axes X / Y, héritier de l'API de la grille XY de Foundation, mais entièrement modernisé autour d'un moteur `gap` (sans marges ni paddings négatifs).

### ✨ Nouveautés

- **Moteur `gap` par axe** : gouttières via `column-gap` / `row-gap`, pilotées par les variables CSS `--flex-gap-x` / `--flex-gap-y`, surchargeables par instance.
- **Largeur de cellule exacte et *gap-aware*** : `calc(f·100% − (1−f)·gap)`, sans override ni marge négative.
- **Classes utilitaires complètes** : groupes (`flex-x`, `flex-y`, `cell`), tailles responsive (`phone-12`, `desktop-6`…), offsets, block grid (`[bp]-up-[n]`), auto/shrink, alignement, ordre, collapse, frame.
- **Breakpoints sémantiques, renommables et extensibles** : aucun nom codé en dur ; les classes et le mixin `breakpoint()` se génèrent à partir de votre map.
- **Gouttières nommées** : `flex-gap-{size}-{axis}` (+ variantes responsive) via les maps `$gutters` / `$padding-gutters`.
- **API Sass sémantique** : mixins `xy-flex`, `xy-cell`, `xy-flex-layout`, `breakpoint()`, helpers de visibilité, pour bâtir une grille sans classes utilitaires.
- **Visibilité responsive** : `show-for-[bp]`, `hide-for-[bp]`, variantes `-only`, `landscape`/`portrait`.
- **Compatibilité Foundation XY** : noms de classes identiques et alias dépréciés (`$grid-*`, `flex-margin-*`, `xy-grid-*`) pour reprendre du code existant sans réécriture.
- **Distribution multiple** : CSS compilé (`dist/`), point d'entrée Sass (`@use 'gridaflex'`), et sous-modules (`gridaflex/src/settings`, `gridaflex/src/classes`).
- **Documentation** : site Zensical avec constructeur de grille interactif, et ressources prêtes à l'emploi pour les assistants IA.

<!-- ======================================================================= -->
<!-- TEMPLATE : Copiez ce bloc pour chaque nouvelle version.                 -->
<!-- ======================================================================= -->
<!--
---

## vX.Y.Z <small>: JJ mois AAAA</small> {#vX-Y-Z}

Brève description de la release.

### 💥 Changements cassants

- …

### ✨ Nouveautés

- …

### 🐛 Corrections

- …

### 🔧 Interne

- …
-->
