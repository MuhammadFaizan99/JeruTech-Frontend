import { useState, useEffect } from "react";
import { FiStar } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    text: "JeruTech delivered my MacBook faster than any other store. Premium packaging and genuine products.",
    rating: 5,
  },
  {
    name: "James Chen",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    text: "Best prices on flagship phones. Customer support responded within minutes on WhatsApp.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    text: "The discount deals are incredible. I saved 50% on headphones without compromising quality.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((a) => (a + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[active];

  return (
    <section className="testimonials-section">
      <div className="testimonials-section__container">
        <ScrollReveal direction="up">
          <div className="section-header-premium">
            <span className="section-eyebrow">Reviews</span>
            <h2>Loved by Customers</h2>
          </div>
        </ScrollReveal>
        <div className="testimonials-section__slider glass-panel">
          <img src={t.avatar} alt={t.name} className="testimonials-section__avatar" />
          <div className="testimonials-section__stars">
            {[...Array(t.rating)].map((_, i) => (
              <FiStar key={i} />
            ))}
          </div>
          <p className="testimonials-section__text">&ldquo;{t.text}&rdquo;</p>
          <h4>{t.name}</h4>
          <span>{t.role}</span>
          <div className="testimonials-section__dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === active ? "active" : ""}
                onClick={() => setActive(i)}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
