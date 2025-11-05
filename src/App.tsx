import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CustomerDishSelection from './pages/CustomerDishSelection';
import ChefDishSelection from './pages/ChefDishSelection';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/customer" element={<CustomerDishSelection />} />
        <Route path="/chef" element={<ChefDishSelection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
