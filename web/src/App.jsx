
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Microsoft from './components/Microsoft';
import Alibaba from './components/Alibaba';
import ENI from './components/ENI';
import InstanceMigration from './components/InstanceMigration';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/microsoft" element={<Microsoft />} />
        <Route path="/alibaba" element={<Alibaba />} />
        <Route path="/samples" element={<ENI />} />
        <Route path="/instance-migration" element={<InstanceMigration />} />
      </Routes>
    </BrowserRouter>
  );
}