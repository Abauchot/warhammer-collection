# Guide d'Installation - Warhammer Collection

Ce projet est composé de deux parties :
1. Un backend Strapi
2. Un frontend React

Il existe deux méthodes d'installation : manuelle ou via l'installateur Windows.

## Installation via l'Installateur Windows (Recommandé)

1. Téléchargez le fichier `Warhammer-Collection-Setup.exe` depuis la section releases
2. Exécutez le fichier d'installation
3. Suivez les instructions à l'écran
4. L'application se lancera automatiquement après l'installation

L'installateur Windows configure automatiquement tout ce dont vous avez besoin !

## Installation Manuelle (Pour les développeurs)

### Prérequis

- Node.js (version 18.x ou supérieure, mais inférieure à 23.x)
- npm (version 6.0.0 ou supérieure)
- Git

## Installation du Backend (Strapi)

1. Clonez le repository :
```bash
git clone <https://github.com/Abauchot/warhammer-collection>
cd warhammer-collection
```

2. Installez les dépendances du backend :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :
```
HOST=0.0.0.0
PORT=1337
APP_KEYS="votre-clé-secrète"
API_TOKEN_SALT="votre-salt"
ADMIN_JWT_SECRET="votre-jwt-secret"
JWT_SECRET="votre-jwt-secret"
```

4. Démarrez le serveur Strapi en mode développement :
```bash
npm run develop
```

Le backend sera accessible à l'adresse : http://localhost:1337
Le panel d'administration Strapi sera accessible à : http://localhost:1337/admin

Lors du premier démarrage, vous devrez créer un compte administrateur.

## Installation du Frontend (React)

1. Ouvrez un nouveau terminal et naviguez vers le dossier frontend :
```bash
cd warhammer-front
```

2. Installez les dépendances du frontend :
```bash
npm install
```

3. Créez un fichier `.env` dans le dossier `warhammer-front` avec :
```
VITE_API_URL=http://localhost:1337
```

4. Démarrez l'application React :
```bash
npm run dev
```

Le frontend sera accessible à l'adresse : http://localhost:5173

## Configuration de la Base de Données

Le projet utilise SQLite par défaut, qui ne nécessite pas de configuration supplémentaire.
Les données seront stockées dans le dossier `database` du projet.

## Problèmes Courants

1. Si vous rencontrez des erreurs de dépendances :
   - Supprimez les dossiers `node_modules`
   - Supprimez les fichiers `package-lock.json`
   - Réexécutez `npm install`

2. Si le backend ne démarre pas :
   - Vérifiez que le port 1337 n'est pas déjà utilisé
   - Vérifiez les variables d'environnement

3. Si le frontend ne se connecte pas au backend :
   - Vérifiez que le backend est bien démarré
   - Vérifiez l'URL dans le fichier `.env` du frontend

## Versions des Dépendances Principales

Backend (Strapi) :
- Strapi : 5.12.5
- Node.js : >=18.0.0 <=22.x.x
- SQLite : 11.3.0

Frontend :
- React : 19.0.0
- Vite : 6.3.1
- Material-UI : 7.1.0
- React Router : 7.6.0
- Tailwind CSS : 4.1.4

## Support

Pour toute question ou problème d'installation, veuillez contacter l'équipe de développement.

## Création de l'Application Desktop

Si vous souhaitez créer l'installateur Windows vous-même :

1. Assurez-vous d'avoir d'abord construit le frontend :
```bash
cd warhammer-front
npm run build
```

2. Construisez le backend Strapi en production :
```bash
cd ..
npm run build
```

3. Installez les dépendances Electron :
```bash
cd electron
npm install
```

4. Créez l'installateur Windows :
```bash
npm run dist
```

L'installateur sera généré dans le dossier `electron/dist`.
