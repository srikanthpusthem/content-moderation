import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use Routes instead of Switch
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Examples from './pages/Examples';
import ProjectFlow from './pages/ProjectFlow';
import './App.css';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>  {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/flow" element={<ProjectFlow />} />
      </Routes>
    </Router>
  );
}

export default App;
