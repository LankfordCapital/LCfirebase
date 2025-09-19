
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Building, User, Mail, Phone, Percent, BarChart, DollarSign, Loader2 } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { authenticatedGet, authenticatedPost } from '@/lib/api-client';

interface BrokerData {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    status: string;
    commissionTier: string;
    ytdVolume: number;
    loansClosed: number;
}

export default function ManageBrokerPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const brokerId = params.brokerId as string;
    
    const [broker, setBroker] = useState<BrokerData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch broker data
    useEffect(() => {
        const fetchBrokerData = async () => {
            try {
                setLoading(true);
                const response = await authenticatedGet(`/api/workforce/broker-info?brokerId=${brokerId}`);
                const result = await response.json();
                
                if (result.success && result.broker) {
                    const brokerData = result.broker;
                    setBroker({
                        id: brokerData.id,
                        name: brokerData.fullName || brokerData.name || 'Unknown Broker',
                        company: brokerData.company || 'No company',
                        email: brokerData.email || 'No email',
                        phone: brokerData.phone || 'No phone',
                        status: brokerData.status || 'Active',
                        commissionTier: brokerData.commissionTier || 'Tier 1 - 1.0%',
                        ytdVolume: brokerData.ytdVolume || 0,
                        loansClosed: brokerData.loansClosed || 0
                    });
                } else {
                    setError('Broker not found');
                }
            } catch (err) {
                console.error('Error fetching broker data:', err);
                setError('Failed to load broker information');
            } finally {
                setLoading(false);
            }
        };

        if (brokerId) {
            fetchBrokerData();
        }
    }, [brokerId]);

    const handleSave = async () => {
        if (!broker) return;
        
        setIsSaving(true);
        try {
            const response = await authenticatedPost('/api/workforce/update-broker', {
                brokerId: broker.id,
                updates: {
                    fullName: broker.name,
                    company: broker.company,
                    email: broker.email,
                    phone: broker.phone,
                    status: broker.status,
                    commissionTier: broker.commissionTier
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                toast({
                    title: "Broker Updated",
                    description: `${broker.name}'s profile has been updated successfully.`,
                });
            } else {
                throw new Error(result.error || 'Failed to update broker');
            }
        } catch (err) {
            console.error('Error updating broker:', err);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update broker information. Please try again.',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleBrokerChange = (field: string, value: string) => {
        setBroker((prev: any) => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Button variant="outline" onClick={() => router.push('/workforce-office')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !broker) {
        return (
            <div>
                 <Button variant="outline" onClick={() => router.push('/workforce-office')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Broker Not Found</h2>
                    <p className="text-muted-foreground">{error || 'The requested broker could not be found.'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.push('/workforce-office')} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Manage Broker: {broker.name}</h1>
                    <p className="text-muted-foreground">{broker.company}</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Broker Profile */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="text-primary"/> Broker Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="brokerName">Name</Label>
                            <Input id="brokerName" value={broker.name} onChange={(e) => handleBrokerChange('name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brokerCompany">Company</Label>
                            <Input id="brokerCompany" value={broker.company} onChange={(e) => handleBrokerChange('company', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brokerEmail">Email</Label>
                            <Input id="brokerEmail" type="email" value={broker.email} onChange={(e) => handleBrokerChange('email', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="brokerPhone">Phone</Label>
                            <Input id="brokerPhone" type="tel" value={broker.phone} onChange={(e) => handleBrokerChange('phone', e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                {/* Management & Performance */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building className="text-primary"/> Management</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="brokerStatus">Broker Status</Label>
                                <Select value={broker.status} onValueChange={(value) => handleBrokerChange('status', value)}>
                                    <SelectTrigger id="brokerStatus">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Probation">Probation</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="commissionTier">Commission Tier</Label>
                                <Select value={broker.commissionTier} onValueChange={(value) => handleBrokerChange('commissionTier', value)}>
                                    <SelectTrigger id="commissionTier">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Tier 1 - 1.0%">Tier 1 - 1.0%</SelectItem>
                                        <SelectItem value="Tier 2 - 1.5%">Tier 2 - 1.5%</SelectItem>
                                        <SelectItem value="Tier 3 - 2.0%">Tier 3 - 2.0%</SelectItem>
                                        <SelectItem value="Custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-primary/5 rounded-lg">
                                <p className="text-sm text-muted-foreground">YTD Volume</p>
                                <p className="text-2xl font-bold">${(broker.ytdVolume / 1000000).toFixed(1)}M</p>
                            </div>
                            <div className="p-4 bg-primary/5 rounded-lg">
                                <p className="text-sm text-muted-foreground">Loans Closed</p>
                                <p className="text-2xl font-bold">{broker.loansClosed}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
