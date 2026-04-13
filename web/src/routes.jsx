import React from 'react';
import { Home, Experience, Resume, Interview, Learn, Links } from './pages';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/experience', element: <Experience /> },
  { path: '/resume', element: <Resume /> },
  { path: '/interview', element: <Interview /> },
  { path: '/learn', element: <Learn /> },
  { path: '/links', element: <Links /> },
];

export default routes;
