// src/pages/Movies.js
import React, { useState, useEffect } from 'react';
import '../styles/sharedStyles.css'; // Import the CSS file

const AdminDash = () => {
  const [movies, setMovies] = useState([]); // List of movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    year: '',
    description: '',
    genre: ''
  });
  const [editMovie, setEditMovie] = useState(null); // Holds movie details for editing

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

  // Add movie
  const handleAddMovie = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newMovie.title.trim() || !newMovie.director.trim()) {
      setError('Please provide both title and director for the movie.');
      return;
    }

    try {
      const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/addMovie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });

      if (!response.ok) {
        throw new Error(`Failed to add movie: ${response.statusText}`);
      }

      setNewMovie({
        title: '',
        director: '',
        year: '',
        description: '',
        genre: ''
      }); // Reset form
      await fetchMovies(); // Re-fetch movies to reflect new entry
    } catch (err) {
      setError(err.message);
    }
  };

  // Update movie
  const handleUpdateMovie = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!editMovie.title.trim() || !editMovie.director.trim()) {
      setError('Please provide both title and director for the movie.');
      return;
    }

    try {
      const response = await fetch(`https:/movieapp-api-lms1.onrender.com/movies/updateMovie/${editMovie.id || editMovie._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editMovie),
      });

      if (!response.ok) {
        throw new Error(`Failed to update movie: ${response.statusText}`);
      }

      setEditMovie(null); // Close edit modal
      await fetchMovies(); // Re-fetch movies to reflect the updated entry
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete movie
  const handleDeleteMovie = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this movie?');
    if (!isConfirmed) return;

    try {
      const response = await fetch(`https:/movieapp-api-lms1.onrender.com/movies/deleteMovie/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete movie: ${response.statusText}`);
      }

      await fetchMovies(); // Re-fetch movies to reflect deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Movies List For Admin</h2>

      {loading && <p>Loading movies...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="add-movie-section">
            <h3>Add New Movie</h3>
            <form onSubmit={handleAddMovie} className="movie-form">
              <input
                type="text"
                name="title"
                placeholder="Movie Title"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                required
              />
              <input
                type="text"
                name="director"
                placeholder="Director"
                value={newMovie.director}
                onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                required
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={newMovie.year}
                onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
              />
              <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={newMovie.genre}
                onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
              />
              <button type="submit" className="button">Add Movie</button>
            </form>
          </section>

          <section className="movie-list-section">
            {movies.length > 0 ? (
              <table className="movie-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Director</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie, index) => (
                    <tr key={movie.id || movie._id}>
                      <td>{index + 1}</td>
                      <td>{movie.title}</td>
                      <td>{movie.director}</td>
                      <td>{movie.year}</td>
                      <td>
                        <button onClick={() => setEditMovie(movie)} className="button-blue">Edit</button>
                        <button onClick={() => handleDeleteMovie(movie.id || movie._id)} className="button-red">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No movies found. Start adding some!</p>
            )}
          </section>
        </>
      )}

      {/* Edit Movie Modal */}
      {editMovie && (
        <div className="modal-overlay" onClick={() => setEditMovie(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Movie</h3>
            <form onSubmit={handleUpdateMovie} className="movie-form">
              <input
                type="text"
                name="title"
                placeholder="Movie Title"
                value={editMovie.title}
                onChange={(e) => setEditMovie({ ...editMovie, title: e.target.value })}
                required
              />
              <input
                type="text"
                name="director"
                placeholder="Director"
                value={editMovie.director}
                onChange={(e) => setEditMovie({ ...editMovie, director: e.target.value })}
                required
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={editMovie.year}
                onChange={(e) => setEditMovie({ ...editMovie, year: e.target.value })}
              />
              <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={editMovie.genre}
                onChange={(e) => setEditMovie({ ...editMovie, genre: e.target.value })}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editMovie.description}
                onChange={(e) => setEditMovie({ ...editMovie, description: e.target.value })}
              />
              <div className="modal-actions">
                <button type="submit" className="button">Update Movie</button>
                <button
                  type="button"
                  onClick={() => setEditMovie(null)}
                  className="button button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDash;
