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

``` db = db.getSiblingDB('algoquestdb'); ``` <br>
``` db.createUser({ ```
```    user: 'algoquest_user', ```
```   pwd: 'securepassword', ```
```   roles: [ ```
```       { ```
```           role: 'readWrite', ```
```           db: 'algoquestdb' ```
```        } ```
```   ] ```
``` }); ```

