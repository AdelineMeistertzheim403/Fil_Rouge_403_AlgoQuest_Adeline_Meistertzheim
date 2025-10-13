export type Enigme = {
  id: string
  titre: string
  enonce: string
  entree: string
  sortieAttendue: string
}

export type Resolution = {
  id: string
  codeSoumis: string
  status: string
  dateSoumission: string
  enigme?: {
    id: string
    titre?: string
  } | null
  enigmeId?: string
  userId?: string
}
