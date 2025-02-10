-- Creator:       MySQL Workbench 8.0.36/ExportSQLite Plugin 0.1.0
-- Author:        Antonio Vinkovic
-- Caption:       New Model
-- Project:       RWA_zadaca_01
-- Changed:       2024-11-25 11:56
-- Created:       2024-11-20 11:27

BEGIN;
CREATE TABLE "film"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naslov" VARCHAR(100) NOT NULL,
  "originalni_naslov" VARCHAR(100) NOT NULL,
  "jezik" VARCHAR(50),
  "popularnost" DOUBLE,
  "poster" VARCHAR(1000),
  "datum_izdavanja" VARCHAR(50),
  "opis" TEXT,
  "odrasli" INTEGER,
  "prosjecna_ocjena" DOUBLE,
  "tmdb_id_film" INTEGER NOT NULL
);
CREATE TABLE "osoba"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "ime" VARCHAR(100) NOT NULL,
  "poznat_po" VARCHAR(50),
  "popularnost" DOUBLE,
  "profilna_slika" VARCHAR(1000),
  "tmdb_id_osoba" INTEGER NOT NULL,
  "biografija" TEXT,
  "datum_rodenja" VARCHAR(50),
  "datum_smrti" VARCHAR(50),
  "spol" INTEGER
);
CREATE TABLE "osoba_film"(
  "osoba_id" INTEGER NOT NULL,
  "film_id" INTEGER NOT NULL,
  "lik" VARCHAR(50),
  PRIMARY KEY("osoba_id","film_id"),
  CONSTRAINT "fk_osoba_film_osoba"
    FOREIGN KEY("osoba_id")
    REFERENCES "osoba"("id")
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT "fk_osoba_film_film1"
    FOREIGN KEY("film_id")
    REFERENCES "film"("id")
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
);
CREATE INDEX "osoba_film.fk_osoba_film_film1_idx" ON "osoba_film" ("film_id");
CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45),
  "opis" TEXT
);
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "korime" VARCHAR(50) NOT NULL,
  "tip_korisnika_id" INTEGER NOT NULL,
  CONSTRAINT "fk_korisnik_1"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
);
CREATE INDEX "korisnik.fk_korisnik_1_idx" ON "korisnik" ("tip_korisnika_id");
COMMIT;

INSERT INTO tip_korisnika(naziv) VALUES ("obican korisnik");
INSERT INTO tip_korisnika(naziv) VALUES ("administrator");

INSERT INTO korisnik(korime, tip_korisnika_id) VALUES("obican", 1);
INSERT INTO korisnik(korime, tip_korisnika_id) VALUES("admin", 2);
