import React from 'react';
import { Home, Microsoft, Alibaba, ENI, InstanceMigration, ASI } from './pages';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/microsoft', element: <Microsoft /> },
  { path: '/alibaba', element: <Alibaba /> },
  { path: '/samples', element: <ENI /> },
  { path: '/instance-migration', element: <InstanceMigration /> },
  { path: '/asi', element: <ASI /> },
];

export default routes;
