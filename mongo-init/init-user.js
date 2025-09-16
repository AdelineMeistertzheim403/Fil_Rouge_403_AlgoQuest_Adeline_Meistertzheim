db = db.getSiblingDB('algoquestdb');
db.createUser({
    user: 'algoquest_user',
    pwd: 'securepassword',
    roles: [
        {
            role: 'readWrite',
            db: 'algoquest'
        }
    ]
});
