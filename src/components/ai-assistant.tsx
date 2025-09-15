
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, Sparkles, User, Mail, Loader2 } from 'lucide-react';
// Lazy load the AI functionality
// import { answerVisitorQuestion, type AnswerVisitorQuestionOutput } from '@/ai/flows/ai-assistant';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from './ui/custom-loader';
import { useUI } from '@/contexts/ui-context';
import { useAuth } from '@/contexts/auth-context';
import { ChatClient } from './chat-client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

type ChatMode = 'selector' | 'ai' | 'email';

export function AIAssistant() {
  const { isAssistantOpen, closeAssistant, assistantContext } = useUI();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('selector');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal' as 'low' | 'normal' | 'high'
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  useEffect(() => {
    if (isAssistantOpen) {
      setChatMode('selector'); // Reset to selector screen when opened
      if (assistantContext) {
        setChatMode('ai');
        startAIChatWithContext();
      }
    }
  }, [isAssistantOpen]);

  const startAIChatWithContext = () => {
     const initialText = `Hello! I see you have a question about "${assistantContext?.replace(/i have a question about the|document/gi, '').replace(/"/g, '').trim()}". How can I help you with that?`;
     setMessages([{ id: 'initial-context', text: initialText, sender: 'ai' }]);
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleStartAIChat = () => {
    setChatMode('ai');
    setMessages([
        {
          id: 'initial',
          text: "Hello! I'm Lankford Capital's AI Assistant. How can I help you today? Feel free to ask about our loan products, eligibility, or the application process.",
          sender: 'ai'
        }
      ]);
  }

  const handleStartEmailContact = () => {
      setChatMode('email');
      // Pre-fill subject if there's context
      if (assistantContext) {
        setContactForm(prev => ({
          ...prev,
          subject: `Question about: ${assistantContext.replace(/i have a question about the|document/gi, '').replace(/"/g, '').trim()}`
        }));
      }
  }

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim() || !user?.email) return;

    setIsSubmittingContact(true);
    
    try {
      const response = await fetch('/api/contact-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.displayName || 'User',
          subject: contactForm.subject,
          message: contactForm.message,
          priority: contactForm.priority,
          context: assistantContext || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send contact request');
      }

      toast({
        title: 'Message Sent!',
        description: 'We\'ll get back to you at your account email within 24 hours.',
      });

      // Reset form and close assistant
      setContactForm({ subject: '', message: '', priority: 'normal' });
      closeAssistant();
    } catch (error) {
      console.error('Contact submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send your message. Please try again.',
      });
    } finally {
      setIsSubmittingContact(false);
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call AI assistant API route
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.answer,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, but I'm having trouble connecting right now. Please use the 'Contact a Team Member' option to get immediate assistance with your question. Our team will be happy to help you!",
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'AI Assistant Unavailable',
        description: 'Please use the Contact a Team Member option for immediate assistance.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (chatMode) {
      case 'selector':
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
             <SheetHeader className="mb-8">
                <SheetTitle className="flex flex-col items-center gap-2 font-headline text-2xl">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    How can we help you?
                </SheetTitle>
            </SheetHeader>
            <div className="w-full space-y-4">
                <Button onClick={handleStartAIChat} className="w-full h-16 text-lg">
                    <Sparkles className="mr-2 h-5 w-5"/> Chat with AI Assistant
                </Button>
                <Button onClick={handleStartEmailContact} variant="secondary" className="w-full h-16 text-lg">
                    <Mail className="mr-2 h-5 w-5"/> Contact a Team Member
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-8">Our AI is available 24/7. Team support is available during business hours.</p>
          </div>
        );
      case 'ai':
        return (
            <>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 font-headline text-xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                    AI Assistant
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1 -mx-6" ref={scrollAreaRef}>
                    <div className="px-6 py-4 space-y-6">
                    {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                        'flex items-start gap-3',
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.sender === 'ai' && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" alt="Lankford Capital AI" />
                            <AvatarFallback className="bg-primary text-primary-foreground">LC</AvatarFallback>
                        </Avatar>
                        )}
                        <div
                        className={cn(
                            'max-w-xs md:max-w-md rounded-lg px-4 py-2 text-sm',
                            message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                        >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        </div>
                        {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 justify-start">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" alt="Lankford Capital AI" />
                                <AvatarFallback className="bg-primary text-primary-foreground">LC</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg px-4 py-2 flex items-center">
                                <CustomLoader className="h-5 w-5 text-muted-foreground"/>
                            </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto -mx-6 px-6 pt-4 bg-background border-t">
                    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Ask a question..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                        {isLoading ? <CustomLoader /> : <Send />}
                        <span className="sr-only">Send message</span>
                    </Button>
                    </form>
                </SheetFooter>
            </>
        );
       case 'email':
        return (
            <div className="h-full flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 font-headline text-xl">
                        <Mail className="h-6 w-6 text-primary" />
                        Contact Our Team
                    </SheetTitle>
                </SheetHeader>
                <div className="flex-1 flex flex-col p-6">
                    <div className="space-y-4 mb-6">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">Get in Touch with Our Team</h3>
                            <p className="text-sm text-muted-foreground">
                                Fill out the form below and we'll send you an email response within 24 hours.
                            </p>
                            {user?.email && (
                                <p className="text-xs text-muted-foreground">
                                    We'll respond to: <strong>{user.email}</strong>
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <form onSubmit={handleContactSubmit} className="space-y-4 flex-1 flex flex-col">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={contactForm.subject}
                                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                                    placeholder="What is your question about?"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select 
                                    value={contactForm.priority} 
                                    onValueChange={(value: 'low' | 'normal' | 'high') => 
                                        setContactForm(prev => ({ ...prev, priority: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent 
                                        className="z-[60] w-full max-h-none" 
                                        position="item-aligned"
                                        side="bottom"
                                        align="start"
                                        sideOffset={4}
                                        style={{ maxHeight: 'none' }}
                                    >
                                        <SelectItem value="low">Low - General inquiry</SelectItem>
                                        <SelectItem value="normal">Normal - Standard question</SelectItem>
                                        <SelectItem value="high">High - Urgent matter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                    placeholder="Please provide details about your question or concern..."
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="mt-auto pt-4 space-y-3">
                            <Button 
                                type="submit" 
                                className="w-full h-12 text-lg"
                                disabled={isSubmittingContact || !contactForm.subject.trim() || !contactForm.message.trim()}
                            >
                                {isSubmittingContact ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-5 w-5" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                            
                            <div className="text-xs text-muted-foreground text-center space-y-1">
                                <p><strong>Response Time:</strong> Within 24 hours</p>
                                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM EST</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
  }

  return (
      <Sheet open={isAssistantOpen} onOpenChange={(open) => !open && closeAssistant()}>
        <SheetContent className="flex flex-col h-full w-full sm:max-w-lg">
            {renderContent()}
        </SheetContent>
      </Sheet>
  );
}
