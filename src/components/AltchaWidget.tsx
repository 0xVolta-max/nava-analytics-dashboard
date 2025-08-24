import React, { useRef, useEffect } from 'react';
import 'altcha/altcha-widget.js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        challengeurl?: string;
        auto?: string;
      };
    }
  }
}

interface AltchaWidgetProps {
  onVerified: (token: string) => void;
  onError: (error: string) => void;
  auto?: boolean;
}

const AltchaWidget: React.FC<AltchaWidgetProps> = ({ onVerified, onError, auto }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const { current } = ref;
    const handleVerified = (e: any) => onVerified(e.detail.payload);
    const handleError = (e: any) => onError(e.detail.error);

    current?.addEventListener('verified', handleVerified);
    current?.addEventListener('error', handleError);

    return () => {
      current?.removeEventListener('verified', handleVerified);
      current?.removeEventListener('error', handleError);
    };
  }, [onVerified, onError]);

  return (
    <altcha-widget
      ref={ref}
      challengeurl={import.meta.env.VITE_ALTCHA_CHALLENGE_API_URL}
      auto={auto ? 'on' : undefined}
    ></altcha-widget>
  );
};

export default AltchaWidget;