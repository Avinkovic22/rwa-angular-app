import express from "express";
import cors from "cors";
import sesija from "express-session";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";
import { dajPort, __dirname } from "../zajednicko/esmPomocnik.js";
import { RestTMDB } from "./restTMDB.js";
import { RestKorisnik } from "./restKorisnik.js";
import { RestApp } from "./restApp.js";
import path from "path";

const server = express();
let konfiguracija = new Konfiguracija();

let port = dajPort("avinkovic22");
if(process.argv[3] != undefined) {
    port = process.argv[3];
}

konfiguracija.ucitajKonfiguraciju()
    .then(pokreniServer)
    .catch((greska : Error | any) => {
        if(process.argv.length == 2) {
            console.error("Potrebno je dati naziv datoteke konfiguracije!");
        }
        else if(greska.path != undefined) {
            console.error("Nije moguće otvoriti datoteku konfiguracije!");
        }
        else console.error(greska.message);
        process.exit();
});

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(
	cors({
		origin: function (origin, povratniPoziv) {
			console.log(origin);
			if(
				!origin ||
				origin.startsWith("http://spider.foi.hr:") ||
				origin.startsWith("http://localhost:")
			) {
				povratniPoziv(null, true);
			} else {
				povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));
			}
		},
		optionsSuccessStatus: 200,
	})
);

function pokreniServer() {
	server.use(
		sesija({
			secret: konfiguracija.dajKonfiguraciju().tajniKljucSesija,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 3 },
			resave: false,
		})
	);
	
	pripremiPutanjeResursTMDB();
	pripremiPutanjeResursKorisnika();
	pripremiPutanjeAplikacija();

	server.use("/dokumentacija-resursi", express.static(path.join(__dirname(), "../../dokumentacija")));

	server.use(express.static(path.join(__dirname(), "../../angular/browser")));
	server.get("*", (zahtjev, odgovor) => {
		odgovor.sendFile(path.join(__dirname(), "../../angular/browser/index.html"));
	});

    server.use((zahtjev, odgovor) => {
		odgovor.status(404);
		var poruka = { greska: "nepostojeći resurs" };
		odgovor.send(JSON.stringify(poruka));
	});

    server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});
}

function pripremiPutanjeAplikacija() {
	let restApp = new RestApp(konfiguracija.dajKonfiguraciju().jwtTajniKljuc, 
    konfiguracija.dajKonfiguraciju().tmdbApiKeyV3, konfiguracija.dajKonfiguraciju().jwtValjanost);

	server.post("/servis/app/registracija", restApp.registracija.bind(restApp));

	server.post("/servis/app/prijava", restApp.prijava.bind(restApp));

    server.get("/servis/app/osobe", restApp.getOsobe.bind(restApp));

    server.get("/servis/app/detaljiosobe/:id", restApp.getDetaljeOsobe.bind(restApp));

    server.get("/servis/app/osobafilmovi/:id", restApp.getOsobaFilmovi.bind(restApp));

	server.get("/servis/app/osobaslike/:id", restApp.getOsobaSlike.bind(restApp));

    server.get("/servis/app/korisnici", restApp.getKorisnici.bind(restApp));

	server.get("/servis/app/korisnici/:korime", restApp.getKorisnik.bind(restApp));

    server.delete("/servis/app/korisnici/:korime", restApp.deleteKorisnici.bind(restApp));

    server.put("/servis/app/korisnici/prava/:korime", restApp.putKorisniciPrava.bind(restApp));

    server.put("/servis/app/korisnici/zahtjev/:korime", restApp.putKorisniciZahtjev.bind(restApp));
}

function pripremiPutanjeResursKorisnika() {
	let restKorisnik = new RestKorisnik(konfiguracija.dajKonfiguraciju()["jwtTajniKljuc"]);

	server.get("/servis/korisnici", restKorisnik.getKorisnici.bind(restKorisnik));
	server.post("/servis/korisnici", restKorisnik.postKorisnici.bind(restKorisnik));
	server.put("/servis/korisnici", restKorisnik.putKorisnici.bind(restKorisnik));
	server.delete("/servis/korisnici", restKorisnik.deleteKorisnici.bind(restKorisnik));

	server.get("/servis/korisnici/:korime", restKorisnik.getKorisnik.bind(restKorisnik));
	server.post("/servis/korisnici/:korime", restKorisnik.postKorisnik.bind(restKorisnik));
	server.put("/servis/korisnici/:korime", restKorisnik.putKorisnik.bind(restKorisnik));
	server.delete("/servis/korisnici/:korime", restKorisnik.deleteKorisnik.bind(restKorisnik));
}

function pripremiPutanjeResursTMDB() {
	let restTMDB = new RestTMDB(
		konfiguracija.dajKonfiguraciju()["tmdbApiKeyV3"],
		konfiguracija.dajKonfiguraciju()["jwtTajniKljuc"]
	);

	server.get("/servis/osoba", restTMDB.getOsobe.bind(restTMDB));
	server.post("/servis/osoba", restTMDB.postOsobe.bind(restTMDB));
	server.put("/servis/osoba", restTMDB.putOsobe.bind(restTMDB));
	server.delete("/servis/osoba", restTMDB.deleteOsobe.bind(restTMDB));

	server.get("/servis/osoba/:tmdb_id", restTMDB.getOsoba.bind(restTMDB));
	server.post("/servis/osoba/:tmdb_id", restTMDB.postOsoba.bind(restTMDB));
	server.put("/servis/osoba/:tmdb_id", restTMDB.putOsoba.bind(restTMDB));
	server.delete("/servis/osoba/:tmdb_id", restTMDB.deleteOsoba.bind(restTMDB));

	server.get("/servis/osoba/:tmdb_id/film", restTMDB.getOsobaFilm.bind(restTMDB));
	server.post("/servis/osoba/:tmdb_id/film", restTMDB.postOsobaFilm.bind(restTMDB));
	server.put("/servis/osoba/:tmdb_id/film", restTMDB.putOsobaFilm.bind(restTMDB));
	server.delete("/servis/osoba/:tmdb_id/film", restTMDB.deleteOsobaFilm.bind(restTMDB));

	server.get("/servis/film", restTMDB.getFilmovi.bind(restTMDB));
	server.post("/servis/film", restTMDB.postFilmovi.bind(restTMDB));
	server.put("/servis/film", restTMDB.putFilmovi.bind(restTMDB));
	server.delete("/servis/film", restTMDB.deleteFilmovi.bind(restTMDB));

	server.get("/servis/film/:tmdb_id", restTMDB.getFilm.bind(restTMDB));
	server.post("/servis/film/:tmdb_id", restTMDB.postFilm.bind(restTMDB));
	server.put("/servis/film/:tmdb_id", restTMDB.putFilm.bind(restTMDB));
	server.delete("/servis/film/:tmdb_id", restTMDB.deleteFilm.bind(restTMDB));
}
