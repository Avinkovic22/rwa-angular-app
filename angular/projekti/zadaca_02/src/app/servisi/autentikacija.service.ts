import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikRegI } from './KorisnikI';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutentikacijaService {
  restServis: string = environment.restServis;

  constructor() { }

  prijava(korime: string, lozinka: string): Promise<any> {
    const tijelo = JSON.stringify({ korime, lozinka });
    return fetch(this.restServis + 'app/prijava', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: tijelo,
    })
    .then(odgovor => odgovor.json())
    .then(podaci => {
      if(podaci.token) {
        localStorage.setItem('jwt', podaci.token);
        return true;
      }
      else {
        throw new Error('Netočni podaci!');
      }
    })
    .catch(greska => {
      console.error('Greska kod prijave:', greska);
      throw greska;
    });
  }

  prijavljen(): boolean {
    const token = localStorage.getItem('jwt');
    if(!token) {
      return false;
    }

    let sadrzajTokena = JSON.parse(atob(token.split('.')[1]));
    let trenutnoVrijeme = Math.floor(Date.now() / 1000);
    if(sadrzajTokena.exp > trenutnoVrijeme) {
      return true;
    }
    else {
      localStorage.removeItem('jwt');
      return false;
    }
  }

  odjava() {
    localStorage.removeItem('jwt');
  }

  async registracija(korisnik: KorisnikRegI): Promise<any> {
    const tijelo = JSON.stringify({ korisnik });
    return fetch(this.restServis + 'app/registracija', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: tijelo,
    })
    .then(odgovor => {
      if (odgovor.status === 201) {
          return true;
      }
      else {
        return false;
      }
    });
  }
}
