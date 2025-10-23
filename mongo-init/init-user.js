// mongo-init/init-user.js
// Crée l'utilisateur applicatif à partir de secrets Docker

(function() {
  const fs = require('fs');

  function readSecret(path) {
    try {
      return fs.readFileSync(path, 'utf8').trim();
    } catch (e) {
      print(`Could not read secret ${path}: ${e}`);
      quit(1);
    }
  }

  const appUser = readSecret('/run/secrets/mongo_app_user');
  const appPassword = readSecret('/run/secrets/mongo_app_password');

  // La DB applicative (passée en env dans docker-compose)
  const appDbName = (process.env.MONGO_APP_DB || 'algoquestdb').trim();

  // On crée l'utilisateur applicatif avec rôle readWrite sur la DB applicative
  const appDb = db.getSiblingDB(appDbName);


  print(`Creating app user '${appUser}' with readWrite on '${appDbName}'...`);

  try {
    appDb.createUser({
      user: appUser,
      pwd: appPassword,
      roles: [
        { role: 'readWrite', db: appDbName }
      ]
    });
    print('App user created.');
  } catch (e) {
    if (e.codeName === 'DuplicateKey') {
      print('App user already exists, skipping.');
    } else {
      throw e;
    }
  }
})();
