import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MeetingScheduler } from '../components/MeetingScheduler';
import { MeetingBookingModal, QuickBookingButton, FloatingBookingButton } from '../components/MeetingBookingModal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function MeetingSchedulerDemo() {
  const handleBookingComplete = (booking: any) => {
    console.log('Booking completed:', booking);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-heading font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Meeting Scheduler Demo
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Experience our comprehensive meeting scheduling system that replaces Calendly with a fully integrated solution.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              Real-time Availability
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Clock className="h-3 w-3 mr-1" />
              Timezone Support
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Users className="h-3 w-3 mr-1" />
              Admin Dashboard
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <CheckCircle className="h-3 w-3 mr-1" />
              Email Confirmations
            </Badge>
          </div>
        </div>
      </section>

      {/* Demo Sections */}
      <section className="py-16 px-4">
        <div className="container mx-auto space-y-16">
          
          {/* Full Scheduler Demo */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Full Meeting Scheduler
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete scheduling interface with calendar view, slot selection, and booking form.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <MeetingScheduler
                onBookingComplete={handleBookingComplete}
                serviceType="AI Development Consultation"
              />
            </div>
          </div>

          {/* Modal Booking Demo */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Modal Booking Interface
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Easy-to-use modal that can be integrated into any page or component.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <MeetingBookingModal
                triggerText="Schedule AI Consultation"
                triggerVariant="default"
                serviceType="AI Development Consultation"
                onBookingComplete={handleBookingComplete}
              />
              <MeetingBookingModal
                triggerText="Book Strategy Session"
                triggerVariant="outline"
                serviceType="AI Strategy Session"
                onBookingComplete={handleBookingComplete}
              />
              <MeetingBookingModal
                triggerText="Request Demo"
                triggerVariant="secondary"
                serviceType="AI Demo & Walkthrough"
                onBookingComplete={handleBookingComplete}
              />
            </div>
          </div>

          {/* Quick Booking Buttons */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Quick Booking Buttons
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pre-configured buttons for common meeting types.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    AI Development
                  </CardTitle>
                  <CardDescription>
                    Discuss custom AI development needs and requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuickBookingButton serviceType="AI Development Consultation">
                    Book Consultation
                  </QuickBookingButton>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Strategy Session
                  </CardTitle>
                  <CardDescription>
                    Strategic planning for AI implementation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuickBookingButton serviceType="AI Strategy Session">
                    Book Strategy Call
                  </QuickBookingButton>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Demo & Walkthrough
                  </CardTitle>
                  <CardDescription>
                    Product demonstration and feature overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuickBookingButton serviceType="AI Demo & Walkthrough">
                    Request Demo
                  </QuickBookingButton>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Comparison */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Why Choose Our Scheduler?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how our integrated solution compares to external booking systems.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Our Integrated Scheduler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Full control over data and branding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Seamless integration with existing features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Real-time availability updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Customizable meeting types and durations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Admin dashboard for management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No monthly subscription fees</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">External Calendly</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Limited customization options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Data stored on external servers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Monthly subscription costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Limited integration capabilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Generic branding and UI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Dependency on third-party service</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Admin Dashboard Link */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Manage bookings, create slots, and view analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => window.open('/admin-meetings', '_blank')}
                  className="w-full"
                >
                  Open Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <FloatingBookingButton serviceType="consultation" />
      
      <Footer />
    </div>
  );
} 