import { Component } from '@angular/core';
import { AutentikacijaService } from '../servisi/autentikacija.service';
import { Router } from '@angular/router';

declare var grecaptcha: any;

@Component({
  selector: 'app-prijava',
  standalone: false,
  
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss'
})
export class PrijavaComponent {
  korime: string = '';
  lozinka: string = '';
  poruka: string | null = null;

  constructor(private autentikacijaServis: AutentikacijaService, private router: Router) {}

  ngOnInit(): void {
    let prijavljen = this.autentikacijaServis.prijavljen();
    if(prijavljen) {
      this.router.navigate(['/']);
    }
  }

  prijaviSe() {
    this.autentikacijaServis.prijava(this.korime, this.lozinka)
      .then(odgovor => {
        localStorage.setItem('korime', this.korime);
        this.router.navigate(['/']);
      })
      .catch(greska => {
        this.poruka = 'Dogodila se greška: ' + greska.message;
      });
  }

  onSubmit() {
    if((this.korime.length == 0 || this.korime.length > 50) || (this.lozinka.length == 0 || this.lozinka.length > 50)) {
      this.poruka = "Provjerite ispravnost podataka!";
      return;
    }
    else {
      this.prijaviSe();
    }
  }
}
