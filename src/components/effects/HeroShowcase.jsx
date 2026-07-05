import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 80, damping: 20 });
  const springY = useSpring(my, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div
      ref={ref}
      className="hero-showcase"
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div
        className="hero-showcase__stage"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="hero-showcase__glow-ring" />
        <div className="hero-showcase__center-glow" />

        {floatingItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className={`hero-float ${item.className}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { delay: item.delay, duration: 0.5 },
                scale: { delay: item.delay, duration: 0.5 },
                y: { delay: item.delay + 0.5, duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.08, zIndex: 10 }}
            >
              <div className="hero-float__glass">
                <img src={item.img} alt={item.label} />
                <span className="hero-float__badge">
                  <Icon />
                  {item.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default HeroShowcase;
