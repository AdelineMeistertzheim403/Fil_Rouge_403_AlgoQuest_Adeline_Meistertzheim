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
  status: "A_FAIRE" | "REUSSI" | "ECHEC"
  dateSoumission: string
  enigme: Enigme
}
