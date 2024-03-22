import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import ICards from "../../components/idcard/idcard";
import { GrSubtractCircle } from "react-icons/gr";
import "./watchlist.css";

const Watchlist = () => {
    const { authTokens } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        if (authTokens) {
            fetchWatchlist();
        }
    }, [authTokens]);

    const fetchWatchlist = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/get_watchlist/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setWatchlist(data); // Store entire watchlist data
            } else {
                throw new Error("Failed to fetch watchlist");
            }
        } catch (error) {
            console.error("Error fetching watchlist:", error);
        }
    };

    const removeFromWatchlist = async (movieId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/remove_from_watchlist/${movieId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                // Remove the movie from the watchlist state
                setWatchlist(prevWatchlist => prevWatchlist.filter(item => item.movie_id !== movieId));
                console.log("Movie removed from watchlist");
            } else {
                throw new Error("Failed to remove movie from watchlist");
            }
        } catch (error) {
            console.error("Error removing movie from watchlist:", error);
        }
    };

    return (
        <div className="movie__list">
            <h2 className="list__title" style={{ color: "#f4eba3" }}> My Watchlist</h2>
            <div className="list__cards">
                {/* Map over the watchlist and render Cards component for each movie */}
                {watchlist.map(item => (
                    <div key={item.movie_id} className="card-wrapper">
                        <ICards movieId={item.movie_id} />
                        <div>
                            <button className="remove-button" onClick={() => removeFromWatchlist(item.movie_id)}><GrSubtractCircle style={{ color: "#fa5437" }}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watchlist;
