import { Component } from '@angular/core';
import { OsobeService } from '../servisi/osobe.service';
import { OsobaApiTmdbI, OsobaTmdbI } from '../servisi/OsobeTmdbI';
import { FilmoviService } from '../servisi/filmovi.service';
import { FilmoviTmdbI, FilmTmdbI } from '../servisi/FilmoviTmdbI';

@Component({
  selector: 'app-dodavanje-osoba',
  standalone: false,
  
  templateUrl: './dodavanje-osoba.component.html',
  styleUrl: './dodavanje-osoba.component.scss'
})
export class DodavanjeOsobaComponent {
  trazenaOsoba: string = "";
  osobe = new Array<OsobaApiTmdbI>;
  trenutnaStranica: number = 1;
  ukupnoStranica: number = 1;
  pretrazivanje: boolean = true;

  constructor(private osobeServis: OsobeService, private filmoviServis: FilmoviService) {

  }

  ngOnInit(): void {
    this.osobeServis.traziOsobePoNazivu('---', 1);
  }

  pretraziOsobu() {
    if(this.trazenaOsoba != "") {
      this.ucitajStranicu(1);
    }
    else {
      alert('Polje za pretraživanje ne smije biti prazno!');
    }
  }

  ucitajStranicu(stranica: number): void {
    this.trenutnaStranica = stranica;
    this.pretrazivanje = true;
    this.osobeServis.traziOsobePoNazivu(this.trazenaOsoba, stranica).then(() => {
      this.osobe = this.osobeServis.dajOsobePoNazivu();
      this.ukupnoStranica = this.osobeServis.dajUkupnoStranica();
      this.pretrazivanje = false;
    });
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

  async dodajOsobu(id: number) {
    await this.osobeServis.dodajUBazu(id);
    await this.ucitajStranicu(this.trenutnaStranica);
  }

  async obrisiOsobu(id: number) {
    if(confirm(`Jeste li sigurni da želite izbrisati osobu?`)) {
      await this.filmoviServis.osvjeziFilmoveOsoba(id, 1);
      let filmovi: Array<FilmTmdbI> = this.filmoviServis.dajFilmove();
      let stranice = this.filmoviServis.dajUkupnoStranica();
      let trenutnaStranica = 1;
      if(stranice > 1) {
        while(trenutnaStranica <= stranice) {
          trenutnaStranica++;
          await this.filmoviServis.osvjeziFilmoveOsoba(id, trenutnaStranica);
          filmovi = filmovi.concat(this.filmoviServis.dajFilmove());
        }
      }
      console.log(filmovi);
      await this.osobeServis.obrisiOsobu(id, filmovi);
      await this.ucitajStranicu(this.trenutnaStranica);
    }
    else {
      return;
    }
  }
}
