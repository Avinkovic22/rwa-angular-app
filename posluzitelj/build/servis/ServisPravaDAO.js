import Baza from "../zajednicko/sqliteBaza.js";
export class ServisPravaDAO {
    baza;
    constructor() {
        this.baza = new Baza("podaci/RWA2024avinkovic22_servis.sqlite");
    }
    async daj(korime) {
        let sql = "SELECT * FROM korisnik WHERE korime = ?;";
        try {
            let rezultat = await this.baza.dajPodatkePromise(sql, [korime]);
            return rezultat;
        }
        catch (err) {
            console.error("Dogodila se greška kod dohvaćanja korisnika");
            return false;
        }
    }
    dodaj(korisnik) {
        let sqlProvjera = "SELECT * FROM korisnik WHERE korime = ?;";
        let rezultati = this.baza.dajPodatke(sqlProvjera, [korisnik.korime]);
        if (rezultati.length > 0) {
            return false;
        }
        let sql = `INSERT INTO korisnik (korime, tip_korisnika_id) VALUES (?, ?);`;
        let podaci = [korisnik.korime, korisnik.tip_korisnika_id];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    obrisi(korime) {
        let sql = "DELETE FROM korisnik WHERE korime = ?;";
        try {
            this.baza.ubaciAzurirajPodatke(sql, [korime]);
            return true;
        }
        catch (error) {
            console.error("Greška pri brisanju korisnika: ", error);
            return false;
        }
    }
}
