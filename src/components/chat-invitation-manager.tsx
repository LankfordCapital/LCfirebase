'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Send, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Invitation {
  id: string;
  fullName: string;
  email: string;
  roomName: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}

export function ChatInvitationManager() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [inviteData, setInviteData] = useState({
    fullName: '',
    email: '',
    roomName: '',
  });

  // Fetch invitations
  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/invitations');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch invitations',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send invitation
  const handleSendInvitation = async () => {
    if (!inviteData.fullName || !inviteData.email || !inviteData.roomName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields',
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: inviteData.fullName,
          email: inviteData.email,
          roomId: `room-${Date.now()}`, // Generate a simple room ID
          roomName: inviteData.roomName,
          invitedBy: user?.displayName || 'Lankford Capital Team',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Invitation Sent!',
          description: `Invitation sent to ${inviteData.email}`,
        });
        setInviteData({ fullName: '', email: '', roomName: '' });
        setShowInviteDialog(false);
        fetchInvitations(); // Refresh the list
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send invitation',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Get status badge
  const getStatusBadge = (invitation: Invitation) => {
    const isExpired = new Date(invitation.expiresAt) < new Date();
    
    if (isExpired && invitation.status === 'pending') {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    switch (invitation.status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (invitation: Invitation) => {
    const isExpired = new Date(invitation.expiresAt) < new Date();
    
    if (isExpired && invitation.status === 'pending') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    switch (invitation.status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chat Invitations</h2>
          <p className="text-gray-600">Manage chat room invitations and track their status</p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Chat Invitation</DialogTitle>
              <DialogDescription>
                Invite someone to join a chat room. They'll receive an email with signup/signin links.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={inviteData.fullName}
                  onChange={(e) => setInviteData({ ...inviteData, fullName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomName">Chat Room Name</Label>
                <Input
                  id="roomName"
                  value={inviteData.roomName}
                  onChange={(e) => setInviteData({ ...inviteData, roomName: e.target.value })}
                  placeholder="Project Discussion"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvitation}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invitations List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
              <p className="text-gray-600">Send your first chat invitation to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invitation)}
                      <CardTitle className="text-lg">{invitation.fullName}</CardTitle>
                      {getStatusBadge(invitation)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(invitation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                      <span className="text-sm text-gray-600">{invitation.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Room:</span>
                      <span className="text-sm text-gray-600">{invitation.roomName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Invited by:</span>
                      <span className="text-sm text-gray-600">{invitation.invitedBy}</span>
                    </div>
                    {invitation.status === 'accepted' && invitation.acceptedAt && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Accepted:</span>
                        <span className="text-sm text-gray-600">
                          {new Date(invitation.acceptedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
