import React, { useEffect, useState } from "react";
import "./movie.css";
import { useParams } from "react-router-dom";
import { FaPlayCircle } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { FaStarHalfAlt } from "react-icons/fa";
import ReviewsSection from "../../components/reviewsSection/reviewsSection";

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [streamingPlatforms, setStreamingPlatforms] = useState([]);
    const [topCast, setTopCast] = useState([]);
    const { id } = useParams();
    const key = id;

    useEffect(() => {
        getData();
        window.scrollTo(0, 0);
    }, [key]);

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=05b81b536fc24a416036ac3e5d797fd2`)
            .then(res => res.json())
            .then(data => setMovie(data))
            .catch(error => console.error("Error fetching movie details:", error));

        fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=05b81b536fc24a416036ac3e5d797fd2`)
            .then(res => res.json())
            .then(data => {
                if (data.results && Object.keys(data.results).length > 0) {
                    const region = Object.keys(data.results)[0];
                    if (data.results[region].flatrate && data.results[region].flatrate.length > 0) {
                        setStreamingPlatforms(data.results[region].flatrate);
                    }
                }
            })
            .catch(error => console.error("Error fetching streaming platforms:", error));

        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=05b81b536fc24a416036ac3e5d797fd2`)
            .then(res => res.json())
            .then(data => {
                if (data.cast && data.cast.length > 0) {
                    setTopCast(data.cast.slice(0, 10));
                }
            })
            .catch(error => console.error("Error fetching top cast:", error));
    };

    return (
        <div className="movie">
            <div className="movie__intro">
                <img className="movie__backdrop" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.backdrop_path : ""}`} />
                {streamingPlatforms.length > 0 && (
                    <div className="movie__streamingPlatforms">
                        <div className="streamingOnText">Streaming On</div>
                        <div className="streamingPlatformsList">
                            {streamingPlatforms.map(platform => (
                                <span className="platform" key={platform.provider_id}>{platform.provider_name}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average.toFixed(1) : ""} <i className="fas fa-star" style={{ color: "gold" }} />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                        </div>
                        <div className="movie__runtime">{currentMovieDetail ? `${Math.floor(currentMovieDetail.runtime / 60)} hr ${currentMovieDetail.runtime % 60} mins` : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                        <div className="movie__genres">
                            {currentMovieDetail && currentMovieDetail.genres && currentMovieDetail.genres.map(genre => (
                                <span className="movie__genre" key={genre.id}>{genre.name}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <button className="playTrailerButton">
                            <FaPlayCircle /> Play Trailer
                        </button>
                    </div>
                    <div>
                        <button className="addToWatchlistButton">
                            <IoMdAddCircle /> Add to Watchlist
                        </button>
                    </div><div>
                        <button className="rateButton">
                            <FaStarHalfAlt style={{ color: "gold" }} /> Rate Movie
                        </button>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="overviewText">Overview</div>
                        <div className="movie__overview">{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>
                </div>
            </div>
            {topCast.length > 0 && (
                <div className="topCast">
                    <div className="topCastText">Top Cast</div>
                    <div className="topCastList">
                        {topCast.map(cast => (
                            <div className="castItem" key={cast.id}>
                                <div className="castAvatar">
                                    {cast.profile_path ? (
                                        <img src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`} alt={cast.name} />
                                    ) : (
                                        <i className="fas fa-user-circle"style={{fontSize: "150px"}}></i>
                                    )}
                                </div>
                                <div className="castName">{cast.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <ReviewsSection movieId={id} />
        </div>
    );
};

export default Movie;
