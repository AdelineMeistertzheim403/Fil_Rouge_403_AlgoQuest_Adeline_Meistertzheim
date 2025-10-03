import { api } from "@/src/api/client"
import {
  insertEnigme,
  insertResolution,
  getPendingResolutions,
  markResolutionSynced,
} from "./resolvers"
import type { Enigme, Resolution }from "@/types/type"

/**
 * 🔽 Synchroniser les données distantes (MongoDB via API) vers la BDD locale (SQLite)
 */
export const syncFromServer = async (userId: string) => {
  try {
    // 1. Récupérer la liste des énigmes depuis ton API
    const enigmesResponse = await api.get<Enigme[]>("/enigmes")
    const enigmes = enigmesResponse.data

    // 2. Récupérer la liste des résolutions de l’utilisateur
    const resolutionsResponse = await api.get<Resolution[]>(`/resolutions/user/${userId}`)
    const resolutions = resolutionsResponse.data

    // 3. Insérer / mettre à jour les énigmes
    for (const e of enigmes) {
      await insertEnigme({
        id: e.id,
        titre: e.titre,
        enonce: e.enonce,
        entree: e.entree,
        sortieAttendue: e.sortieAttendue,
      })
    }

    // 4. Insérer / mettre à jour les résolutions
    for (const r of resolutions) {
      await insertResolution({
        id: r.id,
        enigmeId: r.enigme.id,
        codeSoumis: r.codeSoumis,
        status: r.status,
        dateSoumission: r.dateSoumission,
        synced: 1, // ✅ celles venant du serveur sont déjà synchronisées
      })
    }

    console.log("✅ Synchro depuis le serveur terminée")
  } catch (err) {
    console.error("❌ Erreur syncFromServer:", err)
  }
}

/**
 * 🔼 Envoyer les données locales non synchronisées vers l’API distante
 */
export const syncToServer = async (userId: string) => {
  try {
    const pending = await getPendingResolutions()

    for (const res of pending as Resolution[]) {
      try {
        // Envoi au serveur
        await api.post("/resolutions", {
          userId,
          enigmeId: res.enigme.id,
          codeSoumis: res.codeSoumis,
        })

        // Marquer comme synchronisé
        await markResolutionSynced(res.id)
      } catch (err) {
        console.error("⚠️ Erreur synchro d'une résolution:", err)
      }
    }

    console.log("✅ Synchro vers le serveur terminée")
  } catch (err) {
    console.error("❌ Erreur syncToServer:", err)
  }
}

/**
 * 🔄 Fonction principale de synchronisation bidirectionnelle
 */
export const synchronize = async (userId: string) => {
  console.log("⏳ Lancement de la synchronisation...")

  await syncToServer(userId)   // d’abord push les données locales
  await syncFromServer(userId) // puis pull les données distantes

  console.log("🎉 Synchronisation terminée")
}
