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

export interface FilmoviTmdbI {
    stranica : number;
    rezultati : Array<FilmTmdbI>;
    ukupnoStranica : number;
    ukupnoRezultata : number;
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
    lik?: string;
}