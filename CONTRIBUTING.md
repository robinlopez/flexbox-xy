# Contribuer à Gridaflex

Merci de votre intérêt ! Ce guide décrit comment contribuer proprement — que vous
soyez un humain ou un agent IA travaillant sur le dépôt.

## Prérequis

- **Node.js** ≥ 18 et **npm**
- **Dart Sass** (installé via `npm install`)
- **Python 3** + **Zensical** pour la documentation (optionnel) :
  ```bash
  python3 -m venv .venv && .venv/bin/pip install zensical
  ```

## Installation

```bash
git clone https://github.com/robinlopez/gridaflex.git
cd gridaflex
npm install
```

## Structure du projet

| Chemin | Rôle |
|---|---|
| `src/_settings.scss` | Variables configurables (`!default`) |
| `src/_breakpoints.scss` | Map des breakpoints + mixin `breakpoint()` |
| `src/_functions.scss` | Fonctions (`gx-fraction`, `xy-cell-size`…) |
| `src/_mixins.scss` | Mixins de l'API sémantique (`xy-flex`, `xy-cell`…) |
| `src/_classes.scss` | Émission des classes utilitaires |
| `src/_visibility.scss` | Classes/mixins de visibilité responsive |
| `index.scss` | Point d'entrée API Sass (`@use 'gridaflex'`) |
| `gridaflex.scss` | Point d'entrée CSS (émet toutes les classes) |
| `dist/` | CSS compilé (versionné, régénéré au build) |
| `docs/` | Sources Markdown de la documentation |

## Boucle de développement

```bash
npm run build      # dist/gridaflex.css + dist/gridaflex.min.css
npm run watch      # recompilation à la volée
npm run docs:serve # aperçu de la doc avec live-reload
```

> ⚠️ **`dist/` est versionné.** Régénérez-le (`npm run build`) et committez-le dès
> que vous modifiez le Sass de `src/`, sinon le CSS publié sera désynchronisé.

## Conventions de commit

Les messages suivent [Conventional Commits](https://www.conventionalcommits.org/fr/) :

```
<type>(<portée optionnelle>): <description à l'impératif>
```

Types courants : `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `build`.

Exemples :

```
feat(gutters): ajoute les gouttières nommées flex-gap-{size}-{axis}
fix(exports): inclut src/ dans les exports NPM pour Sass
docs(demarrage): clarifie l'ordre des @use
```

Le **type** détermine l'incrément de version (voir [VERSIONING.md](VERSIONING.md)) :
`feat` → mineure, `fix` → patch, un `!` ou `BREAKING CHANGE:` → majeure.

## Avant d'ouvrir une PR

1. `npm run build` — le CSS compile sans erreur et `dist/` est à jour.
2. La documentation reflète le changement (`docs/`, `README.md`).
3. Le `CHANGELOG.md` est mis à jour sous `## [Unreleased]`.
4. Les nouveaux noms publics respectent le préfixe `$flex-*` / `flex-*` / `xy-flex-*`
   (les noms `grid` sont réservés à la compatibilité Foundation, ne pas en créer de nouveaux).

## Rétrocompatibilité

Gridaflex garantit la compatibilité d'API avec Foundation XY. Tout nouvel alias
déprécié doit être documenté et ne jamais casser une config `@use … with (…)`
existante. Une suppression d'alias = changement **majeur**.

## Travailler avec un agent IA

Le dépôt fournit des ressources pour faire maîtriser le système à un assistant :
`llms.txt` et le skill `gridaflex.skill.md`. Si vous modifiez l'API publique
(classes, mixins, variables), **mettez aussi à jour ces deux fichiers** pour qu'ils
restent une source de vérité fiable.
