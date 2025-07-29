
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, Edit, Save, X, ExternalLink } from 'lucide-react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type LenderProfile } from '@/ai/flows/lender-match-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';

export default function LenderDatabasePage() {
    const [lenders, setLenders] = useState<LenderProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for the form
    const [name, setName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [lendingCriteria, setLendingCriteria] = useState('');
    const [notes, setNotes] = useState('');

    // State for editing
    const [editingId, setEditingId] = useState<string | null>(null);

    const { toast } = useToast();
    
    useEffect(() => {
        const fetchLenders = async () => {
            setIsLoading(true);
            const querySnapshot = await getDocs(collection(db, "lenders"));
            const lendersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LenderProfile[];
            setLenders(lendersData);
            setIsLoading(false);
        };
        fetchLenders();
    }, []);

    const resetForm = () => {
        setName('');
        setContactPerson('');
        setEmail('');
        setPhone('');
        setWebsite('');
        setLendingCriteria('');
        setNotes('');
        setEditingId(null);
    }
    
    const handleEditClick = (lender: LenderProfile) => {
        setEditingId(lender.id);
        setName(lender.name);
        setContactPerson(lender.contactPerson);
        setEmail(lender.email);
        setPhone(lender.phone);
        setWebsite(lender.website || '');
        setLendingCriteria(lender.lendingCriteria);
        setNotes(lender.notes || '');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newLenderData = { name, contactPerson, email, phone, website, lendingCriteria, notes };
        
        try {
            if (editingId) {
                // Update existing lender
                const lenderDoc = doc(db, "lenders", editingId);
                await updateDoc(lenderDoc, newLenderData);
                setLenders(lenders.map(l => l.id === editingId ? { ...l, ...newLenderData } : l));
                toast({ title: 'Lender Updated', description: `${name} has been updated successfully.` });
            } else {
                // Add new lender
                const docRef = await addDoc(collection(db, "lenders"), newLenderData);
                setLenders([...lenders, { id: docRef.id, ...newLenderData }]);
                toast({ title: 'Lender Added', description: `${name} has been added to the database.` });
            }
            resetForm();
        } catch (error) {
            console.error("Error saving lender: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save the lender.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (lenderId: string) => {
        if (!confirm('Are you sure you want to delete this lender?')) return;
        
        try {
            await deleteDoc(doc(db, "lenders", lenderId));
            setLenders(lenders.filter(l => l.id !== lenderId));
            toast({ title: 'Lender Deleted', description: 'The lender has been removed from the database.' });
        } catch (error) {
            console.error("Error deleting lender: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the lender.' });
        }
    }


    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Lender & Investor Database</h1>
                <p className="text-muted-foreground">
                    Manage the profiles of your capital partners.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? 'Edit Lender/Investor' : 'Add New Lender/Investor'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Lender/Investor Name</Label>
                                <Input id="name" placeholder="e.g., Capital Group Inc." value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPerson">Contact Person</Label>
                                <Input id="contactPerson" placeholder="e.g., Jane Doe" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="e.g., jane.doe@capital.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="tel" placeholder="e.g., 555-123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" type="url" placeholder="e.g., https://capital.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lendingCriteria">Lending Criteria</Label>
                            <Textarea id="lendingCriteria" placeholder="Describe preferred property types, loan sizes, LTV/LTC, geographic focus, etc." value={lendingCriteria} onChange={(e) => setLendingCriteria(e.target.value)} required className="h-32" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea id="notes" placeholder="Any other relevant notes or information." value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            {editingId && <Button type="button" variant="outline" onClick={resetForm}><X className="mr-2 h-4 w-4"/> Cancel</Button>}
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
                                {editingId ? 'Save Changes' : 'Add Lender'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Current Lenders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Website</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center">Loading lenders...</TableCell></TableRow>
                                ) : lenders.map(lender => (
                                    <TableRow key={lender.id}>
                                        <TableCell className="font-medium">{lender.name}</TableCell>
                                        <TableCell>{lender.contactPerson}</TableCell>
                                        <TableCell>{lender.email}</TableCell>
                                        <TableCell>
                                            {lender.website ? (
                                                <a href={lender.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                                    Visit <ExternalLink className="h-4 w-4" />
                                                </a>
                                            ) : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(lender)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(lender.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
