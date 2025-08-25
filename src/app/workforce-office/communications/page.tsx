
'use client';

import { useState, useEffect } from 'react';
import { ChatClient } from "@/components/chat-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Hash, MessageSquare, Briefcase, Users, Building, PlusCircle, Trash2, Search } from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/protected-route';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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

interface UserProfile {
    uid: string;
    fullName: string;
    email: string;
    role: 'borrower' | 'broker' | 'workforce' | 'admin';
}


export default function CommunicationsPage() {
    const { user, isAdmin, getAllUsers } = useAuth();
    const { toast } = useToast();
    const [channels, setChannels] = useState(initialChannels);
    const [selectedRoomId, setSelectedRoomId] = useState<string>('workforce-internal-chat');
    const [selectedRoomName, setSelectedRoomName] = useState<string>('internal-chat');
    const [newChannelName, setNewChannelName] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
    
    // Member management state
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
    const [channelMembers, setChannelMembers] = useState<Record<string, string[]>>({
        'workforce-internal-chat': ['user-3', 'user-4', 'user-5'],
        'loan-LL-00125': ['user-2', 'user-4'],
        'loan-LL-00127': ['user-2', 'user-3', 'user-4'],
        'broker-alice-chat': ['user-1', 'user-4'],
        'borrower-johndoe-chat': ['user-2', 'user-4'],
    });
    
    // Invite state
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            if(isAdmin) {
                try {
                    const usersData = await getAllUsers();
                    setAllUsers(usersData);
                } catch(e) {
                    console.error("Failed to fetch users", e);
                }
            }
        }
        fetchUsers();
    }, [isAdmin, getAllUsers]);


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

    const handleInviteUser = async () => {
        if(!inviteName || !inviteEmail) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please provide name and email.' });
            return;
        }
        setIsInviting(true);
        // Simulate sending invite
        await new Promise(res => setTimeout(res, 1000));
        toast({ title: 'Invite Sent', description: `Invitation sent to ${inviteEmail}.`});
        setInviteName('');
        setInviteEmail('');
        setIsInviting(false);
    }


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
    const availableUsersToAdd = allUsers.filter(u => !currentMembers.includes(u.uid));

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
                             <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                    <DialogTitle>Manage Members in #{selectedRoomName}</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="add-existing" className="mt-4">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="current">Current ({currentMembers.length})</TabsTrigger>
                                        <TabsTrigger value="add-existing">Add Existing</TabsTrigger>
                                        <TabsTrigger value="invite-new">Invite New</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="current" className="mt-4 max-h-96 overflow-y-auto">
                                        <div className="space-y-2">
                                            {currentMembers.map(userId => {
                                                const member = allUsers.find(u => u.uid === userId);
                                                return (
                                                    <div key={userId} className="flex items-center justify-between p-2 rounded-md bg-muted">
                                                        <span>{member?.fullName || member?.email || userId}</span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveMember(selectedRoomId, userId)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="add-existing" className="mt-4 max-h-96 overflow-y-auto">
                                        <div className="space-y-2">
                                            {availableUsersToAdd.map(userToAdd => (
                                                <div key={userToAdd.uid} className="flex items-center justify-between p-2 rounded-md border">
                                                    <div>
                                                        <p>{userToAdd.fullName}</p>
                                                        <p className="text-xs text-muted-foreground">{userToAdd.email}</p>
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={() => handleAddMember(selectedRoomId, userToAdd.uid)}>Add</Button>
                                                </div>
                                            ))}
                                            {availableUsersToAdd.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">All users are in this channel.</p>}
                                        </div>
                                    </TabsContent>
                                     <TabsContent value="invite-new" className="mt-4">
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground">Send an invitation to someone who is not on the platform yet.</p>
                                            <div className="space-y-2">
                                                <Label htmlFor="invite-name">Full Name</Label>
                                                <Input id="invite-name" value={inviteName} onChange={e => setInviteName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="invite-email">Email Address</Label>
                                                <Input id="invite-email" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                                            </div>
                                            <Button className="w-full" onClick={handleInviteUser} disabled={isInviting}>Send Invite</Button>
                                        </div>
                                    </TabsContent>
                                </Tabs>
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

    