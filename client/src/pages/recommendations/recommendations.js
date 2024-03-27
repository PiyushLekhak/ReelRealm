import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import ICards from "../../components/idcard/idcard";
import "./recommendations.css";

const Recommendations = () => {
    const { authTokens } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (authTokens) {
            fetchRecommendations();
        }
    }, [authTokens]);

    const fetchRecommendations = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/get_recommendations/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setRecommendations(data); // Store entire recommendations data
            } else {
                throw new Error("Failed to fetch recommendations");
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    return (
        <div className="movie__list">
            <h2 className="list__title" style={{ color: "#f4eba3" }}> Personalized Recommendations</h2>
            {recommendations.length === 0 ? (
                <p className="empty-message">Please rate some movies to get personalized recommendations.</p>
            ) : (
                <div className="list__cards">
                    {/* Map over the recommendations and render Cards component for each movie */}
                    {recommendations.map(item => (
                        <div key={item.movie} className="card-wrapper">
                            <ICards movieId={item.movie_id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recommendations;
