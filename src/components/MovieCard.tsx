import React from "react";
import "../styles/MovieCard.css";

interface MovieProps {
    title: string;
    year: number;
    country: string;
    directors: string[];
    actors: string[];
    images: {
        stills: string[];
        posters: string[];
    };
    onClick: () => void;
}

const MovieCard: React.FC<MovieProps> = ({ title, year, country, directors, actors, images, onClick }) => {
    const posterUrl = images?.posters?.[0] || ""; // безопасно достаём первую ссылку

    return (
        <div className="movie-card" onClick={onClick}>
            {/* <img src="/images/placeholder.jpg" alt={title} /> */}
            {posterUrl ? (
                <img src={posterUrl} alt={title} />
            ) : (
                <img src="/images/placeholder.jpg" alt={title} />
            )}
            <h3>{title}</h3>
            <p><strong>Рік:</strong> {year}</p>
            <p><strong>Країна:</strong> {country}</p>
            <p><strong>Режисер:</strong> {directors.length > 0 ? directors.join(", ") : "Невідомо"}</p>
            <p><strong>Актори:</strong> {actors.slice(0, 5).join(", ")}</p>
        </div>
    );
};

export default MovieCard;
