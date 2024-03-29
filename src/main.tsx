import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import ClickAndDrag from './ClickAndDrag';
import Resources from './Pages/Resources';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/resources',
    element: <Resources />,
  },
  {
    path: '/test',
    element: <ClickAndDrag />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
