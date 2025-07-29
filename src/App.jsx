import React, { useEffect, useRef, useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import "./index.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const [trying, setTrying] = useState(false);
  const retryTimeoutRef = useRef();

  const fetchMoviesHandler = async () => {
    // Show loader only on first attempt, not during retry
    if (!trying) setLoader(true);
    setError(null);
    setTrying(false);

    try {
      const res = await fetch("https://swapi.info/api/films");

      if (!res.ok) {
        throw new Error("Something went wrong... Retrying");
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
      setTrying(true); // start retrying
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (trying) {
      retryTimeoutRef.current = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000);
    }

    return () => clearTimeout(retryTimeoutRef.current);
  }, [trying]);

  const cancelRetryHandler = () => {
    clearTimeout(retryTimeoutRef.current);
    setTrying(false);
    setError("Retry canceled by the user.");
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {trying && <button onClick={cancelRetryHandler}>Cancel Retry</button>}
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
