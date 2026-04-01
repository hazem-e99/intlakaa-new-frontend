import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import ScrollToTop from "./lib/ScrollToTop";
import { pushGTMEvent } from "./utils/gtm";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Form = lazy(() => import("./pages/Form"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdsLanding = lazy(() => import("./pages/AdsLanding"));
const Login = lazy(() => import("./pages/Login"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));

// Public CMS pages
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const DynamicPage = lazy(() => import("./pages/DynamicPage"));

// Admin pages
const AdminLayout = lazy(() => import("./layout/AdminLayout").then(m => ({ default: m.AdminLayout })));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Requests = lazy(() => import("./pages/Requests"));
const Settings = lazy(() => import("./pages/Settings"));
const ManageAdmins = lazy(() => import("./pages/ManageAdmins"));
const SEOManagement = lazy(() => import("./pages/SEOManagement"));
const PagesManagement = lazy(() => import("./pages/PagesManagement"));
const PageEditor = lazy(() => import("./pages/PageEditor"));
const PostEditor = lazy(() => import("./pages/PostEditor"));
const Toaster = lazy(() => import("./components/ui/toaster").then((mod) => ({ default: mod.Toaster })));
const Sonner = lazy(() => import("./components/ui/sonner").then((mod) => ({ default: mod.Toaster })));

// Protected Route
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const PageViewTracker = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  useEffect(() => {
    pushGTMEvent('page_view', {
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);
  return <>{children}</>;
};

const App = () => {
  const [enableToasters, setEnableToasters] = useState(false);

  useEffect(() => {
    const enable = () => setEnableToasters(true);

    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(enable, { timeout: 2500 });
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as any).cancelIdleCallback(id);
        }
      };
    }

    const timeoutId = window.setTimeout(enable, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {enableToasters && (
        <Suspense fallback={null}>
          <Toaster />
          <Sonner />
        </Suspense>
      )}

      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <PageViewTracker>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/form" element={<Form />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/ads" element={<AdsLanding />} />

              {/* Blog */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Auth */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/change-password" element={<ChangePassword />} />
              <Route path="/admin/accept-invite" element={<AcceptInvite />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="requests" element={<Requests />} />
                <Route path="settings" element={<Settings />} />
                <Route path="manage-admins" element={<ManageAdmins />} />
                <Route path="seo-management" element={<SEOManagement />} />
                <Route path="pages" element={<PagesManagement />} />
                <Route path="pages/:id" element={<PageEditor />} />
                <Route path="posts/:id" element={<PostEditor />} />
              </Route>

              {/* Dynamic Pages — must be LAST before catch-all */}
              <Route path="/:slug" element={<DynamicPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageViewTracker>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
