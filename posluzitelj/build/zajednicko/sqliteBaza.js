import SQLite from "better-sqlite3";
export default class Baza {
    vezaDB;
    putanjaSqliteDatoteke;
    constructor(putanjaSqliteDatoteke) {
        this.putanjaSqliteDatoteke = putanjaSqliteDatoteke;
        this.vezaDB = new SQLite(putanjaSqliteDatoteke);
        this.vezaDB.exec("PRAGMA foreign_keys = ON");
    }
    spojiSeNaBazu() {
        this.vezaDB = new SQLite(this.putanjaSqliteDatoteke);
        this.vezaDB.exec("PRAGMA foreign_keys = ON");
    }
    ubaciAzurirajPodatke(sql, podaci) {
        try {
            this.vezaDB.prepare(sql).run(podaci);
        }
        catch (err) {
            console.error("Greška pri izvršavanju upita; ", err);
            throw err;
        }
    }
    ubaciAzurirajPodatkePromise(sql, podaci) {
        return new Promise((uspjeh, greska) => {
            setTimeout(() => {
                try {
                    let rezultat = this.vezaDB.prepare(sql).run(podaci);
                    uspjeh(rezultat);
                }
                catch (err) {
                    console.error("Greška pri izvršavanju upita; ", err);
                    greska(err);
                }
            }, 1);
        });
    }
    dajPodatke(sql, podaci) {
        try {
            const rezultat = this.vezaDB.prepare(sql).all(podaci);
            return rezultat;
        }
        catch (err) {
            console.error("Greška pri izvršavanju upita; ", err);
            throw err;
        }
    }
    dajPodatkePromise(sql, podaci) {
        return new Promise((uspjeh, greska) => {
            setTimeout(() => {
                try {
                    let rezultat = this.vezaDB.prepare(sql).all(podaci);
                    uspjeh(rezultat);
                }
                catch (err) {
                    console.error("Greška pri izvršavanju upita; ", err);
                    greska(err);
                }
            }, 1);
        });
    }
    zatvoriVezu() {
        this.vezaDB.close();
    }
}
