import { ServisPravaDAO } from "./ServisPravaDAO.js";
import * as jwt from "../zajednicko/jwt.js";
export class RestKorisnik {
    spdao;
    tajniKljucJWT;
    constructor(tajniKljucJWT) {
        this.spdao = new ServisPravaDAO();
        this.tajniKljucJWT = tajniKljucJWT;
    }
    async getKorisnici(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
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
    async postKorisnici(zahtjev, odgovor) {
        odgovor.type("json");
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
                let jeAdmin = await this.provjeriKorisnikaIAdmina(tijelo.korime);
                if (jeAdmin) {
                    let { korime, tip_korisnika_id } = zahtjev.body;
                    if (!korime || typeof tip_korisnika_id !== "number") {
                        odgovor.status(400);
                        odgovor.send({ greska: "neočekivani podaci" });
                    }
                    let rezultat = this.spdao.dodaj({ korime, tip_korisnika_id });
                    if (rezultat) {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({ status: "uspjeh" }));
                    }
                    else {
                        odgovor.status(400);
                        odgovor.send(JSON.stringify({ greska: "dodavanje korisnika nije uspjelo" }));
                    }
                }
                else {
                    odgovor.status(403);
                    odgovor.send({ greska: "zabranjen pristup" });
                    return;
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
    async putKorisnici(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
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
    async deleteKorisnici(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
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
    async getKorisnik(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
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
    async postKorisnik(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
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
    async putKorisnik(zahtjev, odgovor) {
        odgovor.type("json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if (!tokenValjani) {
            odgovor.status(406);
            odgovor.send({ greska: "JWT nije prihvacen" });
            return;
        }
        let token = jwt.dajToken(zahtjev);
        if (token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnikaIAdmina(tijelo.korime);
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
    async deleteKorisnik(zahtjev, odgovor) {
        odgovor.type("json");
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
                let jeAdmin = await this.provjeriKorisnikaIAdmina(tijelo.korime);
                if (jeAdmin) {
                    let korime = zahtjev.params["korime"];
                    if (!korime) {
                        odgovor.status(400);
                        odgovor.send({ greska: "neočekivani podaci" });
                        return;
                    }
                    else {
                        let rezultat = this.spdao.obrisi(korime);
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
                    odgovor.status(403);
                    odgovor.send({ greska: "zabranjen pristup" });
                    return;
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
    async provjeriKorisnika(korime) {
        let r = await this.spdao.daj(korime);
        if (r && Array.isArray(r) && r.length) {
            return true;
        }
        else {
            return false;
        }
    }
}
