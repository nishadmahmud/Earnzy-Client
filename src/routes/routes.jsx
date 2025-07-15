import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "../components/PrivateRoute";
import BuyerHome from "../pages/Dashboard/Buyer/BuyerHome";
import AddTask from "../pages/Dashboard/Buyer/AddTask";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    children: [
      { path: "", element: <BuyerHome /> },
      { path: "tasks", element: <div>TaskList (Worker)</div> },
      { path: "submissions", element: <div>My Submissions (Worker)</div> },
      { path: "withdrawals", element: <div>Withdrawals (Worker)</div> },
      { path: "add-task", element: <AddTask /> },
      { path: "my-tasks", element: <div>My Task's (Buyer)</div> },
      { path: "purchase-coin", element: <div>Purchase Coin (Buyer)</div> },
      { path: "payment-history", element: <div>Payment history (Buyer)</div> },
      { path: "manage-users", element: <div>Manage Users (Admin)</div> },
      { path: "manage-tasks", element: <div>Manage Task (Admin)</div> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
