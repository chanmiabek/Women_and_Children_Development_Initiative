import { useEffect, useState } from 'react';

export function useScrollUi() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const current = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(current > 100);
      setHidden(current > last && current > 300);
      setShowTop(current > 300);
      setProgress(total > 0 ? (current / total) * 100 : 0);
      last = current;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrolled, hidden, showTop, progress };
}
