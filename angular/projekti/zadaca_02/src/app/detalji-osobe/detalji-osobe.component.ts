import { Component } from '@angular/core';
import { OsobeService } from '../servisi/osobe.service';
import { ActivatedRoute } from '@angular/router';
import { GalerijaSlikaOsobeTmdbI, OsobaTmdbI, SlikaOsobeTmdbI } from '../servisi/OsobeTmdbI';
import { FilmTmdbI } from '../servisi/FilmoviTmdbI';
import { KorisniciService } from '../servisi/korisnici.service';
import { FilmoviService } from '../servisi/filmovi.service';

@Component({
  selector: 'app-detalji-osobe',
  standalone: false,
  
  templateUrl: './detalji-osobe.component.html',
  styleUrl: './detalji-osobe.component.scss'
})
export class DetaljiOsobeComponent {
  osoba: OsobaTmdbI | null = null;
  osobaFilmovi: FilmTmdbI[] = [];
  slikeOsobe: SlikaOsobeTmdbI[] = [];
  trenutnaStranica: number = 1;
  ukupnoStranica: number = 1;
  osobaId!: number;
  greska: string = "";

  constructor(private osobeServis: OsobeService, private filmoviServis: FilmoviService, private activatedRoute: ActivatedRoute) {
    activatedRoute.paramMap.subscribe((params) => {
      let osobaId = params.get('id');
      if(osobaId != null) {
        this.osobaId = parseInt(osobaId);
        this.dohvatiDetaljeOsobe();
      }
    })
  }

  async dohvatiDetaljeOsobe() {
    try {
      this.osoba = await this.osobeServis.dajOsobu(this.osobaId);
      this.osvjeziFilmoveOsobe();
      this.slikeOsobe = await this.osobeServis.dajSlikeOsobe(this.osoba?.tmdb_id_osoba);
    }
    catch(greska) {
      if(greska instanceof Error) {
        this.greska = greska.message;
      }
    }
  }

  async osvjeziFilmoveOsobe() {
    await this.filmoviServis.osvjeziFilmoveOsoba(this.osobaId, this.trenutnaStranica).then(() => {
      this.osobaFilmovi = this.osobaFilmovi.concat(this.filmoviServis.dajFilmoveOsoba());
      this.ukupnoStranica = this.filmoviServis.dajUkupnoStranica();
    });
  }

  ucitajJosFilmova() {
    this.trenutnaStranica += 1;
    this.osvjeziFilmoveOsobe();
  }

}
