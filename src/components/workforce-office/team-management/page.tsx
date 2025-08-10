
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Hourglass, MoreHorizontal, UserPlus } from 'lucide-react';
import { CustomLoader } from '@/components/ui/custom-loader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeamMember {
    uid: string;
    fullName: string;
    email: string;
    role: 'borrower' | 'broker' | 'workforce' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    createdAt: { toDate: () => Date };
}

export default function TeamManagementPage() {
    const [users, setUsers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as TeamMember[];
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
        try {
            const userDoc = doc(db, "users", uid);
            await updateDoc(userDoc, { role: newRole });
            setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
            toast({ title: 'User Role Updated', description: `User role has been updated to ${newRole}.` });
        } catch (error) {
            console.error("Error updating user role:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update user role.' });
        }
    };

    const InviteUserDialog = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [role, setRole] = useState<TeamMember['role']>('workforce');

        const handleSendInvite = async () => {
            // This is a simplified version. In a real app, you would use Firebase Functions
            // to send an actual email invitation and handle user creation securely.
            // For now, we'll just add a "pending" user to the database.
            try {
                await addDoc(collection(db, "users"), {
                    fullName: name,
                    email: email,
                    role: role,
                    status: 'pending',
                    createdAt: serverTimestamp()
                });

                toast({
                    title: "User Invited",
                    description: `${name} has been invited as a ${role}. They will need to complete the sign-up process.`,
                });
                fetchUsers(); // Refresh the user list
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: "Invitation Failed",
                    description: "Could not send the invitation.",
                });
            }
        }
        
        return (
             <Dialog>
                <DialogTrigger asChild>
                    <Button><UserPlus className="mr-2 h-4 w-4" /> Invite Team Member</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite New Team Member</DialogTitle>
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
                            <Select value={role} onValueChange={(value) => setRole(value as TeamMember['role'])}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="workforce">Workforce</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
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
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Team Management</h1>
                    <p className="text-muted-foreground">Manage roles and access for your team members.</p>
                </div>
                <InviteUserDialog />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>View all registered users and manage their roles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Date Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={5} className="text-center"><CustomLoader /></TableCell></TableRow>
                            ) : users.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center">No team members found.</TableCell></TableRow>
                            ) : (
                                users.map(user => (
                                    <TableRow key={user.uid}>
                                        <TableCell className="font-medium">{user.fullName || 'N/A'}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="capitalize">{user.role}</TableCell>
                                        <TableCell>{user.createdAt?.toDate().toLocaleDateString() || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => handleUpdateRole(user.uid, 'admin')}>Set as Admin</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleUpdateRole(user.uid, 'workforce')}>Set as Workforce</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleUpdateRole(user.uid, 'broker')}>Set as Broker</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleUpdateRole(user.uid, 'borrower')}>Set as Borrower</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
