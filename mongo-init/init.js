db = db.getSiblingDB("algoquest");
db.users.insertOne({ username: "admin", password: "1234" });
