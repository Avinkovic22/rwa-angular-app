import { Component } from '@angular/core';
import { OsobaTmdbI } from '../servisi/OsobeTmdbI';
import { OsobeService } from '../servisi/osobe.service';

@Component({
  selector: 'app-popis-osoba',
  standalone: false,
  
  templateUrl: './popis-osoba.component.html',
  styleUrl: './popis-osoba.component.scss'
})
export class PopisOsobaComponent {
  osobe: Array<OsobaTmdbI> = [];
  greska: string = "";
  ukupnoStranica: number = 1;
  prikazaneOsobe: Array<OsobaTmdbI> = [];
  trenutnaStranica: number = 1;
  trenutnaStranicaRest: number = 1;
  brojOsobaPoStranici: number = 10;

  constructor(private osobeServis: OsobeService) {
  }

  ngOnInit(): void {
    this.ucitajStranicu(this.trenutnaStranicaRest);
  }

  async ucitajStranicu(stranica: number) {
    try {
      await this.osobeServis.osvjeziOsobe(stranica).then(() => {
        this.osobe = this.osobe.concat(this.osobeServis.dajOsobe());
        let ukupnoRezultata = this.osobeServis.dajUkupnoRezultata();
        this.ukupnoStranica = Math.ceil(ukupnoRezultata / this.brojOsobaPoStranici);
        this.azurirajOsobe();
      });
    }
    catch(greska) {
      if(greska instanceof Error) {
        this.greska = greska.message;
      }
    }
  }

  azurirajOsobe() {
    let pocetak = (this.trenutnaStranica - 1) * this.brojOsobaPoStranici;
    let kraj = pocetak + this.brojOsobaPoStranici;
    let potrebnaStranica = Math.ceil(kraj / 20);
  
    if(kraj > this.osobe.length && this.osobe.length < this.osobeServis.dajUkupnoRezultata()) {
      if(potrebnaStranica > this.trenutnaStranicaRest) {
        this.trenutnaStranicaRest = potrebnaStranica;
        this.ucitajStranicu(this.trenutnaStranicaRest).then(() => this.azurirajOsobe());
        return; 
      }
    }
  
    this.prikazaneOsobe = this.osobe.slice(pocetak, kraj);
  }
  

  promijeniStranicu(stranica: number) {
    if(stranica >= 1 && stranica <= this.ukupnoStranica) {
      this.trenutnaStranica = stranica;
      this.azurirajOsobe();
    }
  }

  promijeniBrojOsoba(brojOsoba: number) {
    this.trenutnaStranica = 1;
    this.brojOsobaPoStranici = brojOsoba;
    this.ukupnoStranica = Math.ceil(this.osobeServis.dajUkupnoRezultata() / this.brojOsobaPoStranici);
    this.azurirajOsobe();
  }
}
