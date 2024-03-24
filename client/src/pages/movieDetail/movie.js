import React, { useEffect, useState, useRef } from "react";
import "./movie.css";
import { useParams } from "react-router-dom";
import { FaPlayCircle, FaStarHalfAlt, FaStar } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { GrSubtractCircle } from "react-icons/gr";
import Youtube from 'react-youtube';
import ReviewsSection from "../../components/reviewsSection/reviewsSection";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
const swal = require('sweetalert2');

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [streamingPlatforms, setStreamingPlatforms] = useState([]);
    const [topCast, setTopCast] = useState([]);
    const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [modal, setModal] = useState(false);
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const modalRef = useRef(null);

    const { id } = useParams();
    const { user, authTokens } = useContext(AuthContext);

    useEffect(() => {
        getData();
        checkWatchlist();
        fetchUserRating();
        window.scrollTo(0, 0);
    }, [id]);

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
            
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=05b81b536fc24a416036ac3e5d797fd2`)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const trailer = data.results.find(video => video.type === "Trailer");
                    if (trailer) {
                        setTrailerKey(trailer.key);
                    }
                }
            })
            .catch(error => console.error("Error fetching trailer:", error));

        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=05b81b536fc24a416036ac3e5d797fd2`)
            .then(res => res.json())
            .then(data => {
                if (data.cast && data.cast.length > 0) {
                    setTopCast(data.cast.slice(0, 10));
                }
            })
            .catch(error => console.error("Error fetching top cast:", error));
    };

    const playTrailer = () => {
        setIsTrailerPlaying(true);
    };

    const closeTrailer = () => {
        setIsTrailerPlaying(false);
    };

    const toggleModal = () => {
        // Check if the user is logged in before opening the modal
        if (!authTokens) {
            // User is not logged in, show a message prompting them to login
            swal.fire({
                title: "Please Login",
                text: "You need to login to rate this movie.",
                icon: "warning",
                toast: true,
                timer: 2500,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            // User is logged in, open the rating modal
            setModal(!modal);
        }
    };
    
    const rateMovie = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/rate_movie/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authTokens?.access}`,
                },
                body: JSON.stringify({
                    movie_id: id,
                    rating: rating,
                }),
            });
    
            if (response.ok) {
                // Rating submitted successfully
                swal.fire({
                    title: "Rating submitted successfully",
                    icon: "success",
                    toast: true,
                    timer: 2500,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                toggleModal(); // Close the modal after submitting the rating
            } else {
                throw new Error("Failed to submit rating.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
        document.removeEventListener("click", handleOutsideClick);
        };
    }, []);
    
    const handleButtonClick = (event) => {
        // Prevent event propagation to the document level
        event.stopPropagation();
        // Toggle the modal
        toggleModal();
    };

    const checkWatchlist = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/check_watchlist/${id}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                setIsInWatchlist(data.is_in_watchlist);
            } else {
                throw new Error("Failed to fetch watchlist");
            }
        } catch (error) {
            console.error("Error fetching watchlist:", error);
        }
    };

    const fetchUserRating = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/get_rating/${id}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setRating(data.rating); // Update state with fetched rating
            }
        } catch (error) {
            console.error("Error fetching user rating:", error);
        }
    };

    const toggleWatchlist = async () => {
        try {
            const decodedToken = authTokens ? jwtDecode(authTokens.access) : null;
            const userId = decodedToken ? decodedToken.user_id : null;
    
            if (!decodedToken) {
                // User is not logged in, show a message prompting them to login
                swal.fire({
                    title: "Please Login",
                    text: "You need to login to perform this action.",
                    icon: "warning",
                    toast: true,
                    timer: 2500,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                return;
            }
    
            if (isInWatchlist) {
                // If movie is already in watchlist, remove it
                const response = await fetch(`http://127.0.0.1:8000/api/remove_from_watchlist/${id}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authTokens?.access}`,
                    },
                });
    
                if (response.ok) {
                    setIsInWatchlist(false);
                    swal.fire({
                        title: "Movie Removed from Watchlist",
                        icon: "success",
                        toast: true,
                        timer: 2500,
                        position: "top-right",
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                } else {
                    throw new Error("Failed to remove movie from watchlist.");
                }
            } else {
                // If movie is not in watchlist, add it
                const response = await fetch("http://127.0.0.1:8000/api/add_to_watchlist/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authTokens?.access}`,
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        movie_id: id,
                    }),
                });
    
                if (response.ok) {
                    setIsInWatchlist(true);
                    swal.fire({
                        title: "Movie Added to Watchlist",
                        icon: "success",
                        toast: true,
                        timer: 2500,
                        position: "top-right",
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                } else {
                    throw new Error("Failed to add movie to watchlist.");
                }
            }
        } catch (error) {
            console.error(error);
        }
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
                        {isTrailerPlaying ? (
                            <div>
                                <Youtube
                                    videoId={trailerKey}
                                    className={"youtube-container"}
                                    opts={
                                        {
                                            width: '100%',
                                            height: '100%',
                                            playerVars: {
                                                autoplay: 1,
                                                controls: 1,
                                                cc_load_policy: 0,
                                                fs: 0,
                                                iv_load_policy: 0,
                                                modestbranding: 0,
                                                rel: 0,
                                                showinfo: 0,
                                            },
                                        }
                                    }
                                />
                                <button onClick={closeTrailer} className={"trailerClose-button close-video"}>Close</button>
                            </div>
                        ) : (
                            <button className="playTrailerButton" onClick={playTrailer}>
                                <FaPlayCircle /> Play Trailer
                            </button>
                        )}
                    </div>
                    <div>
                        <button className="addToWatchlistButton" onClick={toggleWatchlist}>
                            {isInWatchlist ? <GrSubtractCircle /> : <IoMdAddCircle />} {/* Render appropriate icon */}
                            {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"} {/* Render appropriate text */}
                        </button>
                    </div>
                    <div>
                        <button className="rateButton" onClick={handleButtonClick}>
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
            {modal && (
                <div className="modal">
                    <div className="overlay"></div>
                    <div ref={modalRef} className="modal-content">
                    <h2 style={{ marginBottom: "25px" }}>Rate this movie out of 10</h2>
                        <div className="rating-container">
                            {[...Array(10)].map((star, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={currentRating}
                                            onClick={() => setRating(currentRating)}
                                        />
                                        <FaStar
                                            className="star"
                                            size={50}
                                            color={
                                                currentRating <= (hover || rating)
                                                ? "#ffc107"
                                                : "#e4e5e9"
                                            }
                                            onMouseEnter={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        <div className="button-container">
                            <button className="close-modal" onClick={toggleModal}>
                                CANCEL
                            </button>
                            <button className="submit-modal" onClick={rateMovie}>
                                SUBMIT
                            </button>                            
                        </div>
                    </div>
                </div>
            )}
            <ReviewsSection movieId={id} />
        </div>
    );
};

export default Movie;
