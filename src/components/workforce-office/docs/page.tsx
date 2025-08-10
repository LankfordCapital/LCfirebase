
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Edit, Save, X, FileText } from 'lucide-react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomLoader } from '@/components/ui/custom-loader';

interface Doc {
    id: string;
    title: string;
    content: string;
    createdAt: any;
}

export default function DocsPage() {
    const [docs, setDocs] = useState<Doc[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentDoc, setCurrentDoc] = useState<Partial<Doc>>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const { toast } = useToast();
    
    useEffect(() => {
        const fetchDocs = async () => {
            setIsLoading(true);
            const q = query(collection(db, "workforce-docs"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Doc[];
            setDocs(docsData);
            setIsLoading(false);
        };
        fetchDocs();
    }, []);

    const handleNewDoc = () => {
        setCurrentDoc({});
        setIsDialogOpen(true);
    };

    const handleEditDoc = (doc: Doc) => {
        setCurrentDoc(doc);
        setIsDialogOpen(true);
    };

    const handleDeleteDoc = async (docId: string) => {
        if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) return;
        
        try {
            await deleteDoc(doc(db, "workforce-docs", docId));
            setDocs(docs.filter(d => d.id !== docId));
            toast({ title: 'Document Deleted', description: 'The document has been permanently deleted.' });
        } catch (error) {
            console.error("Error deleting doc: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the document.' });
        }
    };
    
    const handleSaveDoc = async () => {
        if (!currentDoc.title || !currentDoc.content) {
            toast({ variant: 'destructive', title: 'Missing Fields', description: 'Title and content are required.' });
            return;
        }
        setIsSubmitting(true);
        try {
            if (currentDoc.id) {
                // Update
                const docRef = doc(db, "workforce-docs", currentDoc.id);
                await updateDoc(docRef, { title: currentDoc.title, content: currentDoc.content });
                setDocs(docs.map(d => d.id === currentDoc.id ? { ...d, title: currentDoc.title, content: currentDoc.content } : d));
                toast({ title: 'Document Updated' });
            } else {
                // Create
                const docRef = await addDoc(collection(db, "workforce-docs"), {
                    title: currentDoc.title,
                    content: currentDoc.content,
                    createdAt: new Date(),
                });
                 setDocs([{ id: docRef.id, title: currentDoc.title, content: currentDoc.content, createdAt: new Date() }, ...docs]);
                toast({ title: 'Document Created' });
            }
            setIsDialogOpen(false);
            setCurrentDoc({});
        } catch (error) {
            console.error("Error saving doc: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save the document.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Documents & Notes</h1>
                    <p className="text-muted-foreground">
                        Create, edit, and manage internal team documents and notes.
                    </p>
                </div>
                <Button onClick={handleNewDoc}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Document
                </Button>
            </div>
            
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{currentDoc.id ? 'Edit Document' : 'Create New Document'}</DialogTitle>
                        <DialogDescription>
                            {currentDoc.id ? 'Make changes to your document.' : 'Create a new document for your team.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input 
                            placeholder="Document Title" 
                            value={currentDoc.title || ''} 
                            onChange={(e) => setCurrentDoc({...currentDoc, title: e.target.value})}
                        />
                         <Textarea 
                            placeholder="Document content..."
                            className="h-64"
                            value={currentDoc.content || ''} 
                            onChange={(e) => setCurrentDoc({...currentDoc, content: e.target.value})}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSaveDoc} disabled={isSubmitting}>
                            {isSubmitting && <CustomLoader className="mr-2 h-4 w-4"/>}
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <p>Loading documents...</p>
                ) : docs.map(doc => (
                    <Card key={doc.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-start justify-between">
                                <span className="truncate">{doc.title}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => {e.stopPropagation(); handleDeleteDoc(doc.id);}}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                Created on: {doc.createdAt?.toDate ? doc.createdAt.toDate().toLocaleDateString() : 'N/A'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-sm text-muted-foreground line-clamp-4">{doc.content}</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button variant="outline" className="w-full" onClick={() => handleEditDoc(doc)}>
                                <Edit className="mr-2 h-4 w-4"/> View / Edit
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
