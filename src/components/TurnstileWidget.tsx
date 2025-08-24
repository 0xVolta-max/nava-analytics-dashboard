import React, { useRef, useEffect, useState } from 'react';

interface TurnstileWidgetProps {
  onVerified: (token: string) => void;
  onError: (error: string) => void;
  onExpired?: () => void;
}

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string;
    };
  }
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerified,
  onError,
  onExpired
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('🔄 Turnstile script loaded');
      setIsLoading(false);
    };

    script.onerror = () => {
      console.error('❌ Failed to load Turnstile script');
      onError('Failed to load bot protection');
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onError]);

  useEffect(() => {
    if (!isLoading && containerRef.current && window.turnstile) {
      console.log('🎯 Initializing Turnstile widget');

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          theme: 'light',
          size: 'normal',
          callback: (token: string) => {
            console.log('✅ Turnstile verification successful');
            onVerified(token);
          },
          'error-callback': (error: string) => {
            console.error('❌ Turnstile error:', error);
            onError(`Bot verification failed: ${error}`);
          },
          'expired-callback': () => {
            console.log('⏰ Turnstile token expired');
            onExpired?.();
          }
        });

        setWidgetId(id);
        console.log('🎯 Turnstile widget initialized with ID:', id);

      } catch (error) {
        console.error('❌ Failed to initialize Turnstile:', error);
        onError('Failed to initialize bot protection');
      }
    }

    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (error) {
          console.warn('Failed to remove Turnstile widget:', error);
        }
      }
    };
  }, [isLoading, onVerified, onError, onExpired]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
        <div className="text-sm text-gray-600">Loading bot protection...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[65px] flex items-center justify-center">
      <div ref={containerRef}></div>
    </div>
  );
};

export default TurnstileWidget;
