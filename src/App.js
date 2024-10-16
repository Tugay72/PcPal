// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.js';
import './App.css'; // Your existing styles
import Homepage from './components/homepage/Homepage.js';
import Footer from './components/footer/Footer.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Homepage />
        <Footer />
      </div>
    </Router>
  );
}

export default App;