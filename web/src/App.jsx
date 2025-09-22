
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Microsoft from './components/Microsoft';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/microsoft" element={<Microsoft />} />
      </Routes>
    </BrowserRouter>
  );
}