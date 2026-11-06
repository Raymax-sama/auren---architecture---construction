# AUREN — Architecture, Construction & Rénovation

Projet web haut de gamme pour le studio d'architecture et de construction contemporaine **AUREN**.
Conçu avec React 19, TypeScript, Tailwind CSS, et animations fluides GSAP.

---

## 🚀 Démarrage Rapide en Local

### 1. Prérequis
- [Node.js](https://nodejs.org/) version 18 ou supérieure
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### 2. Installation des dépendances
Dans le dossier du projet, exécutez :
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000).

### 4. Compiler pour la production
```bash
npm run build
```
Le dossier optimisé `dist/` est généré, prêt à être hébergé.

---

## 🌐 Déploiement en 1 Clic (Vercel ou Netlify)

Le projet inclut déjà toutes les configurations clés en main :

### Sur Vercel :
1. Créez un compte ou connectez-vous sur [Vercel](https://vercel.com).
2. Cliquez sur **Add New > Project**, puis importez ce dossier (ou déposez-le via GitHub / CLI `vercel`).
3. Vercel détecte automatiquement le framework Vite. Le fichier `vercel.json` inclus gère les routes SPA et le cache des médias.
4. Cliquez sur **Deploy**.

### Sur Netlify :
1. Connectez-vous sur [Netlify](https://netlify.com).
2. Glissez-déposez le dossier `dist/` ou connectez le dépôt Git.
3. Les fichiers `netlify.toml` et `public/_redirects` inclus assurent la redirection de toutes les routes vers `index.html`.

---

## 📁 Structure du Projet

```
auren-architecture/
├── public/                 # Médias statiques (vidéos, séquences, images optimisées)
│   ├── frames/             # Séquence chronophotographique 60fps pour la vidéo Hero
│   ├── images/             # Visuels d'architecture & transformations avant/après
│   ├── videos/             # Vidéos sources MP4 fournies (villa-hero, interiors, engineering)
│   └── _redirects          # Configuration SPA Netlify
├── src/
│   ├── components/
│   │   ├── Header.tsx      # En-tête architectural fixe avec navigation scroll-spy
│   │   ├── Hero.tsx        # Séquence cinématique de transformation sur Canvas
│   │   ├── Expertise.tsx   # Monographie des 3 disciplines constructives
│   │   ├── ComparisonSlider.tsx # Comparateur Avant / Après interactif tactile
│   │   ├── Methodology.tsx # Jalons d'ingénierie & visualiseur CAO/BIM et clip
│   │   ├── Contact.tsx     # Formulaire d'échange & consultations d'atelier
│   │   └── Footer.tsx      # Mentions éditoriales et colophon
│   ├── utils/              # Fonctions pures & calculs de curseur
│   ├── App.tsx             # Composant racine & observateur de sections
│   ├── main.tsx            # Point d'entrée React
│   └── index.css           # Thème global Tailwind CSS
├── netlify.toml            # Configuration de build et cache Netlify
├── vercel.json             # Configuration de build et cache Vercel
├── package.json            # Scripts et dépendances
└── vite.config.ts          # Configuration Vite
```

---

## 🎨 Direction Artistique & Typographie

- **Palette** :
  - Ivoire chaleureux : `#EAE6DD`
  - Anthracite architectural : `#151615`
  - Bronze sourd : `#92795E`
  - Beige secondaire : `#BDB3A3`
- **Typographie** :
  - *Cormorant Garamond* (titres éditoriaux)
  - *Manrope* (interface, corps de texte, étiquettes)
