import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiMapPin, FiPhone, FiTrash2, FiUser } from "react-icons/fi";
import DashboardPanelSkeleton from "../../components/DashboardPanelSkeleton";
import LoadingButton from "../../components/LoadingButton";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearAuthError, deleteAccount, updateProfile } from "../../redux/slices/authSlice";
import { resetCart } from "../../redux/slices/cartSlice";
import { showDeleteAccountConfirm } from "../../utils/alerts";
import { removeFavourite, getFavourites } from "../../utils/favourites";
import { showErrorToast, showSuccessToast, showWarningToast } from "../../utils/toast";

const Settings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const profileLoading = useAppSelector((state) => state.auth.profileLoading);
  const profileSaving = useAppSelector((state) => state.auth.profileSaving);
  const profileDeleting = useAppSelector((state) => state.auth.profileDeleting);

  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        customerName: user.customerName || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profileSaving || profileDeleting) return;

    if (
      !form.customerName.trim() ||
      !form.phoneNumber.trim() ||
      !form.address.trim()
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

    if (form.password && form.password !== form.confirmPassword) {
      showWarningToast("Passwords do not match");
      return;
    }

    const payload = {
      customerName: form.customerName.trim(),
      phoneNumber: phoneValue,
      address: form.address.trim(),
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    const result = await dispatch(updateProfile(payload));

    if (updateProfile.fulfilled.match(result)) {
      showSuccessToast("Profile updated successfully");
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      return;
    }

    showErrorToast(result.payload || "Failed to update profile");
  };

  const clearLocalUserData = () => {
    getFavourites().forEach((item) => removeFavourite(item.id));
    dispatch(resetCart());
  };

  const handleDeleteAccount = async () => {
    if (profileSaving || profileDeleting) return;

    const confirmed = await showDeleteAccountConfirm();
    if (!confirmed) return;

    const result = await dispatch(deleteAccount());

    if (deleteAccount.fulfilled.match(result)) {
      clearLocalUserData();
      showSuccessToast("Your account has been permanently deleted");
      navigate("/", { replace: true });
      return;
    }

    showErrorToast(result.payload || "Failed to delete account");
  };

  if (profileLoading && !user) {
    return <DashboardPanelSkeleton variant="form" />;
  }

  return (
    <div className="dashboard-panel">
      <p className="dashboard-panel__intro">
        Update your account details. Your email address cannot be changed. Leave
        the password fields blank to keep your current password.
      </p>

      <form className="dashboard-panel__form" onSubmit={handleSubmit} noValidate>
        <fieldset
          disabled={profileSaving || profileDeleting}
          className="dashboard-panel__fieldset"
        >
          <label className="dashboard-panel__field">
            <span>
              <FiUser aria-hidden="true" /> Full Name
            </span>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              required
            />
          </label>

          <label className="dashboard-panel__field">
            <span>
              <FiMail aria-hidden="true" /> Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              disabled
              className="dashboard-panel__input--readonly"
              aria-describedby="settings-email-help"
            />
            <small id="settings-email-help" className="dashboard-panel__field-hint">
              Email cannot be changed after registration.
            </small>
          </label>

          <label className="dashboard-panel__field">
            <span>
              <FiPhone aria-hidden="true" /> Phone
            </span>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </label>

          <label className="dashboard-panel__field">
            <span>
              <FiMapPin aria-hidden="true" /> Address
            </span>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              required
            />
          </label>

          <label className="dashboard-panel__field">
            <span>
              <FiLock aria-hidden="true" /> New Password
            </span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
          </label>

          <label className="dashboard-panel__field">
            <span>
              <FiLock aria-hidden="true" /> Confirm Password
            </span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </label>
        </fieldset>

        <LoadingButton
          type="submit"
          loading={profileSaving}
          disabled={profileDeleting}
          className="dashboard-panel__submit"
        >
          Save Changes
        </LoadingButton>
      </form>

      <section className="dashboard-panel__danger-zone">
        <h3>Delete Account</h3>
        <p>
          Permanently remove your account and all personal data from JeruTech.
          This action cannot be undone.
        </p>
        <LoadingButton
          type="button"
          loading={profileDeleting}
          disabled={profileSaving}
          className="dashboard-panel__delete-btn"
          onClick={handleDeleteAccount}
        >
          <FiTrash2 aria-hidden="true" />
          Delete Account
        </LoadingButton>
      </section>
    </div>
  );
};

export default Settings;
