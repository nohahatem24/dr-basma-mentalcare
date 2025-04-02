import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ChatSupport from "./components/ChatSupport";
import Auth from "./pages/Auth";
import DoctorProfile from "./pages/DoctorProfile";
import VideoSession from "./pages/VideoSession";
import BookingFloatingButton from "./components/BookingFloatingButton";
import Report from "@/components/Report";
import UserProfile from "@/components/user/UserProfile";
import DoctorAdmin from "@/components/doctor/DoctorAdmin";
import { useLanguage } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import PaymentPage from "./pages/PaymentPage";

const queryClient = new QueryClient();

// Type for session and user
interface SessionState {
  isAuthenticated: boolean;
  isDoctor: boolean;
  isLoading: boolean;
}

// Auth provider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    isDoctor: false,
    isLoading: true
  });

  useEffect(() => {
    const checkSession = async () => {
      setTimeout(() => {
        setSession({
          isAuthenticated: true,
          isDoctor: false,
          isLoading: false
        });
      }, 1000);
    };

    checkSession();
  }, []);

  return (
    <div>
      {children}
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ 
  children,
  requireAuth = true,
  requireDoctor = false 
}: { 
  children: React.ReactNode;
  requireAuth?: boolean;
  requireDoctor?: boolean;
}) => {
  const location = useLocation();
  const isAuthenticated = true;
  const isDoctor = false;
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  if (requireDoctor && !isDoctor) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const [relationshipData, setRelationshipData] = useState([]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/book-appointment" element={<DoctorProfile />} />
      
      <Route path="/video-session" element={
        <ProtectedRoute>
          <VideoSession />
        </ProtectedRoute>
      } />
      
      <Route path="/report" element={
        <ProtectedRoute>
          <Report
            moodEntries={(location.state as any)?.moodEntries || []}
            relationshipData={relationshipData}
            language={language}
          />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <div className="container py-8">
            <UserProfile />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/doctor-admin" element={
        <ProtectedRoute requireDoctor={true}>
          <div className="container py-8">
            <DoctorAdmin />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/payment" element={
        <ProtectedRoute>
          <PaymentPage />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <AppRoutes />
              </main>
              <Footer />
              <ChatSupport />
              <BookingFloatingButton />
            </div>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
