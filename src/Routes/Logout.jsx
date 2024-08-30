import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      alert('No token found');
      return;
    }

    axios.post('http://localhost:5000/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log('Logout response:', response); // Log the entire response object
      localStorage.removeItem('jwt_token');  // Remove token from local storage
      alert('Logout successful');
      navigate('/');  // Redirect to login page
    })
    .catch((error) => {
      console.error('Logout error:', error.response ? error.response.data : error.message);
      alert('Logout failed');
    });
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
