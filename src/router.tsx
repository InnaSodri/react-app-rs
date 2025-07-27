import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Home } from './components/Home';
import { About } from './components/About';

// 404 fallback as a proper component (optional but cleaner)
const NotFound = () => (
  <p style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</p>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, //
    children: [
      { index: true, element: <Home /> }, //
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
