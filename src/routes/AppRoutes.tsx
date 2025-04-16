
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLanguage } from '@/components/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Dashboard from "@/pages/Dashboard";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import DoctorProfile from "@/pages/DoctorProfile";
import VideoSession from "@/pages/VideoSession";
import Report from "@/components/Report";
import UserProfile from "@/components/user/UserProfile";
import DoctorAdmin from "@/components/doctor/DoctorAdmin";
import PaymentPage from "@/pages/PaymentPage";
import AccountSettings from "@/components/user/AccountSettings";

const AppRoutes = () => {
  const location = useLocation();
  const { language } = useLanguage();

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
          <Report />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <div className="container py-8">
            <UserProfile />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/account-settings" element={
        <ProtectedRoute>
          <AccountSettings />
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

export default AppRoutes;
