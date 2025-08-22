import React, { useEffect, useRef } from 'react';

interface AltchaWidgetProps {
  onVerified: (challenge: string) => void;
  onError: (error: string) => void;
  auto?: boolean;
}

declare global {
  interface Window {
    Altcha?: any;
  }
}

const AltchaWidget: React.FC<AltchaWidgetProps> = ({ onVerified, onError, auto = true }) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const challengeUrl = import.meta.env.VITE_ALTCHA_CHALLENGE_API_URL || '/api/altcha-challenge';

  useEffect(() => {
    if (!widgetRef.current) return;

    const initWidget = async () => {
      // Wait for Altcha to be available
      if (typeof window !== 'undefined' && window.Altcha) {
        try {
          const widget = new window.Altcha(widgetRef.current, {
            challengeUrl,
            auto,
            onVerified: (challenge: string) => {
              onVerified(challenge);
            },
            onError: (error: any) => {
              onError(error?.message || 'Altcha verification failed.');
            },
          });
        } catch (error: any) {
          console.error('Failed to initialize Altcha widget:', error);
          onError('Failed to load Altcha widget');
        }
      } else {
        // Retry after a short delay if Altcha is not yet loaded
        setTimeout(initWidget, 100);
      }
    };

    initWidget();
  }, [challengeUrl, auto, onVerified, onError]);

  return (
    <div className="altcha-container mt-4 flex justify-center">
      <div
        ref={widgetRef}
        className="altcha-widget"
        style={{ minHeight: '65px' }}
      />
    </div>
  );
};

export default AltchaWidget;
