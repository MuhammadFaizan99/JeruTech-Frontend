import { Link } from "react-router-dom";

const FooterInfoPage = ({ title, description, eyebrow = "JeruTech Support", icon: Icon, sections }) => {
  return (
    <div className="page-wrapper footer-info-page">
      <section className="footer-info-page__card">
        <div className="footer-info-page__hero">
          <div className="footer-info-page__icon" aria-hidden="true">
            {Icon ? <Icon /> : null}
          </div>
          <div className="footer-info-page__hero-copy">
            <p className="footer-info-page__eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>

        <div className="footer-info-page__content">
          {sections.map((section) => (
            <article key={section.title} className="footer-info-page__section">
              <h2>{section.title}</h2>
              {section.body.map((paragraph, index) => (
                <p key={`${section.title}-${index}`}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>

        <div className="footer-info-page__actions">
          <Link to="/" className="footer-info-page__btn footer-info-page__btn--primary">
            Back to Home
          </Link>
          <Link to="/contact" className="footer-info-page__btn footer-info-page__btn--secondary">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FooterInfoPage;
