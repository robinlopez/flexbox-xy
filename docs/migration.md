# Migration depuis Foundation XY

Dans la quasi-totalité des cas : **on remplace la feuille de styles, rien d'autre**. Les classes sont identiques.

| Sujet | À savoir                                                                                                                                       |
|---|------------------------------------------------------------------------------------------------------------------------------------------------|
| `flex-gap-x` collé aux bords | Plus besoin de `body { overflow-x: hidden }` : `gap` ne crée pas de débordement.                                                               |
| Push / Pull | Non repris (déjà déprécié côté Foundation). Utilisez `.[bp]-order-[n]`.                                                                        |
| Gouttières dynamiques | Surcharge par instance : `style="--flex-gap-x: 8px"`.                                                                                          |
| Axes des gouttières | `flex-gap-x` = horizontal seul, `flex-gap-y` = vertical seul, `flex-gap-xy` = les deux (nouveau).                                              |
| Mélange avec `gap` maison | Désormais sans conflit, c'est tout l'intérêt.                                                                                                  |
| Noms de breakpoints | Sémantiques par défaut (`phone`, `desktop`…). Adaptez `$breakpoints` à vos conventions.                                                        |
| Mixins Sass `xy-grid-*` | Renommés `xy-flex-*` (système flexbox, pas CSS Grid). Les anciens noms restent en alias dépréciés, votre Sass Foundation continue de compiler. |
| Réglages `$grid-*` | Renommés `$flex-*` (`$grid-columns` → `$flex-columns`…). Vos `with ($grid-columns: …)` Foundation restent acceptés en alias dépréciés.         |

## Différences de comportement à connaître

- **Gouttières par axe.** Sous Foundation, `flex-gap-x` posait des marges gauche/droite. Ici c'est `column-gap` ; pour l'espacement vertical des lignes qui wrappent, ajoutez `flex-gap-y` (ou `flex-gap-xy`).
- **Largeur exacte.** Les cellules utilisent `calc(f·100% − (1−f)·gap)`, mathématiquement exact, fini les arrondis qui débordent.
- **Pas d'override par type de grille.** La taille d'une cellule lit `--flex-gap-x` ; elle s'adapte donc qu'on soit en grille simple, margin ou collapse.

## Checklist

- [ ] Remplacer l'import Foundation XY par `gridaflex`.
- [ ] Reporter vos `$breakpoints` / `$flex-columns` dans le fichier de config.
- [ ] Vérifier les écrans utilisant `flex-gap-x` qui attendaient aussi un espacement vertical → ajouter `flex-gap-y`.
- [ ] Retirer les anciens `body { overflow-x: hidden }` devenus inutiles.
- [ ] Remplacer d'éventuels push/pull par `order`.
