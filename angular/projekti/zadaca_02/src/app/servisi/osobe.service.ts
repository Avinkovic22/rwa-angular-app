import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GalerijaSlikaOsobeTmdbI, OsobaApiTmdbI, OsobaTmdbI, OsobeApiTmdbI, OsobeTmdbI } from './OsobeTmdbI';
import { FilmApiTmdbI, FilmoviTmdbI, FilmTmdbI } from './FilmoviTmdbI';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OsobeService {
  restServis: string = environment.restServis;
  osobeRezultati!: OsobeTmdbI;
  osobe = new Array<OsobaTmdbI>;
  osobeTmdbRezultati!: OsobeApiTmdbI;
  osobeTmdb = new Array<OsobaApiTmdbI>
  ukupnoStranica: number = 1;

  constructor(private router: Router) { 
  }

  async osvjeziOsobe(stranica: number) {
    let parametri = '?stranica=' + stranica;
    let o = (await fetch(
      this.restServis + 'osoba' + parametri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })) as Response;
    if(o.status == 406 || o.status == 422) {
      this.router.navigate(['/']);
    }
    else if(o.status == 200) {
      let r = JSON.parse(await o.text()) as OsobeTmdbI;
      this.osobeRezultati = r;
      this.osobe = r.rezultati;
      this.ukupnoStranica = r.ukupnoStranica || 1;
    }
    else {
      throw new Error('Došlo je do pogreške!');
    }
  }

  dajUkupnoRezultata() {
    return this.osobeRezultati.ukupnoRezultata;
  }

  dajOsobe(): Array<OsobaTmdbI> {
    return this.osobe;
  }

  async dajOsobu(id: number) {
    let o = (await fetch(
      this.restServis + 'osoba/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })) as Response;
    if(o.status == 406 || o.status == 422) {
      this.router.navigate(['/']);
      return null;
    }
    else if(o.status == 200) {
      let r = JSON.parse(await o.text()) as OsobaTmdbI;
      return r;
    }
    else {
      throw new Error('Došlo je do pogreške!');
    }
  }

  async dajSlikeOsobe(id: number | undefined) {
    let o = (await fetch(
      this.restServis + 'app/osobaslike/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })) as Response;
    
    if(o.status == 406 || o.status == 422) {
      this.router.navigate(['/']);
      return [];
    }
    else if(o.status == 200) {
      let r = JSON.parse(await o.text()) as GalerijaSlikaOsobeTmdbI;
      return r.profiles;
    }
    else {
      return [];
    }
  }

  dajOsobePoNazivu(): Array<OsobaApiTmdbI> {
    return this.osobeTmdb;
  }

  dajUkupnoStranica(): number {
    return this.ukupnoStranica;
  }

  async traziOsobePoNazivu(naziv: string, stranica: number) {
    console.log(this.restServis + "app/osobe?stranica=" + stranica + "&trazi=" + naziv);
    let o = (await fetch(this.restServis + "app/osobe?stranica=" + stranica + "&trazi=" + naziv, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })) as Response;
    if(o.status == 406 || o.status == 422) {
      this.router.navigate(['/']);
    }
    else if(o.status == 200) {
      let r = JSON.parse(await o.text()) as OsobeApiTmdbI;;
      this.osobeTmdbRezultati = r;
      this.osobeTmdb = r.results;
      this.osobeTmdb.map(async osoba => {
        let postoji = await this.provjeriPostojanjeOsobe(osoba.id);
        if(postoji) {
          osoba.exists = true;
        }
        else {
          osoba.exists = false;
        }
      })
      this.ukupnoStranica = r.total_pages || 1;
    }
    else {
      throw new Error('Došlo je do pogreške!');
    }
  }

  async provjeriPostojanjeOsobe(tmbdIdOsobe: number) {
    let o = await fetch(this.restServis + "osoba/" + tmbdIdOsobe, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    if(o.status == 200) {
      return true;
    }
    else if(o.status == 400) {
      return false;
    }
    else {
      throw new Error('Došlo je do pogreške!');
    }
  }

  async dohvatiDetaljeOsobe(idOsobe: number) {
    let o = await fetch(this.restServis + "app/detaljiosobe/" + idOsobe, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    if(o.status == 406 || o.status == 422) {
      this.router.navigate(['/']);
    }
    else if(o.status == 200) {
      let podaci = await o.json();
      return podaci;
    }
    else {
      throw new Error('Došlo je do pogreške!');
    }
  }

  async dodajOsobu(detalji: OsobaApiTmdbI) {
    let tijeloOsoba = {
        "ime": detalji.name,
        "poznat_po": detalji.known_for_department,
        "popularnost": detalji.popularity,
        "profilna_slika": detalji.profile_path,
        "tmdb_id_osoba": detalji.id,
        "biografija": detalji.biography,
        "datum_rodenja": detalji.birthday,
        "datum_smrti": detalji.deathday,
        "spol": detalji.gender
    };

    let parametriOsoba = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(tijeloOsoba)
    };

    let o = await fetch(this.restServis + "osoba", parametriOsoba);
    if(o.status === 201) {
        console.log("Osoba dodana u bazu!");
        return true;
    } else {
        console.error("Greška u dodavanju osobe!");
        return false;
    }
  }

  async dohvatiFilmoveOsobe(idOsobe: number) {
    let o = await fetch(this.restServis + "app/osobafilmovi/" + idOsobe, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    if(o.status == 406 || o.status == 422) {
      this.router.navigate(['/']);
    }
    else if(o.status == 200) {
      let podaci = await o.json();
      return podaci;
    }
    else {
      throw new Error('Došlo je do pogreške!');
    }
  }

  async dodajFilmove(filmovi: Array<FilmTmdbI>) {
    let filmPromise = filmovi.map(film => {
        let parametri = {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify(film)
        };
        return fetch(this.restServis + "film", parametri).then(odgovor => {
            if(odgovor.status === 201) {
                console.log(`Film dodan u bazu! ID: ${film.tmdb_id_film}`);
            } else {
                console.log(`Greška u dodavanju filma! ID: ${film.tmdb_id_film}`);
            }
        });
    });

    await Promise.all(filmPromise);
  }

  async poveziOsobaFilmovi(id: number, filmovi: Array<FilmTmdbI>) {
    let parametri = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(filmovi)
    };
    let osobaFilmRezultat = await fetch(this.restServis + "osoba/" + id + "/film", parametri);
    if(osobaFilmRezultat.status === 201) {
        console.log("Osoba i filmovi povezani!");
        return true;
    } else {
        console.log("Greška u povezivanju osobe i filmova!");
        return false;
    }
  }

  async dodajUBazu(idOsobe: number) {
    try {
      let detalji = await this.dohvatiDetaljeOsobe(idOsobe);
      if(detalji) {
          let osobaRezultat = await this.dodajOsobu(detalji);
          if(!osobaRezultat) {
              throw new Error("Greška u dodavanju osobe!");
          }
          let filmoviOsoba = await this.dohvatiFilmoveOsobe(idOsobe);
          let straniceniFilmovi = filmoviOsoba.cast.slice(0, 25);
          let filmovi = straniceniFilmovi.map((f: FilmApiTmdbI) => ({
              naslov: f.title,
              originalni_naslov: f.original_title,
              jezik: f.original_language,
              popularnost: f.popularity,
              poster: f.poster_path,
              datum_izdavanja: f.release_date,
              opis: f.overview,
              odrasli: f.adult ? 1 : 0,
              prosjecna_ocjena: f.vote_average,
              tmdb_id_film: f.id,
              lik: f.character
          }));

          if(filmovi) {
              await this.dodajFilmove(filmovi);
              await this.poveziOsobaFilmovi(idOsobe, filmovi);
          }
      }
    }
    catch (greska) {
      console.error(greska);
      alert("Došlo je do greške!");
    }
  }

  async obrisiOsobuIVeze(idOsoba: number) {
    let parametri = {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    };
    let r = await fetch(this.restServis + "osoba/" + idOsoba, parametri);
    if(r.status === 201) {
        console.log("Osoba obrisana!");
        return true;
    } else {
        console.log("Greška kod brisanja osobe!");
        return false;
    }
  }

  async obrisiFilm(idFilm: number) {
    let parametri = {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    };
    try {
      let o = await fetch(this.restServis + "film/" + idFilm, parametri);
      if(o.status === 201) {
          console.log("Film obrisan! ID: " + idFilm);
          return true;
      } 
      else {
          console.log("Greška kod brisanja filma! ID: " + idFilm);
          return false;
      }
    } 
    catch (greska) {
      console.error("Došlo je do greške:", greska);
      return false;
    }
  }

  async obrisiOsobu(idOsoba: number, filmoviOsobe: Array<FilmTmdbI>) {
    await this.obrisiOsobuIVeze(idOsoba);
    for(let film of filmoviOsobe) {
      await this.obrisiFilm(film.tmdb_id_film);
    }
  }
}
