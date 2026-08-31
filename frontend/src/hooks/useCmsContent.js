import { useEffect, useState } from 'react';
import { readCmsContent } from '../utils/cms.js';
import { fetchContent, hasBackend } from '../services/api.js';

export function useCmsContent() {
  const [content, setContent] = useState(() => readCmsContent());

  useEffect(() => {
    const refresh = () => setContent(readCmsContent());
    window.addEventListener('storage', refresh);
    window.addEventListener('wcdi-cms-updated', refresh);
    if (hasBackend()) {
      fetchContent().then((remote) => {
        if (remote) {
          localStorage.setItem('wcdi_cms_content', JSON.stringify(remote));
          refresh();
        }
      }).catch(() => undefined);
    }
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('wcdi-cms-updated', refresh);
    };
  }, []);

  return content;
}


export function useCmsContentValue(key, defaultValue = '') {
  const content = useCmsContent();
  return content?.[key] ?? defaultValue;
} 