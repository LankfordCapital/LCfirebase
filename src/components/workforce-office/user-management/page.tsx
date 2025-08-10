
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Hourglass, MoreHorizontal } from 'lucide-react';
import { CustomLoader } from '@/components/ui/custom-loader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserProfile {
    uid: string;
    fullName: string;
    email: string;
    role: 'borrower' | 'broker' | 'workforce';
    status: 'pending' | 'approved' | 'rejected';
    createdAt: { toDate: () => Date };
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.docs.map(doc => ({ ...doc.data() })) as UserProfile[];
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

    const handleUpdateStatus = async (uid: string, newStatus: 'approved' | 'rejected') => {
        try {
            const userDoc = doc(db, "users", uid);
            await updateDoc(userDoc, { status: newStatus });
            setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
            toast({ title: 'User Updated', description: `User has been ${newStatus}.` });
        } catch (error) {
            console.error("Error updating user status:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update user status.' });
        }
    };

    const StatusBadge = ({ status }: { status: UserProfile['status'] }) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500 hover:bg-green-600"><Check className="mr-1 h-3 w-3" />Approved</Badge>;
            case 'pending':
                return <Badge variant="secondary"><Hourglass className="mr-1 h-3 w-3" />Pending</Badge>;
            case 'rejected':
                return <Badge variant="destructive"><X className="mr-1 h-3 w-3" />Rejected</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const renderUserTable = (filteredUsers: UserProfile[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Date Registered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center"><CustomLoader /></TableCell></TableRow>
                ) : filteredUsers.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center">No users found.</TableCell></TableRow>
                ) : (
                    filteredUsers.map(user => (
                        <TableRow key={user.uid}>
                            <TableCell className="font-medium">{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="capitalize">{user.role}</TableCell>
                            <TableCell>{user.createdAt?.toDate().toLocaleDateString()}</TableCell>
                            <TableCell><StatusBadge status={user.status} /></TableCell>
                            <TableCell className="text-right">
                                {user.status === 'pending' && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user.uid, 'approved')}>
                                                <Check className="mr-2 h-4 w-4 text-green-500" /> Approve
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user.uid, 'rejected')}>
                                                <X className="mr-2 h-4 w-4 text-red-500" /> Reject
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Approve, reject, and manage user accounts.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>User List</CardTitle>
                    <CardDescription>View all registered users and manage their approval status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="borrowers">Borrowers</TabsTrigger>
                            <TabsTrigger value="brokers">Brokers</TabsTrigger>
                            <TabsTrigger value="all">All Users</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending">
                            {renderUserTable(users.filter(u => u.status === 'pending'))}
                        </TabsContent>
                         <TabsContent value="borrowers">
                            {renderUserTable(users.filter(u => u.role === 'borrower' && u.status === 'approved'))}
                        </TabsContent>
                         <TabsContent value="brokers">
                            {renderUserTable(users.filter(u => u.role === 'broker' && u.status === 'approved'))}
                        </TabsContent>
                         <TabsContent value="all">
                            {renderUserTable(users)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
