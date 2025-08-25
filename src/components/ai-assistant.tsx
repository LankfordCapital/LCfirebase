
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, Sparkles, User } from 'lucide-react';
// Lazy load the AI functionality
// import { answerVisitorQuestion, type AnswerVisitorQuestionOutput } from '@/ai/flows/ai-assistant';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from './ui/custom-loader';
import { useUI } from '@/contexts/ui-context';
import { ChatClient } from './chat-client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

type ChatMode = 'selector' | 'ai' | 'live';

export function AIAssistant() {
  const { isAssistantOpen, closeAssistant, assistantContext } = useUI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('selector');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleStartLiveChat = () => {
      setChatMode('live');
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
      // Dynamically import AI functionality only when needed
      const { answerVisitorQuestion } = await import('@/ai/flows/ai-assistant');
      const result = await answerVisitorQuestion({
        question: inputValue,
      });

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
        text: "I'm sorry, but I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI assistant.',
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
                <Button onClick={handleStartLiveChat} variant="secondary" className="w-full h-16 text-lg">
                    <User className="mr-2 h-5 w-5"/> Chat with a Team Member
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-8">Our AI is available 24/7. Live support is available during business hours.</p>
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
       case 'live':
        return (
            <div className="h-full flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 font-headline text-xl">
                        <User className="h-6 w-6 text-primary" />
                        Live Chat
                    </SheetTitle>
                </SheetHeader>
                <div className="flex-1 min-h-0 py-4">
                    {/* The roomId should be dynamic in a real application */}
                    <ChatClient roomId="live-support" />
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
