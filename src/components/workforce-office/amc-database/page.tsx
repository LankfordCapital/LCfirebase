
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Edit, Save, X } from 'lucide-react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomLoader } from '@/components/ui/custom-loader';

interface AMCProfile {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    reportTypes: string;
    coverageArea: string;
    orderingInstructions: string;
}

export default function AmcDatabasePage() {
    const [amcs, setAmcs] = useState<AMCProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for the form
    const [companyName, setCompanyName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [reportTypes, setReportTypes] = useState('');
    const [coverageArea, setCoverageArea] = useState('');
    const [orderingInstructions, setOrderingInstructions] = useState('');

    // State for editing
    const [editingId, setEditingId] = useState<string | null>(null);

    const { toast } = useToast();
    
    useEffect(() => {
        const fetchAmcs = async () => {
            setIsLoading(true);
            const querySnapshot = await getDocs(collection(db, "amcs"));
            const amcsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AMCProfile[];
            setAmcs(amcsData);
            setIsLoading(false);
        };
        fetchAmcs();
    }, []);

    const resetForm = () => {
        setCompanyName('');
        setContactPerson('');
        setEmail('');
        setPhone('');
        setReportTypes('');
        setCoverageArea('');
        setOrderingInstructions('');
        setEditingId(null);
    }
    
    const handleEditClick = (amc: AMCProfile) => {
        setEditingId(amc.id);
        setCompanyName(amc.companyName);
        setContactPerson(amc.contactPerson);
        setEmail(amc.email);
        setPhone(amc.phone);
        setReportTypes(amc.reportTypes);
        setCoverageArea(amc.coverageArea);
        setOrderingInstructions(amc.orderingInstructions);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newAmcData = { companyName, contactPerson, email, phone, reportTypes, coverageArea, orderingInstructions };
        
        try {
            if (editingId) {
                // Update existing amc
                const amcDoc = doc(db, "amcs", editingId);
                await updateDoc(amcDoc, newAmcData);
                setAmcs(amcs.map(l => l.id === editingId ? { ...l, ...newAmcData } : l));
                toast({ title: 'Vendor Updated', description: `${companyName} has been updated successfully.` });
            } else {
                // Add new amc
                const docRef = await addDoc(collection(db, "amcs"), newAmcData);
                setAmcs([...amcs, { id: docRef.id, ...newAmcData }]);
                toast({ title: 'Vendor Added', description: `${companyName} has been added to the database.` });
            }
            resetForm();
        } catch (error) {
            console.error("Error saving vendor: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save the vendor.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (amcId: string) => {
        if (!confirm('Are you sure you want to delete this vendor?')) return;
        
        try {
            await deleteDoc(doc(db, "amcs", amcId));
            setAmcs(amcs.filter(l => l.id !== amcId));
            toast({ title: 'Vendor Deleted', description: 'The vendor has been removed from the database.' });
        } catch (error) {
            console.error("Error deleting vendor: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the vendor.' });
        }
    }


    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">AMC & Report Vendor Database</h1>
                <p className="text-muted-foreground">
                    Manage your network of appraisal and third-party report vendors.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? 'Edit Vendor' : 'Add New Vendor'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" placeholder="e.g., Appraisal Experts Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPerson">Contact Person</Label>
                                <Input id="contactPerson" placeholder="e.g., John Smith" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="e.g., orders@appraisalexperts.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="tel" placeholder="e.g., 555-987-6543" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="reportTypes">Report Types Offered</Label>
                                <Input id="reportTypes" placeholder="e.g., Appraisal, BPO, Survey, Environmental" value={reportTypes} onChange={(e) => setReportTypes(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coverageArea">Areas of Coverage</Label>
                                <Input id="coverageArea" placeholder="e.g., Nationwide, California, Texas" value={coverageArea} onChange={(e) => setCoverageArea(e.target.value)} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orderingInstructions">Ordering Instructions</Label>
                            <Textarea id="orderingInstructions" placeholder="Describe how to order reports from this vendor (e.g., portal link, email address, required forms)." value={orderingInstructions} onChange={(e) => setOrderingInstructions(e.target.value)} required className="h-32" />
                        </div>
                        <div className="flex justify-end gap-2">
                            {editingId && <Button type="button" variant="outline" onClick={resetForm}><X className="mr-2 h-4 w-4"/> Cancel</Button>}
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <CustomLoader className="mr-2 h-4 w-4" /> : (editingId ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
                                {editingId ? 'Save Changes' : 'Add Vendor'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Current Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Report Types</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center">Loading vendors...</TableCell></TableRow>
                                ) : amcs.map(amc => (
                                    <TableRow key={amc.id}>
                                        <TableCell className="font-medium">{amc.companyName}</TableCell>
                                        <TableCell>{amc.contactPerson}</TableCell>
                                        <TableCell>{amc.email}</TableCell>
                                        <TableCell>{amc.phone}</TableCell>
                                        <TableCell>{amc.reportTypes}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(amc)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(amc.id)}>
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
