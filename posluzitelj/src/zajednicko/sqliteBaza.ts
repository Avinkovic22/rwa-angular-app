import SQLite from "better-sqlite3";

export default class Baza {
    private vezaDB;
    private putanjaSqliteDatoteke;

    constructor(putanjaSqliteDatoteke : string) {
        this.putanjaSqliteDatoteke = putanjaSqliteDatoteke;
        this.vezaDB = new SQLite(putanjaSqliteDatoteke);
        this.vezaDB.exec("PRAGMA foreign_keys = ON");
    }

    spojiSeNaBazu() {
        this.vezaDB = new SQLite(this.putanjaSqliteDatoteke);
        this.vezaDB.exec("PRAGMA foreign_keys = ON");
    }

    ubaciAzurirajPodatke(sql : string, podaci : Array<string | number | boolean | null | undefined>) {
        try {
            this.vezaDB.prepare(sql).run(podaci);
        } catch(err) {
            console.error("Greška pri izvršavanju upita; ", err);
            throw err;
        }
    }

    ubaciAzurirajPodatkePromise(sql : string, podaci : Array<string | number | boolean | null | undefined>) {
        return new Promise((uspjeh, greska) => {
            setTimeout(() => {
                try {
                    let rezultat = this.vezaDB.prepare(sql).run(podaci);
                    uspjeh(rezultat);
                } catch(err) {
                    console.error("Greška pri izvršavanju upita; ", err);
                    greska(err);
                }
            }, 1);
        })
    }

    dajPodatke(sql : string, podaci : Array<string | number | undefined>) {
        try {
            const rezultat = this.vezaDB.prepare(sql).all(podaci);
            return rezultat;
        } catch(err) {
            console.error("Greška pri izvršavanju upita; ", err);
            throw err;
        }
    }

    dajPodatkePromise(sql : string, podaci : Array<string | number | undefined>) {
        return new Promise((uspjeh, greska) => {
            setTimeout(() => {
                try {
                    let rezultat = this.vezaDB.prepare(sql).all(podaci);
                    uspjeh(rezultat);
                } catch(err) {
                    console.error("Greška pri izvršavanju upita; ", err);
                    greska(err);
                }
            }, 1);
        })
    }

    zatvoriVezu() {
        this.vezaDB.close();
    }
}