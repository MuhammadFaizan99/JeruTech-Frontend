import { useState, useEffect, useCallback } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../styles/ScrollIndicator.scss";

const ScrollIndicator = ({
  targetId = "about-jerutech",
}) => {
  const [visible, setVisible] = useState(true);

  const updateVisibility = useCallback(() => {
    const hero = document.querySelector(".hero-slider");
    const heroBottom = hero
      ? hero.getBoundingClientRect().bottom
      : window.innerHeight;
    setVisible(window.scrollY < heroBottom * 0.65);
  }, []);

  useEffect(() => {
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [updateVisibility]);

  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <button
      type="button"
      className={`scroll-indicator${visible ? " scroll-indicator--visible" : ""}`}
      onClick={handleClick}
      aria-label={`Scroll to ${targetId.replace(/-/g, " ")} section.`}
    >
      <span className="scroll-indicator__glow" aria-hidden="true" />

      <span className="scroll-indicator__mouse" aria-hidden="true">
        <span className="scroll-indicator__mouse-body">
          <span className="scroll-indicator__wheel" />
        </span>
      </span>

      <span className="scroll-indicator__arrow" aria-hidden="true">
        <FiChevronDown />
      </span>
    </button>
  );
};

export default ScrollIndicator;
