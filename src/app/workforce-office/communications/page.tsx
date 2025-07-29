
'use client';

import { ChatClient } from "@/components/chat-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Briefcase } from "lucide-react";


export default function CommunicationsPage() {
    // In a real application, these room IDs would be dynamic,
    // e.g., based on loan IDs or user IDs.
    const rooms = {
        internal: 'workforce-internal-chat',
        broker: 'broker-alice-chat',
        borrower: 'borrower-johndoe-chat',
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Communications Hub</h1>
                <p className="text-muted-foreground">
                    Chat with workforce members, brokers, and borrowers in real-time.
                </p>
            </div>
            <Tabs defaultValue="internal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="internal"><Users className="mr-2 h-4 w-4" /> Internal Workforce</TabsTrigger>
                    <TabsTrigger value="broker"><Briefcase className="mr-2 h-4 w-4" /> Broker: Alice</TabsTrigger>
                    <TabsTrigger value="borrower"><MessageSquare className="mr-2 h-4 w-4" /> Borrower: John Doe</TabsTrigger>
                </TabsList>
                <TabsContent value="internal">
                   <ChatClient roomId={rooms.internal} />
                </TabsContent>
                <TabsContent value="broker">
                    <ChatClient roomId={rooms.broker} />
                </TabsContent>
                <TabsContent value="borrower">
                    <ChatClient roomId={rooms.borrower} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
