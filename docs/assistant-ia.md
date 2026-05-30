# Assistant IA

Gridaflex fournit des ressources prêtes à l'emploi pour qu'un **assistant de code**
(Claude Code, Copilot, Cursor…) maîtrise le système de grille et génère du markup
correct, sans confondre avec CSS Grid ni réintroduire de marges négatives.

## Les deux ressources

Elles sont **distribuées avec le package** (vous les retrouvez dans
`node_modules/gridaflex/` après `npm install`) :

| Fichier | Pour quoi |
|---|---|
| **`gridaflex.skill.md`** | Guide complet : modèle mental, cheatsheet des classes, config Sass, erreurs à éviter. À copier dans votre projet. |
| **`llms.txt`** | Résumé court au [format llms.txt](https://llmstxt.org/), lu automatiquement par certains outils. À placer à la racine de votre projet. |

## Mise en place

=== "Claude Code / agents à fichier d'instructions"

    Copiez le skill dans le dossier d'instructions de votre agent, ou importez-le
    depuis votre `CLAUDE.md` / `AGENTS.md` :

    ```bash
    cp node_modules/gridaflex/gridaflex.skill.md .claude/skills/gridaflex.md
    ```

    Ou référencez-le simplement dans votre `CLAUDE.md` :

    ```markdown
    @node_modules/gridaflex/gridaflex.skill.md
    ```

=== "llms.txt (racine du projet)"

    ```bash
    cp node_modules/gridaflex/llms.txt ./llms.txt
    ```

    Les outils qui supportent le standard `llms.txt` le découvriront
    automatiquement et y trouveront les liens vers la documentation détaillée.

=== "Copier-coller ponctuel"

    Pour une session unique, collez le contenu de `gridaflex.skill.md` dans le
    contexte de votre assistant avant de lui demander de produire une mise en page.

## Ce que l'assistant retient

Le skill encode notamment les **règles non négociables** du système :

- La **taille** (`desktop-4`) va sur la **cellule** ; la **gouttière** (`flex-gap-x`)
  va sur le **groupe**.
- Gouttières **par axe** : `flex-gap-x` (horizontal), `flex-gap-y` (vertical),
  `flex-gap-xy` (les deux).
- C'est du **flexbox**, pas CSS Grid, aucune marge négative, pas d'`overflow-x: hidden`.
- L'ordre des `@use` Sass : `settings with (…)` **puis** `classes`, dans le même fichier.
- Les noms `grid-*` / `flex-margin-*` / `xy-grid-*` sont des **alias dépréciés** de
  compatibilité Foundation, à éviter en code neuf.

!!! tip "Gardez les ressources à jour"
    Si vous personnalisez fortement la config (breakpoints renommés, nombre de
    colonnes différent), ajoutez ces spécificités au skill copié dans votre projet :
    l'assistant collera ainsi exactement à VOTRE grille.
