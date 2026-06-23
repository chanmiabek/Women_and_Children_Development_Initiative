import { useEffect, useState } from 'react';
import { readCmsContent } from '../utils/cms.js';

export function useCmsContent() {
  const [content, setContent] = useState(() => readCmsContent());

  useEffect(() => {
    const refresh = () => setContent(readCmsContent());
    window.addEventListener('storage', refresh);
    window.addEventListener('wcdi-cms-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('wcdi-cms-updated', refresh);
    };
  }, []);

  return content;
}
