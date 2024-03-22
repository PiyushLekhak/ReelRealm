import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import ICards from "../../components/idcard/idcard";

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
                setWatchlist(data.map(item => item.movie_id)); // Extract movie IDs
            } else {
                throw new Error("Failed to fetch watchlist");
            }
        } catch (error) {
            console.error("Error fetching watchlist:", error);
        }
    };

    return (
        <div className="movie__list">
            <h2 className="list__title"> My Watchlist</h2>
            <div cclassName="list__cards">
                {/* Map over the watchlist and render Cards component for each movie */}
                {watchlist.map(movieId => (
                    <ICards key={movieId} movieId={movieId} />
                ))}
            </div>
        </div>
    );
};

export default Watchlist;
