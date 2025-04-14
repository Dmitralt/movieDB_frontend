import React, { useEffect, useState, useRef } from "react";
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
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isSwitchingRef = useRef(false);
    const playPromiseRef = useRef<Promise<void> | null>(null);
    const rateLimitRef = useRef(false);
    const videoKeyRef = useRef<number>(0);

    useEffect(() => {
        if (cache[movieId]) {
            setMovie(cache[movieId]);
            return;
        }

        const apiUrl = process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_API_URL_LOCAL
            : process.env.REACT_APP_API_URL;

        fetch(`${apiUrl}/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                setMovie(data);
                setCache((prevCache) => ({ ...prevCache, [movieId]: data }));
            })
            .catch((err) => console.error(err));
    }, [movieId]);

    useEffect(() => {
        if (movie?.videos) {
            setCurrentVideoUrl(movie.videos[selectedVideo]);
        }
    }, [movie, selectedVideo]);

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = '';
                videoRef.current.load();
            }
            playPromiseRef.current = null;
            rateLimitRef.current = false;
        };
    }, []);

    const handleVideoLoad = () => {
        if (isSwitchingRef.current) return;
        setIsVideoLoading(false);
        setVideoError(null);
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
        }
    };

    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        if (isSwitchingRef.current) return;
        setIsVideoLoading(false);
        setIsVideoPlaying(false);
        setIsBuffering(false);
        const video = e.target as HTMLVideoElement;
        const error = video.error;

        if (video.networkState === 3) {
            const xhr = video.error?.message.includes('429');
            if (xhr) {
                rateLimitRef.current = true;
                setVideoError('Забагато запитів. Будь ласка, зачекайте кілька секунд перед наступною спробою.');
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.src = '';
                    videoRef.current.load();
                }
                return;
            }
        }

        const errorMessage = error ? `Error ${error.code}: ${error.message}` : 'Unknown video error';
        setVideoError(errorMessage);
        console.error('Error loading video:', errorMessage);
    };

    const switchVideo = async (index: number) => {
        if (!movie?.videos || index === selectedVideo || isSwitchingRef.current || rateLimitRef.current) return;

        const newVideoUrl = movie.videos[index];
        if (newVideoUrl === currentVideoUrl) return;

        isSwitchingRef.current = true;
        setIsVideoLoading(true);
        setIsBuffering(true);
        setVideoError(null);
        setSelectedVideo(index);
        setIsVideoPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        if (playPromiseRef.current) {
            try {
                await playPromiseRef.current;
            } catch (error) {
            }
        }

        setCurrentVideoUrl(newVideoUrl);
        isSwitchingRef.current = false;
    };

    const handlePlayPause = async () => {
        if (!videoRef.current || isSwitchingRef.current || !currentVideoUrl || rateLimitRef.current) return;

        try {
            if (isVideoPlaying) {
                if (playPromiseRef.current) {
                    try {
                        await playPromiseRef.current;
                    } catch (error) {
                        //:TODO
                    }
                }
                videoRef.current.pause();
                setIsVideoPlaying(false);
                playPromiseRef.current = null;
            } else {
                setIsVideoPlaying(true);
                playPromiseRef.current = videoRef.current.play();

                if (playPromiseRef.current !== undefined) {
                    await playPromiseRef.current;
                    if (!isSwitchingRef.current) {
                        setIsBuffering(false);
                    }
                }
            }
        } catch (error) {
            if (!isSwitchingRef.current) {
                console.error('Error in play/pause:', error);
                setIsVideoPlaying(false);
                setIsBuffering(false);
                setVideoError('Error playing video');
                playPromiseRef.current = null;
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
        }
    };

    const handleWaiting = () => {
        if (!isSwitchingRef.current) {
            setIsBuffering(true);
        }
    };

    const handlePlaying = () => {
        if (!isSwitchingRef.current) {
            setIsBuffering(false);
            setVideoError(null);
        }
    };

    const handleProgress = () => {
        if (videoRef.current && !isSwitchingRef.current) {
            const buffered = videoRef.current.buffered;
            if (buffered.length > 0) {
                const bufferedEnd = buffered.end(buffered.length - 1);
                const duration = videoRef.current.duration;
                const bufferedPercent = (bufferedEnd / duration) * 100;
                console.log(`Buffered: ${bufferedPercent.toFixed(2)}%`);
            }
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * duration;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

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
                                        ? `Згорнути (${movie.images?.stills?.length} фото)`
                                        : `Показати всі (${movie.images?.stills?.length} фото)`}
                                </button>
                            )}
                        </>
                    ) : (
                        <p>Немає доступних зображень</p>
                    )}
                </div>

                {movie.links && movie.links.length > 0 && (
                    <div className="links-section">
                        <h3>Посилання</h3>
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
                            {showVideoPlayer ? 'Сховати відео' : 'показати відео'}
                        </button>

                        {showVideoPlayer && (
                            <div className="video-player-container">
                                {isVideoLoading && (
                                    <div className="video-loading">
                                        Завантаження відео...
                                    </div>
                                )}
                                <div className="video-wrapper">
                                    <video
                                        ref={videoRef}
                                        key={currentVideoUrl}
                                        className="movie-video"
                                        poster={movie.images?.posters?.[0] || "/images/placeholder.jpg"}
                                        onLoadStart={() => setIsVideoLoading(true)}
                                        onCanPlay={handleVideoLoad}
                                        onError={handleVideoError}
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={handleLoadedMetadata}
                                        onWaiting={handleWaiting}
                                        onPlaying={handlePlaying}
                                        onProgress={handleProgress}
                                        data-testid="video-player"
                                    >
                                        <source src={currentVideoUrl || ''} type="video/mp4" />
                                        Ваш браузер не підтримує відео.
                                    </video>
                                    {videoError && (
                                        <div className="video-error">
                                            {videoError}
                                        </div>
                                    )}
                                    <div className="video-controls">
                                        <button className="play-pause-button" onClick={handlePlayPause}>
                                            {isVideoPlaying ? '⏸' : '▶'}
                                        </button>
                                        <div className="progress-container" onClick={handleProgressClick}>
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${(currentTime / duration) * 100}%` }}
                                            />
                                        </div>
                                        <div className="time-display">
                                            {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} /
                                            {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                                        </div>
                                        <div className="volume-controls">
                                            <button className="mute-button" onClick={handleMuteToggle}>
                                                {isMuted ? '🔇' : '🔊'}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={volume}
                                                onChange={handleVolumeChange}
                                                className="volume-slider"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {movie.videos.length > 1 && (
                                    <div className="video-list">
                                        {movie.videos.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`video-list-item ${selectedVideo === index ? 'active' : ''}`}
                                                onClick={() => switchVideo(index)}
                                            >
                                                відео {index + 1}
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
