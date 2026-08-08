import { memo, useEffect, useRef, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import QuickViewModal from "./QuickViewModal";
import CompareModal from "./CompareModal";
import CompareBar from "./CompareBar";

const PremiumShell = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const updateScrollState = () => {
      frameRef.current = null;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const nextProgress = height > 0 ? (scrollTop / height) * 100 : 0;

      setScrollProgress((current) => {
        return Math.abs(current - nextProgress) < 0.5 ? current : nextProgress;
      });
      setShowBackTop(scrollTop > 400);
    };

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <button
        type="button"
        className={`back-to-top${showBackTop ? " back-to-top--visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FiArrowUp />
      </button>

      <QuickViewModal />
      <CompareBar />
      <CompareModal />
    </>
  );
};

export default memo(PremiumShell);
