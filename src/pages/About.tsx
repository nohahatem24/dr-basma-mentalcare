import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BassmaAdelImage from '@/assets/images/BassmaAdel.jpg';
import DoctorReviews from '@/components/DoctorReviews';
import { useDoctorRating } from '@/contexts/DoctorRatingContext';

type SessionsResponse = {
  count: number; 
};

const About = () => {
  const [sessionsCount, setSessionsCount] = useState(0); 
  const { averageRating } = useDoctorRating();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get<SessionsResponse>('/api/sessions');
        setSessionsCount(response.data.count);
      } catch (error) {
        console.error('Error fetching session count:', error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 header-gradient text-center">About Dr. Bassma Adel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1">
            <div className="aspect-square rounded-xl overflow-hidden">
              <img 
                src={BassmaAdelImage} 
                alt="Dr. Bassma Adel" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
          
          <div className="col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Professional Profile</h2>
            <p className="mb-4 text-muted-foreground">
              Dr. Bassma Adel is a dedicated mental health professional specializing in various psychological 
              treatments and therapies. With years of experience and comprehensive training, she is committed 
              to helping individuals navigate their mental health journey with compassion and expertise.
            </p>
            <p className="text-muted-foreground">
              Her approach combines evidence-based practices with a deep understanding of individual needs, 
              creating personalized treatment plans that address the unique challenges faced by each client.
            </p>
          </div>
        </div>

        {/* Highlighted Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Years of Experience */}
          <div className="p-6 rounded-lg bg-primary/10 text-center">
            <h3 className="text-4xl font-bold text-primary">
              {new Date().getFullYear() - 2016}+
            </h3>
            <p className="text-muted-foreground">Years of Experience</p>
          </div>

          {/* Average Rating */}
          <div className="p-6 rounded-lg bg-primary/10 text-center">
            <h3 className="text-4xl font-bold text-primary" key={averageRating}>
              {averageRating}
            </h3>
            <p className="text-muted-foreground">Average Rating</p>
          </div>

          {/* Number of Sessions */}
          <div className="p-6 rounded-lg bg-primary/10 text-center">
            <h3 className="text-4xl font-bold text-primary">{sessionsCount}+</h3>
            <p className="text-muted-foreground">Sessions Completed</p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 header-gradient">Specializations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">Anxiety Disorders</h3>
              <p className="text-sm text-muted-foreground">General anxiety, social phobia</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">Depression</h3>
              <p className="text-sm text-muted-foreground">Treatment and management</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">Family Counseling</h3>
              <p className="text-sm text-muted-foreground">Resolving family dynamics</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">Marital Problems</h3>
              <p className="text-sm text-muted-foreground">Conflict resolution</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">Behavioral Problems</h3>
              <p className="text-sm text-muted-foreground">Children and adolescents</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">Personality Disorders</h3>
              <p className="text-sm text-muted-foreground">Borderline and others</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">OCD</h3>
              <p className="text-sm text-muted-foreground">Obsessive-compulsive disorder</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">Addiction</h3>
              <p className="text-sm text-muted-foreground">Counseling and support</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">CBT</h3>
              <p className="text-sm text-muted-foreground">Cognitive-behavioral therapy</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">PTSD</h3>
              <p className="text-sm text-muted-foreground">Post-traumatic stress disorder</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <h3 className="font-medium">Psychological Assessments</h3>
              <p className="text-sm text-muted-foreground">Comprehensive evaluations</p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 header-gradient">Education & Certifications</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-mindtrack-green flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">✓</div>
              <div>
                <h3 className="font-medium">Master's Degree in Positive Psychology</h3>
                <p className="text-sm text-muted-foreground">Mansoura University</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-mindtrack-green flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">✓</div>
              <div>
                <h3 className="font-medium">Bachelor of Arts in Psychology</h3>
                <p className="text-sm text-muted-foreground">Mansoura University</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-mindtrack-green flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">✓</div>
              <div>
                <h3 className="font-medium">Clinical Psychology Diploma</h3>
                <p className="text-sm text-muted-foreground">Mansoura University</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-mindtrack-green flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">✓</div>
              <div>
                <h3 className="font-medium">Member of the Association of Psychologists (Ranm)</h3>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-mindtrack-green flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">✓</div>
              <div>
                <h3 className="font-medium">Member of the Egyptian Association for Psychotherapists</h3>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 header-gradient">Professional Experience</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-accent/10">
              <h3 className="font-medium mb-2">Clinical Training</h3>
              <p className="text-muted-foreground">
                Trained as a clinical psychotherapist at prestigious institutions including Abbasiya Hospital, 
                Jamal Madi Abu al-Azayem Hospitals, and Mansoura University Hospital.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-accent/10">
              <h3 className="font-medium mb-2">Volunteer Work</h3>
              <p className="text-muted-foreground">
                Volunteering as a psychotherapist in the Resala Charity Association, providing 
                mental health support to underserved communities.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-accent/10">
              <h3 className="font-medium mb-2">Awareness Campaigns</h3>
              <p className="text-muted-foreground">
                Participation in campaigns to raise awareness of mental illness and prevention through 
                the hotline for psychological support and emergencies in the General Secretariat of Abbasiya.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-accent/10">
              <h3 className="font-medium mb-2">Current Practice</h3>
              <p className="text-muted-foreground">
                Works as a psychologist at Dr. Mustafa Abu Al-Azaim Clinics for Mental Health, 
                providing comprehensive psychological care to patients.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 header-gradient">Professional Philosophy</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Dr. Bassma believes in a holistic approach to mental health that considers each 
            individual's unique circumstances, challenges, and strengths. Her goal is to 
            empower patients with the tools and insights they need to navigate life's challenges 
            and achieve emotional well-being.
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-6 header-gradient text-center">Patient Reviews</h2>
        <DoctorReviews />
      </div>
    </div>
  );
};

export default About;
