import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery is 2–5 business days nationwide. Express options are available at checkout.",
  },
  {
    q: "What warranty do products include?",
    a: "All products include manufacturer warranty. JeruTech also offers extended protection on select items.",
  },
  {
    q: "What is your return policy?",
    a: "Returns accepted within 14 days for unopened items in original packaging. Defective products are replaced immediately.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently support Cash on Delivery. Online payment gateways will be added soon.",
  },
  {
    q: "How can I contact support?",
    a: "Reach us 24/7 via phone, email, WhatsApp, or the Contact page. Average response time is under 2 hours.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq-section">
      <div className="faq-section__container">
        <ScrollReveal direction="up">
          <div className="section-header-premium">
            <span className="section-eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
        </ScrollReveal>
        <div className="faq-section__list">
          {faqs.map((item, i) => (
            <ScrollReveal key={item.q} direction="up" delay={i * 0.05}>
              <div className={`faq-item glass-panel${open === i ? " faq-item--open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__trigger"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                >
                  {item.q}
                  <FiChevronDown />
                </button>
                <div className="faq-item__panel">
                  <p>{item.a}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
