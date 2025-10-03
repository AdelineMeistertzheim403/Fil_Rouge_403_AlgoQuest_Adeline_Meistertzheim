import * as SQLite from "expo-sqlite"

let db: SQLite.SQLiteDatabase | null = null

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    // ouverture synchrone de la DB (SDK 49+)
    db = SQLite.openDatabaseSync("algoquest.db")
  }
  return db
}

export const initDB = async () => {
  const db = getDatabase()

  const initSQL = `
    CREATE TABLE IF NOT EXISTS enigmes (
      id TEXT PRIMARY KEY NOT NULL,
      titre TEXT,
      enonce TEXT,
      entree TEXT,
      sortieAttendue TEXT,
      lastSync TEXT
    );

    CREATE TABLE IF NOT EXISTS resolutions (
      id TEXT PRIMARY KEY NOT NULL,
      enigmeId TEXT,
      codeSoumis TEXT,
      status TEXT,
      dateSoumission TEXT,
      synced INTEGER DEFAULT 0
    );
  `

  try {
    await db.execAsync(initSQL)
    console.log("✅ SQLite initialisé")
  } catch (err) {
    console.error("❌ Erreur init SQLite:", err)
  }
}
