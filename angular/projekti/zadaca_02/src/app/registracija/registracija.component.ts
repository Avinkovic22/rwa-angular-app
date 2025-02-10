import { Component } from '@angular/core';
import { KorisnikI, KorisnikRegI } from '../servisi/KorisnikI';
import { AutentikacijaService } from '../servisi/autentikacija.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registracija',
  standalone: false,
  
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss'
})
export class RegistracijaComponent {
  ime: string = '';
  prezime: string = '';
  korime: string = '';
  lozinka: string = '';
  email: string = '';
  adresa: string = '';
  telefon: string = '';
  datum_rodenja: string = '';
  poruka: string | null = null;
  regexDatum = /^\d{1,2}\.\d{1,2}\.\d{4}\.$|^$/;
  korisnik!: KorisnikRegI;

  constructor(private autentikacijaServis: AutentikacijaService, private router: Router) {}

  ngOnInit(): void {
    let prijavljen = this.autentikacijaServis.prijavljen();
    if(prijavljen) {
      this.router.navigate(['/']);
    }
  }

  provjeriValidnostDuljine(input: string, max: number, min = 0) {
    if(input.length < min || input.length > max) {
        return false;
    }
    return true;
}

  async onSubmit() {
    if(!this.provjeriValidnostDuljine(this.ime, 50) || !this.provjeriValidnostDuljine(this.prezime, 100) || 
        !this.provjeriValidnostDuljine(this.korime, 50, 1) || !this.provjeriValidnostDuljine(this.lozinka, 100, 1) || 
        !this.provjeriValidnostDuljine(this.email, 100, 1) || !this.provjeriValidnostDuljine(this.adresa, 100) || 
        !this.provjeriValidnostDuljine(this.telefon, 50) || !this.regexDatum.test(this.datum_rodenja)) {
          this.poruka = "Provjerite ispravnost podataka!";
          return; 
        }
    else {
      this.poruka = null;
      this.korisnik = {
        ime: this.ime,
        prezime: this.prezime,
        korime: this.korime,
        lozinka: this.lozinka,
        email: this.email,
        adresa: this.adresa,
        telefon: this.telefon,
        datum_rodenja: this.datum_rodenja
      };

      let uspjeh = await this.autentikacijaServis.registracija(this.korisnik);
      if(uspjeh) {
        this.router.navigate(['/prijava']);
      }
      else {
        this.poruka = 'Registracija korisnika nije uspjela. Pokušajte ponovno.';
      }
    }
  }
}
