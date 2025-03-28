
import React from 'react';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, LineChart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Brain className="h-10 w-10 text-mindtrack-blue" />,
    title: 'Mood Tracking',
    description: 'Log and monitor your daily mood patterns with our intuitive tracking system.',
  },
  {
    icon: <LineChart className="h-10 w-10 text-mindtrack-green" />,
    title: 'AI-Powered Insights',
    description: 'Receive personalized insights and patterns based on your emotional data.',
  },
  {
    icon: <Heart className="h-10 w-10 text-mindtrack-lavender" />,
    title: 'CBT Tools',
    description: 'Access cognitive behavioral therapy exercises to improve thought patterns.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-mindtrack-blue" />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and only accessible to you and Dr. Bassma.',
  },
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <section className="py-16 container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 header-gradient">Nurture Your Mental Health</h2>
          <p className="text-muted-foreground">
            MindTrack provides you with tools and insights to understand your emotional patterns
            and improve your mental well-being under the guidance of Dr. Bassma Adel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 bg-accent/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 header-gradient">Meet Dr. Bassma Adel</h2>
              <p className="text-muted-foreground mb-6">
                Specialized in anxiety, depression, family counseling, and more. Dr. Bassma combines her expertise in 
                positive psychology with clinical experience to provide compassionate mental health care.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-mindtrack-green mr-2">✓</span>
                  <span>Master's Degree in Positive Psychology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-mindtrack-green mr-2">✓</span>
                  <span>Clinical Psychology Diploma</span>
                </li>
                <li className="flex items-start">
                  <span className="text-mindtrack-green mr-2">✓</span>
                  <span>Member of Professional Psychological Associations</span>
                </li>
              </ul>
              <Button asChild className="btn-secondary">
                <Link to="/about">Learn More About Dr. Bassma</Link>
              </Button>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-mindtrack-lavender/50 to-mindtrack-blue/50 rounded-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white/90">
                <div className="text-center">
                  <span className="text-xl font-semibold">Dr. Bassma Adel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 header-gradient">Start Your Mental Health Journey Today</h2>
          <p className="text-muted-foreground mb-8">
            Track your moods, identify triggers, practice gratitude, and access personalized mental health tools - all in one secure platform.
          </p>
          <Button className="btn-primary" size="lg" asChild>
            <Link to="/dashboard">Get Started with MindTrack</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
