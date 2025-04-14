import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    IsUrl,
    Min,
    Max,
    IsInt,
    IsNotEmpty,
    Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { sanitizeHtml, sanitizeArray, isValidYear, isValidRating, isValidUrl, isValidStringArray } from '../utils/validators';

export class CreateMovieDto {
    protected _title: string = '';
    protected _description: string = '';
    protected _year: number = new Date().getFullYear();
    protected _country: string = '';
    protected _language: string = '';
    protected _production_company: string = '';
    protected _genres: string[] = [];
    protected _directors: string[] = [];
    protected _screenwriters: string[] = [];
    protected _actors: string[] = [];
    protected _posterUrl: string = '';
    protected _videoUrl: string = '';
    protected _rating: number = 0;
    protected _runtime: number = 0;

    get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = sanitizeHtml(value);
    }

    get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = sanitizeHtml(value);
    }

    get year(): number {
        return this._year;
    }

    public set year(value: number) {
        if (isValidYear(value)) {
            this._year = value;
        } else {
            throw new Error('Рік повинен бути між 1888 та поточним роком');
        }
    }

    get country(): string {
        return this._country;
    }

    public set country(value: string) {
        this._country = sanitizeHtml(value);
    }

    get language(): string {
        return this._language;
    }

    public set language(value: string) {
        this._language = sanitizeHtml(value);
    }

    get production_company(): string {
        return this._production_company;
    }

    public set production_company(value: string) {
        this._production_company = sanitizeHtml(value);
    }

    get genres(): string[] {
        return this._genres;
    }

    public set genres(value: string[]) {
        if (isValidStringArray(value)) {
            this._genres = sanitizeArray(value);
        } else {
            throw new Error('Жанри повинні бути масивом рядків');
        }
    }

    get directors(): string[] {
        return this._directors;
    }

    public set directors(value: string[]) {
        if (isValidStringArray(value)) {
            this._directors = sanitizeArray(value);
        } else {
            throw new Error('Режисери повинні бути масивом рядків');
        }
    }

    get screenwriters(): string[] {
        return this._screenwriters;
    }

    public set screenwriters(value: string[]) {
        if (isValidStringArray(value)) {
            this._screenwriters = sanitizeArray(value);
        } else {
            throw new Error('Сценаристи повинні бути масивом рядків');
        }
    }

    get actors(): string[] {
        return this._actors;
    }

    public set actors(value: string[]) {
        if (isValidStringArray(value)) {
            this._actors = sanitizeArray(value);
        } else {
            throw new Error('Актори повинні бути масивом рядків');
        }
    }

    get posterUrl(): string {
        return this._posterUrl;
    }

    public set posterUrl(value: string) {
        if (isValidUrl(value)) {
            this._posterUrl = value;
        } else {
            throw new Error('Неправильний URL для постера');
        }
    }

    get videoUrl(): string {
        return this._videoUrl;
    }

    public set videoUrl(value: string) {
        if (isValidUrl(value)) {
            this._videoUrl = value;
        } else {
            throw new Error('Неправильний URL для відео');
        }
    }

    get rating(): number {
        return this._rating;
    }

    public set rating(value: number) {
        if (isValidRating(value)) {
            this._rating = value;
        } else {
            throw new Error('Рейтинг повинен бути від 0 до 10');
        }
    }

    get runtime(): number {
        return this._runtime;
    }

    public set runtime(value: number) {
        if (value >= 0) {
            this._runtime = value;
        } else {
            throw new Error('Тривалість повинна бути додатнім числом');
        }
    }
}

export class UpdateMovieDto extends CreateMovieDto {
    public set title(value: string) {
        if (value !== undefined) {
            this._title = sanitizeHtml(value);
        }
    }

    public set year(value: number) {
        if (value !== undefined) {
            if (isValidYear(value)) {
                this._year = value;
            } else {
                throw new Error('Рік повинен бути між 1888 та поточним роком');
            }
        }
    }
}

export class MovieResponseDto {
    id: string = '';
    title: string = '';
    description?: string;
    year: number = new Date().getFullYear();
    country?: string;
    language?: string;
    production_company?: string;
    genres?: string[];
    directors?: string[];
    screenwriters?: string[];
    actors?: string[];
    posterUrl?: string;
    videoUrl?: string;
    rating?: number;
    runtime?: number;
    images?: {
        stills: string[];
        posters: string[];
    };
    videos?: string[];
} 