
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Anxiety Disorders',
    description: 'Treatment for general anxiety, panic disorders, and social phobia using evidence-based approaches.',
    icon: '😰',
  },
  {
    title: 'Depression',
    description: 'Comprehensive management of depression through therapy, behavioral activation, and mood tracking.',
    icon: '😔',
  },
  {
    title: 'Family Counseling',
    description: 'Resolving conflicts and improving communication within family units for better relationships.',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Marital Problems',
    description: 'Working through relationship challenges with couples to rebuild trust and strengthen bonds.',
    icon: '💑',
  },
  {
    title: 'Behavioral Problems in Children',
    description: 'Addressing behavioral issues in children and adolescents with age-appropriate interventions.',
    icon: '👶',
  },
  {
    title: 'Personality Disorders',
    description: 'Specialized monitoring and treatment for borderline personality disorder and other conditions.',
    icon: '🧠',
  },
  {
    title: 'Obsessive-Compulsive Disorder',
    description: 'Evidence-based treatment for OCD using exposure and response prevention techniques.',
    icon: '🔄',
  },
  {
    title: 'Addiction Counseling',
    description: 'Support for those struggling with addiction through compassionate and effective therapy.',
    icon: '⛓️',
  },
  {
    title: 'Cognitive-Behavioral Therapy',
    description: 'Structured approach to identifying and changing negative thought patterns and behaviors.',
    icon: '💭',
  },
  {
    title: 'Post-Traumatic Stress Disorder',
    description: 'Trauma-focused therapy to help process difficult experiences and reduce symptoms.',
    icon: '⚡',
  },
  {
    title: 'Psychological Assessments',
    description: 'Comprehensive evaluations to help understand mental health conditions and guide treatment.',
    icon: '📋',
  },
  {
    title: 'MindTrack Digital Platform',
    description: 'Digital tools for mood tracking, journaling, and receiving AI-powered insights for mental wellness.',
    icon: '📱',
  },
];

const Services = () => {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 header-gradient">Our Services</h1>
        <p className="text-muted-foreground">
          Dr. Bassma Adel offers a range of mental health services to support you on your journey to emotional well-being.
          Each service is delivered with compassion, expertise, and a commitment to your individual needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service, i) => (
          <Card key={i} className="card-hover">
            <CardHeader>
              <div className="text-4xl mb-3">{service.icon}</div>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{service.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-accent/10 rounded-xl p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-mindtrack-blue text-white flex items-center justify-center font-bold mb-3">1</div>
              <h3 className="font-medium mb-2">Initial Contact</h3>
              <p className="text-sm text-muted-foreground text-center">Reach out through our secure messaging system to discuss your needs.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-mindtrack-green text-white flex items-center justify-center font-bold mb-3">2</div>
              <h3 className="font-medium mb-2">Consultation</h3>
              <p className="text-sm text-muted-foreground text-center">Schedule a consultation to discuss your concerns and goals.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-mindtrack-lavender text-white flex items-center justify-center font-bold mb-3">3</div>
              <h3 className="font-medium mb-2">Personalized Care</h3>
              <p className="text-sm text-muted-foreground text-center">Receive customized treatment and utilize MindTrack for ongoing support.</p>
            </div>
          </div>
          <Button className="btn-primary" asChild>
            <Link to="/contact">Contact Dr. Bassma</Link>
          </Button>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center header-gradient">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-2">What is the MindTrack platform?</h3>
            <p className="text-sm text-muted-foreground">
              MindTrack is Dr. Bassma's digital mental health platform that allows you to track your mood, 
              journal your thoughts, identify emotional triggers, and receive AI-powered insights based on your data.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-2">How is my privacy protected?</h3>
            <p className="text-sm text-muted-foreground">
              Your data is securely encrypted and only accessible to you and Dr. Bassma. We follow strict 
              confidentiality protocols to ensure your information remains private.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-2">Do I need to book appointments online?</h3>
            <p className="text-sm text-muted-foreground">
              No, our platform does not include an appointment booking system. Please use the contact 
              form or messaging system to inquire about consultations.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-2">What therapeutic approaches does Dr. Bassma use?</h3>
            <p className="text-sm text-muted-foreground">
              Dr. Bassma utilizes various evidence-based approaches including Cognitive-Behavioral Therapy (CBT), 
              positive psychology techniques, and personalized treatment plans based on individual needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
