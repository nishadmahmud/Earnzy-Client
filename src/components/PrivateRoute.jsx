import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../auth/AuthProvider";
import Spinner from "./Spinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
