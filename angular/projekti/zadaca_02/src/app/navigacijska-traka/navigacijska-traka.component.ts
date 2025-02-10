import { Component } from '@angular/core';
import { AutentikacijaService } from '../servisi/autentikacija.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigacijska-traka',
  standalone: false,
  
  templateUrl: './navigacijska-traka.component.html',
  styleUrl: './navigacijska-traka.component.scss'
})
export class NavigacijskaTrakaComponent {
  prijavljen: boolean = false;

  constructor(private autentikacijaServis: AutentikacijaService, private router: Router) {}

  ngOnInit(): void {
    this.provjeriPrijavljenost();

    this.router.events.subscribe(() => {
      this.provjeriPrijavljenost();
    });
  }

  provjeriPrijavljenost(): void {
    this.prijavljen = this.autentikacijaServis.prijavljen();
  }

  odjava() {
    this.autentikacijaServis.odjava();
    this.prijavljen = false;
    this.router.navigate(['/prijava']);
  }
}
