import React, {useEffect, useState} from "react"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import "./card.css"
import { Link } from "react-router-dom"

const Cards = ({movie}) => {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
    }, []) 

    return <>
    {
        isLoading
        ?
        <div className="cards">
            <SkeletonTheme color="#202020" highlightColor="#f4eba3">
                <Skeleton height={400} duration={2} />
            </SkeletonTheme>
        </div>
        :
        <Link to={`/movie/${movie.id}`} style={{textDecoration:"none", color:"white"}}>
            <div className="cards">
                <img className="cards__img" src={`https://image.tmdb.org/t/p/original${movie?movie.poster_path:""}`} />
                <div className="cards__overlay">
                    <div className="card__title">{movie?movie.title:""}</div>
                    <div className="card__runtime">
                        {movie?movie.release_date:""}
                        <span className="card__rating">{movie?movie.vote_average.toFixed(1):""}<i className="fas fa-star" style={{color: "gold"}} /></span>
                    </div>
                    <div className="card__description">{movie ? movie.overview.slice(0,118)+"..." : ""}</div>
                </div>
            </div>
        </Link>
    }
    </>
}

export default Cards