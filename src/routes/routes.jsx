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
import MyTasks from "../pages/Dashboard/Buyer/MyTasks";
import PurchaseCoin from "../pages/Dashboard/Buyer/PurchaseCoin";
import PaymentHistory from "../pages/Dashboard/Buyer/PaymentHistory";
import WorkerHome from "../pages/Dashboard/Wroker/WorkerHome";
import WorkerTaskList from "../pages/Dashboard/Wroker/WorkerTaskList";
import WorkerTaskDetails from "../pages/Dashboard/Wroker/WorkerTaskDetails";
import WorkerMySubmissions from "../pages/Dashboard/Wroker/WorkerMySubmissions";
import WorkerWithdrawals from "../pages/Dashboard/Wroker/WorkerWithdrawals";
import DashboardHome from "../pages/Dashboard/DashboardHome";

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
      { path: "", element: <DashboardHome /> },
      { path: "tasks", element: <WorkerTaskList /> },
      { path: "tasks/:id", element: <WorkerTaskDetails /> },
      { path: "submissions", element: <WorkerMySubmissions /> },
      { path: "withdrawals", element: <WorkerWithdrawals /> },
      { path: "add-task", element: <AddTask /> },
      { path: "my-tasks", element: <MyTasks /> },
      { path: "purchase-coin", element: <PurchaseCoin /> },
      { path: "payment-history", element: <PaymentHistory /> },
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
