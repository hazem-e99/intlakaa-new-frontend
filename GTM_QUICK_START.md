# GTM Quick Start

## 🚀 Setup (2 minutes)

### Step 1: Add Your GTM ID
Edit `.env` and replace `GTM-XXXXXXX` with your actual GTM container ID:

```env
VITE_GTM_ID=GTM-K8H9J2L
```

### Step 2: Restart Dev Server
```bash
npm run dev
```

### Step 3: Verify Installation
Open browser console and look for:
```
✅ Google Tag Manager initialized successfully (GTM-XXXXXXX)
```

## 📊 Track Custom Events

```typescript
import { pushGTMEvent } from './utils/gtm';

// Simple event
pushGTMEvent('button_click', { button_name: 'cta' });

// E-commerce event
pushGTMEvent('purchase', {
  value: 99.99,
  currency: 'USD',
  product_id: '12345'
});
```

## 🔧 Production Deployment

### Vercel
1. Project Settings → Environment Variables
2. Add: `VITE_GTM_ID` = `GTM-XXXXXXX`
3. Redeploy

### Netlify
1. Site Settings → Environment
2. Add: `VITE_GTM_ID` = `GTM-XXXXXXX`
3. Trigger deploy

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| GTM not loading | Check `.env` has `VITE_GTM_ID` set |
| Changes not reflecting | Restart dev server after `.env` changes |
| Production not working | Verify env var is set in hosting platform |

## 📁 Files Modified

- ✅ `src/utils/gtm.ts` - GTM utility (new)
- ✅ `src/main.tsx` - Initialization added
- ✅ `.env` - GTM ID variable added

---

**Need more details?** See `GTM_INTEGRATION_GUIDE.md`
