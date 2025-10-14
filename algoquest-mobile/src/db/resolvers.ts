import { getDatabase } from "./database"

// ✅ ENIGMES
export const insertEnigme = async (enigme: {
  id: string
  titre: string
  enonce: string
  entree: string
  sortieAttendue: string
}) => {
  const db = getDatabase()
  await db.runAsync(
    `INSERT OR REPLACE INTO enigmes
      (id, titre, enonce, entree, sortieAttendue, lastSync)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [enigme.id, enigme.titre, enigme.enonce, enigme.entree, enigme.sortieAttendue]
  )
}

export const getEnigmes = async () => {
  const db = getDatabase()
  return await db.getAllAsync("SELECT * FROM enigmes ORDER BY titre ASC")
}

export const getEnigmeById = async (id: string) => {
  const db = getDatabase()
  return await db.getFirstAsync("SELECT * FROM enigmes WHERE id = ?", [id])
}

export const deleteEnigmes = async () => {
  const db = getDatabase()
  await db.runAsync("DELETE FROM enigmes")
}

// ✅ RESOLUTIONS
export const insertResolution = async (res: {
  id: string
  enigmeId: string
  codeSoumis: string
  status: string
  dateSoumission: string
  synced?: number
}) => {
  const db = getDatabase()
  await db.runAsync(
    `INSERT OR REPLACE INTO resolutions
      (id, enigmeId, codeSoumis, status, dateSoumission, synced)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      res.id,
      res.enigmeId,
      res.codeSoumis,
      res.status,
      res.dateSoumission,
      res.synced ?? 0,
    ]
  )
}

export const getResolutionsByEnigme = async (enigmeId: string) => {
  const db = getDatabase()
  return await db.getAllAsync(
    "SELECT * FROM resolutions WHERE enigmeId = ? ORDER BY dateSoumission DESC",
    [enigmeId]
  )
}

export const getPendingResolutions = async () => {
  const db = getDatabase()
  return await db.getAllAsync("SELECT * FROM resolutions WHERE synced = 0")
}

export const markResolutionSynced = async (id: string) => {
  const db = getDatabase()
  await db.runAsync("UPDATE resolutions SET synced = 1 WHERE id = ?", [id])
}

export const deleteResolutions = async () => {
  const db = getDatabase()
  await db.runAsync("DELETE FROM resolutions")
}
