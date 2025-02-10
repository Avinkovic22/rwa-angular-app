import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FilmoviTmdbI, FilmTmdbI } from './FilmoviTmdbI';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FilmoviService {
  restServis: string = environment.restServis;
  filmoviRezultati!: FilmoviTmdbI;
  filmovi = new Array<FilmTmdbI>;
  ukupnoStranica: number = 1;

  constructor(private router: Router) { 
  }

  async osvjeziFilmoveOsoba(id: number, stranica: number) {
    let o = (await fetch(
    this.restServis + 'osoba/' + id + '/film?stranica=' + stranica, {
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
      let r = JSON.parse(await o.text()) as FilmoviTmdbI;
      this.filmoviRezultati = r;
      this.filmovi = r.rezultati;
      this.ukupnoStranica = r.ukupnoStranica || 1;
    }
    else {
      throw new Error('Došlo je do pogreške!');
    }
  }

  dajFilmoveOsoba(): Array<FilmTmdbI> {
    return this.filmovi;
  }

  dajUkupnoStranica(): number {
    return this.ukupnoStranica;
  }

  async osvjeziFilmove(stranica: number, datumOd: string, datumDo: string) {
    let parametri = '?stranica=' + stranica;
    if(datumOd !== "" || datumDo !== "") {
      if(datumOd !== "") {
        let datumOdMs = new Date(datumOd).getTime();
        parametri += "&datumOd=" + datumOdMs;
      }
      if(datumDo !== "") {
        let datumDoMs = new Date(datumDo).getTime();
        parametri += "&datumDo=" + datumDoMs;
      }
    }
    let o = (await fetch(
      this.restServis + 'film' + parametri, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
      })) as Response;
      console.log(`Bearer ${localStorage.getItem('jwt')}`);
      if(o.status == 406 || o.status == 422) {
        this.router.navigate(['/']);
      }
      else if(o.status == 200) {
        let r = JSON.parse(await o.text()) as FilmoviTmdbI;
        this.filmoviRezultati = r;
        this.filmovi = r.rezultati;
        this.ukupnoStranica = r.ukupnoStranica || 1;
      }
      else {
        throw new Error('Došlo je do pogreške!');
      }
  }

  dajFilmove(): Array<FilmTmdbI> {
    return this.filmovi;
  }
}
