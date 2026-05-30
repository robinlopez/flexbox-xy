# Démarrage

## Installation

### Via NPM

Le package est disponible sur NPM (ou directement depuis GitHub). Installez-le dans votre projet avec :

```bash
npm install gridaflex
```

### Modes d'utilisation

Une fois installé, vous avez trois façons d'utiliser Gridaflex :

=== "CSS compilé"

    ```html
    <link rel="stylesheet" href="node_modules/gridaflex/dist/gridaflex.min.css">
    ```

=== "Sass (recommandé)"

    ```scss
    // Surcharger les réglages avant d'émettre les classes
    @use 'gridaflex/src/settings' with (
      $flex-columns: 12
    );
    @use 'gridaflex/src/classes';
    ```

=== "API Sass sémantique"

    ```scss
    @use 'gridaflex' as flex;

    .galerie {
      @include flex.xy-flex;
      @include flex.xy-flex-margin(xy);
      @include flex.xy-flex-layout(3, '.item');
    }
    ```

## Breakpoints par défaut

Gridaflex part de breakpoints **sémantiques et orientés appareil** (le premier vaut `0`) :

| Nom | Valeur |
|---|---|
| `phone` | `0` |
| `tablet-portrait` | `600px` |
| `tablet-landscape` | `900px` |
| `desktop` | `1200px` |
| `medium-desktop` | `1440px` |
| `big-desktop` | `1800px` |

Les classes de grille sont générées à partir de ces noms : `phone-12`, `desktop-6`, `tablet-portrait-up-3`, `desktop-offset-2`…

!!! tip "Tout est renommable"
    Ce sont de simples valeurs par défaut. Renommez-les ou ajoutez-en (voir ci-dessous) : le moteur n'a aucun nom codé en dur.

## Fichier de configuration

Un fichier unique qui configure puis émet les classes. Un template est fourni : `gridaflex-settings.scss`.

```scss
// _gridaflex-settings.scss (votre projet)
@use 'gridaflex/src/settings' with (
  $breakpoints: (
    'phone': 0,
    'tablet-portrait': 600px,
    'tablet-landscape': 900px,
    'desktop': 1200px,
    'medium-desktop': 1440px,
    'big-desktop': 1800px,
  ),
  $breakpoint-classes: (phone tablet-portrait tablet-landscape desktop medium-desktop big-desktop),
  $flex-columns: 24,
  $flex-margin-gutters: ('phone': 16px, 'tablet-portrait': 24px),

  // Tailles de gouttières nommées pour flex-gap-{size}-{axis}
  $gutters: (
    'default': 16px,  // → flex-gap-x / -y / -xy
    // 'sm': 8px,     // → flex-gap-sm-x / -sm-y / -sm-xy
    // 'lg': 32px,    // → flex-gap-lg-x / -lg-y / -lg-xy
  ),

  // Tailles de padding nommées pour flex-padding-{size}-{axis}
  $padding-gutters: (
    'default': 16px,
    // 'sm': 8px,
    // 'lg': 32px,
  ),
);
@use 'gridaflex/src/classes';   // émet toutes les classes avec VOS réglages
```

!!! warning "Important, ordre des `@use`"
    Avec les modules Sass, `@use … with (…)` doit se faire dans le **premier** fichier qui charge `settings`. Placez donc votre configuration et l'`@use 'src/classes'` dans le même fichier d'entrée.

## Réglages disponibles

| Variable | Défaut |
|---|---|
| `$flex-container` | `1200px` |
| `$flex-columns` | `12` |
| `$breakpoints` | `phone 0 … big-desktop 1800px` |
| `$breakpoints-hidpi` | `hidpi-1 1 … hidpi-3 3` |
| `$breakpoint-classes` | `phone tablet-portrait tablet-landscape desktop medium-desktop big-desktop` |
| `$print-breakpoint` | `null` (désactivé) |
| `$flex-margin-gutters` | `phone 16px, tablet-portrait 24px` |
| `$flex-padding-gutters` | `$flex-margin-gutters` |
| `$gutters` | `default → $flex-margin-gutters` *(tailles de gap nommées)* |
| `$padding-gutters` | `default → $flex-padding-gutters` *(tailles de padding nommées)* |
| `$xy-block-flex-max` | `8` |

Les maps `$gutters` / `$padding-gutters` permettent des **tailles de gouttières nommées** (`flex-gap-sm-x`, `desktop-flex-gap-lg-xy`…) : voir [Gouttières & axes](gouttieres.md#tailles-de-gouttieres).

!!! note "Compatibilité : `$grid-*`"
    Les anciens noms `$grid-container`, `$grid-columns`, `$grid-margin-gutters`, `$grid-padding-gutters`, `$grid-container-padding` et `$xy-block-grid-max` restent acceptés en **alias dépréciés** : un `@use … with ($grid-columns: 24)` existant continue de compiler. Le préfixe `$flex-` est à privilégier (système flexbox, pas CSS Grid).

---

## Déploiement de la documentation

!!! warning "Réservé aux mainteneurs"
    Cette section est un *runbook* pour les mainteneurs du dépôt. Publier le package
    (`npm publish`) ou déployer la doc (`mike deploy` sur `gh-pages`) requiert des
    droits d'écriture et des identifiants que les contributeurs n'ont pas : une
    contribution se fait via une **pull request**, fusionnée après revue.

Ce projet utilise [Zensical](https://zensical.org/) et `mike` pour générer une documentation versionnée sur GitHub Pages.

### Pré-requis
Pour pouvoir déployer plusieurs versions (v1.0.0, v1.1.0, etc.), le fork Zensical de `mike` doit être installé :
```bash
pip install git+https://github.com/squidfunk/mike.git
```

### Publier une nouvelle version

1. **Compilez les styles de la documentation** :
   ```bash
   npm run docs:css
   ```
2. **Déployez la version** (exemple pour la `1.0.0` marquée comme `stable`) :
   ```bash
   # Remplacez "main" par "origin" selon le nom de votre remote GitHub
   mike deploy --push --remote main --update-aliases 1.0.0 stable
   ```
3. Si c'est votre tout premier déploiement, **définissez la version par défaut** :
   ```bash
   mike set-default --push --remote main stable
   ```

*(Pensez à configurer votre dépôt GitHub pour qu'il déploie les Pages depuis la branche `gh-pages` !)*
