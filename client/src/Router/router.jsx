import { createBrowserRouter } from 'react-router-dom';
import Admin from '../pages/AdminDashboard/Admin';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home Page</div>, // You can replace this with your home component
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  // Add more routes as needed
]);

export default router;
