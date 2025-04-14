import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieDetailsModal from "../components/MovieDetailsModal";
import "../styles/Home.css";

interface Movie {
    _id: string;
    title: string;
    year: number;
    country: string;
    directors: string[];
    actors: string[];
    images: {
        stills: string[];
        posters: string[];
    }

}

const Home: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedQuery, setDebouncedQuery] = useState<string>("");
    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setPage(1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchQuery]);


    useEffect(() => {
        const API_URL = process.env.REACT_APP_API_URL;

        const url = debouncedQuery
            ? `${API_URL}/movies/search?query=${debouncedQuery}&page=${page}&limit=${limit}`
            : `${API_URL}/movies?page=${page}&limit=${limit}`;


        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setMovies(data.data);
                setTotalPages(Math.ceil(data.total / limit));
            })
            .catch((err) => console.error(err));
    }, [page, limit, debouncedQuery]);

    console.log(movies)
    return (
        <div className="home-container">
            <input
                type="text"
                placeholder="Пошук за назвою..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            <div className="movies-grid">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie._id}
                        title={movie.title}
                        year={movie.year}
                        country={movie.country}
                        directors={movie.directors || []}
                        actors={movie.actors || []}
                        images={movie.images}
                        onClick={() => setSelectedMovieId(movie._id)}
                    />

                ))}
            </div>

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                <span>Сторінка {page} з {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
                <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
                <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>



            {selectedMovieId && <MovieDetailsModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />}


        </div>
    );
};

export default Home;
