import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import ScrollReveal from "../components/effects/ScrollReveal";
import LoadingButton from "../components/LoadingButton";
import Loader from "../components/Loader";
import PageLoader from "../components/PageLoader";
import Pagination from "../components/Pagination";
import CustomerDetailsSkeleton from "../components/CustomerDetailsSkeleton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  placeOrder,
} from "../redux/slices/cartSlice";
import { formatPrice } from "../utils/productHelpers";
import {
  showSuccessToast,
  showWarningToast,
  showErrorToast,
} from "../utils/toast";
import {
  showClearCartConfirm,
  showRemoveFromCartConfirm,
  showPlaceOrderConfirm,
  showOrderSuccessModal,
} from "../utils/alerts";

import "../styles/Cart.scss";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const subtotal = useAppSelector((state) => state.cart.subtotal);
  const taxRate = useAppSelector((state) => state.cart.taxRate);
  const taxLoaded = useAppSelector((state) => state.cart.taxLoaded);
  const tax = useAppSelector((state) => state.cart.tax);
  const deliveryFee = useAppSelector((state) => state.cart.deliveryFee);
  const total = useAppSelector((state) => state.cart.total);
  const pagination = useAppSelector((state) => state.cart.pagination);
  const loading = useAppSelector((state) => state.cart.loading);
  const mutating = useAppSelector((state) => state.cart.mutating);
  const placingOrder = useAppSelector((state) => state.cart.placingOrder);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    dispatch(fetchCart({ page, limit }));
  }, [dispatch, page, limit]);

  const refreshCart = async (nextPage = page, nextLimit = limit) => {
    const result = await dispatch(fetchCart({ page: nextPage, limit: nextLimit }));

    if (fetchCart.rejected.match(result)) {
      showErrorToast(result.payload || "Failed to refresh cart");
    }

    return result;
  };

  const handleRemoveItem = async (item) => {
    const confirmed = await showRemoveFromCartConfirm(item.name);
    if (!confirmed) return;

    const result = await dispatch(removeFromCart(item.itemId));

    if (removeFromCart.fulfilled.match(result)) {
      const nextPage = Math.max(
        1,
        Math.min(page, Math.max(1, Math.ceil(Math.max(0, (pagination.totalItems || 0) - 1) / limit)))
      );
      await refreshCart(nextPage, limit);
      showSuccessToast(`${item.name} removed from cart`);
      return;
    }

    showErrorToast(result.payload || "Failed to remove item");
  };

  const handleClearCart = async () => {
    const confirmed = await showClearCartConfirm();
    if (!confirmed) return;

    const result = await dispatch(clearCart());

    if (clearCart.fulfilled.match(result)) {
      setPage(1);
      await refreshCart(1, limit);
      showSuccessToast("Cart cleared");
      return;
    }

    showErrorToast(result.payload || "Failed to clear cart");
  };

  const handleQuantityChange = async (itemId, action) => {
    const thunk = action === "increase" ? increaseQuantity : decreaseQuantity;
    const result = await dispatch(thunk(itemId));

    if (thunk.fulfilled.match(result)) {
      await refreshCart(page, limit);
      return;
    }

    if (thunk.rejected.match(result)) {
      showErrorToast(result.payload || "Failed to update quantity");
    }
  };

  const handlePageChange = (nextPage) => setPage(nextPage);

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || user?.role !== "customer") {
      navigate("/signin", {
        replace: true,
        state: {
          from: location,
          message: "Please sign in to order products.",
        },
      });
      return;
    }

    if (cartItems.length === 0) {
      showWarningToast("Your cart is empty");
      return;
    }

    const confirmed = await showPlaceOrderConfirm({
      itemCount: cartItems.length,
      total,
      paymentMethod: "Cash on Delivery",
    });
    if (!confirmed) return;

    const result = await dispatch(placeOrder({ paymentMethod: "Cash on Delivery" }));

    if (placeOrder.fulfilled.match(result)) {
      await showOrderSuccessModal({
        customerName: user?.customerName,
        total: result.payload?.total ?? total,
        paymentMethod: result.payload?.paymentMethod || "Cash on Delivery",
      });
      showSuccessToast("Order placed successfully! Awaiting admin approval.");
      return;
    }

    showErrorToast(result.payload || "Failed to place order");
  };

  if (loading && cartItems.length === 0) {
    return <PageLoader message="Loading your cart..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper cart-page">
        <section className="cart-page__header">
          <h1>Your Cart</h1>
        </section>
        <section className="cart-page__empty">
          <FiShoppingBag className="cart-page__empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Browse our products and add items to get started.</p>
          <Link to="/products" className="cart-page__shop-btn">
            Shop Products
          </Link>
        </section>
      </div>
    );
  }

  const isBusy = mutating || placingOrder;

  return (
    <div className="page-wrapper cart-page">
      <section className="cart-page__header">
        <ScrollReveal direction="up">
          <h1>Your Cart</h1>
          <p>
            {(pagination.totalItems || cartItems.length)} item{(pagination.totalItems || cartItems.length) !== 1 ? "s" : ""} in your cart
          </p>
        </ScrollReveal>
      </section>

      <section className="cart-page__body">
        <div className="cart-page__layout">
          <div className="cart-page__items-col">
            <div className="cart-page__items-header">
              <h2>Cart Items</h2>
              <button
                type="button"
                className="cart-page__clear-btn"
                onClick={handleClearCart}
                disabled={isBusy}
              >
                Clear Cart
              </button>
            </div>
            <div className="cart-page__items">
              {cartItems.map((item) => (
                <ScrollReveal key={item.itemId} direction="up">
                  <article className="cart-item">
                    <Link to={`/product/${item.id}`} className="cart-item__img-wrap">
                      <img src={item.image} alt={item.name} />
                    </Link>
                    <div className="cart-item__info">
                      <Link to={`/product/${item.id}`} className="cart-item__name">
                        {item.name}
                      </Link>
                      <span className="cart-item__category">{item.category}</span>
                      <span className="cart-item__price">{formatPrice(item.price)}</span>
                      {item.oldPrice && (
                        <span className="cart-item__old-price">
                          {formatPrice(item.oldPrice)}
                        </span>
                      )}
                    </div>
                    <div className="cart-item__controls">
                      <div className="cart-item__qty">
                        <button
                          type="button"
                          aria-label="Decrease"
                          onClick={() => handleQuantityChange(item.itemId, "decrease")}
                          disabled={isBusy}
                        >
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase"
                          onClick={() => handleQuantityChange(item.itemId, "increase")}
                          disabled={isBusy || item.quantity >= item.stock}
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <span className="cart-item__line-total">
                        {formatPrice(item.lineTotal ?? item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        className="cart-item__remove"
                        aria-label="Remove item"
                        onClick={() => handleRemoveItem(item)}
                        disabled={isBusy}
                      >
                        <FiTrash2 />
                        Remove
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            {!loading && cartItems.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage || 1}
                totalPages={pagination.totalPages || 1}
                onPageChange={handlePageChange}
                scrollTarget=".cart-page"
                itemsPerPage={limit}
                onItemsPerPageChange={handleLimitChange}
                totalItems={pagination.totalItems || 0}
              />
            )}
          </div>

          <ScrollReveal direction="right" className="cart-page__sidebar-col">
            <aside className="cart-page__sidebar">
              {!user ? (
                <CustomerDetailsSkeleton />
              ) : (
                <section className="cart-page__customer">
                  <h2>Customer Details</h2>
                  <ul className="cart-page__customer-list">
                    <li>
                      <FiUser />
                      <span>{user.customerName}</span>
                    </li>
                    <li>
                      <FiPhone />
                      <span>{user.phoneNumber}</span>
                    </li>
                    <li>
                      <FiMapPin />
                      <span>{user.address}</span>
                    </li>
                    <li>
                      <FiMail />
                      <span>{user.email}</span>
                    </li>
                  </ul>
                </section>
              )}

              <section className="cart-page__summary">
                <h2>Order Summary</h2>
                <div className="cart-page__row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-page__row">
                  <span>
                    Tax{" "}
                    {taxLoaded ? `(${(taxRate * 100).toFixed(0)}%)` : ""}
                  </span>
                  <span className="cart-page__tax-value">
                    {!taxLoaded && loading ? (
                      <Loader size="sm" inline aria-label="Loading tax" />
                    ) : (
                      formatPrice(tax)
                    )}
                  </span>
                </div>
                <div className="cart-page__row">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="cart-page__row cart-page__row--total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <p className="cart-page__payment">
                  <strong>Payment Method:</strong> Cash on Delivery (Cash in Hand)
                </p>

                <p className="cart-page__delivery-note">
                  Your order will be submitted as pending until an admin approves it.
                  Please pay with cash when your package is delivered.
                </p>

                <LoadingButton
                  className="cart-page__checkout-btn"
                  loading={placingOrder}
                  disabled={mutating}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </LoadingButton>
              </section>
            </aside>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Cart;
