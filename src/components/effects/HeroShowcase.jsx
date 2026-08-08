import { useRef } from "react";
import {
  FiSmartphone,
  FiMonitor,
  FiWatch,
  FiHeadphones,
} from "react-icons/fi";

const floatingItems = [
  {
    icon: FiSmartphone,
    label: "Mobiles",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=280&fit=crop",
    className: "hero-float--phone",
    delay: 0,
  },
  {
    icon: FiMonitor,
    label: "Laptops",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=280&h=180&fit=crop",
    className: "hero-float--laptop",
    delay: 0.2,
  },
  {
    icon: FiWatch,
    label: "Watches",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop",
    className: "hero-float--watch",
    delay: 0.4,
  },
  {
    icon: FiHeadphones,
    label: "Audio",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=140&h=140&fit=crop",
    className: "hero-float--headphones",
    delay: 0.6,
  },
];

const HeroShowcase = () => {
  const ref = useRef(null);

  return (
    <div className="hero-showcase">
      <div className="hero-showcase__stage">
        <div className="hero-showcase__glow-ring" />
        <div className="hero-showcase__center-glow" />

        {floatingItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`hero-float ${item.className}`}>
              <div className="hero-float__glass">
                <img src={item.img} alt={item.label} />
                <span className="hero-float__badge">
                  <Icon />
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroShowcase;
