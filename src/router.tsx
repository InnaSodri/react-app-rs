import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { Home } from './components/Home';
import { About } from './components/About';
import NotFound from './components/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/1" /> },
      { path: ':page/:movieId?', element: <Home /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
