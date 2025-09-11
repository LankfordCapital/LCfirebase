
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
// Define Appointment type locally
interface Appointment {
  id: string;
  title: string;
  start: string;
  end?: string;
  type: 'appointment' | 'task';
  description?: string;
  workforceMemberId: string;
}
import { Plus, Calendar as CalendarIcon, ClipboardCheck, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/auth-context';
import { CustomLoader } from './ui/custom-loader';

export function SchedulerClient() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Appointment>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEvents = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/appointments?workforceMemberId=${user.uid}`);
            const data = await response.json();
            
            if (response.ok) {
                setEvents(data.appointments || []);
            } else {
                throw new Error(data.error || 'Failed to fetch events');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch events.'})
        }
        setIsLoading(false);
    }
    fetchEvents();
  }, [user, toast]);
  
  const handleSaveEvent = async () => {
    if (!user || !currentEvent.title || !currentEvent.start) {
        toast({ variant: 'destructive', title: 'Error', description: 'Title and start date are required.'});
        return;
    }
    setIsSubmitting(true);
    try {
        const eventToSave = {
            ...currentEvent,
            workforceMemberId: user.uid,
        };

        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventToSave),
        });

        const data = await response.json();

        if (response.ok) {
            // Add the new event to the local state
            setEvents(prev => [...prev, {id: data.id, ...eventToSave} as Appointment]);
            toast({ title: 'Success', description: 'Event saved successfully.' });
            setIsDialogOpen(false);
            setCurrentEvent({});
        } else {
            throw new Error(data.error || 'Failed to save event');
        }
    } catch (error) {
        console.error('Error saving event:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save the event.'});
    }
    setIsSubmitting(false);
  };

  const dailyEvents = events.filter(event => 
    selectedDate && new Date(event.start).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
            <CardContent className="p-2">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="w-full"
                />
            </CardContent>
        </Card>
         <Card className="mt-6">
            <CardHeader>
                <CardTitle>Public Booking Link</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Share this link for others to book appointments with you.</p>
                <div className="flex gap-2">
                    <Input readOnly value={user ? `${window.location.origin}/book-appointment/${user.uid}` : 'Loading...'}/>
                    <Button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/book-appointment/${user?.uid}`)}>Copy</Button>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
                Schedule for {selectedDate ? selectedDate.toLocaleDateString() : 'Today'}
            </CardTitle>
            <Button onClick={() => { setCurrentEvent({start: selectedDate?.toISOString()}); setIsDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? <CustomLoader /> : (
                 <div className="space-y-4">
                    {dailyEvents.length > 0 ? dailyEvents.map(event => (
                        <div key={event.id} className={`p-4 rounded-md border-l-4 ${event.type === 'task' ? 'border-blue-500 bg-blue-50' : 'border-purple-500 bg-purple-50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end && new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-sm mt-2">{event.description}</p>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-center py-8">No events scheduled for this day.</p>
                    )}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentEvent.id ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                    <DialogDescription>
                        {currentEvent.id ? 'Make changes to your scheduled event.' : 'Create a new event or task for your schedule.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Input 
                        placeholder="Event Title"
                        value={currentEvent.title || ''}
                        onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})}
                    />
                     <Textarea 
                        placeholder="Description..."
                        value={currentEvent.description || ''}
                        onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                         <Input 
                            type="time"
                            value={currentEvent.start ? new Date(currentEvent.start).toTimeString().substring(0,5) : ''}
                            onChange={e => {
                                const newDate = selectedDate ? new Date(selectedDate) : new Date();
                                const [hours, minutes] = e.target.value.split(':');
                                newDate.setHours(Number(hours), Number(minutes));
                                setCurrentEvent({...currentEvent, start: newDate.toISOString()});
                            }}
                        />
                         <Input 
                            type="time"
                            value={currentEvent.end ? new Date(currentEvent.end).toTimeString().substring(0,5) : ''}
                            onChange={e => {
                                const newDate = selectedDate ? new Date(selectedDate) : new Date();
                                const [hours, minutes] = e.target.value.split(':');
                                newDate.setHours(Number(hours), Number(minutes));
                                setCurrentEvent({...currentEvent, end: newDate.toISOString()});
                            }}
                        />
                    </div>
                     <Select value={currentEvent.type || 'appointment'} onValueChange={val => setCurrentEvent({...currentEvent, type: val as 'appointment' | 'task' })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="appointment"><CalendarIcon className="mr-2 h-4 w-4"/> Appointment</SelectItem>
                            <SelectItem value="task"><ClipboardCheck className="mr-2 h-4 w-4"/> Task</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button onClick={handleSaveEvent} disabled={isSubmitting}>
                        {isSubmitting && <CustomLoader className="mr-2 h-4 w-4"/>}
                        Save Event
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}
