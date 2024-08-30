import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Signup from './routes/Signup';
import Dashboard from './routes/Dashboard';  // Add a Dashboard component for logged-in users
import Logout from './Routes/Logout';
import Admin from './Routes/Admin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </Router>
  );
};

export default App;
