
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Microsoft from './components/Microsoft';
import ASI from './components/ASI';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/microsoft" element={<Microsoft />} />
        <Route path="/asi" element={<ASI />} />
      </Routes>
    </BrowserRouter>
  );
}