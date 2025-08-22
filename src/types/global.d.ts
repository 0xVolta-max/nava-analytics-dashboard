declare global {
  interface Window {
    // turnstile?: { // Removed Turnstile declaration
    //   render: (element: string | HTMLElement, options: TurnstileOptions) => string;
    //   reset: (widgetId: string) => void;
    //   execute: (widgetId: string) => void;
    //   remove: (widgetId: string) => void;
    // };
  }
}

// Removed TurnstileOptions interface

export {}; // This line is important to make it a module and not global script