import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { useTranslation } from '@/hooks/useTranslation';

// عند إضافة صفحات أخرى، سيتم استيرادها هنا
// import DoctorProfilePage from './pages/DoctorProfilePage';
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import AppointmentsPage from './pages/AppointmentsPage';
// import VideoCallPage from './pages/VideoCallPage';

const App: React.FC = () => {
  const { isRTL } = useTranslation();
  
  // تطبيق الاتجاه الصحيح للغة على الجسم
  useEffect(() => {
    // إضافة فئة للتسهيلات مع RTL
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
    
    // إضافة خطوط Google للغة العربية
    const googleFontsLink = document.createElement('link');
    googleFontsLink.rel = 'stylesheet';
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(googleFontsLink);
    
    return () => {
      // تنظيف
      document.head.removeChild(googleFontsLink);
    };
  }, [isRTL]);
  
  return (
    <Router>
      <div className={`app ${isRTL ? 'rtl' : 'ltr'}`}>
        <Routes>
          {/* الصفحة الرئيسية */}
          <Route path="/" element={<Home />} />
          
          {/* عند إضافة المزيد من الصفحات */}
          {/* <Route path="/doctor/:id" element={<DoctorProfilePage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          {/* <Route path="/appointments" element={<AppointmentsPage />} /> */}
          {/* <Route path="/video-call/:appointmentId" element={<VideoCallPage />} /> */}
          
          {/* توجيه للصفحة الرئيسية إذا لم يتم العثور على المسار */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
