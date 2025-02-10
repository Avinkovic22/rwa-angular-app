-- Creator:       MySQL Workbench 8.0.36/ExportSQLite Plugin 0.1.0
-- Author:        Antonio Vinkovic
-- Caption:       New Model
-- Project:       RWA_zadaca_01
-- Changed:       2024-11-26 13:46
-- Created:       2024-11-20 11:00

BEGIN;
CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" TEXT
);
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "adresa" TEXT,
  "korime" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(1000) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "tip_korisnika_id" INTEGER NOT NULL,
  "telefon" VARCHAR(50),
  "datum_rodenja" VARCHAR(50),
  "servis_prava" INTEGER,
  "poslao_zahtjev" INTEGER,
  CONSTRAINT "korime_UNIQUE"
    UNIQUE("korime"),
  CONSTRAINT "email_UNIQUE"
    UNIQUE("email"),
  CONSTRAINT "fk_korisnik_tip_korisnika"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
);
CREATE INDEX "korisnik.fk_korisnik_tip_korisnika_idx" ON "korisnik" ("tip_korisnika_id");
COMMIT;

INSERT INTO tip_korisnika(naziv) VALUES("registrirani korisnik");
INSERT INTO tip_korisnika(naziv) VALUES("administrator");

UPDATE korisnik SET tip_korisnika_id = 1, servis_prava = 1 WHERE korime = "obican";
UPDATE korisnik SET poslao_zahtjev = 0 WHERE korime = "obican";