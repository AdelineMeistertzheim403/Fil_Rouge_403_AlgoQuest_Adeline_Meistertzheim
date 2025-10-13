import { useEffect, useState } from "react"
import { getEnigmes, getResolutionsByEnigme } from "@/src/db/resolvers"
import type { Enigme, Resolution } from "@/types/type"

export type EnigmeWithStatus = Enigme & { status: "A_FAIRE" | "ECHEC" | "REUSSI" }

export const useEnigmes = (refreshTrigger = 0) => {
  const [enigmes, setEnigmes] = useState<EnigmeWithStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const localEnigmes = (await getEnigmes()) as Enigme[]
        const enriched: EnigmeWithStatus[] = []

        for (const e of localEnigmes) {
  const resolutions = (await getResolutionsByEnigme(e.id)) as Resolution[]

  const lastRes = resolutions.sort(
    (a, b) => new Date(b.dateSoumission).getTime() - new Date(a.dateSoumission).getTime()
  )[0]

  // ✅ Si une réussite existe, elle prévaut
  const hasSuccess = resolutions.some(r => r.status === "REUSSI")

  enriched.push({
    ...e,
    status: hasSuccess
      ? "REUSSI"
      : lastRes
      ? (lastRes.status as "ECHEC" | "REUSSI")
      : "A_FAIRE",
  })
}

        setEnigmes(enriched)
      } catch (err) {
        console.error("❌ Erreur useEnigmes:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [refreshTrigger])

  return { enigmes, loading }
}
