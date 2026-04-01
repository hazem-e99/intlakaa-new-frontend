/**
 * Google Tag Manager Integration Utility
 * 
 * This module provides a clean and secure way to integrate Google Tag Manager
 * using environment variables. It dynamically injects GTM scripts into the DOM.
 */

/**
 * Initializes Google Tag Manager by injecting the required scripts
 * Reads GTM ID from environment variable: NEXT_PUBLIC_GTM_ID
 * 
 * @returns {boolean} Returns true if GTM was successfully initialized, false otherwise
 */
export const initializeGTM = (): boolean => {
  const isDev = process.env.NODE_ENV !== 'production';

  // Read GTM ID from environment variable
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || process.env.VITE_GTM_ID;

  // Validate GTM ID exists
  if (!GTM_ID) {
    console.warn('GTM ID not found. Please set NEXT_PUBLIC_GTM_ID in your .env file');
    return false;
  }

  // Validate GTM ID format (should start with GTM-)
  if (!GTM_ID.startsWith('GTM-')) {
    console.error('Invalid GTM ID format. GTM ID should start with "GTM-"');
    return false;
  }

  try {
    // Inject GTM script into <head>
    injectGTMScript(GTM_ID);
    
    // Inject GTM noscript iframe into <body>
    injectGTMNoScript(GTM_ID);

    if (isDev) {
      console.log(`GTM initialized successfully (${GTM_ID})`);
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize Google Tag Manager:', error);
    return false;
  }
};

/**
 * Injects the GTM script into the document <head>
 * @param {string} gtmId - The Google Tag Manager ID
 */
const injectGTMScript = (gtmId: string): void => {
  // Create and inject the GTM script
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  
  // Insert at the beginning of <head>
  document.head.insertBefore(script, document.head.firstChild);
};

/**
 * Injects the GTM noscript iframe into the document <body>
 * @param {string} gtmId - The Google Tag Manager ID
 */
const injectGTMNoScript = (gtmId: string): void => {
  // Create noscript element
  const noscript = document.createElement('noscript');
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  
  // Append iframe to noscript
  noscript.appendChild(iframe);
  
  // Insert right after opening <body> tag
  document.body.insertBefore(noscript, document.body.firstChild);
};

/**
 * Pushes a custom event to the GTM dataLayer
 * Useful for tracking custom events in your application
 * 
 * @param {string} event - The event name
 * @param {Record<string, any>} data - Additional event data
 */
export const pushGTMEvent = (event: string, data?: Record<string, any>): void => {
  if (typeof window === 'undefined') return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event,
    ...data,
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
  }
}
