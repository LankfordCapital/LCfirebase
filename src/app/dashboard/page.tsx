import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DollarSign, FileCheck, FileClock, PlusCircle, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const summaryCards = [
    { title: "Active Loans", value: "1", icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> },
    { title: "Documents Submitted", value: "8", icon: <FileCheck className="h-4 w-4 text-muted-foreground" /> },
    { title: "Pending Actions", value: "2", icon: <FileClock className="h-4 w-4 text-muted-foreground" /> },
];

const loanApplications = [
    { id: "LL-00124", property: "123 Main St, Anytown", type: "Fix and Flip", status: "Underwriting", progress: 60 },
    { id: "LL-00119", property: "456 Oak Ave, Somecity", type: "DSCR", status: "Approved", progress: 100 },
];

const recentActivity = [
    { date: "2 days ago", description: "Document 'Bank Statement Q1' was approved." },
    { date: "3 days ago", "description": "You uploaded 'Signed Purchase Agreement'." },
    { date: "5 days ago", "description": "Loan officer requested 'Proof of Insurance'." },
]

const missingDocuments = [
    { id: "doc1", name: "2023 Personal Tax Returns" },
    { id: "doc2", name: "2023 Business Tax Returns" },
    { id: "doc3", name: "Signed Purchase Agreement" },
    { id: "doc4", name: "Driver's License" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Welcome Back, John Doe!</h1>
          <p className="text-muted-foreground">Lankford Lending Solutions</p>
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
                    <CardTitle>Loan Application Status</CardTitle>
                    <CardDescription>Track the progress of your active loan applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Loan ID</TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loanApplications.map(loan => (
                                <TableRow key={loan.id}>
                                    <TableCell className="font-medium">{loan.id}</TableCell>
                                    <TableCell>{loan.property}</TableCell>
                                    <TableCell>{loan.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={loan.status === 'Approved' ? 'default' : 'secondary'} className={loan.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : ''}>{loan.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                        <Progress value={loan.progress} className="w-full md:w-40" />
                                        <span className="text-xs text-muted-foreground">{loan.progress}%</span>
                                        </div>
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
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Missing Documents
                    </CardTitle>
                    <CardDescription>Please upload the following documents to proceed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {missingDocuments.map((doc) => (
                         <div key={doc.id} className="flex items-center space-x-2">
                            <Checkbox id={doc.id} />
                            <Label htmlFor={doc.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{doc.name}</Label>
                        </div>
                    ))}
                     <Button className="w-full mt-2" asChild>
                        <Link href="/dashboard/documents">Upload Documents</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start gap-4">
                        <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{activity.date}</span>
                        <p className="text-sm">{activity.description}</p>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
    </div>
  )
}
