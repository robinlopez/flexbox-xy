# Constructeur de grille <span class="gx-badge">Beta</span>

Réglez votre grille dans le panneau, visualisez-la en direct, puis récupérez **deux
choses** prêtes à l'emploi : le **markup HTML** et votre **fichier de configuration
`_gridaflex-settings.scss`**.

<div class="gx-builder" id="gx-builder"
     data-breakpoints="phone,tablet-portrait,tablet-landscape,desktop,medium-desktop,big-desktop"
     data-columns="12"
     data-gutters="default,sm,lg"></div>

!!! tip "Comment l'utiliser"
    - **La section _Configuration_ pilote tout** : colonnes, breakpoints (nom + seuil)
      et tailles de gouttières alimentent à la fois les options, l'aperçu en direct
      **et** le fichier `_gridaflex-settings.scss` généré (copiable / téléchargeable).
    - **Deux modes exclusifs** : *Grille classique* (cellules dimensionnées une à une)
      ou *Block grid* (N cellules par ligne).
    - **Multi-breakpoints** : empilez plusieurs paliers sur une cellule
      (`phone-12 desktop-6 big-desktop-4`) ou sur le block grid (`phone-up-2 desktop-up-4`).
    - **Gap** et **Padding** sont indépendants : combinez `flex-gap-xy` *et* `flex-padding-y`.
    - Une cellule en `auto` absorbe l'espace restant ; en `shrink` elle se réduit à son contenu.

!!! note "Aperçu fidèle à votre config"
    L'aperçu est généré à partir de votre configuration (colonnes, seuils de
    breakpoints, valeurs de gouttières) : il reflète donc exactement ce que produira
    le fichier `_gridaflex-settings.scss` une fois compilé dans votre projet.
