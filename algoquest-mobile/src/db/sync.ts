import { api } from "@/src/api/client"
import {
  insertEnigme,
  insertResolution,
  getPendingResolutions,
  markResolutionSynced,
} from "./resolvers"
import type { Enigme, Resolution }from "@/types/type"


export const syncFromServer = async (userId: string) => {
  try {

    const enigmesResponse = await api.get<Enigme[]>("/enigmes")
    const enigmes = enigmesResponse.data

    const completeEnigmes: Enigme[] = []

    for (const e of enigmes) {
      try {
        const detailResponse = await api.get<Enigme>(`/enigmes/${e.id}`)
        completeEnigmes.push(detailResponse.data)
      } catch (err) {
        console.warn(`Impossible de récupérer les détails de l'énigme ${e.id} `,err)

        completeEnigmes.push(e)
      }
    }

    await Promise.all(
        completeEnigmes.map(e =>
            insertEnigme({
        id: e.id,
        titre: e.titre,
        enonce: e.enonce ?? "",
        entree: e.entree ?? "",
        sortieAttendue: e.sortieAttendue ?? "",
      })
        )
    )

    const resolutionsResponse = await api.get<Resolution[]>(`/resolutions/user/${userId}`)
    const resolutions = resolutionsResponse.data

await Promise.all(
    resolutions.map(r => {
        const enigmeId = r.enigmeId || r.enigme?.id;
        if (!enigmeId) return Promise.resolve()
        return insertResolution({
    id: r.id,
    enigmeId,
    codeSoumis: r.codeSoumis,
    status: r.status,
    dateSoumission: r.dateSoumission,
    synced: 1,
  });
    })
)

    console.log("Synchro depuis le serveur terminée")
  } catch (err) {
    console.error("Erreur syncFromServer:", err)
  }
}


export const syncToServer = async (userId: string) => {
  try {
    const pending = await getPendingResolutions()

    for (const res of pending as Resolution[]) {
      try {
        await api.post("/resolutions", {
          userId,
          enigmeId: res.enigme?.id,
          codeSoumis: res.codeSoumis,
        })
        await markResolutionSynced(res.id)
      } catch (err) {
        console.error("Erreur synchro d'une résolution:", err)
      }
    }

    console.log("Synchro vers le serveur terminée")
  } catch (err) {
    console.error("Erreur syncToServer:", err)
  }
}

export const synchronize = async (userId: string) => {
  console.log("Lancement de la synchronisation...")

  await syncToServer(userId)
  await syncFromServer(userId)

  console.log("Synchronisation terminée")
}
