'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function TestChatInvitationPage() {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        roomId: 'test-chat-room',
        roomName: 'Test Chat Room',
        invitedBy: 'Test User'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/invitations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: 'Invitation Sent!',
                    description: `Invitation sent to ${formData.email}. Check your email for the invitation.`,
                });
                
                // Reset form
                setFormData({
                    fullName: '',
                    email: '',
                    roomId: 'test-chat-room',
                    roomName: 'Test Chat Room',
                    invitedBy: 'Test User'
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Failed to send invitation',
                    description: result.error || 'An error occurred while sending the invitation.',
                });
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send invitation. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Test Chat Invitation System</CardTitle>
                        <CardDescription className="text-center">
                            Test the new Resend-based email invitation system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="roomName">Chat Room Name</Label>
                                <Input
                                    id="roomName"
                                    type="text"
                                    placeholder="Project Discussion"
                                    value={formData.roomName}
                                    onChange={(e) => handleInputChange('roomName', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="invitedBy">Invited By</Label>
                                <Input
                                    id="invitedBy"
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.invitedBy}
                                    onChange={(e) => handleInputChange('invitedBy', e.target.value)}
                                    required
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending Invitation...' : 'Send Chat Invitation'}
                            </Button>
                        </form>

                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">How to Test:</h3>
                            <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
                                <li>Fill out the form above with your email address</li>
                                <li>Click "Send Chat Invitation"</li>
                                <li>Check your email for the invitation</li>
                                <li>The email should contain links to sign up or sign in</li>
                                <li>Click the links to test the invitation flow</li>
                            </ol>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="font-semibold text-green-800 mb-2">What This Tests:</h3>
                            <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                                <li>Email sending via Resend service</li>
                                <li>Invitation creation in Firestore</li>
                                <li>Email template rendering</li>
                                <li>Invitation URL generation</li>
                                <li>Complete invitation workflow</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
