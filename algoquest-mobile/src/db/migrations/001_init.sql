-- Table enigmes
CREATE TABLE IF NOT EXISTS enigmes (
  id TEXT PRIMARY KEY NOT NULL,
  titre TEXT,
  enonce TEXT,
  entree TEXT,
  sortieAttendue TEXT,
  lastSync TEXT
);

-- Table resolutions
CREATE TABLE IF NOT EXISTS resolutions (
  id TEXT PRIMARY KEY NOT NULL,
  enigmeId TEXT,
  codeSoumis TEXT,
  status TEXT,
  dateSoumission TEXT,
  synced INTEGER DEFAULT 0,
  FOREIGN KEY (enigmeId) REFERENCES enigmes(id)
);
