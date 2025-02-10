import dsPromise from "fs/promises";
import * as path from "path";
import { __dirname } from "./esmPomocnik.js";
export class Konfiguracija {
    konfiguracija;
    constructor() {
        this.konfiguracija = this.initKonfiguracija();
    }
    initKonfiguracija() {
        return {
            jwtValjanost: "",
            jwtTajniKljuc: "",
            tajniKljucSesija: "",
            tmdbApiKeyV3: "",
            tmdbApiKeyV4: "",
            tajniKljucCaptcha: "",
        };
    }
    dajKonfiguraciju() {
        return this.konfiguracija;
    }
    async ucitajKonfiguraciju() {
        if (process.argv[2] == undefined) {
            throw new Error("Nedostaje putanja do konfiguracijske datoteke!");
        }
        let putanja = path.join(__dirname(), '..', '..', 'podaci', process.argv[2]);
        let podaci = await dsPromise.readFile(putanja, { encoding: "utf-8" });
        this.pretvoriJSONkonfig(podaci);
        this.provjeriPodatkeKonfiguracije();
        console.log(this.konfiguracija);
    }
    pretvoriJSONkonfig(podaci) {
        let konfiguracija = {};
        let nizPodataka = podaci.split("\n");
        for (let podatak of nizPodataka) {
            let podatakNiz = podatak.split("#");
            if (podatakNiz.length > 2) {
                throw new Error("Vrijednosti konfiguracije ne smiju sadržavati znak #!");
            }
            let naziv = podatakNiz[0];
            if (typeof naziv != "string" || naziv == "")
                continue;
            let vrijednost = podatakNiz[1] ?? "";
            konfiguracija[naziv] = vrijednost;
        }
        this.konfiguracija = konfiguracija;
    }
    provjeriPodatkeKonfiguracije() {
        if (this.konfiguracija.jwtValjanost == undefined ||
            this.konfiguracija.jwtValjanost.trim() == "") {
            throw new Error("Nedostaje JWT valjanost!");
        }
        if (parseInt(this.konfiguracija.jwtValjanost) < 15 ||
            parseInt(this.konfiguracija.jwtValjanost) > 300 ||
            isNaN(parseInt(this.konfiguracija.jwtValjanost))) {
            throw new Error("JWT valjanost mora biti brojčana vrijednost od 15 do 300!");
        }
        function provjeriValjanostTajnogKljuca(tajniKljuc) {
            const regex = /^[a-z0-9!%$]+$/;
            return regex.test(tajniKljuc);
        }
        if (this.konfiguracija.jwtTajniKljuc == undefined ||
            this.konfiguracija.jwtTajniKljuc.trim() == "") {
            throw new Error("Nedostaje JWT tajni ključ!");
        }
        if (this.konfiguracija.jwtTajniKljuc.length < 100 ||
            this.konfiguracija.jwtTajniKljuc.length > 200) {
            throw new Error("Vrijednost JWT tajnog ključa nije u skladu s propisanom veličinom!");
        }
        if (provjeriValjanostTajnogKljuca(this.konfiguracija.jwtTajniKljuc) == false) {
            throw new Error("Vrijednost JWT tajnog ključa sadrži nepodržane znakove!");
        }
        if (this.konfiguracija.tajniKljucSesija == undefined ||
            this.konfiguracija.tajniKljucSesija.trim() == "") {
            throw new Error("Nedostaje tajni ključ sesije!");
        }
        if (this.konfiguracija.tajniKljucSesija.length < 100 ||
            this.konfiguracija.tajniKljucSesija.length > 200) {
            throw new Error("Vrijednost tajnog ključa sesije nije u skladu s propisanom veličinom!");
        }
        if (provjeriValjanostTajnogKljuca(this.konfiguracija.tajniKljucSesija) == false) {
            throw new Error("Vrijednost tajnog ključa sesije sadrži nepodržane znakove!");
        }
        if (this.konfiguracija.tmdbApiKeyV3 == undefined ||
            this.konfiguracija.tmdbApiKeyV3.trim() == "") {
            throw new Error("Nedostaje API key V3!");
        }
        if (this.konfiguracija.tmdbApiKeyV4 == undefined ||
            this.konfiguracija.tmdbApiKeyV4.trim() == "") {
            throw new Error("Nedostaje API key V4!");
        }
    }
}
