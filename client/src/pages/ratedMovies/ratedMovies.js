import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import ICards from "../../components/idcard/idcard";
import { GrSubtractCircle } from "react-icons/gr";
import "./ratedMovies.css";

const RatedMovies = () => {
    const { authTokens } = useContext(AuthContext);
    const [ratedMovies, setRatedMovies] = useState([]);

    useEffect(() => {
        if (authTokens) {
            fetchRatings();
        }
    }, [authTokens]);

    const fetchRatings = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/get_user_rated_movies/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setRatedMovies(data); // Store entire rated movies data
            } else {
                throw new Error("Failed to fetch rated movies");
            }
        } catch (error) {
            console.error("Error fetching rated movies:", error);
        }
    };

    const removeFromRatings = async (movieId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/delete_rating/${movieId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                // Remove the movie from the rated movies state
                setRatedMovies(prevRatedMovies => prevRatedMovies.filter(item => item.movie_id !== movieId));
                console.log("Movie removed from rated movies");
            } else {
                throw new Error("Failed to remove movie from rated movies");
            }
        } catch (error) {
            console.error("Error removing movie from rated movies:", error);
        }
    };

    return (
        <div className="movie__list">
            <h2 className="list__title" style={{ color: "#f4eba3" }}> My Rated Movies</h2>
            <div className="list__cards">
                {/* Map over the rated movies and render Cards component for each movie */}
                {ratedMovies.map(item => (
                    <div key={item.movie_id} className="card-wrapper">
                        <ICards movieId={item.movie_id} />
                        <div>
                            <button className="remove-button" onClick={() => removeFromRatings(item.movie_id)}><GrSubtractCircle style={{ color: "#fa5437" }}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatedMovies;
