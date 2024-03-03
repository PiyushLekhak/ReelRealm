import React, { useEffect, useState } from "react"
import "./home.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import MovieList from "../../components/movieList/movieList"

const Home = () => {
    
    const [nowPlayingMovies, setNowPlayingMovies] = useState([])

    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=05b81b536fc24a416036ac3e5d797fd2")
        .then(res => res.json())
        .then(data => {
            // Fetch additional details for each movie
            const promises = data.results.map(movie => (
                fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=05b81b536fc24a416036ac3e5d797fd2&append_to_response=credits`)
                    .then(res => res.json())
            ));
    
            Promise.all(promises).then(movieDetails => {
                // Combine original movie data with additional details
                const moviesWithDetails = data.results.map((movie, index) => ({
                    ...movie,
                    runtime: movieDetails[index].runtime,
                    genres: movieDetails[index].genres.map(genre => genre.name).join(', ')
                }));
                setNowPlayingMovies(moviesWithDetails);
            });
        });
    }, []);
    
    
    return(
        <>
        {nowPlayingMovies.length > 0 && (
            <div className="poster">
                <Carousel
                    showThumbs = {false}
                    autoPlay = {true}
                    transitionTime = {3}
                    infiniteLoop = {true}
                    showStatus = {false}
                >
                    {
                        nowPlayingMovies.map(movie => (
                            <Link style={{textDecoration:"none",color:"white"}} to={`/movie/${movie.id}`} >
                                <div className="posterImage">
                                    <img src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} />
                                </div>
                                <div className="posterImage__overlay">
                                    <div className="posterImage__title">{movie ? movie.title: ""}</div>
                                    <div className="posterImage__runtimeGenres">
                                        <span className="posterImage__runtime">
                                            <span className="posterImage__rating">
                                                {movie ? movie.vote_average.toFixed(1) : ""}
                                                <i className="fas fa-star" style={{color: "gold"}} />{" "}
                                            </span>
                                            <span className="posterImage__verticalLine">|</span>
                                            {Math.floor(movie.runtime / 60)} hr {movie.runtime % 60} mins
                                            <span className="posterImage__verticalLine">|</span>
                                        </span>
                                    <div className="posterImage__genres">
                                        {movie && movie.genres.split(',').map(genre => (
                                    <div className="genreBox">{genre}</div>
                                    ))}
                                    </div>
                                </div>
                                <div className="posterImage__description">{movie ? movie.overview : ""}</div>
                                </div>
                            </Link>
                        ))
                    }
                </Carousel>
                <MovieList/>
            </div>
        )}
        </>
    )
}

export default Home;