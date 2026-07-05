import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiUserPlus,
  FiMapPin,
} from "react-icons/fi";
import ScrollReveal from "../components/effects/ScrollReveal";
import LoadingButton from "../components/LoadingButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { signUpUser, clearAuthError } from "../redux/slices/authSlice";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toast";
import "../styles/Auth.scss";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);

  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      !form.customerName.trim() ||
      !form.phoneNumber.trim() ||
      !form.address.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      showWarningToast("Please fill in all required fields");
      return;
    }

    const phoneValue = form.phoneNumber.trim();
    const phoneRegex = /^\+?[0-9\s().-]{7,20}$/;
    const digits = phoneValue.replace(/\D/g, "");

    if (!phoneRegex.test(phoneValue) || digits.length < 7 || digits.length > 15) {
      showWarningToast("Please enter a valid phone number");
      return;
    }

    if (form.password.length < 6) {
      showWarningToast("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showWarningToast("Passwords do not match");
      return;
    }

    const result = await dispatch(
      signUpUser({
        customerName: form.customerName.trim(),
        phoneNumber: phoneValue,
        address: form.address.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
    );

    if (signUpUser.fulfilled.match(result)) {
      showSuccessToast(
        `Welcome ${form.customerName.trim()}! Your account has been created successfully.`
      );
      navigate("/", { replace: true });
      return;
    }

    showErrorToast(result.payload || "Registration failed. Please try again.");
  };

  return (
    <div className="page-wrapper auth-page">
      <section className="auth-page__card auth-page__card--wide">
        <ScrollReveal direction="up">
          <div className="auth-page__header">
            <h1>Sign Up</h1>
            <p>Create your JeruTech account and start shopping</p>
          </div>

          <form className="auth-page__form" onSubmit={handleSubmit}>
            <label className="auth-page__field">
              <FiUser className="auth-page__field-icon" />
              <input
                type="text"
                name="customerName"
                placeholder="Customer name"
                value={form.customerName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>

            <label className="auth-page__field">
              <FiPhone className="auth-page__field-icon" />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone number"
                value={form.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </label>

            <label className="auth-page__field auth-page__field--area">
              <FiMapPin className="auth-page__field-icon auth-page__field-icon--area" />
              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                autoComplete="street-address"
                required
                rows={3}
              />
            </label>

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
                autoComplete="new-password"
                required
                minLength={6}
              />
            </label>

            <label className="auth-page__field">
              <FiLock className="auth-page__field-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                minLength={6}
              />
            </label>

            <LoadingButton
              type="submit"
              className="auth-page__submit"
              loading={loading}
            >
              <FiUserPlus /> Sign Up
            </LoadingButton>
          </form>

          <p className="auth-page__switch">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default SignUp;