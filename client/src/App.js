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
import Profile from "./pages/profile/profile";
import Recommendations from "./pages/recommendations/recommendations";
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
              <Route path='/profile' element={<Profile/>} />
              <Route path='/recommendations' element={<Recommendations/>} />
          </Route>
          <Route path="/*" element={<h1 style={{ textAlign: "center", marginTop: "20rem", color: "rgb(252, 74, 30)" }}>
                Sorry! This URL does not exist. Please recheck the entered URL.
              </h1>}></Route>
        </Routes>
        <Footer/>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
