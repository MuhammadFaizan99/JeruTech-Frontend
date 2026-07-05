import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import { FiHeart, FiEye, FiShoppingCart, FiLayers } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addToCart } from "../redux/slices/cartSlice";
import {
  setQuickViewProduct,
  toggleCompareProduct,
} from "../redux/slices/uiSlice";
import { formatPrice, isProductInCart } from "../utils/productHelpers";
import { isFavourite, toggleFavourite } from "../utils/favourites";
import api from "../api";
import {
  showSuccessToast,
  showInfoToast,
  showWarningToast,
  showErrorToast,
} from "../utils/toast";
import TiltCard from "./effects/TiltCard";
import MagneticButton from "./effects/MagneticButton";
import "../styles/ProductCard.scss";

const ProductCard = ({ product, discounted = false }) => {
  const [wishlisted, setWishlisted] = useState(() => isFavourite(product.id));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAppSelector((state) => state.auth.token);
  const profileLoading = useAppSelector((state) => state.auth.profileLoading);
  const user = useAppSelector((state) => state.auth.user);
  const compareItems = useAppSelector((state) => state.ui.compareItems);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const cartMutating = useAppSelector((state) => state.cart.mutating);
  const isCompared = compareItems.some((p) => p.id === product.id);
  const isAuthResolving = Boolean(token) && !user && profileLoading;

  const isDiscounted =
    discounted || product.isDiscounted || Number(product.discount) > 0;

  const currentImage = product.images?.[0] || product.image || "";
  const currentPrice = product.finalPrice ?? product.price ?? 0;
  const oldPrice = isDiscounted ? product.price : null;
  const companyName = product.company || product.name?.split(" ")[0] || "JeruTech";

  const productForCart = {
    ...product,
    id: product.id,
    image: currentImage,
    discounted: isDiscounted,
    price: currentPrice,
    oldPrice,
  };

  const alreadyInCart =
    user?.role === "customer" && isProductInCart(cartItems, productForCart);

  const handleAddToCart = async () => {
    if (isAuthResolving || cartMutating || alreadyInCart) {
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

    const result = await dispatch(
      addToCart({ productId: product.id, quantity: 1 })
    );

    if (addToCart.rejected.match(result)) {
      showWarningToast(result.payload || "Failed to add to cart");
      return;
    }

    showSuccessToast(`${product.name} added to cart`);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setQuickViewProduct(productForCart));
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCompared && compareItems.length >= 2) {
      showWarningToast("You can compare up to 2 products");
      return;
    }
    dispatch(toggleCompareProduct(productForCart));
  };

  const handleToggleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || user.role !== "customer") {
      const { added } = toggleFavourite(productForCart);
      setWishlisted(added);
      showInfoToast(
        added
          ? `${product.name} added to favourites`
          : `${product.name} removed from favourites`,
      );
      return;
    }

    const nextWishlisted = !wishlisted;
    setWishlisted(nextWishlisted);

    try {
      if (nextWishlisted) {
        await api.post(`/favourites/${product.id}`);
        showSuccessToast(`${product.name} added to favourites`);
      } else {
        await api.delete(`/favourites/${product.id}`);
        showInfoToast(`${product.name} removed from favourites`);
      }
    } catch (error) {
      setWishlisted(wishlisted);
      showErrorToast(error.response?.data?.message || "Failed to update favourites");
    }
  };

  const discountLabel =
    product.discount > 0
      ? `${product.discount}% OFF`
      : discounted
        ? "Discount"
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      style={{ height: "100%" }}
    >
      <TiltCard maxTilt={6}>
        <Card
          className={`product-card-premium${discounted ? " product-card-premium--deal" : ""}`}
        >
          <Box className="product-card-premium__media">
            <Link
              to={`/product/${product.id}`}
              className="product-card-premium__img-link"
            >
              <img
                src={currentImage}
                alt={product.name}
                className="product-card-premium__img"
                loading="lazy"
              />
            </Link>

            {discountLabel && (
              <span className="product-card-premium__discount-badge">
                {discountLabel}
              </span>
            )}

            <button
              type="button"
              className={`product-card-premium__compare${isCompared ? " active" : ""}`}
              onClick={handleCompare}
              aria-label="Compare product"
            >
              <FiLayers size={14} />
            </button>

            <button
              type="button"
              className="product-card-premium__quick-view"
              onClick={handleQuickView}
            >
              Quick View
            </button>

            <IconButton
              className={`product-card-premium__wishlist${wishlisted ? " active is-pulse" : ""}`}
              onClick={handleToggleFavourite}
              size="small"
              aria-label={wishlisted ? "Remove from favourites" : "Add to favourites"}
            >
              <FiHeart fill={wishlisted ? "#ef4444" : "none"} />
            </IconButton>
          </Box>

          <CardContent className="product-card-premium__body">
            <div className="product-card-premium__badge-row">
              <Chip
                label={product.category}
                size="small"
                className="product-card-premium__category"
              />
              <span className="product-card-premium__brand-badge">{companyName}</span>
            </div>

            <Typography
              variant="h6"
              component="h3"
              className="product-card-premium__title"
            >
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </Typography>

            <Typography variant="body2" className="product-card-premium__desc">
              {product.description}
            </Typography>

            <div className="product-card-premium__meta-row">
              <div className="product-card-premium__stock">
                {product.stock > 0 ? `Stock: ${product.stock}` : "Out of stock"}
              </div>
              {product.discount > 0 && (
                <div className="product-card-premium__discount-text">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {isDiscounted ? (
              <Box className="product-card-premium__prices">
                <span className="product-card-premium__old-price">
                  {formatPrice(product.price)}
                </span>
                <span className="product-card-premium__new-price">
                  {formatPrice(currentPrice)}
                </span>
              </Box>
            ) : (
              <Typography className="product-card-premium__price">
                {formatPrice(currentPrice)}
              </Typography>
            )}

            <Box className="product-card-premium__btn-row">
              <MagneticButton>
                <Button
                  component={Link}
                  to={`/product/${product.id}`}
                  variant="outlined"
                  size="small"
                  startIcon={<FiEye />}
                  className="product-card-premium__btn product-card-premium__btn--outline"
                >
                  View Details
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<FiShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={isAuthResolving || cartMutating || alreadyInCart}
                  className={`product-card-premium__btn product-card-premium__btn--cart${alreadyInCart ? " is-in-cart" : ""}`}
                >
                  {isAuthResolving
                    ? "Checking..."
                    : cartMutating
                      ? "Adding..."
                      : alreadyInCart
                        ? "Already in Cart"
                        : "Add to Cart"}
                </Button>
              </MagneticButton>
            </Box>
          </CardContent>
        </Card>
      </TiltCard>
    </motion.div>
  );
};

export default ProductCard;
