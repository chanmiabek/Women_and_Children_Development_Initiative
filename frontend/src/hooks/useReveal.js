import { useEffect } from 'react';

export function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add('aos-enabled');
    const targets = document.querySelectorAll('.aos-lite');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('aos-animate'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  });
}
