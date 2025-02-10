import Baza from "../zajednicko/sqliteBaza.js";
import { FilmoviTmdbI, FilmTmdbI, OsobaTmdbI, OsobeTmdbI } from "../zajednicko/tmbdI.js";

export class TmdbDAO {
    private baza : Baza;

    constructor() {
        this.baza = new Baza("podaci/RWA2024avinkovic22_servis.sqlite");
    }

    async dajSveOsobe(stranica : number) : Promise<OsobeTmdbI> {
        let razmak = (stranica - 1) * 20;
        let sql1 = "SELECT * FROM osoba ORDER BY id DESC LIMIT 20 OFFSET ?;";
        let podaci = await this.baza.dajPodatkePromise(sql1, [razmak]) as Array<OsobaTmdbI>;
        let sql2 = "SELECT COUNT(ime) AS zbroj FROM osoba;";
        let brojOsobaRezultat = await this.baza.dajPodatkePromise(sql2, []) as { zbroj: number }[];
        let brojOsoba = brojOsobaRezultat[0]?.zbroj || 0;
        let brojStranica = Math.ceil(brojOsoba / 20);
        let osobe = new Array<OsobaTmdbI>();
        for(let p of podaci) {
            let o : OsobaTmdbI = {id: p["id"], ime: p["ime"], poznat_po: p["poznat_po"], popularnost: p["popularnost"], 
                profilna_slika: p["profilna_slika"], tmdb_id_osoba: p["tmdb_id_osoba"], biografija: p["biografija"], 
                datum_rodenja: p["datum_rodenja"], datum_smrti: p["datum_smrti"], spol: p["spol"]};
                osobe.push(o);
        }
        return { stranica: stranica, rezultati: osobe, ukupnoStranica: brojStranica, ukupnoRezultata: brojOsoba }
    }

    async dajOsobu(id : string) : Promise<OsobaTmdbI | null> {
        let sql = "SELECT * FROM osoba WHERE tmdb_id_osoba = ?";
        let podaci = await this.baza.dajPodatkePromise(sql, [id]) as Array<OsobaTmdbI>;

        if(podaci.length == 1 && podaci[0] != undefined) {
            let p = podaci[0];
            let o : OsobaTmdbI = {id: p["id"], ime: p["ime"], poznat_po: p["poznat_po"], popularnost: p["popularnost"], 
                profilna_slika: p["profilna_slika"], tmdb_id_osoba: p["tmdb_id_osoba"], biografija: p["biografija"], 
                datum_rodenja: p["datum_rodenja"], datum_smrti: p["datum_smrti"], spol: p["spol"]};
            return o;
        }
        return null;
    }

    async dodajOsobu(osoba : OsobaTmdbI) {
        let sqlProvjera = "SELECT * FROM osoba WHERE tmdb_id_osoba = ?;";
        let rezultati = await this.baza.dajPodatkePromise(sqlProvjera, [osoba.tmdb_id_osoba]) as Array<OsobaTmdbI>;
        if(rezultati.length > 0) {
            return false
        }
        let sql = `INSERT INTO osoba(ime, poznat_po, popularnost, profilna_slika, tmdb_id_osoba, 
        biografija, datum_rodenja, datum_smrti, spol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        let podaci = [osoba.ime, osoba.poznat_po, osoba.popularnost, osoba.profilna_slika, 
            osoba.tmdb_id_osoba, osoba.biografija, osoba.datum_rodenja, osoba.datum_smrti, osoba.spol];
        await this.baza.ubaciAzurirajPodatkePromise(sql, podaci);
        return true;
    }

    obrisiOsobu(tmdbId : string) {
        let sql1 = "DELETE FROM osoba WHERE tmdb_id_osoba = ?;";
        let sql2 = "DELETE FROM osoba_film WHERE osoba_id = (SELECT id FROM osoba WHERE tmdb_id_osoba = ?);";
        try {
            this.baza.ubaciAzurirajPodatke(sql2, [tmdbId]);
            this.baza.ubaciAzurirajPodatke(sql1, [tmdbId]);
            return true;
        } catch (greska) {
            console.error("Greška pri brisanju osobe: ", greska);
            return false;
        }
    }

    async dajOsobaFilmove(id : string, stranica: number) {
        let razmak = (stranica - 1) * 20;
        let sql1 = `SELECT f.*, of.lik FROM film f JOIN osoba_film of ON f.id = of.film_id 
        WHERE of.osoba_id = (SELECT id FROM osoba WHERE tmdb_id_osoba = ?) LIMIT 20 OFFSET ?;`;
        let podaci = await this.baza.dajPodatkePromise(sql1, [id, razmak]) as Array<FilmTmdbI>;
        let sql2 = "SELECT COUNT(osoba_id) AS zbroj FROM osoba_film WHERE osoba_id = (SELECT id FROM osoba WHERE tmdb_id_osoba = ?);";
        let brojFilmovaRezultat = await this.baza.dajPodatkePromise(sql2, [id]) as { zbroj: number }[];
        let brojFilmova = brojFilmovaRezultat[0]?.zbroj || 0;
        let brojStranica = Math.ceil(brojFilmova / 20);

        let filmovi = new Array<FilmTmdbI>();
        for(let p of podaci) {
            let f : FilmTmdbI = {naslov: p["naslov"], originalni_naslov: p["originalni_naslov"], jezik: p["jezik"], 
                popularnost: p["popularnost"], poster: p["poster"], datum_izdavanja: p["datum_izdavanja"], 
                opis: p["opis"], odrasli: p["odrasli"], prosjecna_ocjena: p["prosjecna_ocjena"], 
                tmdb_id_film: p["tmdb_id_film"], lik: p["lik"]};
            filmovi.push(f);
        }
        return { stranica: stranica, rezultati: filmovi, ukupnoStranica: brojStranica, ukupnoRezultata: brojFilmova };
    }

    azurirajOsobaFilmove(id: number, filmovi: Array<FilmTmdbI>) {
        if(!id || filmovi.length === 0) {
            console.error("Pogrešni podaci.");
            return false;
        }
        let sqlOsoba = "SELECT id FROM osoba WHERE tmdb_id_osoba = ?";
        let osobaRezultat = this.baza.dajPodatke(sqlOsoba, [id]) as Array<{id : number}>;
        if(osobaRezultat.length === 0) {
            console.log('Osoba nije u bazi podataka.');
            return false;
        }
        let osobaId = osobaRezultat[0]?.id;
        console.log(osobaId);
        if(osobaId === undefined) {
            console.error("Nije moguće dohvatiti ID osobe.");
            return false;
        }
    
        for(let f of filmovi) {
            let sqlFilm = "SELECT id FROM film WHERE tmdb_id_film = ?";
            let filmRezultat = this.baza.dajPodatke(sqlFilm, [f.tmdb_id_film]) as Array<{id : number}>;
            if(filmRezultat.length === 0) {
                console.log("Film nije u bazi podataka. ID: " + f.tmdb_id_film);
                continue;
            }
            let filmId = filmRezultat[0]?.id;
            console.log(filmId);
            if(filmId === undefined) {
                console.error("Nije moguće dohvatiti ID filma.");
                return false;
            }
            let lik = f.lik;
            let sqlOsobaFilm = "SELECT * FROM osoba_film WHERE osoba_id = ? AND film_id = ?";
            let osobaFilmRezultat = this.baza.dajPodatke(sqlOsobaFilm, 
            [osobaId, filmId]) as Array<{osoba_id : number, film_id : number}>;
            if(osobaFilmRezultat.length > 0) {
                console.log("Osoba i film već povezani.");
                continue;
            }

            let sqlOsobaFilmUbaci = "INSERT INTO osoba_film (osoba_id, film_id, lik) VALUES (?, ?, ?)";
            this.baza.ubaciAzurirajPodatkePromise(sqlOsobaFilmUbaci, [osobaId, filmId, lik]);
        }
        return true;
    }

    obrisiOsobaFilmove(id : number) {
        let sql = `DELETE FROM osoba_film WHERE osoba_id = (SELECT id FROM osoba WHERE tmdb_id_osoba = ?);`;
        try {
            this.baza.ubaciAzurirajPodatke(sql, [id]);
            return true;
        } catch (error) {
            console.error("Greška pri brisanju veze osoba film: ", error);
            return false;
        }
    }

    async dajSveFilmove(stranica : number, datumOd?: number, datumDo?: number) : Promise<FilmoviTmdbI> {
        let razmak = (stranica - 1) * 20;
        let sql1 = "SELECT * FROM film";
        let parametri1 = [];

        if(datumOd !== undefined || datumDo !== undefined) {
            sql1 += " WHERE";
            if(datumOd !== undefined) {
                sql1 += " datum_izdavanja >= ?";
                let datumOdString = new Date(datumOd).toISOString().split("T")[0];
                parametri1.push(datumOdString);
            }
        }
        if(datumDo !== undefined) {
            if(parametri1.length > 0) {
                sql1 += " AND";
            }
            sql1 += " datum_izdavanja <= ?"
            let datumDoString = new Date(datumDo).toISOString().split("T")[0];
            parametri1.push(datumDoString);
        }

        sql1 += " ORDER BY id DESC LIMIT 20 OFFSET ?;";
        parametri1.push(razmak);
        let podaci = await this.baza.dajPodatkePromise(sql1, parametri1) as Array<FilmTmdbI>;

        let sql2 = "SELECT COUNT(naslov) AS zbroj FROM film";
        let parametri2 = [];

        if(datumOd !== undefined || datumDo !== undefined) {
            sql2 += " WHERE";
            if(datumOd !== undefined) {
                sql2 += " datum_izdavanja >= ?";
                let datumOdString = new Date(datumOd).toISOString().split("T")[0];
                parametri2.push(datumOdString);
            }
        }
        if(datumDo !== undefined) {
            if(parametri2.length > 0) {
                sql2 += " AND";
            }
            sql2 += " datum_izdavanja <= ?"
            let datumDoString = new Date(datumDo).toISOString().split("T")[0];
            parametri2.push(datumDoString);
        }

        let brojFilmovaRezultat = await this.baza.dajPodatkePromise(sql2, parametri2) as { zbroj: number }[];
        let brojFilmova = brojFilmovaRezultat[0]?.zbroj || 0;
        let brojStranica = Math.ceil(brojFilmova / 20);
        let filmovi = new Array<FilmTmdbI>();
        for(let p of podaci) {
            let f : FilmTmdbI = {naslov: p["naslov"], originalni_naslov: p["originalni_naslov"], jezik: p["jezik"], 
                popularnost: p["popularnost"], poster: p["poster"], datum_izdavanja: p["datum_izdavanja"], 
                opis: p["opis"], odrasli: p["odrasli"], prosjecna_ocjena: p["prosjecna_ocjena"], 
                tmdb_id_film: p["tmdb_id_film"]};
            filmovi.push(f);
        }
        return { stranica: stranica, rezultati: filmovi, ukupnoStranica: brojStranica, ukupnoRezultata: brojFilmova }
    }

    async dajFilm(id : string) : Promise<FilmTmdbI | null> {
        let sql = "SELECT * FROM film WHERE tmdb_id_film = ?";
        let podaci = await this.baza.dajPodatkePromise(sql, [id]) as Array<FilmTmdbI>;

        if(podaci.length == 1 && podaci[0] != undefined) {
            let p = podaci[0];
            let f: FilmTmdbI = { naslov: p["naslov"], originalni_naslov: p["originalni_naslov"], 
                jezik: p["jezik"], popularnost: p["popularnost"], poster: p["poster"], 
                datum_izdavanja: p["datum_izdavanja"], opis: p["opis"], odrasli: p["odrasli"], 
                prosjecna_ocjena: p["prosjecna_ocjena"], tmdb_id_film: p["tmdb_id_film"]};
            return f;
        }
        return null;
    }

    dodajFilm(film : FilmTmdbI) {
        let sqlProvjera = "SELECT * FROM film WHERE tmdb_id_film = ?;";
        let rezultati = this.baza.dajPodatke(sqlProvjera, [film.tmdb_id_film]) as Array<FilmTmdbI>;
        if(rezultati.length > 0) {
            return false
        }
        let sql = `INSERT INTO film(naslov, originalni_naslov, jezik, popularnost, poster, 
        datum_izdavanja, opis, odrasli, prosjecna_ocjena, tmdb_id_film) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        let podaci = [film.naslov, film.originalni_naslov, film.jezik, film.popularnost, 
            film.poster, film.datum_izdavanja, film.opis, film.odrasli, film.prosjecna_ocjena, film.tmdb_id_film];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }

    obrisiFilm(id : string) {
        let sql = `DELETE FROM film WHERE tmdb_id_film = ? AND NOT EXISTS 
        (SELECT 1 FROM osoba_film WHERE film_id = (SELECT id FROM film WHERE tmdb_id_film = ?));`;
        try {
            this.baza.ubaciAzurirajPodatke(sql, [id, id]);
            return true;
        } catch (error) {
            console.error("Greška pri brisanju filma: ", error);
            return false;
        }
    }
}