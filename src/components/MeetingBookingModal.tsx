import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';

interface MeetingBookingButtonProps {
  triggerText?: string;
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
  serviceType?: string;
  className?: string;
  children?: React.ReactNode;
}

export function MeetingBookingModal({
  triggerText = "Schedule Consultation",
  triggerVariant = "default",
  triggerSize = "default",
  serviceType,
  className = "",
  children,
}: MeetingBookingButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/book-meeting', { state: { serviceType } });
  };

  return (
    <Button variant={triggerVariant} size={triggerSize} className={className} onClick={handleClick}>
      {children ? children : <><Calendar className="h-4 w-4 mr-2" />{triggerText}</>}
    </Button>
  );
}

// Quick booking button component for common use cases
export function QuickBookingButton({
  serviceType,
  variant = "default",
  size = "default",
  children
}: {
  serviceType: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}) {
  return (
    <MeetingBookingModal
      triggerText={children as string}
      triggerVariant={variant}
      triggerSize={size}
      serviceType={serviceType}
    />
  );
}

// Floating action button for mobile
export function FloatingBookingButton({
  serviceType = "consultation"
}: {
  serviceType?: string;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <MeetingBookingModal
        triggerText=""
        triggerVariant="default"
        triggerSize="icon"
        serviceType={serviceType}
        className="h-14 w-14 rounded-full shadow-lg"
      >
        <Calendar className="h-6 w-6" />
      </MeetingBookingModal>
    </div>
  );
}
