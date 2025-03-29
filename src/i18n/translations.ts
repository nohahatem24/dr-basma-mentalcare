import { Lang } from '@/hooks/useTranslation';

export type Language = 'ar' | 'en';

type TranslationDictionary = {
  [key: string]: string;
};

export type Translations = {
  [key in Language]: TranslationDictionary;
};

export const translations: Translations = {
  en: {
    // General
    home: 'Home',
    profile: 'Profile',
    appointments: 'Appointments',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    search: 'Search',
    seeAll: 'See All',
    noResults: 'No results found',
    
    // Authentication
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    
    // Doctor Profile
    doctorProfile: 'Doctor Profile',
    about: 'About',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    reviews: 'Reviews',
    aboutDoctor: 'About the Doctor',
    professionalExperience: 'Professional Experience',
    present: 'Present',
    seeAllReviews: 'See All Reviews',
    patientReviews: 'Patient Reviews',
    noReviewsYet: 'No reviews yet',
    doctorResponse: 'Doctor\'s Response',
    bookAppointment: 'Book Appointment',
    instantSession: 'Instant Session',
    unavailableNow: 'Unavailable Now',
    consultationFee: 'Fee',
    online: 'Online',
    offline: 'Offline',
    
    // Appointments
    upcomingAppointments: 'Upcoming Appointments',
    pastAppointments: 'Past Appointments',
    appointmentDetails: 'Appointment Details',
    scheduleAppointment: 'Schedule Appointment',
    reschedule: 'Reschedule',
    cancelAction: 'Cancel',
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    type: 'Type',
    status: 'Status',
    paymentStatus: 'Payment Status',
    notes: 'Notes',
    addNotes: 'Add Notes',
    videoCall: 'Video Call',
    startCall: 'Start Call',
    joinCall: 'Join Call',
    endCall: 'End Call',
    cancelAppointment: 'Cancel Appointment',
    confirmCancellation: 'Are you sure you want to cancel this appointment?',
    
    // Appointment Status
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    noShow: 'No Show',
    
    // Payment
    payment: 'Payment',
    paymentMethod: 'Payment Method',
    paymentMethods: 'Payment Methods',
    addPaymentMethod: 'Add Payment Method',
    cardNumber: 'Card Number',
    cardholderName: 'Cardholder Name',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    saveCard: 'Save Card',
    payNow: 'Pay Now',
    paid: 'Paid',
    unpaid: 'Unpaid',
    refunded: 'Refunded',
    processingPayment: 'Processing Payment',
    paymentSuccessful: 'Payment Successful',
    paymentFailed: 'Payment Failed',
    
    // Ratings
    yourRating: 'Your Rating',
    rateDoctor: 'Rate Doctor',
    leaveReview: 'Leave a Review',
    reviewPlaceholder: 'Share your experience with the doctor...',
    thankYouForReview: 'Thank you for your review!',
    
    // Video Call
    connecting: 'Connecting...',
    reconnecting: 'Reconnecting...',
    microphoneOff: 'Microphone Off',
    microphoneOn: 'Microphone On',
    cameraOff: 'Camera Off',
    cameraOn: 'Camera On',
    screenShare: 'Share Screen',
    stopScreenShare: 'Stop Sharing',
    leaveCall: 'Leave Call',
    callEnded: 'Call Ended',
    
    // Settings
    generalSettings: 'General Settings',
    accountSettings: 'Account Settings',
    notificationSettings: 'Notification Settings',
    privacySettings: 'Privacy Settings',
    language: 'Language',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    
    // Doctor Dashboard
    myPatients: 'My Patients',
    todayAppointments: 'Today\'s Appointments',
    upcomingSessionsList: 'Upcoming Sessions',
    totalPatients: 'Total Patients',
    totalSessions: 'Total Sessions',
    totalReviews: 'Total Reviews',
    averageRating: 'Average Rating',
    setAvailability: 'Set Availability',
    manageTimeSlots: 'Manage Time Slots',
    instantSessionAvailability: 'Instant Session Availability',
    
    // Patient Dashboard
    myAppointments: 'My Appointments',
    findDoctors: 'Find Doctors',
    upcomingSessions: 'Upcoming Sessions',
    pastSessions: 'Past Sessions',
    viewMedicalRecords: 'View Medical Records',
    
    // Errors
    errorOccurred: 'An error occurred',
    tryAgain: 'Please try again',
    sessionExpired: 'Your session has expired. Please login again.',
    networkError: 'Network error. Please check your connection.',
    
    // Success Messages
    appointmentBooked: 'Appointment booked successfully',
    appointmentCancelled: 'Appointment cancelled successfully',
    appointmentRescheduled: 'Appointment rescheduled successfully',
    profileUpdated: 'Profile updated successfully',
    passwordChanged: 'Password changed successfully',
  },
  
  ar: {
    // General
    home: 'الرئيسية',
    profile: 'الملف الشخصي',
    appointments: 'المواعيد',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'تسجيل جديد',
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    loading: 'جاري التحميل...',
    search: 'بحث',
    seeAll: 'عرض الكل',
    noResults: 'لا توجد نتائج',
    
    // Authentication
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'إعادة تعيين كلمة المرور',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    createAccount: 'إنشاء حساب جديد',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    
    // Doctor Profile
    doctorProfile: 'ملف الطبيب',
    about: 'نبذة',
    experience: 'الخبرات',
    education: 'التعليم',
    certifications: 'الشهادات',
    reviews: 'التقييمات',
    aboutDoctor: 'نبذة عن الطبيب',
    professionalExperience: 'الخبرة المهنية',
    present: 'حتى الآن',
    seeAllReviews: 'عرض جميع التقييمات',
    patientReviews: 'تقييمات المرضى',
    noReviewsYet: 'لا توجد تقييمات حتى الآن',
    doctorResponse: 'رد الطبيب',
    bookAppointment: 'حجز موعد',
    instantSession: 'جلسة فورية',
    unavailableNow: 'غير متاح الآن',
    consultationFee: 'الرسوم',
    online: 'متصل',
    offline: 'غير متصل',
    
    // Appointments
    upcomingAppointments: 'المواعيد القادمة',
    pastAppointments: 'المواعيد السابقة',
    appointmentDetails: 'تفاصيل الموعد',
    scheduleAppointment: 'جدولة موعد',
    reschedule: 'إعادة جدولة',
    cancelAction: 'إلغاء',
    date: 'التاريخ',
    time: 'الوقت',
    duration: 'المدة',
    type: 'النوع',
    status: 'الحالة',
    paymentStatus: 'حالة الدفع',
    notes: 'ملاحظات',
    addNotes: 'إضافة ملاحظات',
    videoCall: 'مكالمة فيديو',
    startCall: 'بدء المكالمة',
    joinCall: 'الانضمام للمكالمة',
    endCall: 'إنهاء المكالمة',
    cancelAppointment: 'إلغاء الموعد',
    confirmCancellation: 'هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟',
    
    // Appointment Status
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    cancelled: 'ملغى',
    noShow: 'لم يحضر',
    
    // Payment
    payment: 'الدفع',
    paymentMethod: 'طريقة الدفع',
    paymentMethods: 'طرق الدفع',
    addPaymentMethod: 'إضافة طريقة دفع',
    cardNumber: 'رقم البطاقة',
    cardholderName: 'اسم حامل البطاقة',
    expiryDate: 'تاريخ الانتهاء',
    cvv: 'رمز التحقق',
    saveCard: 'حفظ البطاقة',
    payNow: 'ادفع الآن',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    refunded: 'مسترد',
    processingPayment: 'جاري معالجة الدفع',
    paymentSuccessful: 'تم الدفع بنجاح',
    paymentFailed: 'فشل الدفع',
    
    // Ratings
    yourRating: 'تقييمك',
    rateDoctor: 'تقييم الطبيب',
    leaveReview: 'اترك تقييماً',
    reviewPlaceholder: 'شارك تجربتك مع الطبيب...',
    thankYouForReview: 'شكراً لتقييمك!',
    
    // Video Call
    connecting: 'جاري الاتصال...',
    reconnecting: 'جاري إعادة الاتصال...',
    microphoneOff: 'الميكروفون متوقف',
    microphoneOn: 'الميكروفون يعمل',
    cameraOff: 'الكاميرا متوقفة',
    cameraOn: 'الكاميرا تعمل',
    screenShare: 'مشاركة الشاشة',
    stopScreenShare: 'إيقاف مشاركة الشاشة',
    leaveCall: 'مغادرة المكالمة',
    callEnded: 'انتهت المكالمة',
    
    // Settings
    generalSettings: 'الإعدادات العامة',
    accountSettings: 'إعدادات الحساب',
    notificationSettings: 'إعدادات الإشعارات',
    privacySettings: 'إعدادات الخصوصية',
    language: 'اللغة',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    
    // Doctor Dashboard
    myPatients: 'مرضاي',
    todayAppointments: 'مواعيد اليوم',
    upcomingSessionsList: 'الجلسات القادمة',
    totalPatients: 'إجمالي المرضى',
    totalSessions: 'إجمالي الجلسات',
    totalReviews: 'إجمالي التقييمات',
    averageRating: 'متوسط التقييم',
    setAvailability: 'تعيين الأوقات المتاحة',
    manageTimeSlots: 'إدارة الفترات الزمنية',
    instantSessionAvailability: 'إتاحة الجلسات الفورية',
    
    // Patient Dashboard
    myAppointments: 'مواعيدي',
    findDoctors: 'البحث عن أطباء',
    upcomingSessions: 'الجلسات القادمة',
    pastSessions: 'الجلسات السابقة',
    viewMedicalRecords: 'عرض السجلات الطبية',
    
    // Errors
    errorOccurred: 'حدث خطأ',
    tryAgain: 'يرجى المحاولة مرة أخرى',
    sessionExpired: 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.',
    networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
    
    // Success Messages
    appointmentBooked: 'تم حجز الموعد بنجاح',
    appointmentCancelled: 'تم إلغاء الموعد بنجاح',
    appointmentRescheduled: 'تمت إعادة جدولة الموعد بنجاح',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    passwordChanged: 'تم تغيير كلمة المرور بنجاح',
  }
}; 