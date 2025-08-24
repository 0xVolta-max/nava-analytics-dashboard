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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        console.log('🔄 Fetching CSRF token...');
        const response = await fetch('/api/csrf-token');
        console.log('📡 CSRF Response status:', response.status);
        const data = await response.json();
        console.log('📦 CSRF Response data:', data);

        if (data.success) {
          console.log('✅ CSRF token received:', data.token);
          setCsrfToken(data.token);
        } else {
          throw new Error('Failed to get CSRF token: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('❌ Failed to fetch CSRF token:', error);
        onError('Failed to initialize bot protection: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCsrfToken();
  }, [onError]);

  useEffect(() => {
    const { current } = ref;
    if (!current || !csrfToken || isLoading) {
      return;
    }

    const customFetch = async (url: string, init: RequestInit) => {
      const headers = new Headers(init.headers);
      headers.append('x-csrf-token', csrfToken);
      headers.append('Content-Type', 'application/json');

      const newInit = { ...init, headers };

      // For challenge URL, make a POST request with action
      if (url.includes('/api/altcha-challenge')) {
        const challengeResponse = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ action: 'login' })
        });
        return challengeResponse;
      }

      return fetch(url, newInit);
    };

    // Configure the widget with proper URLs and custom fetch
    current.configure({
      challengeurl: '/api/altcha-challenge',
      verifyurl: '/api/verify-altcha',
      customfetch: customFetch,
    });

    const handleVerified = (e: any) => {
      console.log('Altcha verified:', e.detail);
      onVerified(JSON.stringify(e.detail));
    };

    const handleError = (e: any) => {
      console.error('Altcha error:', e.detail);
      onError(e.detail?.error || 'Bot verification failed');
    };

    const handleServerError = (e: any) => {
      console.error('Altcha server error:', e.detail);
      onError('Server error during verification');
    };

    current.addEventListener('verified', handleVerified);
    current.addEventListener('error', handleError);
    current.addEventListener('servererror', handleServerError);

    return () => {
      current.removeEventListener('verified', handleVerified);
      current.removeEventListener('error', handleError);
      current.removeEventListener('servererror', handleServerError);
    };
  }, [csrfToken, onVerified, onError, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
        <div className="text-sm text-gray-600">Loading bot protection...</div>
      </div>
    );
  }

  return <altcha-widget ref={ref}></altcha-widget>;
};

export default AltchaWidget;
