import { Container } from "@mui/material";
import { MdLocalOffer } from "react-icons/md";
import HeroSlider from "../components/HeroSlider";
import AboutSection from "../components/AboutSection";
import CategoryCard from "../components/CategoryCard";
import ScrollReveal from "../components/effects/ScrollReveal";
import GlowButton from "../components/effects/GlowButton";
import BrandMarquee from "../components/effects/BrandMarquee";
import TrustSection from "../components/effects/TrustSection";
import FAQSection from "../components/effects/FAQSection";
import ArtisticDivider from "../components/effects/ArtisticDivider";
import { categories } from "../data/products";
import {
  HiOutlineBadgeCheck,
  HiOutlineCurrencyDollar,
  HiOutlineTruck,
  HiOutlineSupport,
} from "react-icons/hi";
import "../styles/HeroSlider.scss";

const features = [
  {
    icon: HiOutlineBadgeCheck,
    title: "Quality Products",
    description: "Genuine electronics from trusted brands worldwide.",
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: "Affordable Prices",
    description: "Competitive pricing with regular deals and discounts.",
  },
  {
    icon: HiOutlineTruck,
    title: "Fast Delivery",
    description: "Quick and secure shipping to your doorstep.",
  },
  {
    icon: HiOutlineSupport,
    title: "Trusted Service",
    description: "Dedicated customer support for all your needs.",
  },
];

const Home = () => {
  return (
    <div className="page-wrapper">
      <HeroSlider />

      <BrandMarquee />
      <ArtisticDivider variant="wave" />

      <TrustSection />

      <ArtisticDivider variant="gradient" />
      <AboutSection />
      <ArtisticDivider variant="curve" />

      <section className="section-padding">
        <Container maxWidth={false} sx={{ maxWidth: 1320, mx: "auto", px: { xs: 2, sm: 2.5, md: 3 } }}>
          <ScrollReveal direction="up">
            <div className="section-header-premium">
              <span className="section-eyebrow">Categories</span>
              <h2>Shop by Category</h2>
              <p>Browse our curated collection of premium tech, gear, and creative essentials</p>
            </div>
          </ScrollReveal>
          <div className="home-categories-grid">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding" style={{ background: "rgba(30, 58, 138, 0.08)" }}>
        <Container maxWidth={false} sx={{ maxWidth: 1320, mx: "auto", px: { xs: 2, sm: 2.5, md: 3 } }}>
          <ScrollReveal direction="up">
            <div className="section-header-premium">
              <span className="section-eyebrow">Why Us</span>
              <h2>Why Choose JeruTech?</h2>
              <p>We deliver excellence in every product and service</p>
            </div>
          </ScrollReveal>
          <div className="home-features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} direction="up" delay={index * 0.08}>
                  <div className="feature-card-premium glass-panel">
                    <div className="feature-icon">
                      <Icon size={28} color="#60A5FA" />
                    </div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container maxWidth={false} sx={{ maxWidth: 1320, mx: "auto", px: { xs: 2, sm: 2.5, md: 3 } }}>
          <ScrollReveal direction="zoom">
            <div className="discount-banner">
              <div>
                <h3>Up to 50% OFF on Selected Products</h3>
                <p>Limited time offers on mobility, electronics, and maker-focused essentials</p>
              </div>
              <GlowButton to="/discount" variant="primary" size="large" icon={<MdLocalOffer />}>
                View Deals
              </GlowButton>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <FAQSection />
    </div>
  );
};

export default Home;
