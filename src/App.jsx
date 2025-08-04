import React, { useCallback, useEffect, useRef, useState } from "react";
import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";
// import "./index.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    // Show loader only on first attempt, not during retry
    setLoader(true);
    setError(null);

    try {
      const res = await fetch("https://swapi.info/api/films");

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      const transformedMovies = data.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedMovies);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = (movieObj) => {
    console.log("movieObj", movieObj);
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {loader && <p>Loading...</p>}
        {!loader && error && <p style={{ color: "red" }}>{error}</p>}
        {!loader && !error && movies.length === 0 && <p>No movies</p>}
        {!loader && !error && movies.length > 0 && (
          <MoviesList movies={movies} />
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
