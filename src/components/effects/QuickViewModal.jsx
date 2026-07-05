import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiX, FiShoppingCart } from "react-icons/fi";
import LoadingButton from "../LoadingButton";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearQuickViewProduct } from "../../redux/slices/uiSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { getEffectivePrice, formatPrice, isProductInCart } from "../../utils/productHelpers";
import { showSuccessToast, showInfoToast, showWarningToast } from "../../utils/toast";

const QuickViewModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const product = useAppSelector((state) => state.ui.quickViewProduct);
  const token = useAppSelector((state) => state.auth.token);
  const profileLoading = useAppSelector((state) => state.auth.profileLoading);
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const cartMutating = useAppSelector((state) => state.cart.mutating);
  const open = Boolean(product);
  const isAuthResolving = Boolean(token) && !user && profileLoading;

  if (!product) return null;

  const price = getEffectivePrice(product);
  const isDeal = Boolean(product.isDiscounted || product.discount > 0);
  const currentImage = product.images?.[0] || product.image || "";

  const handleClose = () => dispatch(clearQuickViewProduct());

  const handleAdd = async () => {
    if (isAuthResolving || cartMutating) {
      return;
    }

    if (!user || user.role !== "customer") {
      navigate("/signin", {
        replace: true,
        state: {
          from: location,
          message: "Please sign in to add products to your cart.",
        },
      });
      return;
    }

    const alreadyInCart = isProductInCart(cartItems, product);
    const result = await dispatch(
      addToCart({ productId: product.id, quantity: 1 })
    );

    if (addToCart.rejected.match(result)) {
      showWarningToast(result.payload || "Failed to add to cart");
      return;
    }

    if (alreadyInCart) {
      showInfoToast(`${product.name} is already in your cart — quantity updated`);
    } else {
      showSuccessToast(`${product.name} added to cart`);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ className: "quick-view-modal" }}>
      <button type="button" className="quick-view-modal__close" onClick={handleClose} aria-label="Close">
        <FiX />
      </button>
      <DialogContent className="quick-view-modal__content">
        <div className="quick-view-modal__media">
          <img src={currentImage} alt={product.name} />
        </div>
        <div className="quick-view-modal__info">
          <span className="quick-view-modal__category">{product.category}</span>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <div className="quick-view-modal__price">
            {isDeal && product.price != null && (
              <span className="old">{formatPrice(product.price)}</span>
            )}
            <span className="current">{formatPrice(price)}</span>
          </div>
          <div className="quick-view-modal__actions">
            <LoadingButton
              type="button"
              className="quick-view-modal__btn"
              onClick={handleAdd}
              loading={isAuthResolving || cartMutating}
              disabled={isAuthResolving || cartMutating}
            >
              <FiShoppingCart />{" "}
              {isAuthResolving
                ? "Checking account..."
                : cartMutating
                  ? "Adding..."
                  : "Add to Cart"}
            </LoadingButton>
            <Link to={`/product/${product.id}`} className="quick-view-modal__link" onClick={handleClose}>
              View Full Details
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
