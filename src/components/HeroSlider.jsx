import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiTag,
} from "react-icons/fi";
import { heroSlides as fallbackHeroSlides } from "../data/slides";
import api from "../api";
import ScrollIndicator from "./ScrollIndicator";
import TextReveal from "./effects/TextReveal";
import MagneticButton from "./effects/MagneticButton";
import "../styles/HeroSlider.scss";

const AUTOPLAY_MS = 6000;

const slideIcons = [FiSmartphone, FiMonitor, FiHeadphones, FiTag];

const normalizeSlides = (items = []) =>
  items.map((item, index) => ({
    id: item._id || item.id || index + 1,
    badge: item.badge || "Featured",
    eyebrow: item.eyebrow || item.category || "Curated Collection",
    promo: item.promo || item.subtitle || "",
    title: item.title || "Featured Collection",
    subtitle: item.subtitle || item.description || "",
    description: item.description || "Discover our latest collection.",
    cta: item.ctaText || item.cta || "Shop Now",
    link: item.ctaLink || item.link || "/products",
    image: item.image || fallbackHeroSlides[index % fallbackHeroSlides.length]?.image,
    accent: item.accent || fallbackHeroSlides[index % fallbackHeroSlides.length]?.accent || "cyan",
    category: item.category || item.title,
  }));

const HeroSlider = () => {
  const sectionRef = useRef(null);
  const [slides, setSlides] = useState(fallbackHeroSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        const { data } = await api.get("/homepage-banners");
        if (isMounted && Array.isArray(data?.data) && data.data.length > 0) {
          setSlides(normalizeSlides(data.data));
          setCurrent(0);
        }
      } catch (error) {
        if (isMounted) {
          setSlides(fallbackHeroSlides);
        }
      }
    };

    loadSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  const slideCount = slides.length;
  const slide = slides[current] || fallbackHeroSlides[0];
  const SlideIcon = slideIcons[current % slideIcons.length] || FiSmartphone;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const parallaxX = useTransform(springX, [-1, 1], [-18, 18]);
  const parallaxY = useTransform(springY, [-1, 1], [-12, 12]);
  const productRotateY = useTransform(springX, [-1, 1], [-6, 6]);
  const productRotateX = useTransform(springY, [-1, 1], [4, -4]);

  const goTo = useCallback(
    (index, dir = 1) => {
      setDirection(dir);
      setCurrent((index + slideCount) % slideCount);
      setProgressKey((k) => k + 1);
    },
    [slideCount]
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next, paused]);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const slideVariants = {
    enter: (d) => ({
      opacity: 0,
      x: d > 0 ? 72 : -72,
      scale: 0.97,
      filter: "blur(6px)",
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (d) => ({
      opacity: 0,
      x: d > 0 ? -72 : 72,
      scale: 0.97,
      filter: "blur(6px)",
    }),
  };

  return (
    <section
      ref={sectionRef}
      className={`hero-slider hero-slider--with-scroll hero-slider--accent-${slide.accent}${paused ? " hero-slider--paused" : ""}`}
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="hero-slider__progress" aria-hidden="true">
        <div
          key={progressKey}
          className="hero-slider__progress-bar"
          style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
        />
      </div>

      <div className="hero-slider__bg" aria-hidden="true">
        <div className="hero-slider__orb hero-slider__orb--1" />
        <div className="hero-slider__orb hero-slider__orb--2" />
        <div className="hero-slider__orb hero-slider__orb--3" />
        <div className="hero-slider__orb hero-slider__orb--4" />
        <div className="hero-slider__grid-bg" />
        <div className="hero-slider__particles">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 19 + 4) % 96}%`,
                top: `${(i * 27 + 6) % 88}%`,
                animationDelay: `${i * 0.35}s`,
                animationDuration: `${4 + (i % 5)}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="hero-slider__container">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            className="hero-slider__slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="hero-slider__content"
              style={{ x: parallaxX }}
            >
              <div className="hero-slider__content-glass">
                <span className="hero-slider__badge">
                  <SlideIcon aria-hidden="true" />
                  {slide.badge}
                </span>
                <span className="hero-slider__eyebrow">{slide.eyebrow}</span>
                {slide.promo && <span className="hero-slider__promo">{slide.promo}</span>}
                <h1 className="hero-slider__title">
                  <TextReveal text={slide.title} as="span" key={slide.id} />
                </h1>
                <p className="hero-slider__subtitle">{slide.subtitle}</p>
                <p className="hero-slider__description">{slide.description}</p>
                <MagneticButton>
                  <Link to={slide.link} className="hero-slider__cta">
                    <span className="hero-slider__cta-shine" aria-hidden="true" />
                    {slide.cta}
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </MagneticButton>
              </div>
            </motion.div>

            <motion.div
              className="hero-slider__visual"
              style={{ x: parallaxX, y: parallaxY }}
            >
              <div className="hero-slider__visual-glow" aria-hidden="true" />
              <motion.div
                className="hero-slider__product"
                style={{ rotateY: productRotateY, rotateX: productRotateX }}
              >
                <div className="hero-slider__product-frame">
                  <img src={slide.image} alt={slide.title} />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hero-slider__controls">
        <div className="hero-slider__dots" role="tablist" aria-label="Slide navigation">
          {slides.map((s, index) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={`Go to slide ${index + 1}: ${s.title}`}
              className={`hero-slider__dot${index === current ? " active" : ""}`}
              onClick={() => goTo(index, index > current ? 1 : -1)}
            >
              {index === current && (
                <span
                  key={progressKey}
                  className="hero-slider__dot-progress"
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
        <span className="hero-slider__counter">
          {String(current + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
        </span>
      </div>

      <button
        type="button"
        className="hero-slider__arrow hero-slider__arrow--prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        <FiChevronLeft size={22} />
      </button>
      <button
        type="button"
        className="hero-slider__arrow hero-slider__arrow--next"
        onClick={next}
        aria-label="Next slide"
      >
        <FiChevronRight size={22} />
      </button>

      <ScrollIndicator targetId="about-jerutech" />
    </section>
  );
};

export default HeroSlider;
