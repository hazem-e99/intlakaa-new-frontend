/**
 * Google Tag Manager - Usage Examples
 * 
 * This file demonstrates various ways to use GTM tracking in your application.
 * Copy and adapt these examples to your specific needs.
 */

import { pushGTMEvent } from './gtm';

// ============================================================================
// EXAMPLE 1: Track Button Clicks
// ============================================================================

export const trackButtonClick = (buttonName: string, location: string) => {
  pushGTMEvent('button_click', {
    button_name: buttonName,
    location: location,
    timestamp: new Date().toISOString(),
  });
};

// Usage in a component:
// <button onClick={() => trackButtonClick('cta_button', 'hero_section')}>
//   Click Me
// </button>

// ============================================================================
// EXAMPLE 2: Track Form Submissions
// ============================================================================

export const trackFormSubmission = (
  formName: string,
  formData: Record<string, any>
) => {
  pushGTMEvent('form_submit', {
    form_name: formName,
    form_fields: Object.keys(formData).length,
    timestamp: new Date().toISOString(),
  });
};

// Usage in a form handler:
// const handleSubmit = (data) => {
//   trackFormSubmission('contact_form', data);
//   // ... rest of your submit logic
// };

// ============================================================================
// EXAMPLE 3: Track Page Views (React Router)
// ============================================================================

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    pushGTMEvent('page_view', {
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);
};

// Usage in App.tsx:
// function App() {
//   usePageTracking();
//   return <YourAppContent />;
// }

// ============================================================================
// EXAMPLE 4: Track E-commerce Events
// ============================================================================

export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  pushGTMEvent('view_item', {
    currency: 'USD',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      },
    ],
  });
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  pushGTMEvent('add_to_cart', {
    currency: 'USD',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
};

export const trackPurchase = (
  transactionId: string,
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>,
  total: number
) => {
  pushGTMEvent('purchase', {
    transaction_id: transactionId,
    currency: 'USD',
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

// ============================================================================
// EXAMPLE 5: Track User Interactions
// ============================================================================

export const trackVideoPlay = (videoTitle: string, videoId: string) => {
  pushGTMEvent('video_start', {
    video_title: videoTitle,
    video_id: videoId,
    video_provider: 'youtube', // or 'vimeo', 'custom', etc.
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  pushGTMEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackDownload = (fileName: string, fileType: string) => {
  pushGTMEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
    file_extension: fileName.split('.').pop(),
  });
};

// ============================================================================
// EXAMPLE 6: Track Scroll Depth
// ============================================================================

export const useScrollTracking = () => {
  useEffect(() => {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      maxScroll = Math.max(maxScroll, scrollPercentage);

      milestones.forEach((milestone) => {
        if (maxScroll >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          pushGTMEvent('scroll_depth', {
            scroll_percentage: milestone,
            page_path: window.location.pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

// ============================================================================
// EXAMPLE 7: Track Outbound Links
// ============================================================================

export const trackOutboundLink = (url: string, linkText: string) => {
  pushGTMEvent('outbound_click', {
    link_url: url,
    link_text: linkText,
    link_domain: new URL(url).hostname,
  });
};

// Usage in a component:
// <a
//   href="https://example.com"
//   onClick={() => trackOutboundLink('https://example.com', 'Example Link')}
// >
//   Example Link
// </a>

// ============================================================================
// EXAMPLE 8: Track User Engagement Time
// ============================================================================

export const useEngagementTracking = () => {
  useEffect(() => {
    const startTime = Date.now();

    const trackEngagement = () => {
      const engagementTime = Math.round((Date.now() - startTime) / 1000);
      pushGTMEvent('user_engagement', {
        engagement_time_seconds: engagementTime,
        page_path: window.location.pathname,
      });
    };

    // Track engagement every 30 seconds
    const interval = setInterval(trackEngagement, 30000);

    // Track on page unload
    window.addEventListener('beforeunload', trackEngagement);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', trackEngagement);
    };
  }, []);
};

// ============================================================================
// EXAMPLE 9: Track Errors
// ============================================================================

export const trackError = (
  errorMessage: string,
  errorType: string,
  errorLocation?: string
) => {
  pushGTMEvent('error', {
    error_message: errorMessage,
    error_type: errorType,
    error_location: errorLocation || window.location.pathname,
    timestamp: new Date().toISOString(),
  });
};

// Usage in error boundary or catch block:
// try {
//   // your code
// } catch (error) {
//   trackError(error.message, 'api_error', 'checkout_page');
// }

// ============================================================================
// EXAMPLE 10: Track Custom User Properties
// ============================================================================

export const setUserProperties = (properties: {
  userId?: string;
  userType?: string;
  subscriptionTier?: string;
  [key: string]: any;
}) => {
  pushGTMEvent('set_user_properties', properties);
};

// Usage after user login:
// setUserProperties({
//   userId: '12345',
//   userType: 'premium',
//   subscriptionTier: 'gold',
// });
