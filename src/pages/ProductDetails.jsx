import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import ScrollReveal from "../components/effects/ScrollReveal";
import ProductGallery from "../components/effects/ProductGallery";
import ProductDetailsSkeleton from "../components/ProductDetailsSkeleton";
import LoadingButton from "../components/LoadingButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addToCart } from "../redux/slices/cartSlice";
import { fetchProductById } from "../redux/slices/productSlice";
import { selectRelatedProducts } from "../redux/utils/selectors";
import {
  getProductSpecs,
  formatPrice,
  getEffectivePrice,
  getProductGalleryImages,
  isProductInCart,
} from "../utils/productHelpers";
import { showSuccessToast, showWarningToast } from "../utils/toast";
import "../styles/ProductDetails.scss";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.product.product);
  const token = useAppSelector((state) => state.auth.token);
  const profileLoading = useAppSelector((state) => state.auth.profileLoading);
  const user = useAppSelector((state) => state.auth.user);
  const related = useAppSelector((state) => selectRelatedProducts(state, product, 4));
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const cartMutating = useAppSelector((state) => state.cart.mutating);
  const detailLoading = useAppSelector((state) => state.product.detailLoading);
  const error = useAppSelector((state) => state.product.error);
  const [quantity, setQuantity] = useState(1);
  const isAuthResolving = Boolean(token) && !user && profileLoading;
  const isCurrentProduct =
    product && String(product.id) === String(id);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  if (detailLoading || !isCurrentProduct) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="page-wrapper product-details-page">
        <section className="product-details-page__not-found">
          <h1>Unable to load product</h1>
          <p>{error}</p>
          <Link to="/products" className="product-details-page__back-btn">
            <FiArrowLeft /> Back to Products
          </Link>
        </section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-wrapper product-details-page">
        <section className="product-details-page__not-found">
          <h1>Product not found</h1>
          <p>The item you are looking for does not exist.</p>
          <Link to="/products" className="product-details-page__back-btn">
            <FiArrowLeft /> Back to Products
          </Link>
        </section>
      </div>
    );
  }

  const specs = getProductSpecs(product);
  const price = getEffectivePrice(product);
  const isDeal = Boolean(product.isDiscounted || product.discount > 0);
  const galleryImages = getProductGalleryImages(product);
  const companyName = product.company || product.name?.split(" ")[0] || "JeruTech";
  const alreadyInCart =
    user?.role === "customer" && isProductInCart(cartItems, product);

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
      addToCart({ productId: product.id, quantity })
    );

    if (addToCart.rejected.match(result)) {
      showWarningToast(result.payload || "Failed to add to cart");
      return;
    }

    showSuccessToast(`${product.name} added to cart`);
  };

  return (
    <div className="page-wrapper product-details-page">
      <section className="product-details-page__body">
        <ScrollReveal direction="up">
          <button type="button" className="product-details-page__back" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>
        </ScrollReveal>

        <div className="product-details-page__layout">
          <ScrollReveal direction="left" className="product-details-page__gallery-col">
            <ProductGallery images={galleryImages} alt={product.name} />
            {isDeal && product.discount > 0 && (
              <span className="product-details-page__deal-badge">
                {product.discount}% OFF
              </span>
            )}
          </ScrollReveal>

          <ScrollReveal direction="right" className="product-details-page__info-col">
            <div className="product-details-page__info">
              <div className="product-details-page__tag-row">
                <span className="product-details-page__category">{product.category}</span>
                <span className="product-details-page__brand-badge">{companyName}</span>
                <span
                  className={`product-details-page__stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}
                >
                  {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                </span>
              </div>
              <h1>{product.name}</h1>

              <div className="product-details-page__price-row">
                {isDeal && product.price != null && (
                  <span className="product-details-page__old-price">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="product-details-page__price">{formatPrice(price)}</span>
              </div>

              <p className="product-details-page__desc">{product.description}</p>

              <ul className="product-details-page__specs">
                {specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>

              <div className="product-details-page__qty">
                <span>Quantity</span>
                <div className="product-details-page__qty-controls">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <FiMinus />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="product-details-page__actions">
                <LoadingButton
                  type="button"
                  className={`product-details-page__add-btn${alreadyInCart ? " is-in-cart" : ""}`}
                  onClick={handleAddToCart}
                  loading={isAuthResolving || cartMutating}
                  disabled={isAuthResolving || cartMutating || alreadyInCart}
                >
                  <FiShoppingCart />
                  {isAuthResolving
                    ? "Checking account..."
                    : cartMutating
                      ? "Adding..."
                      : alreadyInCart
                        ? "Already in Cart"
                        : "Add to Cart"}
                </LoadingButton>
                <Link to="/products" className="product-details-page__shop-link">
                  Back to Products
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {related.length > 0 && (
          <section className="product-details-page__related">
            <ScrollReveal direction="up">
              <h2>Related Products</h2>
              <p>You might also like these items from the same category.</p>
            </ScrollReveal>
            <div className="product-details-page__related-grid">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  discounted={item.newPrice != null}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
