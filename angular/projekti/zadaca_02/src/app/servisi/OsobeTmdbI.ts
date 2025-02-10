export interface OsobaTmdbI {
    id: number,
    ime : string;
    poznat_po : string | null;
    popularnost : number | null;
    profilna_slika : string | null;
    tmdb_id_osoba : number;
    biografija : string | null;
    datum_rodenja : string | null;
    datum_smrti : string | null;
    spol : number | null;
}

export interface OsobeTmdbI {
    stranica : number;
    rezultati : Array<OsobaTmdbI>;
    ukupnoStranica : number;
    ukupnoRezultata : number;
}

export interface OsobaApiTmdbI {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: string | null;
    deathday: string | null;
    gender: number;
    homepage: string | null;
    id: number;
    imdb_id: string;
    known_for_department: string;
    name: string;
    place_of_birth: string | null;
    popularity: number;
    profile_path: string | null;
    exists?: boolean;
}

export interface OsobeApiTmdbI {
    page : number;
    results : Array<OsobaApiTmdbI>;
    total_pages : number;
    total_results : number;
}

export interface SlikaOsobeTmdbI {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface GalerijaSlikaOsobeTmdbI {
    id: number;
    profiles: SlikaOsobeTmdbI[];
}