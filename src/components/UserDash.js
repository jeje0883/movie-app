// src/components/UserDash.js
import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap'; 
import axiosInstance from '../api/axiosInstance'; 
import '../styles/sharedStyles.css'; // Your custom styles if needed
import { UserContext } from '../context/UserContext';

const UserDash = () => {
  const { user } = useContext(UserContext); // Get user data from context
  const [movies, setMovies] = useState([]); // List of movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState(''); // For storing new comment
  const [selectedMovie, setSelectedMovie] = useState(null); // Holds movie object for adding comment
  const [showModal, setShowModal] = useState(false);

  // Base URL for the API
  const API_BASE_URL = 'https://movieapp-api-lms1.onrender.com';

  // Function to fetch movies
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/movies/getMovies`);
      setMovies(response.data.movies || response.data); // Adjust based on API response structure
    } catch (err) {
      console.error('Error fetching movies:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to fetch movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Function to open the Add Comment modal
  const handleAddCommentModal = (movie) => {
    setSelectedMovie(movie);
    setComment(''); // Reset comment input
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
    setComment('');
    setError(null);
  };

  // Function to add a comment to a movie
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Please write a comment.');
      return;
    }

    console.log(`Comment: ${comment.trim()}`);

    // Retrieve the token from localStorage
    const token = localStorage.getItem('userToken');

    if (!token) {
      setError('User is not authenticated. Please log in.');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `movies/addComment/${selectedMovie._id || selectedMovie.id}`,
        { comment: comment,
          user: user.id
         }
      );

      console.log('New comment added:', response.data);

      setComment(''); // Reset comment input
      setShowModal(false); // Close modal after submission
      fetchMovies(); // Refresh movies to display new comment
    } catch (err) {
      console.error('Error adding comment:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to add comment.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Movies List</h2>

      {/* Display loading or error message */}
      {loading && <p>Loading movies...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Movies Grid */}
      {!loading && !error && (
        <div className="row">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div className="col-md-4 mb-4" key={movie.id || movie._id}>
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text"><strong>Director:</strong> {movie.director}</p>
                    <p className="card-text"><strong>Year:</strong> {movie.year}</p>
                    <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
                    <p className="card-text">{movie.description}</p>
                    <div className="mt-auto">
                      <h6>Comments:</h6>
                      <ul>
                        {movie.comments && movie.comments.length > 0 ? (
                          movie.comments.map((c, index) => <li key={index}>{c}</li>)
                        ) : (
                          <p>No comments yet</p>
                        )}
                      </ul>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddCommentModal(movie)}
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No movies found. Start adding some!</p>
          )}
        </div>
      )}

      {/* Comment Modal */}
      {selectedMovie && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Comment for "{selectedMovie.title}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddComment}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button id='addComment' type="submit" className="btn btn-primary">Submit Comment</button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UserDash;
