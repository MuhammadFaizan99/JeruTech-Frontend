import ScrollReveal from "./effects/ScrollReveal";
import AnimatedCounter from "./effects/AnimatedCounter";
import {
  HiOutlineSparkles,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineSupport,
  HiOutlineTruck,
} from "react-icons/hi";
import "../styles/About.scss";

const highlights = [
  {
    icon: HiOutlineSparkles,
    title: "Premium Electronics",
    text: "Curated devices from leading global brands.",
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: "Affordable Prices",
    text: "Competitive rates with regular deals and offers.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Trusted Service",
    text: "Genuine products backed by reliable support.",
  },
  {
    icon: HiOutlineSupport,
    title: "Fast Support",
    text: "Responsive help via chat, phone, and WhatsApp.",
  },
];

const companyInfo = [
  {
    title: "What JeruTech Does",
    text: "We curate practical electronics, accessories, and gadgets for everyday use, work, study, and entertainment.",
  },
  {
    title: "Our Mission",
    text: "Our mission is to make reliable tech easy to discover, compare, and buy with a shopping experience that feels simple and trustworthy.",
  },
  {
    title: "Our Services",
    text: "We offer product browsing, curated recommendations, secure ordering, delivery support, and post-purchase customer assistance.",
  },
];

const stats = [
  { end: 500, suffix: "+", label: "Products" },
  { end: 1000, suffix: "+", label: "Happy Customers" },
  { end: 24, suffix: "/7", label: "Support" },
  { end: 0, suffix: "", label: "Fast Delivery", display: "Fast" },
];

const AboutSection = () => {
  return (
    <section
      id="about-jerutech"
      className="about-jerutech"
      aria-labelledby="about-jerutech-title"
    >
      <div className="about-jerutech__container">
        <ScrollReveal direction="up">
          <header className="about-jerutech__header">
            <span className="about-jerutech__eyebrow">Who We Are</span>
            <h2 id="about-jerutech-title" className="about-jerutech__title">
              About JeruTech
            </h2>
            <p className="about-jerutech__subtitle">
              Your trusted destination for mobiles, laptops, and electronic devices.
            </p>
          </header>
        </ScrollReveal>

        <div className="about-jerutech__layout">
          <ScrollReveal direction="left" className="about-jerutech__content-col">
            <div className="about-jerutech__content glass-panel">
              <p>
                JeruTech is a customer-focused electronics company built around
                honest product discovery, dependable service, and a smooth online
                shopping experience.
              </p>
              <div className="about-jerutech__info-grid">
                {companyInfo.map((item) => (
                  <div key={item.title} className="about-jerutech__info-card">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="about-jerutech__visual-col">
            <div className="about-jerutech__visual">
              <img
                src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=640&h=480&fit=crop"
                alt="Modern electronics and technology devices"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>

        <div className="about-jerutech__stats">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} direction="up" delay={index * 0.06}>
              <div className="about-jerutech__stat">
                <span className="about-jerutech__stat-value">
                  {stat.display ? (
                    <span className="about-jerutech__stat-fast">
                      <HiOutlineTruck aria-hidden="true" />
                      {stat.display}
                    </span>
                  ) : (
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  )}
                </span>
                <span className="about-jerutech__stat-label">{stat.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="about-jerutech__highlights">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} direction="up" delay={index * 0.08}>
                <div className="about-jerutech__highlight">
                  <span className="about-jerutech__highlight-icon">
                    <Icon />
                  </span>
                  <h3 className="about-jerutech__highlight-title">{item.title}</h3>
                  <p className="about-jerutech__highlight-text">{item.text}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
