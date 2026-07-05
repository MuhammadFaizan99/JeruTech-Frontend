import { useState } from "react";
import { FiSend, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker, HiOfficeBuilding } from "react-icons/hi";
import ScrollReveal from "../components/effects/ScrollReveal";
import FloatingInput from "../components/effects/FloatingInput";
import LoadingButton from "../components/LoadingButton";
import {
  showSuccessToast,
  showWarningToast,
  showLoadingToast,
  updateLoadingToast,
} from "../utils/toast";
import "../styles/Contact.scss";

const contactCards = [
  { icon: HiOfficeBuilding, title: "Company", content: "JeruTech" },
  {
    icon: HiMail,
    title: "Email",
    content: "support@jerutech.com",
    link: "mailto:support@jerutech.com",
  },
  {
    icon: HiPhone,
    title: "Phone",
    content: "+1 (555) 123-4567",
    link: "tel:+15551234567",
  },
  {
    icon: HiLocationMarker,
    title: "Address",
    content: "123 Tech Ave, Silicon Valley, CA",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showWarningToast("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const toastId = showLoadingToast("Sending your message…");

    await new Promise((resolve) => setTimeout(resolve, 800));

    updateLoadingToast(toastId, `Thank you, ${formData.name}! We will contact you soon.`, "success");
    setFormData({ name: "", phone: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="page-wrapper contact-page">
      <section className="contact-page__header">
        <ScrollReveal direction="up">
          <h1>Contact Us</h1>
          <p>
            Reach out to JeruTech support — we are here to help with all your
            electronics needs.
          </p>
        </ScrollReveal>
      </section>

      <section className="contact-page__body">
        <div className="contact-page__layout">
          <ScrollReveal direction="left" className="contact-page__form-col">
            <div className="contact-page__form-card contact-form-glass glass-panel">
              <h2>Send us a Message</h2>
              <p className="subtitle">We typically respond within 24 hours.</p>

              <form onSubmit={handleSubmit}>
                <div className="contact-page__form-grid">
                  <FloatingInput
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <FloatingInput
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <div className="full-width">
                    <FloatingInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="full-width">
                    <FloatingInput
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={4}
                    />
                  </div>
                  <div className="full-width">
                    <LoadingButton
                      type="submit"
                      className="contact-page__submit"
                      loading={submitting}
                    >
                      <FiSend />
                      Submit Message
                    </LoadingButton>
                  </div>
                </div>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="contact-page__sidebar-col">
            <div className="contact-page__sidebar">
              <div className="contact-page__whatsapp whatsapp-card-premium">
                <FaWhatsapp className="wa-icon" />
                <div>
                  <h3>Chat on WhatsApp</h3>
                  <p>Fast replies, usually within minutes</p>
                  <a
                    href="https://wa.me/15559876543"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start Conversation →
                  </a>
                </div>
              </div>

              <div className="contact-page__cards-grid">
                {contactCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="contact-page__info-card">
                      <Icon className="icon" />
                      <h4>{card.title}</h4>
                      {card.link ? (
                        <a href={card.link}>{card.content}</a>
                      ) : (
                        <p>{card.content}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="contact-page__map maps-placeholder">
                <FiMapPin className="maps-pin" />
                <p>Google Maps — 123 Tech Avenue, Silicon Valley, CA 94025</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Contact;
