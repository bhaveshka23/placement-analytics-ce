import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SmoothScroll({ children }) {
  const location = useLocation();

  useEffect(() => {
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = previous;
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);

      requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  return children;
}