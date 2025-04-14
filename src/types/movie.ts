export interface Movie {
    id: string;
    title: string;
    year: number;
    country: string;
    language: string;
    production_company: string;
    directors: string[];
    screenwriters: string[];
    actors: string[];
    description: string;
    images: {
        stills: string[];
        posters: string[];
    };
    videos: string[];
}

export interface MovieListResponse {
    movies: Movie[];
    total: number;
    page: number;
    limit: number;
}

export interface MovieSearchParams {
    page?: number;
    limit?: number;
    search?: string;
} 