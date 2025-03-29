import React, { useState } from 'react';
import { DoctorProfile as DoctorProfileType, Rating } from '@/types/user';
import { StarIcon, ClockIcon, AwardIcon, GlobeIcon, HeartIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface DoctorProfileProps {
  doctor: DoctorProfileType;
  ratings: Rating[];
  showFullReviews?: boolean;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({
  doctor,
  ratings,
  showFullReviews = false,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'reviews'>('about');
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Doctor Header */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-center">
          <img
            src={doctor.profileImage || '/assets/default-doctor.png'}
            alt={doctor.fullName}
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* Doctor Info */}
      <div className="pt-20 pb-6 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{doctor.fullName}</h2>
        <p className="text-primary font-medium">{doctor.specialization}</p>
        
        <div className="flex items-center justify-center mt-2">
          {renderStars(doctor.rating)}
          <span className="ml-2 text-gray-600">
            {doctor.rating.toFixed(1)} ({doctor.reviewCount} {t('reviews')})
          </span>
        </div>

        <div className="flex justify-center items-center mt-4 space-x-6">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full mb-1 ${
              doctor.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {doctor.isOnline ? t('online') : t('offline')}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <ClockIcon className="w-5 h-5 text-gray-500 mb-1" />
            <span className="text-sm text-gray-600">{t('consultationFee')}: ${doctor.consultationFee}</span>
          </div>

          <div className="flex flex-col items-center">
            <GlobeIcon className="w-5 h-5 text-gray-500 mb-1" />
            <span className="text-sm text-gray-600">{doctor.languages.join(', ')}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all mr-4">
            {t('bookAppointment')}
          </button>
          <button className={`px-6 py-2 rounded-full transition-all border ${
            doctor.availableForImmediateSessions 
              ? 'bg-secondary text-white border-secondary' 
              : 'bg-gray-100 text-gray-500 border-gray-300'
          }`} disabled={!doctor.availableForImmediateSessions}>
            {doctor.availableForImmediateSessions ? t('instantSession') : t('unavailableNow')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('about')}
          >
            {t('about')}
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'experience' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('experience')}
          >
            {t('experience')}
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'education' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('education')}
          >
            {t('education')}
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            {t('reviews')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'about' && (
          <div>
            <h3 className="font-semibold text-lg mb-3">{t('aboutDoctor')}</h3>
            <p className="text-gray-700 whitespace-pre-line">{doctor.bio}</p>
            
            {doctor.certifications && doctor.certifications.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-md mb-2">{t('certifications')}</h4>
                <div className="space-y-2">
                  {doctor.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start">
                      <AwardIcon className="w-5 h-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">{cert.title}</p>
                        <p className="text-sm text-gray-600">{cert.issuer}, {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'experience' && (
          <div>
            <h3 className="font-semibold text-lg mb-3">{t('professionalExperience')}</h3>
            <div className="space-y-4">
              {doctor.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                  <h4 className="font-medium text-md">{exp.title}</h4>
                  <p className="text-primary">{exp.organization}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(exp.startDate).getFullYear()} - 
                    {exp.endDate ? new Date(exp.endDate).getFullYear() : t('present')}
                  </p>
                  {exp.description && <p className="mt-1 text-gray-700">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <h3 className="font-semibold text-lg mb-3">{t('education')}</h3>
            <div className="space-y-4">
              {doctor.education.map((edu, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center mr-3">
                    <GlobeIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-gray-700">{edu.institution}</p>
                    <p className="text-sm text-gray-600">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{t('patientReviews')}</h3>
              {!showFullReviews && ratings.length > 3 && (
                <a href="/doctor/reviews" className="text-primary text-sm font-medium">
                  {t('seeAllReviews')}
                </a>
              )}
            </div>

            <div className="space-y-4">
              {(showFullReviews ? ratings : ratings.slice(0, 3)).map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{review.patientName}</p>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.review && (
                    <p className="mt-2 text-gray-700">{review.review}</p>
                  )}
                  {review.doctorResponse && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium">{t('doctorResponse')}:</p>
                      <p className="text-sm text-gray-700">{review.doctorResponse.response}</p>
                    </div>
                  )}
                </div>
              ))}

              {ratings.length === 0 && (
                <div className="text-center py-6">
                  <HeartIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">{t('noReviewsYet')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 