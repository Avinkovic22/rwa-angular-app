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
}

export interface FilmTmdbI {
    naslov : string
    originalni_naslov : string;
    jezik : string | null;
    popularnost : number | null;
    poster : string | null;
    datum_izdavanja : string | null;
    opis : string | null;
    odrasli : number | null;
    prosjecna_ocjena : number | null;
    tmdb_id_film : number;
    lik?: string | undefined;
}

export interface OsobeTmdbI {
    stranica : number;
    rezultati : Array<OsobaTmdbI>;
    ukupnoStranica : number;
    ukupnoRezultata : number;
}

export interface FilmoviTmdbI {
    stranica : number;
    rezultati : Array<FilmTmdbI>;
    ukupnoStranica : number;
    ukupnoRezultata : number;
}

export interface FilmApiTmdbI {
    backdrop_path: string | null;
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    media_type: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character?: string;
}

export interface OsobeApiTmdbI {
    page : number;
    results : Array<FilmApiTmdbI>;
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