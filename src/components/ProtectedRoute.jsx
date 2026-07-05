import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProfile } from "../redux/slices/authSlice";

const ProtectedRoute = ({ children }) => {
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
    return <PageLoader message="Loading your account..." />;
  }

  if (!isAuthenticated || user?.role !== "customer") {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location, message: "Please sign in to order products." }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
