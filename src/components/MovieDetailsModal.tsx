import React, { useEffect, useState } from "react";
import "../styles/MovieDetailsModal.css";

interface MovieDetailsProps {
    movieId: string;
    onClose: () => void;
}

interface MovieDetails {
    title: string;
    year: number;
    country: string;
    language: string;
    production_company: string;
    directors: string[];
    screenwriters: string[];
    actors: string[];
    description: string;
    images?: {
        stills?: string[];
        posters?: string[];
    };
}

const MovieDetailsModal: React.FC<MovieDetailsProps> = ({ movieId, onClose }) => {
    const [movie, setMovie] = useState<MovieDetails | null>(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => setMovie(data))
            .catch((err) => console.error(err));
    }, [movieId]);

    if (!movie) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src="/images/placeholder.jpg" alt="Постер" className="movie-main-image" />

                <h2>{movie.title}</h2>
                <p><strong>Рік:</strong> {movie.year}</p>
                <p><strong>Країна:</strong> {movie.country}</p>
                <p><strong>Мова:</strong> {movie.language}</p>
                <p><strong>Кінокомпанія:</strong> {movie.production_company}</p>
                <p><strong>Режисер:</strong> {movie.directors.join(", ")}</p>
                <p><strong>Сценаристи:</strong> {movie.screenwriters.join(", ")}</p>
                <p><strong>Актори:</strong> {movie.actors.join(", ")}</p>
                <p><strong>Опис:</strong> {movie.description}</p>

                <div className="movie-images">
                    {(movie.images?.stills || []).length > 0 ? (
                        movie.images!.stills!.map((src, index) => (
                            <img key={index} src="/images/placeholder.jpg" alt={`Кадр ${index + 1}`} className="movie-thumbnail" />
                        ))
                    ) : (
                        <p>Немає доступних зображень</p>
                    )}
                </div>

                <button className="close-button" onClick={onClose}>✕</button>
            </div>
        </div>
    );
};

export default MovieDetailsModal;
