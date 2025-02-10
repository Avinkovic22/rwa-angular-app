export class TMDBklijent {
    bazicniURL = "https://api.themoviedb.org/3";
    apiKljuc;
    constructor(apiKljuc) {
        this.apiKljuc = apiKljuc;
    }
    async pretraziOsobePoNazivu(trazi, stranica) {
        let resurs = "/search/person";
        let parametri = { language: "en-US",
            include_adult: false,
            page: stranica,
            query: trazi };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor);
    }
    async dohvatiSlikeOsobe(idOsobe) {
        let resurs = `/person/${idOsobe}/images`;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async dajDetaljeOsobe(id) {
        let resurs = "/person/" + id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async dajFilmoveOsobe(id) {
        let resurs = "/person/" + id + "/movie_credits";
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async obaviZahtjev(resurs, parametri = {}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        for (let p in parametri) {
            zahtjev += "&" + p + "=" + parametri[p];
        }
        console.log(zahtjev);
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
}
