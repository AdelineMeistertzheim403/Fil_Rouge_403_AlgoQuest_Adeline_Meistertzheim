# Fil_Rouge_403_AlgoQuest_Adeline_Meistertzheim

## Projet AlgoQuest

Créer une application éducative permettant à des utilisateurs de s’exercer à l’alogrithmie en résolvant des énigmes. Chaque énigme propose un énoncé, des entrées, et attend une sortie. L’utilisateur doit écrire un alogrithme dans un éditeur intégré pour résoudre le défi.

## Utilisateurs et rôles

- **Utilisateur** : 
    - Résout les énignes proposées, voit sa progression et son score
- **Admin** : 
    - Crée, modifie et valide les énignes(proposée par les contributeurs si le rôle existe), gére les utilisateurs et suit la progression des utilisateurs
- **Contributeur(optionnel)** : 
    - Un utilisateur qui peut proposer de nouvelles énigmes à valider par l’admin

# Installation du projet

## Cloner le projet

``` git clone https://github.com/AdelineMeistertzheim403/Fil_Rouge_403_AlgoQuest_Adeline_Meistertzheim.git ```

## Configuration

- A la racine du projet créé un fichier .env
- Copier le contenu du fichier .env.exemple dans le .env
- Modifier les valeur des variables d'environnements selon vos besoin : 
    - API_PORT : Le port d'écoute de l'API
    - MONGO_INITDB_ROOT_USERNAME : le nom d'utilisateur admin de la bdd mongodb
    - MONGO_INITDB_ROOT_PASSWORD : le mot de passe admin de la bdd mongodb
    - MONGO_EXPRESS_USER : le nom d'utilisateur de mongo express
    - MONGO_EXPRESS_PASSWORD : le mot de passe de l'utilisateur de mongo express
    - SPRING_DATA_MONGODB_URI : L'URI utilisé par spring boot pour se connecter à mongodb, doit correspondre à l'utilisateur créé dans le fichier ./mongo-init/init-user.js

### Contenu du fichier ./mongo-init/init-user.js

``` db = db.getSiblingDB('algoquestdb'); \\ nom de la bdd ``` <br>
``` db.createUser({ ```<br>
```    user: 'algoquest_user', \\ identifiant de l'utilisateur de la bdd ```<br>
```   pwd: 'securepassword', \\ mot de passe de l'utilisateur de la bdd ```<br>
```   roles: [ ```<br>
```       { ```<br>
```           role: 'readWrite', \\ l'utilisateur à les droits en lecture et ecriture ```<br>
```           db: 'algoquestdb' ```<br>
```        } ```<br>
```   ] ```<br>
``` }); ```<br>

### Modification du port de l'api cotè client

- si un port différent de celui définie dans le .env.exemple est définie dans le fichier .env alors il faut modifier également le port cotè client dans le fichier ./algoquest-mobile/src/api/client.ts
- ligne 5 ``` baseURL: "http://10.0.2.2:8080/api/v1", ``` , remplacer 8080 par le port de la variable API_PORT

## Lancement du docker

- A l'aide d'un terminal et de la commande cd se positionner à la racine du projet
- Saisir la commande suivante : ``` docker compose up --build ```
- Pour stopper le docker : ``` docker compose down ``` (rajouter l'option -v pour supprimer le volume)

## Créer un utilisateur Admin

- Avec postman créer un admin en utilisant la route suivante ``` http://localhost:8080/api/v1/users/create-admin ```
- Choisir la methode POST
- Dans l'onglet Body , séléctionner JSON et saisir le JSON suivant : 
    - { 
        "pseudo" : "le pseudo admin" 
        "email" : "l'email de l'admin"
        "password" : "le mot de passe admin"
    }
- Cette route n'est accessible qu'une seule fois si aucun admin existe en bdd

## Lancement du front end

- Depuis la racine du projet ``` cd algoquest-mobile ```
- Saisir la commande ``` npx expo start ``` 
- A l'aide d'un smartphone flashé le QR-code pour accéder à l'application, ou utiliser l'extension AVD manager pour ouvrir l'application dans un emulateur Android
