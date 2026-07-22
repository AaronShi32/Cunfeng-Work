import React from 'react';
import { Home, Experience, Resume, Interview, Shangan, Learn, Links } from './pages';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/experience', element: <Experience /> },
  { path: '/resume', element: <Resume /> },
  { path: '/interview', element: <Interview /> },
  { path: '/shangan', element: <Shangan /> },
  { path: '/learn', element: <Learn /> },
  { path: '/links', element: <Links /> },
];

export default routes;
