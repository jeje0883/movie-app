import React, { useState, useEffect } from 'react';

import '../styles/sharedStyles.css'; // Your custom styles if needed

const UserDash = () => {
  const [movies, setMovies] = useState([]); // List of movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState(''); // For storing new comment
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Holds movie id for adding comment

  // Fetch movies when the component mounts
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovies`);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }
      const data = await response.json();
      setMovies(data.movies || data); // Adjust based on API response structure
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Add comment to the selected movie
  const handleAddComment = async (e, movieId) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Please write a comment.');
      return;
    }

    try {
      const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/addComment/${movieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }

      setComment(''); // Reset comment input
      await fetchMovies(); // Refresh movies to display new comment
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Movies List</h2>

      {loading && <p>Loading movies...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="row">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div className="col-md-4 mb-4" key={movie.id || movie._id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text"><strong>Director:</strong> {movie.director}</p>
                    <p className="card-text"><strong>Year:</strong> {movie.year}</p>
                    <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
                    <p className="card-text">{movie.description}</p>
                    <div>
                      <h6>Comments:</h6>
                      <ul>
                        {movie.comments && movie.comments.length > 0 ? (
                          movie.comments.map((c, index) => <li key={index}>{c}</li>)
                        ) : (
                          <p>No comments yet</p>
                        )}
                      </ul>
                    </div>
                    <form onSubmit={(e) => handleAddComment(e, movie.id || movie._id)}>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Add a comment"
                          value={selectedMovieId === (movie.id || movie._id) ? comment : ''}
                          onFocus={() => setSelectedMovieId(movie.id || movie._id)}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">Add Comment</button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No movies found. Start adding some!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDash;
