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
    videos?: string[];
    links?: {
        description: string;
        url: string;
    }[];
}

const MovieDetailsModal: React.FC<MovieDetailsProps> = ({ movieId, onClose }) => {
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [cache, setCache] = useState<Record<string, MovieDetails>>({});
    const [showAllImages, setShowAllImages] = useState(false);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(0);
    const [showFullImage, setShowFullImage] = useState<string | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);

    useEffect(() => {
        if (cache[movieId]) {
            setMovie(cache[movieId]);
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                setMovie(data);
                setCache((prevCache) => ({ ...prevCache, [movieId]: data }));
            })
            .catch((err) => console.error(err));
    }, [movieId]);

    if (!movie) return null;

    const displayedStills = showAllImages
        ? movie.images?.stills || []
        : (movie.images?.stills || []).slice(0, 5);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="poster-container">
                    {movie.images?.posters?.[0] ? (
                        <img
                            src={movie.images.posters[0]}
                            alt="Постер"
                            className="movie-main-image"
                            onClick={() => setShowFullImage(movie.images?.posters?.[0] || null)}
                        />
                    ) : (
                        <img src="/images/placeholder.jpg" alt="Постер" className="movie-main-image" />
                    )}
                </div>

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
                    {displayedStills.length > 0 ? (
                        <>
                            {displayedStills.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Кадр ${index + 1}`}
                                    className="movie-thumbnail"
                                    onClick={() => setShowFullImage(src)}
                                />
                            ))}
                            {(movie.images?.stills || []).length > 5 && (
                                <button
                                    className="show-more-button"
                                    onClick={() => setShowAllImages(!showAllImages)}
                                >
                                    {showAllImages
                                        ? `Свернуть (${movie.images?.stills?.length} фото)`
                                        : `Показать все (${movie.images?.stills?.length} фото)`}
                                </button>
                            )}
                        </>
                    ) : (
                        <p>Немає доступних зображень</p>
                    )}
                </div>

                {movie.links && movie.links.length > 0 && (
                    <div className="links-section">
                        <h3>Ссылки</h3>
                        <div className="links-container">
                            {movie.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-button"
                                >
                                    {link.description}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {movie.videos && movie.videos.length > 0 && (
                    <div className="video-section">
                        <button
                            className="video-toggle-button"
                            onClick={() => setShowVideoPlayer(!showVideoPlayer)}
                        >
                            {showVideoPlayer ? 'Скрыть видео' : 'Показать видео'}
                        </button>

                        {showVideoPlayer && (
                            <div className="video-player-container">
                                {isVideoLoading && (
                                    <div className="video-loading">
                                        Загрузка видео...
                                    </div>
                                )}
                                <video
                                    key={selectedVideo}
                                    className="movie-video"
                                    controls
                                    poster={movie.images?.posters?.[0] || "/images/placeholder.jpg"}
                                    onLoadStart={() => setIsVideoLoading(true)}
                                    onCanPlay={() => setIsVideoLoading(false)}
                                    onError={() => setIsVideoLoading(false)}
                                >
                                    <source src={movie.videos[selectedVideo]} type="video/mp4" />
                                    Ваш браузер не поддерживает видео.
                                </video>
                                {movie.videos.length > 1 && (
                                    <div className="video-list">
                                        {movie.videos.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`video-list-item ${selectedVideo === index ? 'active' : ''}`}
                                                onClick={() => {
                                                    setIsVideoLoading(true);
                                                    setSelectedVideo(index);
                                                }}
                                            >
                                                Видео {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {showFullImage && (
                    <div className="full-image-overlay" onClick={() => setShowFullImage(null)}>
                        <img src={showFullImage} alt="Полное изображение" className="full-image" />
                    </div>
                )}

                <button className="close-button" onClick={onClose}>✕</button>
            </div>
        </div>
    );
};

export default MovieDetailsModal;
