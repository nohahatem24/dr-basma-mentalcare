import React, { useEffect, useState } from 'react';
import { DoctorProfile } from '@/components/doctor/DoctorProfile';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { DoctorProfile as DoctorProfileType, Rating } from '@/types/user';
import { useTranslation } from '@/hooks/useTranslation';

// Mock data for demo
const mockDoctor: DoctorProfileType = {
  id: '1',
  email: 'dr.basma@mentalcare.com',
  fullName: 'Dr. Basma Ahmed',
  role: 'doctor',
  phoneNumber: '+1234567890',
  profileImage: '/assets/doctor-profile.jpg',
  createdAt: new Date('2021-01-01'),
  lastLogin: new Date('2023-05-15'),
  language: 'ar',
  specialization: 'Clinical Psychologist',
  bio: 'Dr. Basma Ahmed is a Clinical Psychologist with over 15 years of experience helping patients overcome anxiety, depression, and relationship issues. She specializes in cognitive behavioral therapy and mindfulness-based approaches.\n\nDr. Ahmed creates a safe, supportive environment for all her patients, focusing on evidence-based treatments tailored to individual needs. She is passionate about helping people improve their mental well-being and develop healthy coping strategies.',
  shortBio: 'Clinical Psychologist specializing in anxiety, depression and relationship issues',
  experience: [
    {
      title: 'Senior Clinical Psychologist',
      organization: 'Mental Wellness Center',
      startDate: new Date('2018-03-01'),
      endDate: undefined,
      description: 'Providing individual and group therapy for adults with anxiety, depression, and trauma-related disorders.',
    },
    {
      title: 'Clinical Psychologist',
      organization: 'City General Hospital',
      startDate: new Date('2012-06-01'),
      endDate: new Date('2018-02-28'),
      description: 'Conducted psychological assessments and therapy for inpatients and outpatients.',
    },
    {
      title: 'Assistant Psychologist',
      organization: 'University Counseling Center',
      startDate: new Date('2008-09-01'),
      endDate: new Date('2012-05-30'),
      description: 'Provided counseling services to university students dealing with academic stress and adjustment issues.',
    },
  ],
  education: [
    {
      degree: 'Ph.D. in Clinical Psychology',
      institution: 'University of California',
      year: 2008,
    },
    {
      degree: 'M.A. in Psychology',
      institution: 'Stanford University',
      year: 2004,
    },
    {
      degree: 'B.Sc. in Psychology',
      institution: 'University of Michigan',
      year: 2002,
    },
  ],
  certifications: [
    {
      title: 'Cognitive Behavioral Therapy Certification',
      issuer: 'American Psychological Association',
      year: 2010,
    },
    {
      title: 'Trauma-Focused Therapy Certification',
      issuer: 'International Society for Traumatic Stress Studies',
      year: 2015,
    },
    {
      title: 'Mindfulness-Based Stress Reduction Instructor',
      issuer: 'Center for Mindfulness',
      year: 2016,
    },
  ],
  languages: ['English', 'Arabic', 'French'],
  consultationFee: 120,
  rating: 4.8,
  reviewCount: 156,
  availableForImmediateSessions: true,
  isOnline: true,
  lastSeen: new Date(),
};

const mockRatings: Rating[] = [
  {
    id: '1',
    patientId: '101',
    patientName: 'Sarah Johnson',
    doctorId: '1',
    appointmentId: 'apt101',
    rating: 5,
    review: 'Dr. Ahmed is incredibly insightful and compassionate. After just a few sessions, I've noticed significant improvement in managing my anxiety. She creates a safe environment where I feel comfortable discussing difficult topics.',
    createdAt: new Date('2023-04-15'),
    doctorResponse: {
      response: 'Thank you for your kind words, Sarah. It's been a pleasure working with you and seeing your progress!',
      createdAt: new Date('2023-04-16'),
    },
  },
  {
    id: '2',
    patientId: '102',
    patientName: 'Michael Chen',
    doctorId: '1',
    appointmentId: 'apt102',
    rating: 5,
    review: 'I've been working with Dr. Ahmed for three months now, and her guidance has been transformative. She has helped me develop effective coping strategies for my depression and has always been extremely professional and supportive.',
    createdAt: new Date('2023-03-22'),
  },
  {
    id: '3',
    patientId: '103',
    patientName: 'Aisha Rahman',
    doctorId: '1',
    appointmentId: 'apt103',
    rating: 4,
    review: 'Dr. Ahmed is very knowledgeable and provides practical advice. The video session quality is excellent, making the online therapy experience seamless. She is always punctual and makes good use of the session time.',
    createdAt: new Date('2023-02-10'),
    doctorResponse: {
      response: 'Thank you for your feedback, Aisha. I'm glad the video sessions are working well for you!',
      createdAt: new Date('2023-02-11'),
    },
  },
  {
    id: '4',
    patientId: '104',
    patientName: 'David Wilson',
    doctorId: '1',
    appointmentId: 'apt104',
    rating: 5,
    review: 'I was hesitant about online therapy, but Dr. Ahmed made the transition from in-person sessions incredibly smooth. Her expertise in CBT has given me the tools to manage my panic attacks effectively. Highly recommend!',
    createdAt: new Date('2023-01-30'),
  },
  {
    id: '5',
    patientId: '105',
    patientName: 'Fatima Al-Sayed',
    doctorId: '1',
    appointmentId: 'apt105',
    rating: 5,
    review: 'Dr. Basma's bilingual abilities have been incredibly helpful for me as sometimes I can express myself better in Arabic. She is patient, understanding, and has helped me navigate through a difficult period in my life with compassion and expertise.',
    createdAt: new Date('2022-12-15'),
    doctorResponse: {
      response: 'شكراً جزيلاً لك فاطمة. أنا سعيدة بأن قدرتي على التحدث باللغتين ساعدتك في التعبير عن نفسك بشكل أفضل. أتطلع إلى مواصلة العمل معك!',
      createdAt: new Date('2022-12-16'),
    },
  },
];

export const DoctorProfilePage: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch the doctor profile and ratings from an API
    // For now, we'll use the mock data
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setDoctor(mockDoctor);
        setRatings(mockRatings);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">{t('errorOccurred')}</h2>
          <p className="mt-2 text-gray-600">{t('tryAgain')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">{t('doctorProfile')}</h1>
          <LanguageSwitcher />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DoctorProfile doctor={doctor} ratings={ratings} />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{t('patientReviews')}</h2>
          {/* You could add a full reviews component here if needed */}
        </div>
      </main>
    </div>
  );
}; 