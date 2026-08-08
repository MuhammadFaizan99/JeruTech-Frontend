import { memo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import api from "../api";
import {
  FiShield,
  FiHeadphones,
  FiTruck,
  FiSend,
  FiMail,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import WaveSeparator from "./effects/WaveSeparator";
import { showSuccessToast, showWarningToast } from "../utils/toast";
import "../styles/Footer.scss";
import logo from "../assets/logo.jpeg";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Discounts", path: "/discount" },
  { label: "Learn", path: "/learn" },
  { label: "Contact Us", path: "/contact" },
];

const productCategories = [
  { label: "Mobiles", path: "/products" },
  { label: "Laptops", path: "/products" },
  { label: "Accessories", path: "/products" },
  { label: "Smart Watches", path: "/products" },
  { label: "Other Electronics", path: "/products" },
];

const supportLinks = [
  { label: "Contact Support", path: "/contact-support" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
  { label: "Cookie Policy", path: "/cookie-policy" },
];

const accountLinks = [
  { label: "Sign In", path: "/signin" },
  { label: "Sign Up", path: "/signup" },
  { label: "Cart", path: "/cart" },
  { label: "Orders", path: "/dashboard/orders" },
];

const socialLinks = [
  { icon: FaFacebookF, href: "https://www.facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://www.instagram.com", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com", label: "LinkedIn" },
  { icon: FaXTwitter, href: "https://x.com", label: "X" },
  { icon: FaYoutube, href: "https://www.youtube.com", label: "YouTube" },
];

const trustBadges = [
  { icon: FiShield, label: "Secure Shopping" },
  { icon: FiHeadphones, label: "Fast Support" },
  { icon: FiTruck, label: "COD Available" },
];

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
  { label: "Cookie Policy", path: "/cookie-policy" },
];

const FooterColumn = memo(({ title, children }) => (
  <div className="jerutech-footer__col">
    <h3 className="jerutech-footer__title">{title}</h3>
    {children}
  </div>
));

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      showWarningToast("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      showWarningToast("Please enter a valid email address");
      return;
    }

    setSubscribing(true);

    try {
      const response = await api.post("/newsletter/subscribe", { email: normalizedEmail });
      showSuccessToast(response.data?.message || "Subscribed successfully");
      setEmail("");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to subscribe right now";
      if (error.response?.status === 409) {
        showWarningToast(message);
      } else {
        showWarningToast(message);
      }
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <WaveSeparator className="jerutech-footer__wave" />
      <footer className="jerutech-footer">
        <div className="jerutech-footer__bg" aria-hidden="true">
          <div className="jerutech-footer__blob jerutech-footer__blob--1" />
          <div className="jerutech-footer__blob jerutech-footer__blob--2" />
          <div className="jerutech-footer__blob jerutech-footer__blob--3" />
          <div className="jerutech-footer__grid-pattern" />
          <div className="jerutech-footer__particles">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                style={{
                  left: `${(i * 17 + 3) % 98}%`,
                  top: `${(i * 23 + 8) % 85}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${4 + (i % 4)}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="jerutech-footer__container">
          <div className="jerutech-footer__grid">
            <div className="jerutech-footer__brand">
              <div className="jerutech-footer__logo-glow" aria-hidden="true" />
              <Link to="/" className="jerutech-footer__logo">
                <img src={logo} alt="JeruTech Logo" className="jerutech-footer__logo-img" loading="lazy" />
                <span className="jerutech-footer__logo-text">JeruTech</span>
              </Link>
              <p className="jerutech-footer__desc">
                JeruTech brings mobiles, laptops, accessories, and electronic devices
                together in one trusted digital marketplace.
              </p>
              <div className="jerutech-footer__badges">
                {trustBadges.map(({ icon: Icon, label }) => (
                  <span key={label} className="jerutech-footer__badge">
                    <Icon aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
              <div className="jerutech-footer__social">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jerutech-footer__social-link"
                    aria-label={label}
                    title={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <FooterColumn title="Quick Links" index={1}>
              <ul className="jerutech-footer__links">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="jerutech-footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Product Categories" index={2}>
              <ul className="jerutech-footer__links">
                {productCategories.map((cat) => (
                  <li key={cat.label}>
                    <Link to={cat.path} className="jerutech-footer__link">
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Support & Policies" index={3}>
              <ul className="jerutech-footer__links">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.path}
                      end
                      className={({ isActive }) =>
                        `jerutech-footer__link${isActive ? " jerutech-footer__link--active" : ""}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Account" index={4}>
              <ul className="jerutech-footer__links">
                {accountLinks.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.path}
                      end={link.path !== "/dashboard/orders"}
                      className={({ isActive }) =>
                        `jerutech-footer__link${isActive ? " jerutech-footer__link--active" : ""}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          <div className="jerutech-footer__newsletter">
            <div className="jerutech-footer__newsletter-content">
              <div className="jerutech-footer__newsletter-text">
                <span className="jerutech-footer__newsletter-eyebrow">
                  <FiMail aria-hidden="true" /> Newsletter
                </span>
                <h3>Stay Updated</h3>
                <p>Get latest deals, discounts, and tech updates.</p>
              </div>
              <form className="jerutech-footer__newsletter-form" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="jerutech-footer__subscribe-btn" disabled={subscribing}>
                  <span className="jerutech-footer__subscribe-shine" aria-hidden="true" />
                  <FiSend aria-hidden="true" />
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="jerutech-footer__bottom">
          <div className="jerutech-footer__container jerutech-footer__bottom-inner">
            <p className="jerutech-footer__copyright">
              © 2026 JeruTech. All Rights Reserved.
            </p>
            <nav className="jerutech-footer__legal" aria-label="Legal links">
              {legalLinks.map((link, i) => (
                <span key={link.label} className="jerutech-footer__legal-item">
                  {i > 0 && <span className="jerutech-footer__legal-sep" aria-hidden="true">|</span>}
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) => (isActive ? "jerutech-footer__legal-link--active" : "")}
                  >
                    {link.label}
                  </NavLink>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
};

export default memo(Footer);
