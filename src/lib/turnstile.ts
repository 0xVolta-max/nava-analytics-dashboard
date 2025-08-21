interface TurnstileWindow extends Window {
  turnstile?: {
    render: (element: string | HTMLElement, options: TurnstileOptions) => string;
    reset: (widgetId: string) => void;
    execute: (widgetId: string) => void;
  };
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'invisible';
  tabindex?: number;
  language?: string;
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
  'response-field'?: boolean;
  'response-field-name'?: string;
  'chl-api'?: string;
  'auto-reset'?: boolean;
  binding?: string;
}

declare const window: TurnstileWindow;

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export const renderTurnstile = (
  containerId: string,
  onVerify: (token: string) => void,
  onError: () => void,
  size: 'normal' | 'compact' | 'invisible' = 'invisible'
): string | undefined => {
  if (!window.turnstile || !TURNSTILE_SITE_KEY) {
    console.error("Cloudflare Turnstile script not loaded or site key missing.");
    return undefined;
  }

  const widgetId = window.turnstile.render(`#${containerId}`, {
    sitekey: TURNSTILE_SITE_KEY,
    callback: onVerify,
    'error-callback': onError,
    'expired-callback': onError,
    'timeout-callback': onError,
    size: size,
    theme: 'dark', // Assuming dark theme based on your app's styling
  });

  return widgetId;
};

export const resetTurnstile = (widgetId: string) => {
  if (window.turnstile) {
    window.turnstile.reset(widgetId);
  }
};

export const executeTurnstile = (widgetId: string) => {
  if (window.turnstile) {
    window.turnstile.execute(widgetId);
  }
};