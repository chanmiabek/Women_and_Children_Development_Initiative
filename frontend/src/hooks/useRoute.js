import { useEffect, useState } from 'react';

export function useRoute() {
  const getPath = () => window.location.pathname.replace(/\/$/, '') || '/';
  const getBasePath = () => {
    const path = getPath();
    const marker = path.match(/\/(about|programs|get-involved|events|blog|contact|donate|volunteer|faq|annual-report|privacy-policy|terms|success-stories|blog-single|admin)(\/|$)/);
    if (marker) return path.slice(0, marker.index) || '';
    if (path.endsWith('/index.html')) return path.replace(/\/index\.html$/i, '');
    if (!path.includes('.') && path !== '/') return path;
    return '';
  };
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (href) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const base = getBasePath();
    const target = href.startsWith('/') && base && !href.startsWith(base)
      ? `${base}${href}`
      : href;
    window.history.pushState({}, '', target);
    setPath(getPath());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return [path, navigate];
}
