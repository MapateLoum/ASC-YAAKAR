# Site ASC Yaakar

Site officiel de l'ASC Yaakar (Mboro, Thiès) : calendrier & résultats des Navétanes, effectif, actu du quartier, et un espace admin pour tout gérer sans toucher au code.

**Stack :** Next.js (App Router) + MongoDB Atlas + Tailwind CSS, déployé sur Vercel.

## 1. Développement en local

```bash
npm install
cp .env.local.example .env.local
```

Remplis `.env.local` :
- `MONGODB_URI` : ta chaîne de connexion MongoDB Atlas (voir étape 2)
- `JWT_SECRET` : une chaîne aléatoire longue (sers-toi d'un générateur de mot de passe)
- `ADMIN_PASSWORD_HASH` : génère-le avec :
  ```bash
  node scripts/hash-password.js "TonMotDePasse"
  ```
  Copie le hash affiché dans `.env.local`.

Puis lance :
```bash
npm run dev
```
Le site tourne sur http://localhost:3000, l'admin sur http://localhost:3000/admin/login

## 2. Créer la base de données (MongoDB Atlas — gratuit)

1. Va sur https://www.mongodb.com/cloud/atlas/register et crée un compte.
2. Crée un cluster gratuit (M0).
3. Dans "Database Access", crée un utilisateur avec un mot de passe.
4. Dans "Network Access", autorise `0.0.0.0/0` (accès depuis partout — nécessaire pour Vercel).
5. Clique "Connect" > "Drivers", copie l'URL de connexion (elle ressemble à `mongodb+srv://user:password@cluster.mongodb.net/`).
6. Ajoute `/asc_yaakar` à la fin de l'URL avant les `?...` pour nommer la base : c'est ta valeur `MONGODB_URI`.

## 3. Déployer sur Vercel

1. Mets ce projet sur GitHub (crée un repo, `git push`).
2. Va sur https://vercel.com, connecte ton compte GitHub, importe le repo.
3. Dans les paramètres du projet Vercel > "Environment Variables", ajoute les 3 mêmes variables que dans `.env.local` (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_PASSWORD_HASH`).
4. Déploie. Ton site est en ligne.

## 4. Utiliser l'admin

Va sur `tonsite.vercel.app/admin/login`, connecte-toi avec ton mot de passe (celui utilisé à l'étape 1). Tu peux ajouter/modifier/supprimer les matchs, les joueurs et les articles d'actu — tout se reflète automatiquement sur le site public.

## Structure du projet

```
app/
  page.js                 → Accueil
  matchs/page.js           → Calendrier & résultats
  effectif/page.js         → Fiches joueurs
  actu/page.js              → Liste des articles
  actu/[slug]/page.js       → Article individuel
  admin/login/page.js       → Connexion admin
  admin/dashboard/page.js   → Gestion (matchs, joueurs, actus)
  admin/actions.js          → Server actions (CRUD + auth)
lib/
  db.js    → connexion MongoDB
  data.js  → fonctions de lecture/écriture des données
  auth.js  → session admin (cookie signé JWT)
components/
  Header.js, Footer.js, Scoreboard.js
```
