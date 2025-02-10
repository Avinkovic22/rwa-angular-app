import { TMDBklijent } from "./klijentTMDB.js";
import { KorisnikDAO } from "./korisnikDAO.js";
import * as kodovi from '../zajednicko/kodovi.js';
import { dajTijelo, dajToken, kreirajToken, provjeriToken } from "../zajednicko/jwt.js";
import { ServisPravaDAO } from "./ServisPravaDAO.js";
export class RestApp {
    tajniKljucJWT;
    tmdbKlijent;
    jwtValjanost;
    kdao;
    spdao;
    constructor(tajniKljucJWT, apiKljucV3, jwtValjanost) {
        this.tajniKljucJWT = tajniKljucJWT;
        this.tmdbKlijent = new TMDBklijent(apiKljucV3);
        this.jwtValjanost = jwtValjanost;
        this.kdao = new KorisnikDAO();
        this.spdao = new ServisPravaDAO();
    }
    async registracija(zahtjev, odgovor) {
        if (zahtjev.method == "POST") {
            let uspjeh = await this.dodajKorisnika(zahtjev.body.korisnik);
            if (uspjeh) {
                odgovor.status(201);
                odgovor.send(JSON.stringify({ status: "uspjeh" }));
            }
            else {
                odgovor.status(417);
                odgovor.send({ greska: "Registracija korisnika nije uspjela!" });
            }
        }
    }
    async prijava(zahtjev, odgovor) {
        if (zahtjev.method == "POST") {
            let korime = zahtjev.body.korime;
            let lozinka = zahtjev.body.lozinka;
            let k = await this.prijaviKorisnika(korime, lozinka);
            if (k) {
                var korisnik = k;
                console.log('korisnik: ' + JSON.stringify(korisnik));
                let sesija = zahtjev.session;
                sesija.korisnik = korisnik;
                sesija.korime = korisnik.korime;
                let token = kreirajToken({ korime: k.korime, tip_korisnika_id: k.tip_korisnika_id }, this.tajniKljucJWT, this.jwtValjanost);
                odgovor.status(200).json({ message: 'Uspješna prijava!', token });
                return;
            }
            else {
                odgovor.status(417).json({ greska: "Netočni podaci!" });
                return;
            }
        }
    }
    async prijaviKorisnika(korime, lozinka) {
        lozinka = kodovi.kreirajSHA256(lozinka, "moja sol");
        let rezultat = await this.kdao.daj(korime, lozinka);
        if (rezultat && Array.isArray(rezultat) && rezultat.length > 0) {
            return rezultat[0];
        }
        return false;
    }
    dodajKorisnika(korisnik) {
        let k = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            korime: korisnik.korime,
            lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
            email: korisnik.email,
            adresa: korisnik.adresa,
            telefon: korisnik.telefon,
            datum_rodenja: korisnik.datum_rodenja,
            tip_korisnika_id: 1,
            servis_prava: 0,
            poslao_zahtjev: 0
        };
        console.log(k);
        let rezultat = this.kdao.dodaj(k);
        if (rezultat) {
            return true;
        }
        else {
            return false;
        }
    }
    async getOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = dajToken(zahtjev);
        if (token != null) {
            let tijelo = dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
            if (korisnikPostoji) {
                let stranica = zahtjev.query["stranica"];
                let trazi = zahtjev.query["trazi"];
                if (!stranica || isNaN(parseInt(stranica)) || trazi == null || typeof trazi != "string") {
                    odgovor.status(422);
                    odgovor.send({ greska: "neočekivani podaci" });
                }
                else {
                    this.tmdbKlijent.pretraziOsobePoNazivu(trazi, parseInt(stranica))
                        .then((osobe) => {
                        console.log(osobe);
                        odgovor.status(200);
                        odgovor.send(osobe);
                    })
                        .catch((greska) => {
                        odgovor.json(greska);
                    });
                }
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async getDetaljeOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = dajToken(zahtjev);
        if (token != null) {
            let tijelo = dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    this.tmdbKlijent.dajDetaljeOsobe(parseInt(id))
                        .then((osoba) => {
                        console.log(osoba);
                        odgovor.status(200);
                        odgovor.send(osoba);
                    })
                        .catch((greska) => {
                        odgovor.json(greska);
                    });
                }
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async getOsobaFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = dajToken(zahtjev);
        if (token != null) {
            let tijelo = dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    this.tmdbKlijent.dajFilmoveOsobe(parseInt(id))
                        .then((filmovi) => {
                        console.log(filmovi);
                        odgovor.status(200);
                        odgovor.send(filmovi);
                    })
                        .catch((greska) => {
                        odgovor.json(greska);
                    });
                }
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async getKorisnik(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = dajToken(zahtjev);
        if (token != null) {
            let tijelo = dajTijelo(token);
            this.kdao.dajPremaKorime(tijelo.korime).then((korisnik) => {
                console.log(korisnik);
                if (korisnik && Array.isArray(korisnik) && korisnik.length) {
                    odgovor.status(200);
                    odgovor.send(JSON.stringify(korisnik));
                }
                else {
                    odgovor.status(400);
                    odgovor.send({ greska: "trazeni korisnik ne postoji" });
                }
            });
        }
        return;
    }
    async getKorisnici(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = dajToken(zahtjev);
        if (token != null) {
            let tijelo = dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
            if (korisnikPostoji) {
                this.kdao.dajSve().then((korisnici) => {
                    if (korisnici) {
                        odgovor.status(200);
                        odgovor.send({
                            korisnici,
                            trenutniKorisnik: tijelo.korime
                        });
                    }
                    else {
                        odgovor.status(400);
                        odgovor.send({ greska: "greska kod dohvacanja korisnika" });
                    }
                });
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async provjeriKorisnika(korime) {
        let r = await this.spdao.daj(korime);
        console.log(r);
        if (r && Array.isArray(r) && r.length) {
            return true;
        }
        else {
            return false;
        }
    }
    async putKorisniciPrava(zahtjev, odgovor) {
        odgovor.type("json");
        let token = dajToken(zahtjev);
        if (token != null) {
            let tijelo = dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
            if (korisnikPostoji) {
                let korime = zahtjev.params["korime"];
                if (!korime) {
                    odgovor.status(400);
                    odgovor.send({ greska: "neočekivani podaci" });
                    return;
                }
                else {
                    let servisPrava = zahtjev.body.servis_prava;
                    let rezultat = this.kdao.azurirajPrava(korime, parseInt(servisPrava));
                    if (rezultat) {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({ status: "uspjeh" }));
                    }
                    else {
                        odgovor.status(400);
                        odgovor.send(JSON.stringify({ greska: "greska tijekom azuriranja prava" }));
                    }
                }
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async putKorisniciZahtjev(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let korime = zahtjev.params["korime"];
        if (!korime) {
            odgovor.status(400);
            odgovor.send({ greska: "neočekivani podaci" });
            return;
        }
        else {
            let rezultat = this.kdao.azurirajZahtjev(korime);
            if (rezultat) {
                odgovor.status(201);
                odgovor.send(JSON.stringify({ status: "uspjeh" }));
            }
            else {
                odgovor.status(400);
                odgovor.send(JSON.stringify({ greska: "greska tijekom azuriranja zahtjeva" }));
            }
        }
        return;
    }
    async deleteKorisnici(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = dajToken(zahtjev);
        if (token != null) {
            let tijelo = dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
            if (korisnikPostoji) {
                let korime = zahtjev.params["korime"];
                if (!korime) {
                    odgovor.status(400);
                    odgovor.send({ greska: "neočekivani podaci" });
                    return;
                }
                else {
                    let rezultat = this.kdao.obrisi(korime);
                    if (rezultat) {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({ status: "uspjeh" }));
                    }
                    else {
                        odgovor.status(400);
                        odgovor.send(JSON.stringify({ greska: "greska tijekom azuriranja prava" }));
                    }
                }
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async getOsobaSlike(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = dajToken(zahtjev);
        if (token != null) {
            let tijelo = dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    this.tmdbKlijent.dohvatiSlikeOsobe(parseInt(id))
                        .then((galerija) => {
                        console.log(galerija);
                        odgovor.status(200);
                        odgovor.send(galerija);
                    })
                        .catch((greska) => {
                        odgovor.json(greska);
                    });
                }
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async provjeriKorisnikaIAdmina(korime) {
        let r = await this.spdao.daj(korime);
        console.log(r);
        if (r && Array.isArray(r) && r.length && r[0].tip_korisnika_id == 2) {
            return true;
        }
        else {
            return false;
        }
    }
}
