
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
import BookAppointment from "./pages/BookAppointment";
import VideoSession from "./pages/VideoSession";
import BookingFloatingButton from "./components/BookingFloatingButton";
import Report from "@/components/Report";
import UserProfile from "@/components/user/UserProfile";
import DoctorAdmin from "@/components/doctor/DoctorAdmin";
import { useLanguage } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

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
    // Check for existing session
    const checkSession = async () => {
      // For the demo purposes, hardcode authentication
      // In a real app, this would use supabase.auth.getSession()
      setTimeout(() => {
        setSession({
          isAuthenticated: true, // Set to true for demo
          isDoctor: false, // Change based on user role
          isLoading: false
        });
      }, 1000);
    };

    checkSession();
  }, []);

  // Auth context would be here in a real implementation
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
  // Here we're simulating authentication for demo purposes
  const isAuthenticated = true; // Would use context in real app
  const isDoctor = false; // Would use context in real app
  
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
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/doctor" element={<DoctorProfile />} />
      
      <Route path="/book-appointment" element={
        <ProtectedRoute>
          <BookAppointment />
        </ProtectedRoute>
      } />
      
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
