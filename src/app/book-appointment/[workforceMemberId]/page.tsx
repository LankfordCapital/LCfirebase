
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarCheck } from "lucide-react";
import { addAppointment } from '@/ai/flows/appointment-scheduler-flow';

// Mock available times
const availableTimes = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
];

export default function BookAppointmentPage({ params }: { params: { workforceMemberId: string } }) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = async () => {
    if (!selectedTime || !name || !email) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a time and fill in your details.',
      });
      return;
    }
    setIsLoading(true);
    
    const appointmentDate = new Date(selectedDate);
    const [time, modifier] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    appointmentDate.setHours(hours, minutes, 0, 0);

    try {
      await addAppointment({
        title: `Appointment with ${name}`,
        start: appointmentDate.toISOString(),
        end: new Date(appointmentDate.getTime() + 30 * 60000).toISOString(), // 30 min duration
        type: 'appointment',
        description: `Booked by ${name} (${email})`,
        workforceMemberId: params.workforceMemberId,
      });
      setIsBooked(true);
      toast({
        title: 'Appointment Booked!',
        description: `Your appointment on ${appointmentDate.toLocaleDateString()} at ${selectedTime} is confirmed.`,
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: 'Could not book the appointment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isBooked) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary/5 p-4">
             <Card className="w-full max-w-lg text-center shadow-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-primary">Appointment Confirmed!</CardTitle>
                </CardHeader>
                <CardContent>
                    <CalendarCheck className="mx-auto h-16 w-16 text-green-500 mb-4"/>
                    <p className="text-lg">Thank you, {name}.</p>
                    <p className="text-muted-foreground">Your appointment for {new Date(selectedDate).toLocaleDateString()} at {selectedTime} has been successfully scheduled.</p>
                </CardContent>
             </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary/5 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Book an Appointment</CardTitle>
          <CardDescription>Select a time and provide your details to schedule a meeting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select a Time for {selectedDate.toLocaleDateString()}</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableTimes.map(time => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
          {selectedTime && (
            <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <Button onClick={handleBooking} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck className="mr-2 h-4 w-4" />}
                    Confirm Appointment for {selectedTime}
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
