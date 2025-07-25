
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComparableSales } from './comparable-sales';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { useToast } from '@/hooks/use-toast';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type PhotoFile = {
  id: string;
  file: File;
  preview: string;
};

export function LoanApplicationClientPage3({ loanProgram }: { loanProgram: string}) {
  const router = useRouter();
  const { addDocument, documents } = useDocumentContext();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [propertyType, setPropertyType] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');


  const handleContinue = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    router.push(`/dashboard/application/${programSlug}/page-4`);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        const files = Array.from(event.target.files);
        if (photos.length + files.length > 15) {
            toast({
                variant: 'destructive',
                title: 'Photo Limit Exceeded',
                description: 'You can upload a maximum of 15 photos.',
            });
            return;
        }

        const newPhotos: PhotoFile[] = files.map(file => ({
            id: `${file.name}-${file.lastModified}`,
            file,
            preview: URL.createObjectURL(file),
        }));

        setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);

        // Also add them to the document context if needed
        for (const photo of newPhotos) {
             await addDocument({
                name: `Subject Property Photo - ${photo.file.name}`,
                file: photo.file,
                status: 'uploaded',
            });
        }
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  };


  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Loan Application - Page 3 of 4</h1>
            <p className="text-muted-foreground">{loanProgram}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Provide details about the property to be built.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="propertyType">Type of Property</Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                            <SelectTrigger id="propertyType">
                                <SelectValue placeholder="Select property type..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sfr">Single Family Home</SelectItem>
                                <SelectItem value="townhome">Townhome</SelectItem>
                                <SelectItem value="condo">Condo</SelectItem>
                                <SelectItem value="plex">Duplex, Triplex, or Quadplex</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="numberOfUnits">Planned Number of Units</Label>
                        <Input id="numberOfUnits" type="number" placeholder="e.g., 1" value={numberOfUnits} onChange={(e) => setNumberOfUnits(e.target.value)} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <ComparableSales />

        <Card>
            <CardHeader>
                <CardTitle>Subject Property Photos ({photos.length}/15)</CardTitle>
                <CardDescription>Upload up to 15 photos of the subject property. Click the button below to select multiple files.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="property-photos-upload" className="sr-only">Upload Photos</Label>
                         <div className="flex items-center gap-2">
                            <Input 
                                id="property-photos-upload" 
                                type="file" 
                                onChange={handleFileChange} 
                                multiple 
                                accept="image/*"
                                className="hidden"
                            />
                            <Button asChild variant="outline">
                                <Label htmlFor="property-photos-upload" className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Choose Photos
                                </Label>
                            </Button>
                        </div>
                    </div>
                    {photos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {photos.map(photo => (
                                <div key={photo.id} className="relative group aspect-square">
                                    <Image 
                                        src={photo.preview} 
                                        alt={photo.file.name} 
                                        layout="fill" 
                                        objectFit="cover" 
                                        className="rounded-md"
                                        onLoad={() => URL.revokeObjectURL(photo.preview)} // Clean up object URL after load
                                    />
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemovePhoto(photo.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Page 2
            </Button>
            <Button onClick={handleContinue}>
                Save & Continue to Page 4 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
