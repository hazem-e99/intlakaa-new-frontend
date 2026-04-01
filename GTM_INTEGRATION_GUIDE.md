# Google Tag Manager Integration Guide

## Overview

This project uses a clean, secure Google Tag Manager (GTM) integration that reads the GTM container ID from environment variables. The implementation is production-safe and fully compatible with Vite.

## Setup Instructions

### 1. Configure Your GTM ID

Open your `.env` file and replace `GTM-XXXXXXX` with your actual Google Tag Manager container ID:

```env
VITE_GTM_ID=GTM-XXXXXXX
```

**Example:**
```env
VITE_GTM_ID=GTM-K8H9J2L
```

### 2. Find Your GTM Container ID

1. Log in to [Google Tag Manager](https://tagmanager.google.com/)
2. Select your container
3. Your GTM ID is displayed at the top (format: `GTM-XXXXXXX`)

### 3. Environment-Specific Configuration

#### Development
Create a `.env.local` file for local development:
```env
VITE_GTM_ID=GTM-XXXXXXX
```

#### Production
Set the environment variable in your hosting platform:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `VITE_GTM_ID` with your production GTM ID
3. Redeploy your application

**Netlify:**
1. Go to Site Settings → Build & Deploy → Environment
2. Add `VITE_GTM_ID` variable
3. Trigger a new deploy

**Other Platforms:**
Set the `VITE_GTM_ID` environment variable according to your platform's documentation.

## How It Works

### Architecture

The GTM integration consists of two main components:

1. **GTM Utility** (`src/utils/gtm.ts`)
   - Reads `VITE_GTM_ID` from environment variables
   - Validates the GTM ID format
   - Dynamically injects GTM scripts into the DOM
   - Provides helper functions for custom event tracking

2. **Initialization** (`src/main.tsx`)
   - Calls `initializeGTM()` before React renders
   - Ensures GTM is available from the first page load

### Script Injection

The utility automatically injects:

1. **Head Script**: GTM tracking script in `<head>`
2. **Body Noscript**: Fallback iframe in `<body>` for users with JavaScript disabled

## Usage

### Basic Setup (Already Configured)

The GTM integration is automatically initialized when your app starts. No additional code is needed.

### Custom Event Tracking

To track custom events in your application, use the `pushGTMEvent` helper:

```typescript
import { pushGTMEvent } from './utils/gtm';

// Track a button click
pushGTMEvent('button_click', {
  button_name: 'cta_button',
  page: 'home'
});

// Track a form submission
pushGTMEvent('form_submit', {
  form_name: 'contact_form',
  user_type: 'new_visitor'
});

// Track a custom conversion
pushGTMEvent('purchase', {
  value: 99.99,
  currency: 'USD',
  product_id: '12345'
});
```

### Example: Tracking Page Views in React Router

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pushGTMEvent } from './utils/gtm';

function App() {
  const location = useLocation();

  useEffect(() => {
    pushGTMEvent('page_view', {
      page_path: location.pathname,
      page_title: document.title
    });
  }, [location]);

  return <YourAppContent />;
}
```

## Security Features

✅ **No Hardcoded IDs**: GTM ID is read from environment variables  
✅ **Validation**: Checks GTM ID format before injection  
✅ **Error Handling**: Graceful fallback if GTM ID is missing  
✅ **Type Safety**: Full TypeScript support  
✅ **Production-Safe**: Works seamlessly with Vite's build process  

## Troubleshooting

### GTM Not Loading

1. **Check Console**: Look for GTM initialization messages
   - Success: `✅ Google Tag Manager initialized successfully (GTM-XXXXXXX)`
   - Warning: `GTM ID not found. Please set VITE_GTM_ID in your .env file`

2. **Verify Environment Variable**:
   ```bash
   # Check if variable is set
   echo $VITE_GTM_ID
   ```

3. **Restart Dev Server**: After changing `.env`, restart your dev server:
   ```bash
   npm run dev
   ```

### GTM ID Format Error

If you see: `Invalid GTM ID format. GTM ID should start with "GTM-"`

- Ensure your GTM ID starts with `GTM-` (e.g., `GTM-K8H9J2L`)
- Don't include quotes or extra spaces

### Production Deployment Issues

1. **Verify Environment Variable**: Check that `VITE_GTM_ID` is set in your hosting platform
2. **Rebuild**: Vite injects environment variables at build time, so rebuild after changes
3. **Check Browser Console**: Use browser DevTools to verify GTM script is loaded

## Testing

### Verify GTM Installation

1. **Browser Console**:
   - Open DevTools Console
   - Look for the success message: `✅ Google Tag Manager initialized successfully`

2. **GTM Preview Mode**:
   - In GTM, click "Preview"
   - Enter your website URL
   - Verify tags are firing correctly

3. **Check dataLayer**:
   ```javascript
   // In browser console
   console.log(window.dataLayer);
   ```

### Test Custom Events

```javascript
// In browser console
window.dataLayer.push({
  event: 'test_event',
  test_data: 'hello'
});
```

## File Structure

```
src/
├── utils/
│   └── gtm.ts          # GTM utility functions
├── main.tsx            # GTM initialization
└── ...

.env                    # Environment variables (local)
.env.local              # Local overrides (gitignored)
```

## Best Practices

1. **Never Commit `.env.local`**: Keep sensitive IDs out of version control
2. **Use Different GTM Containers**: Separate containers for dev/staging/production
3. **Test Before Deploying**: Always test GTM in preview mode before going live
4. **Document Custom Events**: Keep track of custom events you're tracking
5. **Monitor Performance**: GTM scripts are async, but monitor page load times

## Additional Resources

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [GTM DataLayer Documentation](https://developers.google.com/tag-manager/devguide)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your GTM container is published
3. Check browser console for errors
4. Test in GTM preview mode

---

**Last Updated**: December 2025  
**Vite Version**: Compatible with Vite 4.x and 5.x
