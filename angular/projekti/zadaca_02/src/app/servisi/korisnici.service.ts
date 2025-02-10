import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { KorisnikI } from './KorisnikI';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KorisniciService {
  restServis: string = environment.restServis;

  constructor(private router: Router) { 
  }

  async dajKorisnike(): Promise<{korisnici: KorisnikI[], trenutni: string | null}> {
    try {
      const odgovor = await fetch(this.restServis + 'app/korisnici', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      if (!odgovor.ok) {
        console.error(`Server greška: ${odgovor.statusText}`);
        if (odgovor.status === 406 || odgovor.status === 422) {
          this.router.navigate(['/']);
        }

        return {korisnici : [], trenutni : null};
      }
      const odgovorJson = await odgovor.json();
      const korisnici: Array<KorisnikI> = odgovorJson.korisnici || [];
      const trenutniKorisnik: string = odgovorJson.trenutniKorisnik;
      return {korisnici : korisnici, trenutni : trenutniKorisnik};
    } catch (greska) {
      console.error('Greska kod dohvacanja korisnika:', greska);
      return {korisnici : [], trenutni : null};
    }
  }

  async dajKorisnika() {
    try {
      const odgovor = await fetch(this.restServis + 'app/korisnici/' + localStorage.getItem('korime'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      if (!odgovor.ok) {
        console.error(`Server greška: ${odgovor.statusText}`);
        if (odgovor.status === 406 || odgovor.status === 422) {
          this.router.navigate(['/prijava']);
        }

        return [];
      }
      const odgovorJson = await odgovor.json();
      return odgovorJson[0];
    } catch (greska) {
      console.error('Greska kod dohvacanja korisnika:', greska);
      return [];
    }
  }

  async makniPrava(korime: string) {
    let parametri = { 
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    };
    let parametri2 = { 
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body : JSON.stringify({ servis_prava: 0 })
    };
    let odgovorServis = await fetch(this.restServis + "korisnici/" + korime, parametri);
    let odgovor = await fetch(this.restServis + "app/korisnici/prava/" + korime, parametri2);
    if(odgovor.status == 201 && odgovorServis.status == 201) {
      console.log('Prava obrisana!');
    } else {
      console.error('Greška kod brisanja prava!');
    }
  }

  async dajPrava(korime: string) {
    let parametri = { 
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({ 
              korime: korime, 
              tip_korisnika_id: 1
          })
    };
    let parametri2 = { 
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body : JSON.stringify({ servis_prava: 1 })
    };
    let odgovorServis = await fetch(this.restServis + "korisnici", parametri);
    let odgovor = await fetch(this.restServis + "app/korisnici/prava/" + korime, parametri2);
    if(odgovor.status == 201 && odgovorServis.status == 201) {
      console.log('Prava dodana!');
    } else {
      console.error('Greška kod dodavanja prava!');
    }
  }

  async izbrisiKorisnika(korime: string) {
    let parametri = { 
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    };
    let parametri2 = { 
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    };
    let odgovorServis = await fetch(this.restServis + "korisnici/" + korime, parametri);
    let odgovor = await fetch(this.restServis + "app/korisnici/" + korime, parametri2);
    if(odgovor.status == 201 && odgovorServis.status == 201) {
      console.log('Korisnik obrisan!');
    } else {
      console.error('Greška kod brisanja korisnika!');
    }
  }

  async posaljiZahtjev(korime: string) {
    let parametri = { 
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    };
    let odgovor = await fetch(this.restServis + "app/korisnici/zahtjev/" + korime, parametri);
      if(odgovor.status == 201 ) {
    } else {
      alert('Greška kod slanja zahtjeva!');
    }
  }
}
