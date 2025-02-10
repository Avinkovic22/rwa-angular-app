import { TmdbDAO } from "./tmbdDAO.js";
import * as jwt from "../zajednicko/jwt.js";
import { ServisPravaDAO } from "./ServisPravaDAO.js";
export class RestTMDB {
    tajniKljucJWT;
    tmdbdao;
    spdao;
    constructor(api_kljuc, tajniKljucJWT) {
        this.tajniKljucJWT = tajniKljucJWT;
        this.tmdbdao = new TmdbDAO();
        this.spdao = new ServisPravaDAO();
    }
    async provjeriKorisnika(korime) {
        let r = await this.spdao.daj(korime);
        if (r && Array.isArray(r) && r.length) {
            return true;
        }
        else {
            return false;
        }
    }
    async getOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let stranica = zahtjev.query["stranica"];
                if (!stranica || isNaN(parseInt(stranica))) {
                    odgovor.status(422);
                    odgovor.send({ greska: "neočekivani podaci" });
                }
                else {
                    this.tmdbdao.dajSveOsobe(parseInt(stranica)).then((rezultat) => {
                        if (rezultat) {
                            odgovor.status(200);
                            odgovor.json(rezultat);
                        }
                        else {
                            odgovor.status(400);
                            odgovor.send({ greska: "greska kod dohvacanja osoba" });
                        }
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
    async postOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                console.log(zahtjev.body);
                let podaci = zahtjev.body;
                let rezultat = await this.tmdbdao.dodajOsobu(podaci);
                if (rezultat) {
                    odgovor.status(201);
                    odgovor.send(JSON.stringify({ status: "uspjeh" }));
                }
                else {
                    odgovor.status(400);
                    odgovor.send(JSON.stringify({ greska: "greska kod dodavanja" }));
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
    async putOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async deleteOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async getOsoba(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    this.tmdbdao.dajOsobu(id).then((osoba) => {
                        console.log(osoba);
                        if (osoba) {
                            odgovor.status(200);
                            odgovor.send(JSON.stringify(osoba));
                        }
                        else {
                            odgovor.status(400);
                            odgovor.send({ greska: "trazena osoba ne postoji" });
                        }
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
    async postOsoba(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async putOsoba(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async deleteOsoba(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    let rezultat = this.tmdbdao.obrisiOsobu(id);
                    if (rezultat) {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({ status: "uspjeh" }));
                    }
                    else {
                        odgovor.status(400);
                        odgovor.send(JSON.stringify({ greska: "greska tijekom brisanja" }));
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
    async getOsobaFilm(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    let stranica = zahtjev.query["stranica"];
                    if (!stranica || isNaN(parseInt(stranica))) {
                        odgovor.status(422);
                        odgovor.send({ greska: "neočekivani podaci" });
                    }
                    else {
                        this.tmdbdao.dajOsobaFilmove(id, parseInt(stranica)).then((rezultat) => {
                            if (rezultat) {
                                odgovor.status(200);
                                odgovor.send(JSON.stringify(rezultat));
                            }
                            else {
                                odgovor.status(400);
                                odgovor.send({ greska: "greska kod dohvacanja filmova" });
                            }
                        });
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
    async postOsobaFilm(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async putOsobaFilm(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let osobaId = zahtjev.params["tmdb_id"];
                let filmovi = zahtjev.body;
                if (!osobaId || !filmovi || !Array.isArray(filmovi)) {
                    odgovor.status(422);
                    let poruka = { greska: "neocekivani podaci" };
                    odgovor.send(JSON.stringify(poruka));
                }
                else {
                    let rezultat = this.tmdbdao.azurirajOsobaFilmove(parseInt(osobaId), filmovi);
                    if (rezultat) {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({ status: "uspjeh" }));
                    }
                    else {
                        odgovor.status(400);
                        odgovor.send(JSON.stringify({ greska: "greska kod azuriranja" }));
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
    async deleteOsobaFilm(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    let rezultat = this.tmdbdao.obrisiOsobaFilmove(parseInt(id));
                    if (rezultat) {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({ status: "uspjeh" }));
                    }
                    else {
                        odgovor.status(400);
                        odgovor.send(JSON.stringify({ greska: "greska tijekom brisanja" }));
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
    async getFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let stranica = zahtjev.query["stranica"];
                if (!stranica || isNaN(parseInt(stranica))) {
                    odgovor.status(422);
                    odgovor.send({ greska: "neočekivani podaci" });
                }
                else {
                    let datumOd = zahtjev.query["datumOd"];
                    let datumDo = zahtjev.query["datumDo"];
                    let stranica = parseInt(zahtjev.query["stranica"] || "1") || 1;
                    let datumOdMs = datumOd ? parseInt(datumOd) : undefined;
                    let datumDoMs = datumDo ? parseInt(datumDo) : undefined;
                    this.tmdbdao.dajSveFilmove(stranica, datumOdMs, datumDoMs).then((rezultat) => {
                        if (rezultat) {
                            odgovor.status(200);
                            odgovor.json(rezultat);
                        }
                        else {
                            odgovor.status(400);
                            odgovor.send({ greska: "greska kod dohvacanja osoba" });
                        }
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
    async postFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let podaci = zahtjev.body;
                let rezultat = this.tmdbdao.dodajFilm(podaci);
                if (rezultat) {
                    odgovor.status(201);
                    odgovor.send(JSON.stringify({ status: "uspjeh" }));
                }
                else {
                    odgovor.status(400);
                    odgovor.send(JSON.stringify({ greska: "greska kod dodavanja" }));
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
    async putFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async deleteFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async getFilm(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    this.tmdbdao.dajFilm(id).then((film) => {
                        console.log(film);
                        if (film) {
                            odgovor.status(200);
                            odgovor.send(JSON.stringify(film));
                        }
                        else {
                            odgovor.status(400);
                            odgovor.send({ greska: "dogodila se greska kod dohvacanja filma" });
                        }
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
    async postFilm(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async putFilm(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                odgovor.status(405);
                let poruka = { greska: "zabranjena metoda" };
                odgovor.send(JSON.stringify(poruka));
            }
            else {
                odgovor.status(422);
                odgovor.send({ greska: "nevaljani korisnik u JWT" });
                return;
            }
        }
        return;
    }
    async deleteFilm(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if (korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if (id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id" });
                    return;
                }
                else {
                    let rezultat = this.tmdbdao.obrisiFilm(id);
                    if (rezultat) {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({ status: "uspjeh" }));
                    }
                    else {
                        odgovor.status(400);
                        odgovor.send(JSON.stringify({ greska: "greska tijekom brisanja" }));
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
}
