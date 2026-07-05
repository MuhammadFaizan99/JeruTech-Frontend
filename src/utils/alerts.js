import Swal from "sweetalert2";
import { formatPrice } from "../utils/productHelpers";

const jeruSwal = Swal.mixin({
  background: "rgba(15, 23, 42, 0.96)",
  color: "#f8fafc",
  backdrop: "rgba(2, 6, 23, 0.72)",
  customClass: {
    popup: "jerutech-swal",
    title: "jerutech-swal__title",
    htmlContainer: "jerutech-swal__text",
    confirmButton: "jerutech-swal__btn jerutech-swal__btn--confirm",
    cancelButton: "jerutech-swal__btn jerutech-swal__btn--cancel",
    actions: "jerutech-swal__actions",
    icon: "jerutech-swal__icon",
  },
  buttonsStyling: false,
  showClass: {
    popup: "jerutech-swal-animate-in",
  },
  hideClass: {
    popup: "jerutech-swal-animate-out",
  },
});

export const showConfirmModal = ({
  title = "Are you sure?",
  text = "",
  html = "",
  icon = "question",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  reverseButtons = true,
} = {}) =>
  jeruSwal.fire({
    title,
    text: html ? undefined : text,
    html: html || undefined,
    icon,
    width: "min(92vw, 520px)",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons,
    customClass: {
      confirmButton:
        confirmVariant === "danger"
          ? "jerutech-swal__btn jerutech-swal__btn--danger"
          : "jerutech-swal__btn jerutech-swal__btn--confirm",
    },
  }).then((result) => result.isConfirmed);

export const showDeleteConfirm = ({
  title = "Delete item?",
  text = "This action cannot be undone.",
  itemName = "",
} = {}) =>
  showConfirmModal({
    title,
    text: itemName ? `${text}\n\n"${itemName}"` : text,
    icon: "warning",
    confirmText: "Delete",
    cancelText: "Keep",
    confirmVariant: "danger",
  });

export const showDeleteAccountConfirm = () =>
  showConfirmModal({
    title: "Delete account permanently?",
    html: `<p>This will permanently delete your JeruTech account and all associated data.</p><p class="jerutech-swal__muted">This action cannot be undone.</p>`,
    icon: "warning",
    confirmText: "Delete Account",
    cancelText: "Keep Account",
    confirmVariant: "danger",
  });

export const showSignOutConfirm = () =>
  showConfirmModal({
    title: "Sign out?",
    text: "Are you sure you want to sign out of your JeruTech account?",
    icon: "question",
    confirmText: "Sign Out",
    cancelText: "Stay Signed In",
  });

export const showClearCartConfirm = () =>
  showConfirmModal({
    title: "Clear cart?",
    text: "All items will be removed from your cart.",
    icon: "warning",
    confirmText: "Clear Cart",
    cancelText: "Cancel",
    confirmVariant: "danger",
  });

export const showRemoveFromCartConfirm = (itemName) =>
  showDeleteConfirm({
    title: "Remove from cart?",
    text: "This product will be removed from your cart.",
    itemName,
  });

export const showPlaceOrderConfirm = ({ itemCount, total, paymentMethod = "Cash on Delivery" } = {}) =>
  showConfirmModal({
    title: "Place order?",
    html: `<p>You are about to place an order for <strong>${itemCount}</strong> item${itemCount !== 1 ? "s" : ""}.</p><p class="jerutech-swal__highlight">Total: <strong>${formatPrice(Number(total ?? 0))}</strong></p><p class="jerutech-swal__muted">Payment: ${paymentMethod}</p>`,
    icon: "question",
    confirmText: "Place Order",
    cancelText: "Review Cart",
  });

export const showOrderSuccessModal = ({
  customerName,
  total,
  paymentMethod = "Cash on Delivery",
  onClose,
} = {}) =>
  jeruSwal
    .fire({
      title: "Order Placed!",
      html: `<p>Thank you, <strong>${customerName}</strong>!</p><p>Your order of <strong>${formatPrice(Number(total ?? 0))}</strong> has been placed successfully.</p><p class="jerutech-swal__muted">Payment: ${paymentMethod}</p>`,
      icon: "success",
      confirmButtonText: "Continue Shopping",
    })
    .then(() => onClose?.());

export const showSuccessModal = ({ title, text, confirmText = "OK" } = {}) =>
  jeruSwal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: confirmText,
  });

export default {
  showConfirmModal,
  showDeleteConfirm,
  showDeleteAccountConfirm,
  showSignOutConfirm,
  showClearCartConfirm,
  showRemoveFromCartConfirm,
  showPlaceOrderConfirm,
  showOrderSuccessModal,
  showSuccessModal,
};
