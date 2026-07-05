import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProfile } from "../redux/slices/authSlice";

const AdminProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const profileLoading = useAppSelector((state) => state.auth.profileLoading);
  const location = useLocation();

  useEffect(() => {
    if (token && !user && !profileLoading) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user, profileLoading]);

  if (token && !user) {
    return <PageLoader message="Loading admin account..." />;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <Navigate
        to="/admin/signin"
        replace
        state={{ from: location, message: "Please sign in with an admin account." }}
      />
    );
  }

  return children;
};

export default AdminProtectedRoute;
