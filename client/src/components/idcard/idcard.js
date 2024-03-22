import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import "../card/card.css";
import { Link } from "react-router-dom";

const ICards = ({ movieId }) => {
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=05b81b536fc24a416036ac3e5d797fd2`);
                if (response.ok) {
                    const data = await response.json();
                    setMovie(data);
                    setIsLoading(false);
                } else {
                    throw new Error('Failed to fetch movie details');
                }
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setIsLoading(false);
            }
        };

        fetchMovieDetails();

    }, [movieId]);

    return (
        <>
            {
                isLoading
                ?
                <div className="cards">
                    <SkeletonTheme color="#202020" highlightColor="#f4eba3">
                        <Skeleton height={400} duration={2} />
                    </SkeletonTheme>
                </div>
                :
                <Link to={`/movie/${movieId}`} style={{ textDecoration: "none", color: "white" }}>
                    <div className="cards">
                        <img className="cards__img" src={`https://image.tmdb.org/t/p/original${movie ? movie.poster_path : ""}`} alt={movie ? movie.title : "Movie Poster"} />
                        <div className="cards__overlay">
                            <div className="card__title">{movie ? movie.title : ""}</div>
                            <div className="card__runtime">
                                {movie ? movie.release_date : ""}
                                <span className="card__rating">{movie ? movie.vote_average.toFixed(1) : ""}<i className="fas fa-star" style={{ color: "gold" }} /></span>
                            </div>
                            <div className="card__description">{movie ? movie.overview.slice(0, 118) + "..." : ""}</div>
                        </div>
                    </div>
                </Link>
            }
        </>
    );
};

export default ICards;
