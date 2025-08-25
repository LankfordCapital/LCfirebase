
'use client';

import { useState } from 'react';
import { ChatClient } from "@/components/chat-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Hash, MessageSquare, Briefcase, Users, Building, PlusCircle, Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/protected-route';

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

const mockUsers = [
    { id: 'user-1', name: 'Alice (Broker)', avatar: '/avatars/1.png' },
    { id: 'user-2', name: 'Bob (Borrower)', avatar: '/avatars/2.png' },
    { id: 'user-3', name: 'Charlie (Workforce)', avatar: '/avatars/3.png' },
    { id: 'user-4', name: 'Diana (Admin)', avatar: '/avatars/4.png' },
    { id: 'user-5', name: 'Evan (Workforce)', avatar: '/avatars/5.png' },
];


export default function CommunicationsPage() {
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const [channels, setChannels] = useState(initialChannels);
    const [selectedRoomId, setSelectedRoomId] = useState<string>('workforce-internal-chat');
    const [selectedRoomName, setSelectedRoomName] = useState<string>('internal-chat');
    const [newChannelName, setNewChannelName] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
    const [channelMembers, setChannelMembers] = useState<Record<string, string[]>>({
        'workforce-internal-chat': ['user-3', 'user-4', 'user-5'],
        'loan-LL-00125': ['user-2', 'user-4'],
        'loan-LL-00127': ['user-2', 'user-3', 'user-4'],
        'broker-alice-chat': ['user-1', 'user-4'],
        'borrower-johndoe-chat': ['user-2', 'user-4'],
    });

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleSelectRoom = (id: string, name: string) => {
        setSelectedRoomId(id);
        setSelectedRoomName(name);
    }
    
    const handleCreateChannel = () => {
        if (!newChannelName.trim()) return;
        const newChannelId = `manual-${newChannelName.toLowerCase().replace(/\s+/g, '-')}`;
        const newChannel = {
            id: newChannelId,
            name: newChannelName.trim(),
            icon: <Users className="h-4 w-4" />
        };
        setChannels(prev => ({
            ...prev,
            team: [...prev.team, newChannel]
        }));
        setChannelMembers(prev => ({
            ...prev,
            [newChannelId]: [user.uid] // Creator is the first member
        }));
        setNewChannelName('');
        setIsCreateDialogOpen(false);
        toast({ title: "Channel Created", description: `The channel #${newChannelName} has been created.`});
    };

    const handleAddMember = (roomId: string, userId: string) => {
        setChannelMembers(prev => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), userId]
        }));
        toast({ title: 'Member Added', description: 'The user has been added to the channel.' });
    };

    const handleRemoveMember = (roomId: string, userId: string) => {
        setChannelMembers(prev => ({
            ...prev,
            [roomId]: (prev[roomId] || []).filter(id => id !== userId)
        }));
        toast({ title: 'Member Removed', description: 'The user has been removed from the channel.' });
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

    const currentMembers = channelMembers[selectedRoomId] || [];
    const availableUsersToAdd = mockUsers.filter(u => !currentMembers.includes(u.id));

    return (
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 h-[calc(100vh-10rem)]">
            {/* Sidebar */}
            <div className="flex flex-col gap-4 py-2 bg-background rounded-lg border">
                 <div className="px-4 flex justify-between items-center">
                     <h2 className="text-lg font-semibold">Channels</h2>
                     {isAdmin && (
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                 <div className="flex items-center justify-between p-2 border-b mb-2">
                    <h3 className="text-lg font-semibold">{selectedRoomName}</h3>
                    {isAdmin && (
                         <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Manage Members</Button>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Manage Members in #{selectedRoomName}</DialogTitle>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Current Members ({currentMembers.length})</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {currentMembers.map(userId => {
                                                const member = mockUsers.find(u => u.id === userId);
                                                return (
                                                    <div key={userId} className="flex items-center justify-between p-2 rounded-md bg-muted">
                                                        <span>{member?.name || userId}</span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveMember(selectedRoomId, userId)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Add New Member</h4>
                                        <div className="space-y-2">
                                            {availableUsersToAdd.map(userToAdd => (
                                                <div key={userToAdd.id} className="flex items-center justify-between p-2 rounded-md border">
                                                    <span>{userToAdd.name}</span>
                                                    <Button variant="outline" size="sm" onClick={() => handleAddMember(selectedRoomId, userToAdd.id)}>Add</Button>
                                                </div>
                                            ))}
                                            {availableUsersToAdd.length === 0 && <p className="text-sm text-muted-foreground">All users are in this channel.</p>}
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                 </div>
                 <ProtectedRoute allowedRoles={['admin', 'workforce', 'broker', 'borrower']}>
                    <ChatClient key={selectedRoomId} roomId={selectedRoomId} />
                </ProtectedRoute>
            </div>
        </div>
    )
}
