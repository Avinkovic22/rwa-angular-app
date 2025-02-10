import { FilmApiTmdbI, GalerijaSlikaOsobeTmdbI, OsobaApiTmdbI, OsobeApiTmdbI } from "../zajednicko/tmbdI.js";

export class TMDBklijent {
    private bazicniURL = "https://api.themoviedb.org/3";
    private apiKljuc : string;

    constructor(apiKljuc : string) {
        this.apiKljuc = apiKljuc;
    }

    public async pretraziOsobePoNazivu(trazi : string, stranica : number){
        let resurs = "/search/person";
        let parametri = {language: "en-US",
                         include_adult: false,
                         page: stranica,
                         query: trazi};
 
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor) as OsobeApiTmdbI;
    }

    public async dohvatiSlikeOsobe(idOsobe: number) {
        let resurs = `/person/${idOsobe}/images`;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor) as GalerijaSlikaOsobeTmdbI;
    }

    public async dajDetaljeOsobe(id : number){
        let resurs = "/person/" + id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor) as OsobaApiTmdbI;
    }

    public async dajFilmoveOsobe(id : number) {
        let resurs = "/person/" + id + "/movie_credits";
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor) as Array<FilmApiTmdbI>;
    }

    private async obaviZahtjev(resurs : string, parametri : {[kljuc : string] : string | number | boolean}={}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        for(let p in parametri) {
            zahtjev += "&" + p + "=" + parametri[p];
        }
        console.log(zahtjev);
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
}