import React from 'react';
import { Home, Microsoft, Alibaba, ENI, InstanceMigration, ASI, Resume, Interview } from './pages';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/microsoft', element: <Microsoft /> },
  { path: '/alibaba', element: <Alibaba /> },
  { path: '/samples', element: <ENI /> },
  { path: '/instance-migration', element: <InstanceMigration /> },
  { path: '/asi', element: <ASI /> },
  { path: '/resume', element: <Resume /> },
  { path: '/interview', element: <Interview /> },
];

export default routes;
