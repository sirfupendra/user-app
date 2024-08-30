import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    axios.post('http://localhost:5000/login', loginData)
      .then((response) => {
        // Store the JWT token in local storage
        localStorage.setItem('jwt_token', response.data.access_token);
        console.log(response.data);
        alert('Login successful');
        // Redirect to dashboard or another protected route
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Login error:', error.response.data);
        alert('Invalid credentials');
      });
  };

  return (
    <div>
      <h1>LOGIN TO GO ON DASHBOARD!</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email </label>
        <input
          type="email"
          value={email}
          onChange={(e) => SetEmail(e.target.value)}
          name="email"
        />
        
        <label htmlFor="password">Password </label>
        <input
          type="password"
          value={password}
          onChange={(e) => SetPassword(e.target.value)}
          name="password"
        />

        <button type="submit">Login</button>
      </form>
      <Link to="/signup">Go to Signup Page</Link>
    </div>
  );
}

export default Home;
