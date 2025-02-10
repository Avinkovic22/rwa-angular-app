export interface KorisnikI {
    ime: string;
    prezime: string;
    korime: string;
    lozinka: string;
    email: string;
    telefon: string | null;
    datum_rodenja: string | null;
    adresa: string | null;
    tip_korisnika_id: number;
    servis_prava: number;
    poslao_zahtjev: number;
}

export interface KorisnikRegI {
    ime: string;
    prezime: string;
    korime: string;
    lozinka: string;
    email: string;
    telefon: string | null;
    datum_rodenja: string | null;
    adresa: string | null;
}