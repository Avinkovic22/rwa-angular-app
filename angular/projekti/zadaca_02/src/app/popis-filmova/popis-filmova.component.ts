import { Component } from '@angular/core';
import { FilmTmdbI } from '../servisi/FilmoviTmdbI';
import { FilmoviService } from '../servisi/filmovi.service';

@Component({
  selector: 'app-popis-filmova',
  standalone: false,
  
  templateUrl: './popis-filmova.component.html',
  styleUrl: './popis-filmova.component.scss'
})
export class PopisFilmovaComponent {
  datumOd: string = "";
  datumDo: string = "";
  filmovi = new Array<FilmTmdbI>;
  trenutnaStranica: number = 1;
  ukupnoStranica: number = 1;
  greska: string = "";

  constructor(private filmoviServis: FilmoviService) {
  }

  ngOnInit(): void {
    this.ucitajStranicu(this.trenutnaStranica);
  }

  async ucitajStranicu(stranica: number) {
    this.trenutnaStranica = stranica;
    try {
      await this.filmoviServis.osvjeziFilmove(stranica, this.datumOd, this.datumDo).then(() => {
        this.filmovi = this.filmoviServis.dajFilmove();
        this.ukupnoStranica = this.filmoviServis.dajUkupnoStranica();
      });
    }
    catch(greska) {
      if(greska instanceof Error) {
        this.greska = greska.message;
      }
    }
  }

  sljedecaStranica(): void {
    if(this.trenutnaStranica < this.ukupnoStranica) {
      this.ucitajStranicu(this.trenutnaStranica + 1);
    }
  }

  prethodnaStranica(): void {
    if(this.trenutnaStranica > 1) {
      this.ucitajStranicu(this.trenutnaStranica - 1);
    }
  }
}
