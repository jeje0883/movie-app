import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap'; 
import { Notyf } from 'notyf'; // Import Notyf
import 'notyf/notyf.min.css'; // Import Notyf styles
import axiosInstance from '../api/axiosInstance'; // Import Axios instance
import { UserContext } from '../context/UserContext'; // Import UserContext
import '../styles/sharedStyles.css'; // Import the CSS file

const AdminDash = () => {
  const { user } = useContext(UserContext); // Access user from context
  const [editMovie, setEditMovie] = useState(null);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false); 
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

  // Initialize Notyf for notifications
  const notyf = new Notyf({
    duration: 3000, // 3 seconds
    position: {
      x: 'left',
      y: 'bottom',
    },
  });

  useEffect(() => {
    // Fetch movies when component mounts
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/movies/getMovies');
      setMovies(response.data.movies || response.data); // Adjust based on API response structure
      notyf.success('Movies loaded successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      notyf.error('Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  // Add movie
  const handleAddMovie = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/movies/addMovie', newMovie);

      console.log('New movie added:', response.data);

      setNewMovie({
        title: '',
        director: '',
        year: '',
        genre: '',
        description: '',
      });
      handleCloseModal(); // Close modal after submission
      fetchMovies(); // Refresh the movies list
      notyf.success('Movie added successfully!');
    } catch (err) {
      console.error('Error adding movie:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.message);
      notyf.error('Failed to add movie.');
    }
  };

  // Handle editing a movie
  const handleEditMovie = (movie) => {
    setEditMovie(movie);
    setNewMovie({
      title: movie.title,
      director: movie.director,
      year: movie.year,
      genre: movie.genre,
      description: movie.description,
    });
    setShowAddMovieModal(true); // Open modal for editing
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
      const response = await axiosInstance.patch(`/movies/updateMovie/${editMovie.id || editMovie._id}`, editMovie);

      console.log('Movie updated:', response.data);

      handleCloseModal(); // Close modal after updating
      await fetchMovies(); // Re-fetch movies to reflect the updated entry
      notyf.success('Movie updated successfully!');
    } catch (err) {
      console.error('Error updating movie:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.message);
      notyf.error('Failed to update movie.');
    }
  };

  // Delete movie
  const handleDeleteMovie = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this movie?');
    if (!isConfirmed) return;

    try {
      const response = await axiosInstance.delete(`/movies/deleteMovie/${id}`);

      console.log('Movie deleted:', response.data);

      await fetchMovies(); // Re-fetch movies to reflect deletion
      notyf.success('Movie deleted successfully!');
    } catch (err) {
      console.error('Error deleting movie:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.message);
      notyf.error('Failed to delete movie.');
    }
  };

  // Handle closing the modal and resetting states
  const handleCloseModal = () => {
    setShowAddMovieModal(false);
    setEditMovie(null);
    setNewMovie({
      title: '',
      director: '',
      year: '',
      genre: '',
      description: '',
    });
    setError(null); // Optionally reset error state
  };

  return (
    <div className="container mt-4">
      <h2>Movie List</h2>

      {/* Button to open the modal for adding a new movie */}
      <button onClick={() => setShowAddMovieModal(true)} className="btn btn-primary custom-admin-button mb-3">
        Add New Movie
      </button>

      {/* Display loading or error message */}
      {loading && <p>Loading movies...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Table to display movies */}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Director</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <tr key={movie._id || movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.director}</td>
                  <td>{movie.year}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.description}</td>
                  <td>
                    <button onClick={() => handleEditMovie(movie)} className="btn btn-warning custom-admin-button btn-sm me-2">
                      Update
                    </button>
                    <button onClick={() => handleDeleteMovie(movie._id || movie.id)} className="btn btn-danger custom-admin-button btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No movies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal to add or edit a movie */}
      <Modal show={showAddMovieModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMovie ? `Edit "${editMovie.title}"` : 'Add New Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={editMovie ? handleUpdateMovie : handleAddMovie} className="movie-form">
            <div className="mb-3">
              <input
                type="text"
                name="title"
                placeholder="Movie Title"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="director"
                placeholder="Director"
                value={newMovie.director}
                onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={newMovie.year}
                onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={newMovie.genre}
                onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <textarea
                name="description"
                placeholder="Description"
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                className="form-control"
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary custom-admin-button">
              {editMovie ? 'Update Movie' : 'Add Movie'}
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDash;
