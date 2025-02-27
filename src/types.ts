export interface Movie {
    _id: string;
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
        posters: string[];
    };
}