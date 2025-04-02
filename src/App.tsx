
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatSupport from "@/components/ChatSupport";
import BookingFloatingButton from "@/components/BookingFloatingButton";
import ScrollToTop from "@/components/ScrollToTop";
import AuthProvider from "@/components/auth/AuthProvider";
import AppRoutes from "@/routes/AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <ScrollToTop />
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
