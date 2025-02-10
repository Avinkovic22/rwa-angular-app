import { Component } from '@angular/core';
import { KorisnikI } from '../servisi/KorisnikI';
import { KorisniciService } from '../servisi/korisnici.service';

@Component({
  selector: 'app-popis-korisnika',
  standalone: false,
  
  templateUrl: './popis-korisnika.component.html',
  styleUrl: './popis-korisnika.component.scss'
})
export class PopisKorisnikaComponent {
  korisnici: KorisnikI[] = [];
  trenutniKorisnik: string | null = null;

  constructor(private korisniciServis: KorisniciService) {

  }

  async ngOnInit() {
    this.korisnici = (await this.korisniciServis.dajKorisnike()).korisnici;
    this.trenutniKorisnik = (await this.korisniciServis.dajKorisnike()).trenutni;
  }

  async dajPrava(korime: string) {
    await this.korisniciServis.dajPrava(korime);
    this.korisnici = (await this.korisniciServis.dajKorisnike()).korisnici;
  }

  async makniPrava(korime: string) {
    await this.korisniciServis.makniPrava(korime);
    this.korisnici = (await this.korisniciServis.dajKorisnike()).korisnici;
  }

  async izbrisiKorisnika(korime: string) {
    if(confirm(`Jeste sigurni da želite izbrisati korisnika ${korime}?`)) {
      await this.korisniciServis.izbrisiKorisnika(korime);
      this.korisnici = (await this.korisniciServis.dajKorisnike()).korisnici;
    }
    else {
      return;
    }
  }
}
