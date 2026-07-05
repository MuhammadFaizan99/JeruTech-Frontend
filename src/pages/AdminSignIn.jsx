import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import ScrollReveal from "../components/effects/ScrollReveal";
import LoadingButton from "../components/LoadingButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { signInAdmin, clearAuthError } from "../redux/slices/authSlice";
import { showSuccessToast, showErrorToast, showWarningToast } from "../utils/toast";
import "../styles/Auth.scss";

const AdminSignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);
  const [form, setForm] = useState({ email: "", password: "" });

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
      signInAdmin({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
    );

    if (signInAdmin.fulfilled.match(result)) {
      showSuccessToast("Admin login successful");
      navigate("/admin", { replace: true });
      return;
    }

    showErrorToast(result.payload || "Invalid admin credentials");
  };

  return (
    <div className="page-wrapper auth-page">
      <section className="auth-page__card">
        <ScrollReveal direction="up">
          <div className="auth-page__header">
            <h1>Admin Sign In</h1>
            <p>Manage orders, wallets, and approvals</p>
          </div>

          {location.state?.message && (
            <p className="auth-page__notice">{location.state.message}</p>
          )}

          <form className="auth-page__form" onSubmit={handleSubmit}>
            <label className="auth-page__field">
              <FiMail className="auth-page__field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Admin email"
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

            <LoadingButton type="submit" className="auth-page__submit" loading={loading}>
              <FiShield /> Admin Sign In
            </LoadingButton>
          </form>

          <p className="auth-page__switch">
            Customer account? <Link to="/signin">Customer Sign In</Link>
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default AdminSignIn;
