
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { answerVisitorQuestion, type AnswerVisitorQuestionOutput } from '@/ai/flows/ai-assistant';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from './ui/custom-loader';
import { useUI } from '@/contexts/ui-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export function AIAssistant() {
  const { isAssistantOpen, setAssistantOpen } = useUI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isAssistantOpen && messages.length === 0) {
        setMessages([
            {
                id: 'initial',
                text: "Hello! I'm Lankford Capital's AI Assistant. How can I help you today? Feel free to ask about our loan products, eligibility, or the application process.",
                sender: 'ai'
            }
        ])
    }
  }, [isAssistantOpen, messages.length]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

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
      const result: AnswerVisitorQuestionOutput = await answerVisitorQuestion({
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

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50"
        size="icon"
        onClick={() => setAssistantOpen(true)}
      >
        <MessageSquare className="h-8 w-8" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>
      <Sheet open={isAssistantOpen} onOpenChange={setAssistantOpen}>
        <SheetContent className="flex flex-col">
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
        </SheetContent>
      </Sheet>
    </>
  );
}
