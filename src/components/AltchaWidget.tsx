import React from 'react';
import { Altcha } from '@altcha/react';

interface AltchaWidgetProps {
  onVerified: (challenge: string) => void;
  onError: (error: string) => void;
  auto?: boolean;
}

const AltchaWidget: React.FC<AltchaWidgetProps> = ({ onVerified, onError, auto = true }) => {
  const challengeUrl = import.meta.env.VITE_ALTCHA_CHALLENGE_API_URL || '/api/altcha-challenge';

  return (
    <div className="altcha-container mt-2 flex justify-center">
      <Altcha
        challengeurl={challengeUrl}
        onVerified={onVerified}
        onError={(e) => onError(e.message || 'Altcha verification failed.')}
        auto={auto}
        // You can customize the widget appearance here if needed
        // theme="dark"
        // debug={true}
      />
    </div>
  );
};

export default AltchaWidget;