# Versioning & process de release

Ce document décrit comment Gridaflex est versionné et comment publier une nouvelle
version — package NPM **et** documentation. Il sert de référence pour cadrer le
travail, y compris avec un assistant IA.

## Schéma de version

Gridaflex suit le [Semantic Versioning](https://semver.org/lang/fr/) : `MAJEUR.MINEUR.PATCH`.

| Incrément | Quand | Exemple de commit |
|---|---|---|
| **MAJEUR** | Changement cassant (suppression d'alias, renommage public, comportement modifié) | `feat!:` ou `BREAKING CHANGE:` |
| **MINEUR** | Nouvelle fonctionnalité rétrocompatible | `feat:` |
| **PATCH** | Correction rétrocompatible | `fix:` |

> La rétrocompatibilité avec Foundation XY est un engagement fort : retirer un alias
> déprécié (`$grid-*`, `flex-margin-*`, `xy-grid-*`) est **toujours** un changement majeur.

## Fichiers de suivi

| Fichier | Rôle | Quand l'éditer |
|---|---|---|
| [`CHANGELOG.md`](CHANGELOG.md) | Historique technique exhaustif (Keep a Changelog) | Au fil de l'eau, sous `[Unreleased]` |
| [`RELEASE-NOTES.md`](RELEASE-NOTES.md) | Notes narratives orientées utilisateur | À la publication d'une version |
| [`docs/releases.md`](docs/releases.md) | Page « Releases » du site de doc | À la publication d'une version |

## Procédure de release

1. **Geler le périmètre** — vérifier que `## [Unreleased]` du `CHANGELOG.md` est complet.

2. **Construire et vérifier le CSS** :
   ```bash
   npm run build        # régénère dist/
   ```
   Committer le `dist/` régénéré (il est versionné).

3. **Mettre à jour la documentation de version** :
   - `CHANGELOG.md` : renommer `[Unreleased]` → `## [X.Y.Z] - AAAA-MM-JJ`, recréer une
     section `[Unreleased]` vide, mettre à jour les liens de comparaison en bas.
   - `RELEASE-NOTES.md` : ajouter une section narrative pour la version.
   - `docs/releases.md` : ajouter l'entrée correspondante (template fourni en bas du fichier).
   - Si l'API publique a changé : mettre à jour `llms.txt` et `gridaflex.skill.md`.

4. **Bumper la version** :
   ```bash
   npm version <patch|minor|major>   # met à jour package.json + crée le tag git vX.Y.Z
   ```

5. **Publier sur NPM** :
   ```bash
   npm publish
   ```
   Le champ `files` du `package.json` contrôle le contenu du tarball — vérifier avec
   `npm pack --dry-run` qu'aucun fichier local (`.idea/`, `.claude/`…) n'y figure.

6. **Pousser le code et le tag** :
   ```bash
   git push && git push --tags
   ```

7. **Déployer la documentation versionnée** (Zensical + [`mike`](https://github.com/jimporter/mike)) :
   ```bash
   npm run docs:css
   mike deploy --push --update-aliases X.Y.Z stable
   # premier déploiement uniquement :
   mike set-default --push stable
   ```
   GitHub Pages doit servir depuis la branche `gh-pages`.

## Checklist rapide

- [ ] `dist/` régénéré et committé
- [ ] `CHANGELOG.md` à jour + liens de comparaison
- [ ] `RELEASE-NOTES.md` + `docs/releases.md` à jour
- [ ] `llms.txt` / `gridaflex.skill.md` à jour si l'API a changé
- [ ] `npm pack --dry-run` propre
- [ ] tag `vX.Y.Z` poussé
- [ ] doc déployée
