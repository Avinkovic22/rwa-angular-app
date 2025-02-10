import { Request, Response } from "express";
import { TmdbDAO } from "./tmbdDAO.js";
import { FilmoviTmdbI, OsobeTmdbI } from "../zajednicko/tmbdI.js";
import * as jwt from "../zajednicko/jwt.js";
import { ServisPravaDAO } from "./ServisPravaDAO.js";

export class RestTMDB {
    private tajniKljucJWT : string;
    private tmdbdao;
    private spdao;

    constructor(api_kljuc : string, tajniKljucJWT : string) {
        this.tajniKljucJWT = tajniKljucJWT;
        this.tmdbdao = new TmdbDAO();
        this.spdao = new ServisPravaDAO();
    }

    async provjeriKorisnika(korime: string) {
        let r = await this.spdao.daj(korime);
        if(r && Array.isArray(r) && r.length) {
            return true;
        }
        else {
            return false;
        }
    }

    async getOsobe(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let stranica = zahtjev.query["stranica"] as string;
                if(!stranica || isNaN(parseInt(stranica))) {
                    odgovor.status(422);
                    odgovor.send({ greska: "neočekivani podaci"});
                }
                else {
                    this.tmdbdao.dajSveOsobe(parseInt(stranica)).then((rezultat : OsobeTmdbI) => {
                        if(rezultat) {
                            odgovor.status(200);
                            odgovor.json(rezultat);
                        }
                        else {
                            odgovor.status(400);
                            odgovor.send({ greska: "greska kod dohvacanja osoba"});
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

    async postOsobe(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                console.log(zahtjev.body);
                let podaci = zahtjev.body;
                let rezultat = await this.tmdbdao.dodajOsobu(podaci);
                if(rezultat) {
                    odgovor.status(201);
                    odgovor.send(JSON.stringify({ status : "uspjeh" }));
                }
                else {
                    odgovor.status(400);
                    odgovor.send(JSON.stringify({ greska : "greska kod dodavanja" }));
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

    async putOsobe(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async deleteOsobe(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async getOsoba(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if(id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id"});
                    return;
                }
                else {
                    this.tmdbdao.dajOsobu(id).then((osoba) => {
                        console.log(osoba);
                        if(osoba) {
                            odgovor.status(200);
                            odgovor.send(JSON.stringify(osoba));
                        }
                        else {
                            odgovor.status(400);
                            odgovor.send({ greska: "trazena osoba ne postoji"});
                        }
                    })
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

    async postOsoba(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async putOsoba(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async deleteOsoba(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if(id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id"});
                    return;
                }
                else {
                    let rezultat = this.tmdbdao.obrisiOsobu(id);
                    if(rezultat) {
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

    async getOsobaFilm(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if(id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id"});
                    return;
                }
                else {
                    let stranica = zahtjev.query["stranica"] as string;
                    if(!stranica || isNaN(parseInt(stranica))) {
                        odgovor.status(422);
                        odgovor.send({ greska: "neočekivani podaci"});
                    }
                    else {
                        this.tmdbdao.dajOsobaFilmove(id, parseInt(stranica)).then((rezultat : FilmoviTmdbI) => {
                            if(rezultat) {
                                odgovor.status(200);
                                odgovor.send(JSON.stringify(rezultat));
                            }
                            else {
                                odgovor.status(400);
                                odgovor.send({ greska: "greska kod dohvacanja filmova"});
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

    async postOsobaFilm(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async putOsobaFilm(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let osobaId = zahtjev.params["tmdb_id"];
                let filmovi = zahtjev.body;
                if(!osobaId || !filmovi || !Array.isArray(filmovi)) {
                    odgovor.status(422);
                    let poruka = { greska: "neocekivani podaci" };
                    odgovor.send(JSON.stringify(poruka));
                }
                else {
                    let rezultat = this.tmdbdao.azurirajOsobaFilmove(parseInt(osobaId), filmovi);
                    if(rezultat) {
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

    async deleteOsobaFilm(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if(id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id"});
                    return;
                }
                else {
                    let rezultat = this.tmdbdao.obrisiOsobaFilmove(parseInt(id));
                    if(rezultat) {
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

    async getFilmovi(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let stranica = zahtjev.query["stranica"] as string;
                if(!stranica || isNaN(parseInt(stranica))) {
                    odgovor.status(422);
                    odgovor.send({ greska: "neočekivani podaci"});
                }
                else {
                    let datumOd = zahtjev.query["datumOd"] as string | undefined;
                    let datumDo = zahtjev.query["datumDo"] as string | undefined;
                    let stranica = parseInt(zahtjev.query["stranica"] as string || "1") || 1;
                    let datumOdMs = datumOd ? parseInt(datumOd) : undefined;
                    let datumDoMs = datumDo ? parseInt(datumDo) : undefined;

                    this.tmdbdao.dajSveFilmove(stranica, datumOdMs, datumDoMs).then((rezultat : FilmoviTmdbI) => {
                        if(rezultat) {
                            odgovor.status(200);
                            odgovor.json(rezultat);
                        }
                        else {
                            odgovor.status(400);
                            odgovor.send({ greska: "greska kod dohvacanja osoba"});
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

    async postFilmovi(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let podaci = zahtjev.body;
                let rezultat = this.tmdbdao.dodajFilm(podaci);
                if(rezultat) {
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

    async putFilmovi(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async deleteFilmovi(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async getFilm(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if(id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id"});
                    return;
                }
                else {
                    this.tmdbdao.dajFilm(id).then((film) => {
                        console.log(film);
                        if(film) {
                            odgovor.status(200);
                            odgovor.send(JSON.stringify(film));
                        }
                        else {
                            odgovor.status(400);
                            odgovor.send({ greska: "dogodila se greska kod dohvacanja filma"});
                        }
                    })
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

    async postFilm(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async putFilm(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
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

    async deleteFilm(zahtjev : Request, odgovor : Response) {
        odgovor.type("application/json");
        let tokenValjani = jwt.provjeriToken(zahtjev, this.tajniKljucJWT);
        if(!tokenValjani) {  
            odgovor.status(406);  
            odgovor.send({ greska: "JWT nije prihvacen" });
            return; 
        }

        let token = jwt.dajToken(zahtjev);
        if(token != null) {
            let tijelo = jwt.dajTijelo(token);
            let korisnikPostoji = await this.provjeriKorisnika(tijelo.korime);
            if(korisnikPostoji) {
                let id = zahtjev.params["tmdb_id"];
                if(id == undefined || isNaN(parseInt(id))) {
                    odgovor.status(400);
                    odgovor.send({ greska: "nepostojeci id"});
                    return;
                }
                else {
                    let rezultat = this.tmdbdao.obrisiFilm(id);
                    if(rezultat) {
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