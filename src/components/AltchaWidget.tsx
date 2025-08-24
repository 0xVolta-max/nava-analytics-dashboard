import React, { useRef, useEffect, useState } from 'react';
import 'altcha';
import 'altcha/altcha.css';

interface AltchaWidgetProps {
  onVerified: (token: string) => void;
  onError: (error: string) => void;
}

const AltchaWidget: React.FC<AltchaWidgetProps> = ({ onVerified, onError }) => {
  const ref = useRef<any>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token');
        const data = await response.json();
        if (data.success) {
          setCsrfToken(data.token);
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        onError('Failed to initialize bot protection.');
      }
    };

    fetchCsrfToken();
  }, [onError]);

  useEffect(() => {
    const { current } = ref;
    if (!current || !csrfToken) {
      return;
    }

    const customFetch = (url: string, init: RequestInit) => {
      const headers = new Headers(init.headers);
      headers.append('x-csrf-token', csrfToken);
      const newInit = { ...init, headers };
      return fetch(url, newInit);
    };

    current.configure({
      challengeurl: import.meta.env.VITE_ALTCHA_CHALLENGE_API_URL,
      customfetch: customFetch,
    });

    const handleVerified = (e: any) => onVerified(e.detail.payload);
    const handleError = (e: any) => onError(e.detail.error);

    current.addEventListener('verified', handleVerified);
    current.addEventListener('error', handleError);

    return () => {
      current.removeEventListener('verified', handleVerified);
      current.removeEventListener('error', handleError);
    };
  }, [csrfToken, onVerified, onError]);

  return <altcha-widget ref={ref}></altcha-widget>;
};

export default AltchaWidget;