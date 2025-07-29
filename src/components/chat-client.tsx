
'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhotoURL: string | null;
  timestamp: Timestamp;
}

interface ChatClientProps {
    roomId: string;
}

export function ChatClient({ roomId }: ChatClientProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) return;
    setIsLoading(true);
    const q = query(collection(db, 'chats', roomId, 'messages'), orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || !roomId) return;

    await addDoc(collection(db, 'chats', roomId, 'messages'), {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      senderPhotoURL: user.photoURL,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <Card className="flex flex-col h-[70vh]">
        <CardHeader>
            <CardTitle>Room: {roomId}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0">
             <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-6 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : messages.length === 0 ? (
                     <div className="text-center text-muted-foreground">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                        'flex items-start gap-3',
                        message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.senderId !== user?.uid && (
                        <Avatar className="h-8 w-8">
                             <AvatarImage src={message.senderPhotoURL || undefined} />
                            <AvatarFallback>{message.senderName?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        )}
                        <div
                        className={cn(
                            'max-w-xs md:max-w-md rounded-lg px-4 py-2 text-sm shadow',
                            message.senderId === user?.uid
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                        >
                        <p className="font-bold text-xs mb-1">{message.senderName}</p>
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs text-right mt-1 opacity-70">
                            {message.timestamp?.toDate().toLocaleTimeString()}
                        </p>
                        </div>
                        {message.senderId === user?.uid && (
                        <Avatar className="h-8 w-8">
                             <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback>{user.displayName?.charAt(0) || 'Me'}</AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))
                )}
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6 border-t">
             <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!user}
              />
              <Button type="submit" size="icon" disabled={!user || newMessage.trim() === ''}>
                <Send />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
        </CardFooter>
    </Card>
  );
}
