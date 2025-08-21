import React, { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (code: string) => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'invisible';
}

declare global {
  interface Window {
    onloadTurnstileCallback: () => void;
    turnstile: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: (code: string) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'invisible';
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  siteKey,
  onVerify,
  onExpire,
  onError,
  theme = 'dark', // Standardmäßig auf 'dark' setzen, passend zum Dashboard
  size = 'invisible', // Standardmäßig auf 'invisible' setzen
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    const scriptId = 'turnstile-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    window.onloadTurnstileCallback = () => {
      if (containerRef.current && window.turnstile) {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'error-callback': onError,
          'expired-callback': onExpire,
          theme: theme,
          size: size,
        });
      }
    };

    // Cleanup function
    return () => {
      if (widgetId.current && window.turnstile) {
        // No explicit destroy method, but resetting might be useful
        // window.turnstile.reset(widgetId.current);
      }
      // Remove the script if it's the only one, to prevent multiple loads on hot reload
      const script = document.getElementById(scriptId);
      if (script) {
        // Only remove if no other Turnstile widgets are active
        // This is a simplification; in a real app, you might manage script loading more carefully
        // For this example, we'll just ensure onloadCallback is cleaned up
        delete window.onloadTurnstileCallback;
      }
    };
  }, [siteKey, onVerify, onExpire, onError, theme, size]);

  return <div ref={containerRef} className="cf-turnstile" data-sitekey={siteKey}></div>;
};

export default TurnstileWidget;