
'use client';

import { useState } from 'react';
import { ChatClient } from "@/components/chat-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Hash, MessageSquare, Briefcase, Users, Building, PlusCircle } from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// In a real application, this list would be dynamically generated
// based on the user's loans, teams, etc.
const initialChannels = {
    team: [
        { id: 'workforce-internal-chat', name: 'internal-chat', icon: <Users className="h-4 w-4" /> },
    ],
    loans: [
        { id: 'loan-LL-00125', name: 'LL-00125-main-st', icon: <Hash className="h-4 w-4" /> },
        { id: 'loan-LL-00127', name: 'LL-00127-pine-ln', icon: <Hash className="h-4 w-4" /> },
    ],
    directMessages: [
        { id: 'broker-alice-chat', name: 'Alice Johnson', icon: <Briefcase className="h-4 w-4" /> },
        { id: 'borrower-johndoe-chat', name: 'John Doe', icon: <Building className="h-4 w-4" /> },
    ]
}


export default function CommunicationsPage() {
    const { user, isAdmin } = useAuth();
    const [channels, setChannels] = useState(initialChannels);
    const [selectedRoomId, setSelectedRoomId] = useState<string>('workforce-internal-chat');
    const [selectedRoomName, setSelectedRoomName] = useState<string>('internal-chat');
    const [newChannelName, setNewChannelName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    if (!user) {
        return <div>Loading...</div>;
    }

    const handleSelectRoom = (id: string, name: string) => {
        setSelectedRoomId(id);
        setSelectedRoomName(name);
    }
    
    const handleCreateChannel = () => {
        if (!newChannelName.trim()) return;
        const newChannel = {
            id: `manual-${newChannelName.toLowerCase().replace(/\s+/g, '-')}`,
            name: newChannelName.trim(),
            icon: <Users className="h-4 w-4" />
        };
        setChannels(prev => ({
            ...prev,
            team: [...prev.team, newChannel]
        }));
        setNewChannelName('');
        setIsDialogOpen(false);
    };

    const renderChannelList = (title: string, items: {id: string, name: string, icon: React.ReactNode}[]) => (
         <div className="space-y-1">
            <h4 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h4>
            {items.map(item => (
                <Button 
                    key={item.id} 
                    variant="ghost" 
                    className={cn(
                        "w-full justify-start gap-2",
                        selectedRoomId === item.id && "bg-primary/10 text-primary"
                    )}
                    onClick={() => handleSelectRoom(item.id, item.name)}
                >
                    {item.icon}
                    <span className="truncate">{item.name}</span>
                </Button>
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 h-[calc(100vh-10rem)]">
            {/* Sidebar */}
            <div className="flex flex-col gap-4 py-2 bg-background rounded-lg border">
                 <div className="px-4 flex justify-between items-center">
                     <h2 className="text-lg font-semibold">Channels</h2>
                     {isAdmin && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Create New Channel</DialogTitle>
                                <DialogDescription>
                                    Create a new team channel for discussions.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label htmlFor="channel-name">Channel Name</Label>
                                    <Input 
                                        id="channel-name" 
                                        value={newChannelName}
                                        onChange={(e) => setNewChannelName(e.target.value)}
                                        placeholder="e.g., #marketing-updates"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateChannel}>Create Channel</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                     )}
                 </div>
                 <div className="flex-grow space-y-4 px-2 overflow-y-auto">
                     {renderChannelList("Team", channels.team)}
                     {renderChannelList("Active Loans", channels.loans)}
                     {renderChannelList("Direct Messages", channels.directMessages)}
                 </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-col">
                <ChatClient key={selectedRoomId} roomId={selectedRoomId} />
            </div>
        </div>
    )
}
