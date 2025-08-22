
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Hourglass, MoreHorizontal, UserPlus, Users, Shield, Building } from 'lucide-react';
import { CustomLoader } from '@/components/ui/custom-loader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { format } from 'date-fns';

interface TeamMember {
    uid: string;
    fullName: string;
    email: string;
    role: 'borrower' | 'broker' | 'workforce' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
    authProvider?: string;
}

export default function TeamManagementPage() {
    const [users, setUsers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const { toast } = useToast();
    const { getAllUsers, updateUserRole, updateUserStatus, isAdmin } = useAuth();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch user data.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async (uid: string, newRole: TeamMember['role']) => {
        setIsUpdating(uid);
        try {
            await updateUserRole(uid, newRole);
            setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
            toast({ title: 'User Role Updated', description: `User role has been updated to ${newRole}.` });
        } catch (error) {
            console.error("Error updating user role:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update user role.' });
        } finally {
            setIsUpdating(null);
        }
    };

    const handleUpdateStatus = async (uid: string, newStatus: TeamMember['status']) => {
        setIsUpdating(uid);
        try {
            await updateUserStatus(uid, newStatus);
            setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
            toast({ title: 'User Status Updated', description: `User status has been updated to ${newStatus}.` });
        } catch (error) {
            console.error("Error updating user status:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update user status.' });
        } finally {
            setIsUpdating(null);
        }
    };

    const RoleBadge = ({ role }: { role: TeamMember['role'] }) => {
        const roleConfig = {
            admin: { color: 'bg-red-100 text-red-800', icon: Shield },
            workforce: { color: 'bg-blue-100 text-blue-800', icon: Users },
            broker: { color: 'bg-green-100 text-green-800', icon: Building },
            borrower: { color: 'bg-purple-100 text-purple-800', icon: UserPlus },
        };

        const config = roleConfig[role];
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
        );
    };

    const StatusBadge = ({ status }: { status: TeamMember['status'] }) => {
        const statusConfig = {
            approved: { color: 'bg-green-100 text-green-800', icon: Check },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Hourglass },
            rejected: { color: 'bg-red-100 text-red-800', icon: X },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const teamStats = [
        {
            title: "Team Members",
            value: users.filter(u => u.role === 'workforce' || u.role === 'admin').length,
            icon: Users,
            color: "text-blue-600"
        },
        {
            title: "Active Brokers",
            value: users.filter(u => u.role === 'broker' && u.status === 'approved').length,
            icon: Building,
            color: "text-green-600"
        },
        {
            title: "Pending Approvals",
            value: users.filter(u => u.status === 'pending').length,
            icon: Hourglass,
            color: "text-yellow-600"
        },
        {
            title: "Total Users",
            value: users.length,
            icon: UserPlus,
            color: "text-purple-600"
        }
    ];

    const InviteUserDialog = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [role, setRole] = useState<TeamMember['role']>('workforce');

        const handleSendInvite = async () => {
            // This is a simplified version. In a real app, you would use Firebase Functions
            // to send an actual email invitation and handle user creation securely.
            toast({
                title: "Invite Sent!",
                description: `An invitation has been sent to ${name} at ${email} for the ${role} role.`,
            });
            
            // Reset form
            setName('');
            setEmail('');
            setRole('workforce');
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button><UserPlus className="mr-2 h-4 w-4" /> Invite Team Member</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite New Team Member</DialogTitle>
                        <DialogDescription>Send an invitation for a new team member to join the platform.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(value) => setRole(value as TeamMember['role'])}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="workforce">Workforce</SelectItem>
                                    <SelectItem value="broker">Broker</SelectItem>
                                    <SelectItem value="borrower">Borrower</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleSendInvite}>Send Invite</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Team Management</h1>
                    <p className="text-muted-foreground">Manage team members, brokers, and user invitations.</p>
                </div>
                <InviteUserDialog />
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {teamStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </div>
                                    <Icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Team Members Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Members & Brokers</CardTitle>
                    <CardDescription>Manage team member roles and broker relationships</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <CustomLoader className="h-8 w-8" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No team members found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((userProfile) => (
                                            <TableRow key={userProfile.uid}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{userProfile.fullName}</p>
                                                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                                                        {userProfile.authProvider && (
                                                            <p className="text-xs text-muted-foreground">via {userProfile.authProvider}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <RoleBadge role={userProfile.role} />
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={userProfile.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm text-muted-foreground">
                                                        {userProfile.createdAt?.toDate 
                                                            ? format(userProfile.createdAt.toDate(), 'MMM dd, yyyy')
                                                            : 'N/A'
                                                        }
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" disabled={isUpdating === userProfile.uid}>
                                                                {isUpdating === userProfile.uid ? (
                                                                    <CustomLoader className="h-4 w-4" />
                                                                ) : (
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem disabled>
                                                                <span className="font-medium">Update Role</span>
                                                            </DropdownMenuItem>
                                                            {['borrower', 'broker', 'workforce', 'admin'].map((role) => (
                                                                <DropdownMenuItem
                                                                    key={role}
                                                                    onClick={() => handleUpdateRole(userProfile.uid, role as TeamMember['role'])}
                                                                    disabled={userProfile.role === role}
                                                                    className={userProfile.role === role ? 'bg-muted' : ''}
                                                                >
                                                                    <RoleBadge role={role as TeamMember['role']} />
                                                                </DropdownMenuItem>
                                                            ))}
                                                            
                                                            <DropdownMenuItem disabled className="mt-2">
                                                                <span className="font-medium">Update Status</span>
                                                            </DropdownMenuItem>
                                                            {['pending', 'approved', 'rejected'].map((status) => (
                                                                <DropdownMenuItem
                                                                    key={status}
                                                                    onClick={() => handleUpdateStatus(userProfile.uid, status as TeamMember['status'])}
                                                                    disabled={userProfile.status === status}
                                                                    className={userProfile.status === status ? 'bg-muted' : ''}
                                                                >
                                                                    <StatusBadge status={status as TeamMember['status']} />
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
