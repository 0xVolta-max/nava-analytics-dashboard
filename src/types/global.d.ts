declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      execute: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
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

export {}; // This line is important to make it a module and not global script