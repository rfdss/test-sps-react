import { createBrowserRouter } from "react-router-dom";
import Users from "./pages/Users";
import Login from "./pages/Login";
import CheckAuthRoute from "./components/CheckAuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <CheckAuthRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Users />,
      },
    ],
  },

]);

export default router;
