import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PopisOsobaComponent } from './popis-osoba/popis-osoba.component';
import { DetaljiOsobeComponent } from './detalji-osobe/detalji-osobe.component';
import { PopisKorisnikaComponent } from './popis-korisnika/popis-korisnika.component';
import { DodavanjeOsobaComponent } from './dodavanje-osoba/dodavanje-osoba.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PopisFilmovaComponent } from './popis-filmova/popis-filmova.component';

const routes: Routes = [
  {path: '', component: PocetnaComponent},
  {path: 'prijava', component: PrijavaComponent},
  {path: 'registracija', component: RegistracijaComponent},
  {path: 'osobe', component: PopisOsobaComponent},
  {path: 'detalji/:id', component: DetaljiOsobeComponent},
  {path: 'korisnici', component: PopisKorisnikaComponent},
  {path: 'dodavanje-osoba', component: DodavanjeOsobaComponent},
  {path: 'dokumentacija', component: DokumentacijaComponent},
  {path: 'filmovi', component: PopisFilmovaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
