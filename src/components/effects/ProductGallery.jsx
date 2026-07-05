import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from "react-icons/fi";
import Dialog from "@mui/material/Dialog";

const ProductGallery = ({ images, alt }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const list = images?.length ? images : [];

  if (!list.length) return null;

  const prev = () => setActive((a) => (a - 1 + list.length) % list.length);
  const next = () => setActive((a) => (a + 1) % list.length);

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <img src={list[active]} alt={alt} className="product-gallery__img" />
        {list.length > 1 && (
          <>
            <button type="button" className="product-gallery__nav prev" onClick={prev} aria-label="Previous">
              <FiChevronLeft />
            </button>
            <button type="button" className="product-gallery__nav next" onClick={next} aria-label="Next">
              <FiChevronRight />
            </button>
          </>
        )}
        <button
          type="button"
          className="product-gallery__zoom"
          onClick={() => setLightbox(true)}
          aria-label="Full screen"
        >
          <FiMaximize2 />
        </button>
      </div>
      {list.length > 1 && (
        <div className="product-gallery__thumbs">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              className={i === active ? "active" : ""}
              onClick={() => setActive(i)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <Dialog open={lightbox} onClose={() => setLightbox(false)} PaperProps={{ className: "product-lightbox" }}>
        <img src={list[active]} alt={alt} />
      </Dialog>
    </div>
  );
};

export default ProductGallery;
