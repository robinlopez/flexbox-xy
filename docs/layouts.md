# Modèles de layout

Une galerie de mises en page courantes construites avec Gridaflex : **aperçu en
direct** + **code HTML** prêt à copier. Tous les exemples utilisent les classes par
défaut (12 colonnes, breakpoints `phone` → `big-desktop`).

!!! tip "Responsive"
    Les aperçus réagissent à la largeur de **votre navigateur** (pas à celle de la
    colonne) : redimensionnez la fenêtre pour voir les paliers s'activer. Pour tester
    une largeur précise, utilisez le [Constructeur de grille](builder.md).

---

## Page applicative (Header / Menu / Contenu / Footer)

Coquille verticale plein écran : un `flex-y` à hauteur fixe, en-tête et pied en
`shrink`, zone centrale en `auto` qui devient elle-même un groupe horizontal
`flex-x` (menu + contenu).

<div class="gx-demo gx-ex">
<div class="flex-y flex-gap-y" style="height: 300px">
  <div class="cell shrink is-bar">Header</div>
  <div class="cell auto flex-x flex-gap-xy">
    <div class="cell desktop-3 show-for-desktop is-muted">Side Menu</div>
    <div class="cell auto">Content View</div>
  </div>
  <div class="cell shrink is-bar">Footer</div>
</div>
</div>

```html
<div class="flex-y flex-gap-y" style="height: 100vh">
  <div class="cell shrink">Header</div>

  <!-- la zone centrale grandit (auto) et devient un groupe horizontal -->
  <div class="cell auto flex-x flex-gap-xy">
    <div class="cell desktop-3 show-for-desktop">Side Menu</div>
    <div class="cell auto">Content View</div>
  </div>

  <div class="cell shrink">Footer</div>
</div>
```

---

## Dashboard : cartes de tailles variées

Un groupe horizontal avec gouttières sur les deux axes (`flex-gap-xy`). Chaque carte
choisit sa largeur ; le `wrap` répartit sur plusieurs lignes. En dessous de `desktop`,
tout passe en pleine largeur (`phone-12`).

<div class="gx-demo gx-ex">
<div class="flex-x flex-gap-xy">
  <div class="cell phone-12 desktop-8">Graphique principal</div>
  <div class="cell phone-12 desktop-4">KPIs</div>
  <div class="cell phone-6 desktop-4">Carte A</div>
  <div class="cell phone-6 desktop-4">Carte B</div>
  <div class="cell phone-12 desktop-4">Carte C</div>
  <div class="cell phone-12 desktop-6">Tableau</div>
  <div class="cell phone-12 desktop-6">Activité</div>
</div>
</div>

```html
<div class="flex-x flex-gap-xy">
  <div class="cell phone-12 desktop-8">Graphique principal</div>
  <div class="cell phone-12 desktop-4">KPIs</div>
  <div class="cell phone-6 desktop-4">Carte A</div>
  <div class="cell phone-6 desktop-4">Carte B</div>
  <div class="cell phone-12 desktop-4">Carte C</div>
  <div class="cell phone-12 desktop-6">Tableau</div>
  <div class="cell phone-12 desktop-6">Activité</div>
</div>
```

---

## Galerie : block grid responsive

Quand toutes les cellules ont la **même** largeur, le block grid `[bp]-up-[n]` évite
de répéter une classe par cellule : 2 par ligne sur mobile, 3 sur tablette, 4 sur
desktop.

<div class="gx-demo gx-ex">
<div class="flex-x flex-gap-xy phone-up-2 tablet-portrait-up-3 desktop-up-4">
  <div class="cell">1</div>
  <div class="cell">2</div>
  <div class="cell">3</div>
  <div class="cell">4</div>
  <div class="cell">5</div>
  <div class="cell">6</div>
  <div class="cell">7</div>
  <div class="cell">8</div>
</div>
</div>

```html
<div class="flex-x flex-gap-xy phone-up-2 tablet-portrait-up-3 desktop-up-4">
  <div class="cell">1</div>
  <div class="cell">2</div>
  <!-- … autant de cellules que voulu -->
</div>
```

---

## Landing : hero + fonctionnalités + CTA

Empilement de groupes : un héro pleine largeur, trois colonnes de fonctionnalités
(`desktop-4`), puis une bande d'appel à l'action.

<div class="gx-demo gx-ex">
<div class="flex-y flex-gap-y">
  <div class="flex-x">
    <div class="cell is-bar" style="min-height: 4rem">Hero : titre + accroche</div>
  </div>
  <div class="flex-x flex-gap-x">
    <div class="cell phone-12 desktop-4">Fonctionnalité 1</div>
    <div class="cell phone-12 desktop-4">Fonctionnalité 2</div>
    <div class="cell phone-12 desktop-4">Fonctionnalité 3</div>
  </div>
  <div class="flex-x">
    <div class="cell is-muted">Bandeau CTA</div>
  </div>
</div>
</div>

```html
<div class="flex-y flex-gap-y">
  <div class="flex-x">
    <div class="cell">Hero : titre + accroche</div>
  </div>

  <div class="flex-x flex-gap-x">
    <div class="cell phone-12 desktop-4">Fonctionnalité 1</div>
    <div class="cell phone-12 desktop-4">Fonctionnalité 2</div>
    <div class="cell phone-12 desktop-4">Fonctionnalité 3</div>
  </div>

  <div class="flex-x">
    <div class="cell">Bandeau CTA</div>
  </div>
</div>
```

---

## Vue liste / détail (split view)

Deux colonnes : une liste à largeur fixe (`desktop-4`) et un détail qui occupe le
reste (`auto`). En dessous de `desktop`, elles s'empilent.

<div class="gx-demo gx-ex">
<div class="flex-x flex-gap-x">
  <div class="cell phone-12 desktop-4 is-muted">Liste</div>
  <div class="cell phone-12 auto" style="min-height: 7rem">Détail</div>
</div>
</div>

```html
<div class="flex-x flex-gap-x">
  <div class="cell phone-12 desktop-4">Liste</div>
  <div class="cell phone-12 auto">Détail</div>
</div>
```

---

## Formulaire deux colonnes

Champs sur deux colonnes en desktop (`desktop-6`), empilés en mobile (`phone-12`), et
un champ ou un bouton pleine largeur (`phone-12`).

<div class="gx-demo gx-ex">
<div class="flex-x flex-gap-xy">
  <div class="cell phone-12 desktop-6">Prénom</div>
  <div class="cell phone-12 desktop-6">Nom</div>
  <div class="cell phone-12 desktop-6">Email</div>
  <div class="cell phone-12 desktop-6">Téléphone</div>
  <div class="cell phone-12">Message</div>
  <div class="cell phone-12 desktop-3 is-bar">Envoyer</div>
</div>
</div>

```html
<div class="flex-x flex-gap-xy">
  <div class="cell phone-12 desktop-6"><input ... /></div>
  <div class="cell phone-12 desktop-6"><input ... /></div>
  <div class="cell phone-12 desktop-6"><input ... /></div>
  <div class="cell phone-12 desktop-6"><input ... /></div>
  <div class="cell phone-12"><textarea ...></textarea></div>
  <div class="cell phone-12 desktop-3"><button>Envoyer</button></div>
</div>
```

---

## Centrage parfait

Carte centrée sur les deux axes via `align-center-middle`, dans un groupe qui occupe
la hauteur souhaitée.

<div class="gx-demo gx-ex">
<div class="flex-x align-center-middle" style="min-height: 200px">
  <div class="cell phone-10 desktop-4 is-bar" style="min-height: 5rem">Carte centrée</div>
</div>
</div>

```html
<div class="flex-x align-center-middle" style="min-height: 100vh">
  <div class="cell phone-10 desktop-4">Carte centrée</div>
</div>
```

---

Besoin d'un cas particulier ? Composez-le dans le [Constructeur de grille](builder.md),
ou consultez le [référentiel des classes](api-sass.md).
