import React from 'react';
import * as Altcha from 'altcha';

interface AltchaWidgetProps {
  onVerified: (challenge: string) => void;
  onError: (error: string) => void;
  auto?: boolean;
}

const AltchaWidget: React.FC<AltchaWidgetProps> = ({ onVerified, onError, auto = true }) => {
  const challengeUrl = import.meta.env.VITE_ALTCHA_CHALLENGE_API_URL || '/api/altcha-challenge';

  return (
    <div className="altcha-container mt-2 flex justify-center">
      <div
        ref={el => {
          if (el) {
            // Clean up previous widget if any
            el.innerHTML = '';
            // @ts-ignore
            const widget = new (Altcha as any).default(el, {
              challengeUrl,
              auto,
              onVerified,
              onError: (e: any) => onError(e?.message || 'Altcha verification failed.'),
            });
            // Optionally store widget instance for further control
          }
        }}
        className="altcha-widget"
      />
    </div>
  );
};

export default AltchaWidget;