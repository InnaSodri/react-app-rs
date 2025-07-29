import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Home } from './components/Home';
import { About } from './components/About';
import NotFound from './components/NotFound';
import DetailsRoute from './components/DetailsRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'details/:movieId', element: <DetailsRoute /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
