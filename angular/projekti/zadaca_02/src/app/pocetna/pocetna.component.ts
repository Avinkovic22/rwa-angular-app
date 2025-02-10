import { Component } from '@angular/core';
import { KorisniciService } from '../servisi/korisnici.service';
import { KorisnikI } from '../servisi/KorisnikI';

@Component({
  selector: 'app-pocetna',
  standalone: false,
  
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.scss'
})
export class PocetnaComponent {
  korisnik!: KorisnikI;

  constructor(private korisniciServis: KorisniciService) {
  }

  async ngOnInit() {
    this.korisnik = await this.korisniciServis.dajKorisnika();
  }

  async posaljiZahtjev(korime: string) {
    await this.korisniciServis.posaljiZahtjev(korime);
    this.korisnik = await this.korisniciServis.dajKorisnika();
  }
}
