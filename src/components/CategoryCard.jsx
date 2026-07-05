import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiWatch,
  FiCpu,
  FiGrid,
  FiZap,
  FiPrinter,
  FiTool,
} from "react-icons/fi";
import { MdSportsEsports } from "react-icons/md";
import TiltCard from "./effects/TiltCard";

const iconMap = {
  smartphone: FiSmartphone,
  laptop: FiMonitor,
  headphones: FiHeadphones,
  watch: FiWatch,
  gaming: MdSportsEsports,
  devices: FiGrid,
  cpu: FiCpu,
  motorcycle: FiTool,
  electronics: FiZap,
  printing: FiPrinter,
};

const CategoryCard = ({ category, index = 0 }) => {
  const IconComponent = iconMap[category.icon] || FiGrid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      style={{ height: "100%" }}
    >
      <TiltCard maxTilt={5}>
        <Link
          to="/products"
          className={`category-card-premium glass-panel category-card-premium--${category.theme || "gadgets"}`}
        >
          <img src={category.image} alt={category.title} className="category-card-premium__img" />
          <div className={`category-card-premium__theme-overlay`} />
          <div className="category-card-premium__overlay" />
          <div className="category-card-premium__glow" />
          <div className="category-card-premium__content">
            <div className="category-card-premium__icon-wrap">
              <IconComponent />
            </div>
            <h3 className="category-card-premium__title">{category.title}</h3>
            <p className="category-card-premium__desc">{category.description}</p>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
};

export default CategoryCard;
