'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Hourglass, MoreHorizontal, Shield, User, Building, CreditCard } from 'lucide-react';
import { CustomLoader } from '@/components/ui/custom-loader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { format } from 'date-fns';

interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: 'borrower' | 'broker' | 'workforce' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  authProvider?: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();
  const { getAllUsers, updateUserRole, updateUserStatus, isAdmin, user } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Could not fetch user data.' 
      });
    } finally {
      setIsLoading(false);
    }
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">You don't have permission to access the admin panel.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-headline text-4xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 text-lg">Manage user roles and account statuses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {users.filter(u => u.status === 'pending').length}
                  </p>
                </div>
                <Hourglass className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'approved').length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl">User Management</CardTitle>
            <CardDescription>Update user roles and approval statuses</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
                    {users.map((userProfile) => (
                      <TableRow key={userProfile.uid}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{userProfile.fullName}</p>
                            <p className="text-sm text-gray-500">{userProfile.email}</p>
                            {userProfile.authProvider && (
                              <p className="text-xs text-gray-400">via {userProfile.authProvider}</p>
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
                          <p className="text-sm text-gray-600">
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
                                  className={userProfile.role === role ? 'bg-gray-100' : ''}
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
                                  className={userProfile.status === status ? 'bg-gray-100' : ''}
                                >
                                  <StatusBadge status={status as UserProfile['status']} />
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

