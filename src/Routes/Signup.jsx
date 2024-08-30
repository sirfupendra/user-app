import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [Name, SetName] = useState('');
  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const signupData = {
      Name,
      email,
      password,
    };

    axios.post('http://localhost:5000/signup', signupData)
      .then((response) => {
        console.log(response.data);
        alert('Signup successful');
        navigate('/');  // Redirect to login page after successful signup
      })
      .catch((error) => {
        console.error('Signup error:', error.response.data);
        alert('User already exists or other error');
      });
  };

  return (
    <div>
      <h1>SIGNUP TO CREATE AN ACCOUNT!</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Name">Name </label>
        <input
          type="text"
          value={Name}
          onChange={(e) => SetName(e.target.value)}
          name="Name"
        />
        
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

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
