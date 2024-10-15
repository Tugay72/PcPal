// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import './App.css'; // Your existing styles
import Homepage from './Homepage.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Homepage />
      </div>
    </Router>
  );
}

export default App;