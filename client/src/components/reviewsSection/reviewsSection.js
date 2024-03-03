import React, { useEffect, useState } from "react";
import "./reviewsSection.css";

const ReviewsSection = ({ movieId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=05b81b536fc24a416036ac3e5d797fd2`)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    setReviews(data.results.slice(0, 8)); // Limit to first 8 reviews
                } else {
                    setReviews([]); // Set empty array if no reviews are available
                }
            })
            .catch(error => console.error("Error fetching reviews:", error));
    }, [movieId]);

    // Function to format the review time
    const formatReviewTime = (time) => {
        const reviewDate = new Date(time);
        return reviewDate.toLocaleString();
    };

    // Function to truncate or expand review content
    const toggleFullReview = (index) => {
        const updatedReviews = [...reviews];
        updatedReviews[index].showFullReview = !updatedReviews[index].showFullReview;
        setReviews(updatedReviews);
    };

    // Function to truncate review content to 50 words
    const truncateReview = (content) => {
        const words = content.split(' ');
        return words.slice(0, 50).join(' ');
    };

    return (
        <div className="reviews-section">
            <h2>Movie Reviews</h2>
            {reviews.length > 0 ? (
                <div className="reviews-list">
                    {reviews.map((review, index) => (
                        <div key={review.id} className="review">
                            <div className="review-header">
                                <i className="fas fa-user"></i>
                                <h3 className="reviewer-name">{review.author}</h3>
                                <p className="review-time" style={{ marginTop: "5px" }}>{formatReviewTime(review.created_at)}</p>
                            </div>
                            <p>
                                {review.showFullReview ? review.content : truncateReview(review.content)}
                                {!review.showFullReview && (
                                    <button className="read-more" onClick={() => toggleFullReview(index)}>...Read More</button>
                                )}
                                {review.showFullReview && (
                                    <button className="read-more" onClick={() => toggleFullReview(index)}>Read Less</button>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: "1.25rem", marginBottom: "5px" }}>There are no reviews available for this movie.</p>
            )}
        </div>
    );
}

export default ReviewsSection;
