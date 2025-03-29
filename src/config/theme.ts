// تكوين الألوان الأساسية للتطبيق
export const theme = {
  colors: {
    // الألوان الأساسية
    primary: {
      light: '#bcdefa',
      main: '#3b82f6', // اللون الأزرق الأساسي
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#fde68a',
      main: '#f59e0b', // اللون البرتقالي للتنبيهات والأزرار الثانوية
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    success: {
      light: '#a7f3d0',
      main: '#10b981', // اللون الأخضر للنجاح
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      light: '#fecaca',
      main: '#ef4444', // اللون الأحمر للأخطاء
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#fed7aa',
      main: '#f97316', // اللون البرتقالي للتحذيرات
      dark: '#ea580c',
      contrastText: '#ffffff',
    },
    info: {
      light: '#bae6fd',
      main: '#0ea5e9', // اللون الأزرق الفاتح للمعلومات
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    // ألوان الخلفية والنص
    background: {
      default: '#f9fafb', // خلفية التطبيق الرئيسية
      paper: '#ffffff', // خلفية العناصر والبطاقات
    },
    text: {
      primary: '#111827', // لون النص الأساسي
      secondary: '#4b5563', // لون النص الثانوي
      disabled: '#9ca3af', // لون النص المعطل
    },
    // ألوان الحدود
    border: {
      light: '#e5e7eb',
      main: '#d1d5db',
      dark: '#9ca3af',
    },
  },
  
  // الخطوط المستخدمة في التطبيق
  fonts: {
    primary: '"IBM Plex Sans Arabic", "Roboto", system-ui, sans-serif',
    heading: '"IBM Plex Sans Arabic", "Roboto", system-ui, sans-serif',
    monospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  
  // أحجام الخط
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  // أوزان الخط
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // نصف قطر الزوايا
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',   // دائري تماماً
  },
  
  // الظلال
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  
  // المسافات
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
    36: '9rem',      // 144px
    40: '10rem',     // 160px
    44: '11rem',     // 176px
    48: '12rem',     // 192px
    52: '13rem',     // 208px
    56: '14rem',     // 224px
    60: '15rem',     // 240px
    64: '16rem',     // 256px
    72: '18rem',     // 288px
    80: '20rem',     // 320px
    96: '24rem',     // 384px
  },
  
  // نقاط الكسر للتصميم المتجاوب
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // خصائص الانتقال
  transition: {
    DEFAULT: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}; 