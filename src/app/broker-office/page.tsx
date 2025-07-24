import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Users, DollarSign, BarChart, MoreHorizontal, Calendar, Mail, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const summaryCards = [
    { title: "Active Borrowers", value: "5", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: "Loans in Progress", value: "3", icon: <BarChart className="h-4 w-4 text-muted-foreground" /> },
    { title: "Total Funded Volume", value: "$1.2M", icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
];

const borrowerLoans = [
    { id: "LL-00125", borrower: "John Doe", property: "123 Main St, Anytown", type: "Fix and Flip", status: "Underwriting", progress: 60 },
    { id: "LL-00126", borrower: "Jane Smith", property: "456 Oak Ave, Somecity", type: "DSCR", status: "Approved", progress: 100 },
    { id: "LL-00127", borrower: "Sam Wilson", property: "789 Pine Ln, Otherville", type: "Ground Up Construction", status: "Missing Documents", progress: 25 },
];

export default function BrokerOfficePage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Broker Back Office</h1>
          <p className="text-muted-foreground">Broker Name | Broker Company LLC</p>
        </div>
        <Button asChild>
            <Link href="/dashboard/documents"><PlusCircle className="mr-2 h-4 w-4"/> Start New Application</Link>
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map(card => (
            <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
            </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Your Borrower Pipeline</CardTitle>
                    <CardDescription>Track the status and progress of all loans submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Borrower</TableHead>
                                <TableHead>Loan ID</TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progress</TableHead>
                                 <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {borrowerLoans.map(loan => (
                                <TableRow key={loan.id}>
                                    <TableCell className="font-medium">{loan.borrower}</TableCell>
                                    <TableCell>{loan.id}</TableCell>
                                    <TableCell>{loan.property}</TableCell>
                                    <TableCell>{loan.type}</TableCell>
                                    <TableCell>
                                        <Badge 
                                          variant={loan.status === 'Approved' ? 'default' : loan.status === 'Missing Documents' ? 'destructive' : 'secondary'}
                                          className={loan.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : ''}
                                        >
                                          {loan.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                        <Progress value={loan.progress} className="w-full md:w-40" />
                                        <span className="text-xs text-muted-foreground">{loan.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" className="h-8 w-8 p-0">
                                                  <span className="sr-only">Open menu</span>
                                                  <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                              <DropdownMenuItem asChild>
                                                  <Link href="#">View Details</Link>
                                              </DropdownMenuItem>
                                              <DropdownMenuItem>
                                                  <Calendar className="mr-2 h-4 w-4" />
                                                  Schedule Call
                                              </DropdownMenuItem>
                                              <DropdownMenuItem>
                                                  <Mail className="mr-2 h-4 w-4" />
                                                  Send Email
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Broker Documents</CardTitle>
                    <CardDescription>Upload your compliance documents here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="w9-upload">W-9</Label>
                        <div className="flex items-center gap-2">
                           <Input id="w9-upload" type="file" />
                           <Button size="icon" variant="ghost"><Upload className="h-4 w-4"/></Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="wiring-upload">Wiring Instructions</Label>
                        <div className="flex items-center gap-2">
                           <Input id="wiring-upload" type="file" />
                           <Button size="icon" variant="ghost"><Upload className="h-4 w-4"/></Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="id-upload">ID / Driver's License</Label>
                        <div className="flex items-center gap-2">
                           <Input id="id-upload" type="file" />
                           <Button size="icon" variant="ghost"><Upload className="h-4 w-4"/></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
