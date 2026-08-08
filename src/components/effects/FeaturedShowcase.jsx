import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { formatPrice } from "../../utils/productHelpers";
import ScrollReveal from "./ScrollReveal";

const FeaturedShowcase = () => {
  const products = useAppSelector((state) => state.product.products);
  const featured = products.slice(0, 3);

  return (
    <section className="featured-showcase">
      <div className="featured-showcase__container">
        <ScrollReveal direction="up">
          <div className="section-header-premium">
            <span className="section-eyebrow">Showcase</span>
            <h2>Featured Products</h2>
            <p>Premium devices curated for performance, design, and value.</p>
          </div>
        </ScrollReveal>

        {featured.map((product, index) => {
          const reversed = index % 2 === 1;
          return (
            <ScrollReveal key={product.id} direction={reversed ? "right" : "left"}>
              <article
                className={`featured-showcase__row glass-panel${reversed ? " featured-showcase__row--reverse" : ""}`}
              >
                <div className="featured-showcase__media">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                <div className="featured-showcase__content">
                  <span className="featured-showcase__category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="featured-showcase__price">{formatPrice(product.price)}</div>
                  <Link to={`/product/${product.id}`} className="featured-showcase__cta">
                    Explore Product
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedShowcase;
