
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Hourglass, MoreHorizontal, Shield, User, Building, CreditCard, Search, Filter, UserPlus, RefreshCw } from 'lucide-react';
import { CustomLoader } from '@/components/ui/custom-loader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface UserProfile {
    uid: string;
    fullName: string;
    email: string;
    role: 'borrower' | 'broker' | 'workforce' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
    authProvider?: string;
}

function InviteUserDialog({ onInviteSent }: { onInviteSent: () => void }) {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserProfile['role']>('borrower');
    const [isInviting, setIsInviting] = useState(false);

    const handleSendInvite = async () => {
        setIsInviting(true);
        // Simulate sending an invite (e.g., via a backend function)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would have a backend function that creates a pending user
        // and sends an invitation email. We'll just show a success toast here.
        
        toast({
            title: "Invite Sent!",
            description: `An invitation has been sent to ${name} at ${email} to join as a ${role}.`,
        });
        onInviteSent();
        setName('');
        setEmail('');
        setRole('borrower');
        setIsInviting(false);
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Invite User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite New User</DialogTitle>
                    <DialogDescription>Send an invitation for a new user to join the platform.</DialogDescription>
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
                        <Select value={role} onValueChange={(value) => setRole(value as UserProfile['role'])}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="borrower">Borrower</SelectItem>
                                <SelectItem value="broker">Broker</SelectItem>
                                <SelectItem value="workforce">Workforce</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                     <DialogClose asChild>
                        <Button onClick={handleSendInvite} disabled={isInviting}>
                            {isInviting && <CustomLoader className="mr-2 h-4 w-4"/>}
                            Send Invite
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function UserManagementPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const { toast } = useToast();
    const { getAllUsers, updateUserRole, updateUserStatus, isAdmin, user } = useAuth();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const usersData = await getAllUsers();
            console.log('Fetched users:', usersData); // Debug log
            console.log('User data structure check:', usersData.map(u => ({ 
                uid: u.uid, 
                role: u.role, 
                status: u.status,
                hasRole: !!u.role,
                hasStatus: !!u.status,
                roleType: typeof u.role,
                statusType: typeof u.status
            })));
            
            // Validate user data structure
            const invalidUsers = usersData.filter(user => 
                !user || 
                !user.uid || 
                !user.fullName || 
                !user.email || 
                !user.role || 
                !user.status
            );
            
            const validUsers = usersData.filter(user => 
                user && 
                user.uid && 
                user.fullName && 
                user.email && 
                user.role && 
                user.status
            );
            
            if (validUsers.length !== usersData.length) {
                console.warn(`Filtered out ${usersData.length - validUsers.length} invalid user records:`, invalidUsers);
                console.log('Invalid user data details:', invalidUsers.map(user => ({
                    uid: user?.uid || 'missing',
                    fullName: user?.fullName || 'missing',
                    email: user?.email || 'missing',
                    role: user?.role || 'missing',
                    status: user?.status || 'missing',
                    rawData: user
                })));
            }
            
            setUsers(validUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({ 
                variant: 'destructive', 
                title: 'Failed to Load Users', 
                description: error instanceof Error ? error.message : 'Could not fetch user data. Please try refreshing the page.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    useEffect(() => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, roleFilter, statusFilter]);

    const handleUpdateRole = async (uid: string, newRole: UserProfile['role']) => {
        if (uid === user?.uid) {
            toast({ variant: 'destructive', title: 'Cannot Update Own Role', description: 'You cannot change your own role.' });
            return;
        }

        // Optimistic update
        const originalUsers = [...users];
        setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
        setIsUpdating(uid);

        try {
            await updateUserRole(uid, newRole);
            toast({ title: 'Role Updated', description: `User role has been updated to ${newRole}.` });
        } catch (error) {
            console.error("Error updating user role:", error);
            // Revert optimistic update on error
            setUsers(originalUsers);
            toast({ 
                variant: 'destructive', 
                title: 'Failed to Update Role', 
                description: error instanceof Error ? error.message : 'Could not update user role. Please try again.' 
            });
        } finally {
            setIsUpdating(null);
        }
    };

    const handleUpdateStatus = async (uid: string, newStatus: UserProfile['status']) => {
        if (uid === user?.uid) {
            toast({ variant: 'destructive', title: 'Cannot Update Own Status', description: 'You cannot change your own status.' });
            return;
        }

        // Optimistic update
        const originalUsers = [...users];
        setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
        setIsUpdating(uid);

        try {
            await updateUserStatus(uid, newStatus);
            toast({ title: 'Status Updated', description: `User status has been updated to ${newStatus}.` });
        } catch (error) {
            console.error("Error updating user status:", error);
            // Revert optimistic update on error
            setUsers(originalUsers);
            toast({ 
                variant: 'destructive', 
                title: 'Failed to Update Status', 
                description: error instanceof Error ? error.message : 'Could not update user status. Please try again.' 
            });
        } finally {
            setIsUpdating(null);
        }
    };

    const RoleBadge = ({ role }: { role: UserProfile['role'] }) => {
        const roleConfig = {
            admin: { color: 'bg-red-100 text-red-800', icon: Shield },
            workforce: { color: 'bg-blue-100 text-blue-800', icon: User },
            broker: { color: 'bg-green-100 text-green-800', icon: Building },
            borrower: { color: 'bg-purple-100 text-purple-800', icon: CreditCard },
        };
        const config = roleConfig[role];
        if (!config) {
            console.warn(`Unknown role: ${role}`);
            return (
                <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {role || 'Unknown'}
                </Badge>
            );
        }
        const Icon = config.icon;
        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
        );
    };

    const StatusBadge = ({ status }: { status: UserProfile['status'] }) => {
        const statusConfig = {
            approved: { color: 'bg-green-100 text-green-800', icon: Check },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Hourglass },
            rejected: { color: 'bg-red-100 text-red-800', icon: X },
        };
        const config = statusConfig[status];
        if (!config) {
            console.warn(`Unknown status: ${status}`);
            return (
                <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
                    <Hourglass className="h-3 w-3" />
                    {status || 'Unknown'}
                </Badge>
            );
        }
        const Icon = config.icon;
        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const stats = [
        { title: "Total Users", value: users.length, icon: User, color: "text-blue-600" },
        { title: "Pending Approval", value: users.filter(u => u.status === 'pending').length, icon: Hourglass, color: "text-yellow-600" },
        { title: "Approved Users", value: users.filter(u => u.status === 'approved').length, icon: Check, color: "text-green-600" },
        { title: "Admins", value: users.filter(u => u.role === 'admin').length, icon: Shield, color: "text-red-600" },
    ];

    if (!isAdmin) {
      return (
        <div className="flex justify-center items-center h-full">
            <Card className="p-8 text-center">
                <CardTitle className="text-2xl">Access Denied</CardTitle>
                <CardDescription>You do not have permission to view this page.</CardDescription>
            </Card>
        </div>
      )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-headline text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Manage user roles, approval statuses, and account permissions.</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={fetchUsers} 
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <CustomLoader className="h-4 w-4" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                        Refresh
                    </Button>
                    <InviteUserDialog onInviteSent={fetchUsers} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
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

            <Card>
                <CardHeader>
                    <CardTitle>Filters & Search</CardTitle>
                    <CardDescription>Filter users by role, status, or search by name/email</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
                            </div>
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by role" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="borrower">Borrower</SelectItem>
                                <SelectItem value="broker">Broker</SelectItem>
                                <SelectItem value="workforce">Workforce</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>User List</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8"><CustomLoader className="h-8 w-8" /></div>
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
                                    {filteredUsers.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found matching your filters.</TableCell></TableRow>
                                    ) : (
                                        filteredUsers.map((userProfile) => (
                                            <TableRow key={userProfile.uid}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{userProfile.fullName}</p>
                                                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                                                        {userProfile.authProvider && (<p className="text-xs text-muted-foreground">via {userProfile.authProvider}</p>)}
                                                    </div>
                                                </TableCell>
                                                <TableCell><RoleBadge role={userProfile.role} /></TableCell>
                                                <TableCell><StatusBadge status={userProfile.status} /></TableCell>
                                                <TableCell><p className="text-sm text-muted-foreground">{userProfile.createdAt?.toDate ? format(userProfile.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}</p></TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                disabled={isUpdating === userProfile.uid}
                                                                className="h-8 w-8"
                                                            >
                                                                {isUpdating === userProfile.uid ? (
                                                                    <CustomLoader className="h-4 w-4" />
                                                                ) : (
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                )}
                                                                <span className="sr-only">Open menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56">
                                                            <DropdownMenuItem disabled>
                                                                <span className="font-medium text-muted-foreground">Update Role</span>
                                                            </DropdownMenuItem>
                                                            {(['borrower', 'broker', 'workforce', 'admin'] as const).map((role) => (
                                                                <DropdownMenuItem 
                                                                    key={role} 
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleUpdateRole(userProfile.uid, role);
                                                                    }}
                                                                    disabled={userProfile.role === role || userProfile.uid === user?.uid || isUpdating === userProfile.uid} 
                                                                    className={`cursor-pointer ${userProfile.role === role ? 'bg-muted' : ''}`}
                                                                >
                                                                    <RoleBadge role={role} />
                                                                </DropdownMenuItem>
                                                            ))}
                                                            <div className="border-t my-1" />
                                                            <DropdownMenuItem disabled>
                                                                <span className="font-medium text-muted-foreground">Update Status</span>
                                                            </DropdownMenuItem>
                                                            {(['pending', 'approved', 'rejected'] as const).map((status) => (
                                                                <DropdownMenuItem 
                                                                    key={status} 
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleUpdateStatus(userProfile.uid, status);
                                                                    }}
                                                                    disabled={userProfile.status === status || userProfile.uid === user?.uid || isUpdating === userProfile.uid} 
                                                                    className={`cursor-pointer ${userProfile.status === status ? 'bg-muted' : ''}`}
                                                                >
                                                                    <StatusBadge status={status} />
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
