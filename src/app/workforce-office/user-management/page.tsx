
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Hourglass, MoreHorizontal, Shield, User, Building, CreditCard, Search, Filter } from 'lucide-react';
import { CustomLoader } from '@/components/ui/custom-loader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { format } from 'date-fns';

interface UserProfile {
    uid: string;
    fullName: string;
    email: string;
    role: 'borrower' | 'broker' | 'workforce' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
    authProvider?: string;
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

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter, statusFilter]);

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

    const filterUsers = () => {
        let filtered = users;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        setFilteredUsers(filtered);
    };

    const handleUpdateRole = async (uid: string, newRole: UserProfile['role']) => {
        if (uid === user?.uid) {
            toast({
                variant: 'destructive',
                title: 'Cannot Update Own Role',
                description: 'You cannot change your own role.',
            });
            return;
        }

        setIsUpdating(uid);
        try {
            await updateUserRole(uid, newRole);
            setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
            toast({ 
                title: 'Role Updated', 
                description: `User role has been updated to ${newRole}.` 
            });
        } catch (error) {
            console.error("Error updating user role:", error);
            toast({ 
                variant: 'destructive', 
                title: 'Error', 
                description: 'Could not update user role.' 
            });
        } finally {
            setIsUpdating(null);
        }
    };

    const handleUpdateStatus = async (uid: string, newStatus: UserProfile['status']) => {
        if (uid === user?.uid) {
            toast({
                variant: 'destructive',
                title: 'Cannot Update Own Status',
                description: 'You cannot change your own status.',
            });
            return;
        }

        setIsUpdating(uid);
        try {
            await updateUserStatus(uid, newStatus);
            setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
            toast({ 
                title: 'Status Updated', 
                description: `User status has been updated to ${newStatus}.` 
            });
        } catch (error) {
            console.error("Error updating user status:", error);
            toast({ 
                variant: 'destructive', 
                title: 'Error', 
                description: 'Could not update user status.' 
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
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const stats = [
        {
            title: "Total Users",
            value: users.length,
            icon: User,
            color: "text-blue-600"
        },
        {
            title: "Pending Approval",
            value: users.filter(u => u.status === 'pending').length,
            icon: Hourglass,
            color: "text-yellow-600"
        },
        {
            title: "Approved Users",
            value: users.filter(u => u.status === 'approved').length,
            icon: Check,
            color: "text-green-600"
        },
        {
            title: "Admins",
            value: users.filter(u => u.role === 'admin').length,
            icon: Shield,
            color: "text-red-600"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-headline text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage user roles, approval statuses, and account permissions.</p>
            </div>

            {/* Stats Cards */}
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

            {/* Filters and Search */}
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
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="borrower">Borrower</SelectItem>
                                <SelectItem value="broker">Broker</SelectItem>
                                <SelectItem value="workforce">Workforce</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
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

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Update user roles and approval statuses</CardDescription>
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
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No users found matching your filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((userProfile) => (
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
                                                                    onClick={() => handleUpdateRole(userProfile.uid, role as UserProfile['role'])}
                                                                    disabled={userProfile.role === role || userProfile.uid === user?.uid}
                                                                    className={userProfile.role === role ? 'bg-muted' : ''}
                                                                >
                                                                    <RoleBadge role={role as UserProfile['role']} />
                                                                </DropdownMenuItem>
                                                            ))}
                                                            
                                                            <DropdownMenuItem disabled className="mt-2">
                                                                <span className="font-medium">Update Status</span>
                                                            </DropdownMenuItem>
                                                            {['pending', 'approved', 'rejected'].map((status) => (
                                                                <DropdownMenuItem
                                                                    key={status}
                                                                    onClick={() => handleUpdateStatus(userProfile.uid, status as UserProfile['status'])}
                                                                    disabled={userProfile.status === status || userProfile.uid === user?.uid}
                                                                    className={userProfile.status === status ? 'bg-muted' : ''}
                                                                >
                                                                    <StatusBadge status={status as UserProfile['status']} />
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
