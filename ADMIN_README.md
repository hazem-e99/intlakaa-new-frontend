# Admin Dashboard Documentation

## 🎯 Overview

A complete admin dashboard built with React + Vite, Supabase, TailwindCSS, and Shadcn UI. This dashboard allows you to manage and view customer requests stored in your Supabase database.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components (Shadcn UI)
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard with statistics
│   ├── Requests.tsx    # Requests table with search & pagination
│   ├── Settings.tsx    # Settings page
│   ├── Index.tsx       # Landing page
│   ├── Form.tsx        # Contact form
│   ├── ThankYou.tsx    # Thank you page
│   └── NotFound.tsx    # 404 page
├── layout/             # Layout components
│   ├── AdminLayout.tsx # Main admin layout wrapper
│   ├── Sidebar.tsx     # Sidebar navigation
│   └── Header.tsx      # Header with theme toggle
├── services/           # API service layer
│   └── requestsService.ts # Supabase queries for requests
├── lib/               # Utility functions
│   ├── supabase.js    # Supabase client
│   └── utils.ts       # Helper functions
├── hooks/             # Custom React hooks
└── App.tsx            # Main app with routing
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account with a project set up
- A `requests` table in your Supabase database

### Installation

1. Install dependencies:
```bash
npm install
# or
bun install
```

2. Configure Supabase (already done in `src/lib/supabase.js`):
```javascript
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
```

3. Start the development server:
```bash
npm run dev
# or
bun dev
```

4. Access the admin dashboard:
```
http://localhost:5173/admin
```

## 📊 Database Schema

The dashboard expects a `requests` table in Supabase with the following structure:

```sql
CREATE TABLE requests (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  store_url TEXT,
  monthly_sales TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enable Row Level Security (RLS)

For production, enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the form)
CREATE POLICY "Allow public insert" ON requests
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated reads (for the admin)
CREATE POLICY "Allow authenticated read" ON requests
  FOR SELECT TO authenticated
  USING (true);
```

## 🎨 Features

### 1. Dashboard Page (`/admin`)
- **Statistics Cards**: Total requests, monthly requests, daily requests, average sales
- **Recent Requests**: Quick view of the last 5 requests
- **Real-time Data**: Auto-refreshes with React Query

### 2. Requests Page (`/admin/requests`)
- **Data Table**: Display all requests in a sortable table
- **Search**: Filter by name or phone number (debounced)
- **Pagination**: Navigate through large datasets (10 items per page)
- **Refresh Button**: Manually refresh the data
- **Responsive**: Works on mobile, tablet, and desktop
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

### 3. Settings Page (`/admin/settings`)
- Admin profile settings
- Email and browser notifications toggle
- Dark/light mode switch
- RTL support for Arabic

### 4. Layout Components

#### Sidebar
- Navigation links with icons
- Active route highlighting
- Mobile responsive with hamburger menu
- Logout button

#### Header
- Page title
- Theme toggle (dark/light mode)
- User profile dropdown menu
- Sticky positioning

## 🔧 Service Layer

### `requestsService.ts`

All Supabase queries are centralized in this service:

```typescript
// Fetch all requests
getRequests(): Promise<Request[]>

// Search requests by name or phone
searchRequests(query: string): Promise<Request[]>

// Paginate requests
paginateRequests(page: number, limit: number): Promise<PaginatedResponse>

// Search + Paginate combined
searchAndPaginateRequests(query: string, page: number, limit: number): Promise<PaginatedResponse>
```

## 🎯 Routing Structure

```
/ → Landing page
/form → Contact form
/thank-you → Success page
/admin → Admin dashboard (main)
/admin/requests → Requests table
/admin/settings → Settings page
* → 404 Not Found
```

## 🎨 Styling & Theming

- **TailwindCSS**: Utility-first CSS framework
- **Shadcn UI**: Pre-built accessible components
- **Dark Mode**: Built-in with toggle
- **Responsive**: Mobile-first design
- **RTL Support**: Ready for Arabic content

### Color Scheme

The dashboard uses your project's existing theme:
- Primary color for active states and CTAs
- Muted colors for backgrounds
- Semantic colors for success/error states

## 📱 Responsive Design

- **Mobile (< 768px)**: Hamburger menu, stacked layout
- **Tablet (768px - 1024px)**: Sidebar visible, optimized spacing
- **Desktop (> 1024px)**: Full sidebar, multi-column layout

## 🔐 Security Considerations

### Current Setup
- Uses Supabase anonymous key (public access)
- No authentication required

### Recommended for Production

1. **Add Authentication**:
```typescript
// In Sidebar.tsx or Header.tsx
import { supabase } from "@/lib/supabase";

const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};
```

2. **Protect Admin Routes**:
```typescript
// Create ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}
```

3. **Enable RLS in Supabase** (see Database Schema section)

## 🚀 Performance Optimizations

1. **React Query Caching**: 30-second stale time for requests
2. **Lazy Loading**: All pages are lazy-loaded with code splitting
3. **Debounced Search**: 500ms delay to reduce API calls
4. **Optimized Renders**: Memoized components where needed

## 🧪 Testing the Dashboard

1. **Add Test Data**: Insert sample data into your Supabase `requests` table:

```sql
INSERT INTO requests (name, phone, store_url, monthly_sales)
VALUES 
  ('Ahmed Ali', '+966 50 123 4567', 'https://store1.com', '50000 SAR'),
  ('Sara Mohammed', '+966 55 234 5678', 'https://store2.com', '75000 SAR'),
  ('Khalid Hassan', '+966 56 345 6789', 'https://store3.com', '100000 SAR');
```

2. **Navigate to Admin**: Open `http://localhost:5173/admin`

3. **Test Features**:
   - Search for names/phones
   - Navigate between pages
   - Toggle dark mode
   - View statistics
   - Refresh data

## 🐛 Troubleshooting

### Issue: "Error fetching requests"
- Check Supabase URL and anon key in `src/lib/supabase.js`
- Verify the `requests` table exists in Supabase
- Check browser console for detailed error messages

### Issue: Table is empty
- Ensure you have data in the `requests` table
- Check RLS policies if enabled
- Verify Supabase connection

### Issue: Search not working
- Check that column names match (`name`, `phone`)
- Verify Supabase has proper indexes
- Check browser console for errors

## 📦 Dependencies

Key dependencies already installed:
- `react-router-dom` - Routing
- `@tanstack/react-query` - Data fetching & caching
- `@supabase/supabase-js` - Supabase client
- `date-fns` - Date formatting
- `framer-motion` - Animations (optional)
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `@radix-ui/*` - Shadcn UI primitives

## 🎓 Next Steps

1. **Add Authentication**: Implement Supabase Auth
2. **Add CRUD Operations**: Create, Update, Delete requests
3. **Export Data**: Add CSV/Excel export functionality
4. **Advanced Filters**: Filter by date range, sales amount
5. **Charts & Analytics**: Add visual charts with Recharts
6. **Email Integration**: Send notifications for new requests
7. **Multi-language**: Add i18n support for Arabic/English

## 📄 License

This admin dashboard is part of your project and follows your project's license.

---

**Built with ❤️ using React, Vite, Supabase, and Shadcn UI**
