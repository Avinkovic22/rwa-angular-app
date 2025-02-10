import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { FormsModule } from '@angular/forms';
import { PopisOsobaComponent } from './popis-osoba/popis-osoba.component';
import { DetaljiOsobeComponent } from './detalji-osobe/detalji-osobe.component';
import { PopisKorisnikaComponent } from './popis-korisnika/popis-korisnika.component';
import { DodavanjeOsobaComponent } from './dodavanje-osoba/dodavanje-osoba.component';
import { NavigacijskaTrakaComponent } from './navigacijska-traka/navigacijska-traka.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PopisFilmovaComponent } from './popis-filmova/popis-filmova.component';

@NgModule({
  declarations: [
    AppComponent,
    PrijavaComponent,
    RegistracijaComponent,
    PopisOsobaComponent,
    DetaljiOsobeComponent,
    PopisKorisnikaComponent,
    DodavanjeOsobaComponent,
    NavigacijskaTrakaComponent,
    PocetnaComponent,
    DokumentacijaComponent,
    PopisFilmovaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
