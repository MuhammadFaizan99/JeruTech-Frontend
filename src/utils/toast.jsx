import { toast as hotToast } from "react-hot-toast";
import { toast as notify, Slide } from "react-toastify";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";

const defaultOptions = {
  position: "top-right",
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
  className: "jerutech-toast",
  progressClassName: "jerutech-toast__progress",
};

const renderIcon = (Icon, className) => (
  <span className={`jerutech-toast__icon ${className}`}>
    <Icon size={20} />
  </span>
);

const baseToast = (type, message, options = {}) => {
  const icons = {
    success: renderIcon(FiCheckCircle, "jerutech-toast__icon--success"),
    error: renderIcon(FiXCircle, "jerutech-toast__icon--error"),
    warning: renderIcon(FiAlertTriangle, "jerutech-toast__icon--warning"),
    info: renderIcon(FiInfo, "jerutech-toast__icon--info"),
  };

  return notify[type](message, {
    ...defaultOptions,
    icon: icons[type],
    ...options,
  });
};

export const showSuccessToast = (message, options) =>
  baseToast("success", message, options);

export const showErrorToast = (message, options) =>
  baseToast("error", message, options);

export const showWarningToast = (message, options) =>
  baseToast("warning", message, options);

export const showInfoToast = (message, options) =>
  baseToast("info", message, options);

export const showLoadingToast = (message = "Loading…") =>
  hotToast.loading(message, {
    className: "jerutech-hot-toast jerutech-hot-toast--loading",
  });

export const dismissLoadingToast = (toastId) => {
  if (toastId) hotToast.dismiss(toastId);
  else hotToast.dismiss();
};

export const updateLoadingToast = (toastId, message, type = "success") => {
  if (!toastId) return;
  hotToast[type](message, { id: toastId });
};

export default {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showLoadingToast,
  dismissLoadingToast,
  updateLoadingToast,
};
