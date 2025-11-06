import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDishSelection from './pages/CustomerDishSelection';
import ChefDishSelection from './pages/ChefDishSelection';
import EnvTest from './pages/EnvTest';
import EnvInfo from './components/EnvInfo';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer" element={<CustomerDishSelection />} />
        <Route path="/chef" element={<ChefDishSelection />} />
        <Route path="/env-test" element={<EnvTest />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* 显示环境信息（仅在开发环境） */}
      {process.env.NODE_ENV === 'development' && <EnvInfo />}
    </Router>
  );
}

export default App;
