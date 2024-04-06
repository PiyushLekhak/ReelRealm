import React from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { FaBookmark, FaSearch, FaUser } from 'react-icons/fa';
import { useState, useRef, useEffect } from "react";

const Header = () => {

    const {user, logoutUser} = useContext(AuthContext)
    const token = localStorage.getItem("authTokens")

    if (token){
    const decoded = jwtDecode(token) 
    var user_id = decoded.user_id
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const searchBoxRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOutsideClick = (event) => {
        if ((dropdownOpen && !event.target.closest('.userDropdown')) ||
            (searchResults.length > 0 && !event.target.closest('.searchBox'))) {
            setDropdownOpen(false);
            setSearchResults([]);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [dropdownOpen, searchResults]);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Fetch search results based on query
        if (query.trim() !== "") {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=05b81b536fc24a416036ac3e5d797fd2&query=${query}`)
                .then(res => res.json())
                .then(data => setSearchResults(data.results))
                .catch(error => console.error("Error fetching search results:", error));
        } else {
            setSearchResults([]);
        }
    };

    const handleRedirect = (movieId) => {
        navigate(`/movie/${movieId}`);
        setSearchResults([]);
    };

    return(
        <div className = "header">
            <div className = "headerleft">
                <Link to = "/"> <img className = "header__icon" src= "/images/Logo.png" alt="Logo" /></Link>
            </div>
            <div className="searchBox"> <FaSearch className="searchIcon" />
            <input
                    type="text"
                    placeholder="Search Movies..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                {searchResults.length > 0 && (
                    <div className="searchResults">
                        {searchResults.map(movie => (
                            <div className="searchResultItem" onClick={() => handleRedirect(movie.id)}>
                            <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="moviePoster" />
                            <div className="movieInfo">
                                <div className="movieName">{movie.title}</div>
                                <div className="releaseYear">{movie.release_date ? new Date(movie.release_date).getFullYear() : ""}</div>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="headerRight">             
                <Link to = "/movies/popular" style = {{textDecoration: "none"}}><span>Popular</span></Link>
                <Link to = "/movies/top_rated"style = {{textDecoration: "none"}}><span>Top Rated</span></Link>
                <Link to = "/movies/upcoming"style = {{textDecoration: "none"}}><span>Upcoming</span></Link>
                <Link to="/watchlist"style = {{textDecoration: "none"}}><span><FaBookmark style={{marginRight: "5px"}}/>Watchlist</span></Link>
                {token === null && 
                <>
                <Link to="/login"style = {{textDecoration: "none"}}><span>Log In</span></Link>
                </>}
                {token !== null && 
                    <>
                    <Link to="/recommendations" style={{textDecoration: "none"}}><span>Recommendations</span></Link>
                        <div className="userDropdown" onClick={handleDropdown}>
                            <FaUser className="userIcon" />
                            {dropdownOpen && (
                                <div className="dropdownMenu">
                                    <Link to="/profile" style={{textDecoration: "none"}}><span>My Analytics</span></Link>
                                    <Link to="/rated-movies" style={{textDecoration: "none"}}><span>Rated Movies</span></Link>
                                    <Link onClick={logoutUser} style={{textDecoration: "none"}}><span>Log Out</span></Link>
                                </div>
                            )
                        }
                    </div>
                </>
            }
        </div>
    </div>
    )
}

export default Header;