
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';
import DoctorReviews from '@/components/DoctorReviews';

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="container">
      <div className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter header-gradient mb-2">
                  {language === 'en' ? 'Dr. Besma Adel' : 'د. بسمة عادل'}
                </h1>
                <p className="text-xl md:text-2xl text-accent-foreground mb-2">
                  {language === 'en' ? 'Clinical Psychologist' : 'أخصائية نفسية سريرية'}
                </p>
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'PhD in Clinical Psychology with over 15 years of experience' 
                    : 'دكتوراه في علم النفس السريري مع أكثر من 15 عامًا من الخبرة'}
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  {language === 'en' ? 'Education & Credentials' : 'التعليم والشهادات'}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    {language === 'en' 
                      ? 'PhD in Clinical Psychology, University of Cambridge, UK' 
                      : 'دكتوراه في علم النفس السريري، جامعة كامبريدج، المملكة المتحدة'}
                  </li>
                  <li>
                    {language === 'en' 
                      ? 'Masters in Psychological Medicine, University of Oxford, UK' 
                      : 'ماجستير في الطب النفسي، جامعة أكسفورد، المملكة المتحدة'}
                  </li>
                  <li>
                    {language === 'en' 
                      ? 'Licensed Clinical Psychologist (License #23581)' 
                      : 'أخصائية نفسية سريرية مرخصة (ترخيص رقم 23581)'}
                  </li>
                  <li>
                    {language === 'en' 
                      ? 'Certified in Cognitive Behavioral Therapy (CBT)' 
                      : 'معتمدة في العلاج المعرفي السلوكي (CBT)'}
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  {language === 'en' ? 'Areas of Expertise' : 'مجالات الخبرة'}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    {language === 'en' ? 'Anxiety & Depression' : 'القلق والاكتئاب'}
                  </li>
                  <li>
                    {language === 'en' ? 'Trauma & PTSD' : 'الصدمات واضطراب ما بعد الصدمة'}
                  </li>
                  <li>
                    {language === 'en' ? 'Relationship Counseling' : 'استشارات العلاقات'}
                  </li>
                  <li>
                    {language === 'en' ? 'Stress Management' : 'إدارة الضغط النفسي'}
                  </li>
                  <li>
                    {language === 'en' ? 'Personal Growth & Development' : 'النمو والتطور الشخصي'}
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  {language === 'en' ? 'Treatment Approach' : 'نهج العلاج'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'My approach combines evidence-based techniques with a warm, empathetic style. I believe in creating a safe, judgment-free space where clients can explore their challenges and develop practical strategies for growth and healing.'
                    : 'يجمع نهجي بين التقنيات المستندة إلى الأدلة وأسلوب دافئ ومتعاطف. أؤمن بخلق مساحة آمنة وخالية من الأحكام حيث يمكن للعملاء استكشاف تحدياتهم وتطوير استراتيجيات عملية للنمو والشفاء.'}
                </p>
              </div>
              
              <Button asChild size="lg" className="mt-2">
                <Link to="/book-appointment">
                  {language === 'en' ? 'Book an Appointment' : 'حجز موعد'}
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <img 
              src="/assets/images/BassmaAdel.jpg" 
              alt={language === 'en' ? 'Dr. Besma Adel' : 'د. بسمة عادل'} 
              className="rounded-lg shadow-lg w-full max-w-md mx-auto aspect-[3/4] object-cover" 
            />
          </div>
        </div>
        
        {/* Timeline section */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            {language === 'en' ? 'Professional Journey' : 'المسيرة المهنية'}
          </h2>
          
          <div className="relative border-l border-primary pl-8 space-y-12 py-4 ml-6">
            <div className="relative">
              <span className="absolute flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full -left-[3.25rem] top-0">
                2022
              </span>
              <h3 className="text-xl font-semibold">
                {language === 'en' 
                  ? 'Established Dr. Besma Mental Health Clinic' 
                  : 'تأسيس عيادة د. بسمة للصحة النفسية'}
              </h3>
              <p className="text-muted-foreground mt-2">
                {language === 'en' 
                  ? 'Founded a specialized mental health practice focusing on holistic psychological care and innovative therapeutic approaches.'
                  : 'تأسيس ممارسة متخصصة في الصحة النفسية تركز على الرعاية النفسية الشاملة والنهج العلاجية المبتكرة.'}
              </p>
            </div>
            
            <div className="relative">
              <span className="absolute flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full -left-[3.25rem] top-0">
                2018
              </span>
              <h3 className="text-xl font-semibold">
                {language === 'en' 
                  ? 'Senior Clinical Psychologist at Royal Medical Center' 
                  : 'أخصائية نفسية سريرية أولى في المركز الطبي الملكي'}
              </h3>
              <p className="text-muted-foreground mt-2">
                {language === 'en' 
                  ? 'Led a team of mental health professionals and developed specialized treatment programs for complex psychological conditions.'
                  : 'قادت فريقًا من المتخصصين في الصحة النفسية وطورت برامج علاجية متخصصة للحالات النفسية المعقدة.'}
              </p>
            </div>
            
            <div className="relative">
              <span className="absolute flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full -left-[3.25rem] top-0">
                2015
              </span>
              <h3 className="text-xl font-semibold">
                {language === 'en' 
                  ? 'Research Fellowship at Harvard Medical School' 
                  : 'زمالة بحثية في كلية الطب بجامعة هارفارد'}
              </h3>
              <p className="text-muted-foreground mt-2">
                {language === 'en' 
                  ? 'Conducted pioneering research on trauma recovery and resilience building strategies in diverse populations.'
                  : 'أجرت بحثًا رائدًا حول التعافي من الصدمات واستراتيجيات بناء المرونة في مجموعات سكانية متنوعة.'}
              </p>
            </div>
            
            <div className="relative">
              <span className="absolute flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full -left-[3.25rem] top-0">
                2010
              </span>
              <h3 className="text-xl font-semibold">
                {language === 'en' 
                  ? 'Clinical Psychologist at London Psychiatric Institute' 
                  : 'أخصائية نفسية سريرية في معهد لندن للطب النفسي'}
              </h3>
              <p className="text-muted-foreground mt-2">
                {language === 'en' 
                  ? 'Provided psychological assessments and therapy to diverse clients while specializing in anxiety and mood disorders.'
                  : 'قدمت التقييمات النفسية والعلاج لعملاء متنوعين مع التخصص في اضطرابات القلق والمزاج.'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Doctor Reviews Section */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            {language === 'en' ? 'Patient Reviews' : 'تقييمات المرضى'}
          </h2>
          <DoctorReviews />
        </div>
      </div>
    </div>
  );
};

export default About;
