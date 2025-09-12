'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Building2, 
  Home, 
  Factory, 
  MapPin, 
  Truck, 
  Layers,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle
} from "lucide-react";

interface LoanProgram {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  typicalTerms: string;
  requirements: string[];
  estimatedProcessing: string;
}

export default function BrokerApplicationsPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const loanPrograms: LoanProgram[] = [
    // Residential NOO Programs
    {
      id: 'residential-noo-ground-up-construction',
      name: 'Residential NOO - Ground Up Construction',
      category: 'Residential NOO',
      description: 'New construction financing for residential investment properties',
      icon: <Home className="h-6 w-6" />,
      features: ['New construction', 'Investment properties', 'Flexible terms', 'Quick approval'],
      typicalTerms: '12-24 months',
      requirements: ['Construction plans', 'Builder credentials', 'Market analysis', 'Exit strategy'],
      estimatedProcessing: '7-14 days'
    },
    {
      id: 'residential-noo-fix-and-flip',
      name: 'Residential NOO - Fix and Flip',
      category: 'Residential NOO',
      description: 'Short-term financing for purchasing, renovating, and selling residential properties',
      icon: <Home className="h-6 w-6" />,
      features: ['Purchase + renovation', 'Quick funding', 'Flexible terms', 'No income verification'],
      typicalTerms: '6-18 months',
      requirements: ['Purchase contract', 'Renovation budget', 'After-repair value', 'Exit strategy'],
      estimatedProcessing: '5-10 days'
    },
    {
      id: 'residential-noo-dscr',
      name: 'Residential NOO - DSCR',
      category: 'Residential NOO',
      description: 'Long-term financing based on property cash flow rather than personal income',
      icon: <Home className="h-6 w-6" />,
      features: ['Long-term financing', 'Cash flow based', 'No personal income verification', 'Investment focus'],
      typicalTerms: '30 years',
      requirements: ['Property cash flow', 'Credit score 680+', 'Property appraisal', 'Rental history'],
      estimatedProcessing: '14-21 days'
    },
    {
      id: 'residential-noo-bridge',
      name: 'Residential NOO - Bridge',
      category: 'Residential NOO',
      description: 'Short-term financing to bridge the gap between property purchase and long-term financing',
      icon: <Home className="h-6 w-6" />,
      features: ['Quick funding', 'Flexible terms', 'Bridge to permanent financing', 'No income verification'],
      typicalTerms: '6-12 months',
      requirements: ['Purchase contract', 'Exit strategy', 'Property value', 'Credit score 650+'],
      estimatedProcessing: '5-10 days'
    },
    // Commercial Programs
    {
      id: 'commercial-ground-up-construction',
      name: 'Commercial - Ground Up Construction',
      category: 'Commercial',
      description: 'Construction financing for commercial properties including retail, office, and mixed-use',
      icon: <Building2 className="h-6 w-6" />,
      features: ['New construction', 'Commercial properties', 'Flexible terms', 'Project management'],
      typicalTerms: '18-36 months',
      requirements: ['Construction plans', 'Builder credentials', 'Market analysis', 'Pre-leasing'],
      estimatedProcessing: '14-21 days'
    },
    {
      id: 'commercial-rehab-loans',
      name: 'Commercial - Rehab Loans',
      category: 'Commercial',
      description: 'Financing for renovating and improving existing commercial properties',
      icon: <Building2 className="h-6 w-6" />,
      features: ['Renovation financing', 'Existing properties', 'Value-add strategy', 'Quick funding'],
      typicalTerms: '12-24 months',
      requirements: ['Property purchase', 'Renovation plans', 'After-repair value', 'Exit strategy'],
      estimatedProcessing: '10-14 days'
    },
    {
      id: 'commercial-acquisition-bridge',
      name: 'Commercial - Acquisition & Bridge',
      category: 'Commercial',
      description: 'Short-term financing for acquiring commercial properties with plans for long-term financing',
      icon: <Building2 className="h-6 w-6" />,
      features: ['Quick acquisition', 'Bridge financing', 'Flexible terms', 'No prepayment penalty'],
      typicalTerms: '6-24 months',
      requirements: ['Purchase contract', 'Exit strategy', 'Property value', 'Credit score 650+'],
      estimatedProcessing: '7-14 days'
    },
    {
      id: 'commercial-conventional-long-term-debt',
      name: 'Commercial - Conventional Long Term Debt',
      category: 'Commercial',
      description: 'Traditional long-term financing for stabilized commercial properties',
      icon: <Building2 className="h-6 w-6" />,
      features: ['Long-term financing', 'Stabilized properties', 'Competitive rates', 'Amortization'],
      typicalTerms: '10-25 years',
      requirements: ['Property cash flow', 'Credit score 700+', 'Property appraisal', 'Business plan'],
      estimatedProcessing: '21-30 days'
    },
    // Industrial Programs
    {
      id: 'industrial-ground-up-construction',
      name: 'Industrial - Ground Up Construction',
      category: 'Industrial',
      description: 'Construction financing for industrial properties including warehouses, manufacturing, and distribution',
      icon: <Factory className="h-6 w-6" />,
      features: ['New construction', 'Industrial properties', 'Flexible terms', 'Project management'],
      typicalTerms: '18-36 months',
      requirements: ['Construction plans', 'Builder credentials', 'Market analysis', 'Tenant commitments'],
      estimatedProcessing: '14-21 days'
    },
    {
      id: 'industrial-rehab-expansion-loans',
      name: 'Industrial - Rehab & Expansion',
      category: 'Industrial',
      description: 'Financing for renovating and expanding existing industrial facilities',
      icon: <Factory className="h-6 w-6" />,
      features: ['Renovation financing', 'Expansion projects', 'Value-add strategy', 'Quick funding'],
      typicalTerms: '12-24 months',
      requirements: ['Property ownership', 'Renovation plans', 'After-repair value', 'Business plan'],
      estimatedProcessing: '10-14 days'
    },
    {
      id: 'industrial-acquisition-bridge',
      name: 'Industrial - Acquisition & Bridge',
      category: 'Industrial',
      description: 'Short-term financing for acquiring industrial properties with plans for long-term financing',
      icon: <Factory className="h-6 w-6" />,
      features: ['Quick acquisition', 'Bridge financing', 'Flexible terms', 'No prepayment penalty'],
      typicalTerms: '6-24 months',
      requirements: ['Purchase contract', 'Exit strategy', 'Property value', 'Credit score 650+'],
      estimatedProcessing: '7-14 days'
    },
    {
      id: 'industrial-long-term-debt',
      name: 'Industrial - Long Term Debt',
      category: 'Industrial',
      description: 'Long-term financing for stabilized industrial properties',
      icon: <Factory className="h-6 w-6" />,
      features: ['Long-term financing', 'Stabilized properties', 'Competitive rates', 'Amortization'],
      typicalTerms: '10-25 years',
      requirements: ['Property cash flow', 'Credit score 700+', 'Property appraisal', 'Business plan'],
      estimatedProcessing: '21-30 days'
    },
    // Other Programs
    {
      id: 'land-acquisition',
      name: 'Land Acquisition',
      category: 'Land & Development',
      description: 'Financing for purchasing land for future development or investment',
      icon: <MapPin className="h-6 w-6" />,
      features: ['Land purchase', 'Development potential', 'Flexible terms', 'Investment focus'],
      typicalTerms: '12-36 months',
      requirements: ['Land appraisal', 'Development plans', 'Zoning verification', 'Exit strategy'],
      estimatedProcessing: '10-21 days'
    },
    {
      id: 'mezzanine-loans',
      name: 'Mezzanine Loans',
      category: 'Structured Finance',
      description: 'Subordinate financing that sits between senior debt and equity',
      icon: <Layers className="h-6 w-6" />,
      features: ['Subordinate financing', 'Higher leverage', 'Flexible terms', 'Quick funding'],
      typicalTerms: '3-7 years',
      requirements: ['Senior debt in place', 'Strong collateral', 'Business plan', 'Exit strategy'],
      estimatedProcessing: '14-21 days'
    },
    {
      id: 'mobilization-funding',
      name: 'Mobilization Funding',
      category: 'Construction',
      description: 'Short-term financing for construction project startup costs',
      icon: <Clock className="h-6 w-6" />,
      features: ['Project startup', 'Quick funding', 'Flexible terms', 'Construction focus'],
      typicalTerms: '3-12 months',
      requirements: ['Construction contract', 'Project timeline', 'Budget breakdown', 'Exit strategy'],
      estimatedProcessing: '5-10 days'
    },
    {
      id: 'equipment-financing',
      name: 'Equipment Financing',
      category: 'Equipment',
      description: 'Financing for purchasing business equipment and machinery',
      icon: <Truck className="h-6 w-6" />,
      features: ['Equipment purchase', 'Flexible terms', 'Quick approval', 'No collateral'],
      typicalTerms: '2-7 years',
      requirements: ['Equipment quotes', 'Business plan', 'Credit score 650+', 'Down payment'],
      estimatedProcessing: '3-7 days'
    }
  ];

  // Handle starting a new application
  const handleStartApplication = async (program: LoanProgram) => {
    if (!user || !userProfile) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to start a loan application.',
      });
      return;
    }

    if (userProfile.role !== 'broker' && userProfile.role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'Only brokers and admins can start loan applications.',
      });
      return;
    }

    try {
      console.log('Creating loan application for program:', program.id);
      console.log('User ID:', user.uid);
      console.log('Broker ID:', user.uid);
      
      // Create a new loan application
      const response = await fetch('/api/enhanced-loan-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          userId: user.uid, // Broker's user ID (will be updated when borrower is added)
          brokerId: user.uid, // Current broker's ID
          loanProgram: program.id,
          initialData: {
            // Set initial data based on the program
            loanCategory: program.category,
            status: 'draft',
            progress: {
              borrowerInfoCompleted: false,
              businessInfoCompleted: false,
              loanDetailsCompleted: false,
              financialInfoCompleted: false,
              propertyInfoCompleted: false,
              employmentInfoCompleted: false,
              documentsUploaded: false,
              overallProgress: 0
            }
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', response.status, errorText);
        throw new Error(`Failed to create loan application: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        // Verify we have the application ID
        if (!result.data || !result.data.applicationId) {
          console.error('Missing application ID in response:', result);
          throw new Error('Application created but no ID returned');
        }
        
        toast({
          title: 'Application Created',
          description: `Loan application for ${program.name} has been created successfully.`,
        });

        console.log('Navigating to application with ID:', result.data.applicationId);
        // Navigate to the loan application form with the new application ID
        router.push(`/broker-office/application/${program.id}?applicationId=${result.data.applicationId}`);
      } else {
        throw new Error(result.error || 'Failed to create application');
      }
      
    } catch (error) {
      console.error('Error creating loan application:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: 'Failed to create loan application. Please try again.',
      });
    }
  };

  // Group programs by category
  const categories = ['Residential NOO', 'Commercial', 'Industrial', 'Land & Development', 'Structured Finance', 'Construction', 'Equipment'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Loan Programs</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose from our comprehensive selection of loan programs designed to meet your clients' diverse financing needs.
        </p>
      </div>

      {categories.map(category => {
        const categoryPrograms = loanPrograms.filter(program => program.category === category);
        
        if (categoryPrograms.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {categoryPrograms[0]?.icon}
                {category}
              </CardTitle>
              <CardDescription>
                {categoryPrograms.length} program{categoryPrograms.length !== 1 ? 's' : ''} available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryPrograms.map(program => (
                  <Card key={program.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {program.icon}
                          <Badge variant="outline" className="text-xs">
                            {program.typicalTerms}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-base">{program.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {program.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {program.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {program.requirements.slice(0, 2).map((req, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <FileText className="h-3 w-3 text-blue-500" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs text-muted-foreground">
                            Processing: {program.estimatedProcessing}
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleStartApplication(program)}
                            className="flex items-center gap-1"
                          >
                            Start Application <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the loan program that best fits your client's needs and start the application process. 
              You can collect borrower information during the application flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="lg">
                Contact Our Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
