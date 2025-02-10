import { KorisnikI } from "../zajednicko/korisnikI.js";
import Baza from "../zajednicko/sqliteBaza.js";

export class KorisnikDAO {
    private baza : Baza;

    constructor() {
        this.baza = new Baza("podaci/RWA2024avinkovic22_web.sqlite");
    }

    dodaj(korisnik : KorisnikI) {
        try {
            let sqlProvjera = "SELECT * FROM korisnik WHERE korime = ? OR email = ?;";
            let rezultati = this.baza.dajPodatke(sqlProvjera, [korisnik.korime, korisnik.email]) as Array<KorisnikI>;
            if(rezultati.length > 0) {
                return false
            }
            let sql = `INSERT INTO korisnik (ime, prezime, adresa, korime, lozinka, email, 
            tip_korisnika_id, telefon, datum_rodenja, servis_prava, poslao_zahtjev) VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            let podaci = [korisnik.ime, korisnik.prezime, korisnik.adresa, korisnik.korime,
                korisnik.lozinka, korisnik.email, korisnik.tip_korisnika_id, korisnik.telefon, 
                korisnik.datum_rodenja, korisnik.servis_prava, korisnik.poslao_zahtjev];
            this.baza.ubaciAzurirajPodatke(sql, podaci);
            return true;
        }
        catch(err) {
            console.error("Dogodila se greška kod dodavanja korisnika: " + err);
            return false;
        }
    }

    async dajPremaKorime(korime : string) {
        let sql = "SELECT * FROM korisnik WHERE korime = ?;";
        try {
            let rezultat = await this.baza.dajPodatkePromise(sql, [korime]);
            return rezultat as KorisnikI;
        }
        catch(err) {
            console.error("Dogodila se greška kod dohvaćanja korisnika");
            return false;
        }
    }

    async daj(korime : string, lozinka : string) {
        let sql = "SELECT * FROM korisnik WHERE korime = ? AND lozinka = ?;";
        try {
            let rezultat = await this.baza.dajPodatkePromise(sql, [korime, lozinka]);
            return rezultat as KorisnikI;
        }
        catch(err) {
            console.error("Dogodila se greška kod dohvaćanja korisnika");
            return false;
        }
    }

    async dajSve() : Promise<Array<KorisnikI>> {
        let sql = "SELECT * FROM korisnik;";
        let podaci = await this.baza.dajPodatkePromise(sql, []) as Array<KorisnikI>;
        let rezultat = new Array<KorisnikI>();
        for(let p of podaci) {
            let k : KorisnikI = {ime: p["ime"], prezime: p["prezime"], korime: p["korime"], 
                lozinka: p["lozinka"], email: p["email"], telefon: p["telefon"], 
                datum_rodenja: p["datum_rodenja"], adresa: p["adresa"], tip_korisnika_id: p["tip_korisnika_id"],
                servis_prava: p["servis_prava"], poslao_zahtjev: p["poslao_zahtjev"]
            };
            rezultat.push(k);
        }
        console.log(rezultat);
        return rezultat;
    }

    obrisi(korime : string) {
        let sql = "DELETE FROM korisnik WHERE korime = ?;";
        this.baza.ubaciAzurirajPodatke(sql, [korime]);
        return true;
    }

    azurirajPrava(korime : string, servis_prava : number) {
        try {
            let sql = "UPDATE korisnik SET servis_prava = ?, poslao_zahtjev = 0 WHERE korime = ?";
            this.baza.ubaciAzurirajPodatke(sql, [servis_prava, korime]);
            console.log("uspjeh");
            return true;
        }
        catch(err) {
            console.error(err);
            return false;
        }
    }
    azurirajZahtjev(korime : string) {
        try {
            let sql = "UPDATE korisnik SET poslao_zahtjev = 1 WHERE korime = ?";
            this.baza.ubaciAzurirajPodatke(sql, [korime]);
            console.log("uspjeh");
            return true;
        }
        catch(err) {
            console.error(err);
            return false;
        }
    }

}