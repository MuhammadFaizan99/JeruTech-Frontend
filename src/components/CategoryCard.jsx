import { memo } from "react";
import { Link } from "react-router-dom";
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

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || FiGrid;

  return (
    <div style={{ height: "100%" }}>
      <Link
        to="/products"
        className={`category-card-premium glass-panel category-card-premium--${category.theme || "gadgets"}`}
      >
        <img src={category.image} alt={category.title} className="category-card-premium__img" loading="lazy" />
        <div className="category-card-premium__theme-overlay" />
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
    </div>
  );
};

export default memo(CategoryCard);
