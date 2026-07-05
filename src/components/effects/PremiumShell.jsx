import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import QuickViewModal from "./QuickViewModal";
import CompareModal from "./CompareModal";
import CompareBar from "./CompareBar";

const PremiumShell = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(height > 0 ? (scrollTop / height) * 100 : 0);
      setShowBackTop(scrollTop > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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

export default PremiumShell;
