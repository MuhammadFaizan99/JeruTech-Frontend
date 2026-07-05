import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import ScrollReveal from "../components/effects/ScrollReveal";
import LoadingButton from "../components/LoadingButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { signInUser, clearAuthError } from "../redux/slices/authSlice";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toast";
import "../styles/Auth.scss";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.auth.loading);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const redirectMessage = location.state?.message;

  useEffect(() => {
    if (redirectMessage) {
      showWarningToast(redirectMessage);
    }
  }, [redirectMessage]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.email.trim() || !form.password.trim()) {
      showWarningToast("Please fill in all required fields");
      return;
    }

    const result = await dispatch(
      signInUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
    );

    if (signInUser.fulfilled.match(result)) {
      showSuccessToast("Login successful! Welcome back.");

      const from = location.state?.from?.pathname;
      navigate(from && from !== "/signin" ? from : "/", { replace: true });
      return;
    }

    showErrorToast(result.payload || "Invalid email or password.");
  };

  return (
    <div className="page-wrapper auth-page">
      <section className="auth-page__card">
        <ScrollReveal direction="up">
          <div className="auth-page__header">
            <h1>Sign In</h1>
            <p>Access your JeruTech account</p>
          </div>

          <form className="auth-page__form" onSubmit={handleSubmit}>
            <label className="auth-page__field">
              <FiMail className="auth-page__field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-page__field">
              <FiLock className="auth-page__field-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </label>

            <LoadingButton
              type="submit"
              className="auth-page__submit"
              loading={loading}
            >
              <FiLogIn /> Sign In
            </LoadingButton>
          </form>

          <p className="auth-page__switch">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default SignIn;