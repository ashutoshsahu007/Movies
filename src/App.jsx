import React, { useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import "./index.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchMoviesHandler = async () => {
    try {
      setLoader(true);
      const res = await fetch("https://swapi.info/api/films");
      const data = await res.json();
      const transformedMovies = data.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setLoader(false);
      setMovies(transformedMovies);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {loader ? <p>loading....</p> : <MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
