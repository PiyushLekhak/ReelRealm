import "./App.css";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/privateRoute";
import Header from "./components/header/header";
import Home from "./pages/home/home";
import MovieList from "./components/movieList/movieList";
import Movie from './pages/movieDetail/movie';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Watchlist from "./pages/watchlist/watchlist";
import Recommendations from "./pages/recommendations/recommendations";
import RatedMovies from "./pages/ratedMovies/ratedMovies";
import Profile from "./pages/profile/profile";
import Footer from "./components/footer/footer";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="movie/:id" element={<Movie/>}/>
          <Route path="movies/:type" element={<MovieList/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute/>}>
              <Route path='/watchlist' element={<Watchlist/>} />              
              <Route path='/recommendations' element={<Recommendations/>} />
              <Route path='/rated-movies' element={<RatedMovies/>} />
              <Route path='/profile' element={<Profile/>} />
          </Route>
          <Route path="/*" element={<p className="wrong-url-message">
                Sorry! This URL does not exist. Please recheck the entered URL.
              </p>}></Route>
        </Routes>
        <Footer/>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
