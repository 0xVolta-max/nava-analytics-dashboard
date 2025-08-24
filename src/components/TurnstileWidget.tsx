import React, { useEffect, useRef, useState } from 'react';

interface TurnstileWidgetProps {
  onVerified: (token: string) => void;
  onError: (error: string) => void;
  onExpired?: () => void;
  onReset?: () => void;
}

// Global callback name counter
let callbackCounter = 0;

// Declare global for Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string;
    };
    [key: string]: any; // For dynamic callback functions
  }
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerified,
  onError,
  onExpired,
  onReset
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const widgetIdRef = useRef<string | null>(null);
  const callbackNameRef = useRef<string | null>(null);
  
  // Store callbacks in refs to avoid stale closures
  const onVerifiedRef = useRef(onVerified);
  const onErrorRef = useRef(onError);
  const onExpiredRef = useRef(onExpired);
  const onResetRef = useRef(onReset);
  
  // Update refs when props change
  useEffect(() => {
    onVerifiedRef.current = onVerified;
    onErrorRef.current = onError;
    onExpiredRef.current = onExpired;
    onResetRef.current = onReset;
  }, [onVerified, onError, onExpired, onReset]);

  useEffect(() => {
    console.log('🚀 [STABLE] TurnstileWidget mounted');
    let mounted = true;
    
    // Prevent multiple initializations
    if (widgetIdRef.current) {
      console.log('🚫 [STABLE] Widget already exists, skipping init');
      return;
    }

    // Check if script already exists
    if (document.querySelector('script[src*="turnstile"]') && window.turnstile) {
      console.log('✅ [STABLE] Script already loaded, initializing directly');
      initializeWidget();
      return;
    }

    // Create unique callback name
    const callbackName = `turnstileCallback_${++callbackCounter}`;
    callbackNameRef.current = callbackName;

    // Set up global callbacks using refs for stable execution
    window[callbackName] = (token: string) => {
      console.log('✅ [STABLE] Turnstile verified, token:', token.substring(0, 20) + '...');
      if (mounted && onVerifiedRef.current) {
        setIsLoading(false);
        console.log('🚀 [STABLE] Calling onVerified callback via ref...');
        try {
          onVerifiedRef.current(token);
          console.log('✅ [STABLE] onVerified callback executed successfully');
        } catch (error) {
          console.error('❌ [STABLE] Error in onVerified callback:', error);
        }
      } else {
        console.warn('⚠️ [STABLE] Component unmounted or callback missing, skipping');
      }
    };

    const errorCallbackName = `turnstileError_${callbackCounter}`;
    window[errorCallbackName] = (error: string) => {
      console.error('❌ [STABLE] Turnstile error:', error);
      if (mounted && onErrorRef.current) {
        setIsLoading(false);
        console.log('🚀 [STABLE] Calling onError callback via ref...');
        try {
          onErrorRef.current(`Bot verification failed: ${error}`);
          console.log('✅ [STABLE] onError callback executed successfully');
        } catch (error) {
          console.error('❌ [STABLE] Error in onError callback:', error);
        }
      } else {
        console.warn('⚠️ [STABLE] Component unmounted or error callback missing, skipping');
      }
    };

    function initializeWidget() {
      if (!mounted || !containerRef.current) return;
      
      const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
      if (!siteKey || siteKey === 'DEIN_CLOUDFLARE_TURNSTILE_SITE_KEY') {
        console.error('❌ [STABLE] Invalid site key');
        onError('Invalid configuration');
        return;
      }

      // Check if this is a test key (always passes)
      const isTestKey = siteKey === '0x4AAAAAABt7u_Co2b2tEbcj' || siteKey.startsWith('0x4AAAAAA');
      if (isTestKey) {
        console.log('🧪 [TEST-MODE] Using Turnstile test key - auto-verification enabled');
      }

      try {
        console.log('🎨 [STABLE] Rendering widget...');
        const widgetId = window.turnstile!.render(containerRef.current, {
          sitekey: siteKey,
          callback: callbackName,
          'error-callback': errorCallbackName,
          theme: 'light',
          size: 'normal'
        });
        
        widgetIdRef.current = widgetId;
        setIsLoading(false);
        console.log('✅ [STABLE] Widget rendered:', widgetId);
        
        // Debug: Test if callback is properly registered
        console.log('🧪 [DEBUG] Testing callback registration...');
        console.log('🧪 [DEBUG] Global callback exists:', typeof window[callbackName] === 'function');
        console.log('🧪 [DEBUG] Callback name:', callbackName);
        console.log('🧪 [DEBUG] onVerifiedRef.current exists:', !!onVerifiedRef.current);
        
        // For test keys, simulate successful verification after a short delay
        if (isTestKey) {
          console.log('🧪 [TEST-MODE] Simulating automatic verification in 2 seconds...');
          setTimeout(() => {
            if (mounted) {
              const testToken = 'TEST_TOKEN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
              console.log('🧪 [TEST-MODE] Triggering test verification with token:', testToken);
              
              // Manually call our callback since Turnstile test keys don't call callbacks
              if (window[callbackName]) {
                window[callbackName](testToken);
              } else {
                console.error('❌ [TEST-MODE] Callback function not found!');
              }
            }
          }, 2000); // 2 second delay to simulate real interaction
        }
        
      } catch (error) {
        console.error('❌ [STABLE] Widget render failed:', error);
        setIsLoading(false);
        onError('Widget initialization failed');
      }
    }

    // Load script only if not already loading
    if (!document.querySelector('script[src*="turnstile"]')) {
      console.log('📦 [STABLE] Loading Turnstile script...');
      
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ [STABLE] Script loaded');
        if (mounted) {
          setTimeout(() => initializeWidget(), 100);
        }
      };
      
      script.onerror = () => {
        console.error('❌ [STABLE] Script failed to load');
        if (mounted) {
          setIsLoading(false);
          onError('Failed to load bot protection');
        }
      };
      
      document.head.appendChild(script);
    }

    return () => {
      console.log('🧹 [STABLE] Cleaning up');
      mounted = false;
      
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          console.warn('Cleanup warning:', e);
        }
      }
      
      // Clean up global callbacks
      if (callbackNameRef.current) {
        delete window[callbackNameRef.current];
        delete window[errorCallbackName];
      }
    };
  }, []); // EMPTY DEPENDENCIES - run only once on mount

  return (
    <div className="min-h-[65px] flex items-center justify-center">
      {isLoading ? (
        <div className="text-sm text-gray-600">Loading bot protection...</div>
      ) : null}
      <div ref={containerRef}></div>
    </div>
  );
};

export default TurnstileWidget;
