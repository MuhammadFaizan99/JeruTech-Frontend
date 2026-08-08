import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
import ScrollIndicator from "./ScrollIndicator";
import "../styles/HeroSlider.scss";

const AUTOPLAY_MS = 6000;

const slideIcons = [FiSmartphone, FiMonitor, FiHeadphones, FiTag];

const HeroSlider = () => {
  const [slides, setSlides] = useState(fallbackHeroSlides);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    setSlides(fallbackHeroSlides);
    setCurrent(0);
  }, []);

  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  const slideCount = slides.length;
  const slide = slides[current] || fallbackHeroSlides[0];
  const SlideIcon = slideIcons[current % slideIcons.length] || FiSmartphone;

  const goTo = useCallback(
    (index) => {
      setCurrent((index + slideCount) % slideCount);
      setProgressKey((k) => k + 1);
    },
    [slideCount]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next, paused]);

  const handleMouseLeave = () => {
    setPaused(false);
  };

  return (
    <section
      className={`hero-slider hero-slider--with-scroll hero-slider--accent-${slide.accent}${paused ? " hero-slider--paused" : ""}`}
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={handleMouseLeave}
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
        <div className="hero-slider__slide">
          <div className="hero-slider__content">
            <div className="hero-slider__content-glass">
              <span className="hero-slider__badge">
                <SlideIcon aria-hidden="true" />
                {slide.badge}
              </span>
              <span className="hero-slider__eyebrow">{slide.eyebrow}</span>
              {slide.promo && <span className="hero-slider__promo">{slide.promo}</span>}
              <h1 className="hero-slider__title">{slide.title}</h1>
              <p className="hero-slider__subtitle">{slide.subtitle}</p>
              <p className="hero-slider__description">{slide.description}</p>
              <Link to={slide.link} className="hero-slider__cta">
                <span className="hero-slider__cta-shine" aria-hidden="true" />
                {slide.cta}
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="hero-slider__visual">
            <div className="hero-slider__visual-glow" aria-hidden="true" />
            <div className="hero-slider__product">
              <div className="hero-slider__product-frame">
                <img src={slide.image} alt={slide.title} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
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
