
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Mail, Phone, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 header-gradient">Contact Dr. </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions or want to inquire about Dr. 's services? Use our secure messaging 
          system or contact information below to get in touch.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="card-hover">
          <CardHeader className="text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-mindtrack-blue" />
            <CardTitle>Secure Messaging</CardTitle>
            <CardDescription>
              Use our encrypted messaging system
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Send a secure message to Dr.  through our platform's 
              encrypted messaging system.
            </p>
            <Button className="btn-primary" size="sm" asChild>
              <a href="#messageForm">Send Message</a>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="text-center">
            <Mail className="h-8 w-8 mx-auto mb-2 text-mindtrack-green" />
            <CardTitle>Email</CardTitle>
            <CardDescription>
              Reach out via email
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              For general inquiries or information, you can send an email to:
            </p>
            <a href="mailto:info@drbasma.com" className="text-primary hover:underline">
              info@drbasma.com
            </a>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="text-center">
            <Phone className="h-8 w-8 mx-auto mb-2 text-mindtrack-lavender" />
            <CardTitle>Phone</CardTitle>
            <CardDescription>
              Call for urgent matters
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              For urgent matters during business hours, you can reach us at:
            </p>
            <a href="tel:+123456789" className="text-primary hover:underline">
              +123 456 789
            </a>
          </CardContent>
        </Card>
      </div>
      
      <div className="max-w-2xl mx-auto" id="messageForm">
        <Card>
          <CardHeader>
            <CardTitle>Send a Secure Message</CardTitle>
            <CardDescription>
              All messages are encrypted and will be responded to within 24-48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Message subject" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Write your message here..." className="min-h-[150px]" />
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Your message is encrypted and secure.
                </p>
                <Button type="submit" className="btn-primary">
                  Send Message <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center header-gradient">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What are your office hours?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dr. basma's consultation hours vary. Please contact us through the messaging 
                system to inquire about availability.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How quickly will I receive a response?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We aim to respond to all messages within 24-48 hours during business days.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is my information confidential?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Yes, all communications are confidential and protected by patient-doctor confidentiality.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Do you offer online consultations?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Yes, Dr. basma offers both in-person and online consultations depending on your needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
