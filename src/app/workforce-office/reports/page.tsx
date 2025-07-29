
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, ResponsiveContainer, LineChart, Line, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const monthlyVolumeData = [
  { month: "Jan", volume: 1860000 },
  { month: "Feb", volume: 3050000 },
  { month: "Mar", volume: 2370000 },
  { month: "Apr", volume: 730000 },
  { month: "May", volume: 2090000 },
  { month: "Jun", volume: 2140000 },
];

const statusDistributionData = [
  { name: 'Initial Review', value: 15, fill: 'var(--color-review)' },
  { name: 'Underwriting', value: 8, fill: 'var(--color-underwriting)' },
  { name: 'Missing Docs', value: 3, fill: 'var(--color-missing)' },
  { name: 'Approved', value: 5, fill: 'var(--color-approved)' },
  { name: 'Funded', value: 12, fill: 'var(--color-funded)' },
];
const statusChartConfig = {
    review: { label: 'Initial Review', color: 'hsl(var(--chart-1))' },
    underwriting: { label: 'Underwriting', color: 'hsl(var(--chart-2))' },
    missing: { label: 'Missing Docs', color: 'hsl(var(--chart-3))' },
    approved: { label: 'Approved', color: 'hsl(var(--chart-4))' },
    funded: { label: 'Funded', color: 'hsl(var(--chart-5))' },
}

const performanceByTypeData = [
    { type: 'Fix and Flip', count: 18, volume: 5400000, avgTime: '15 days' },
    { type: 'DSCR', count: 12, volume: 4800000, avgTime: '22 days' },
    { type: 'Ground Up', count: 5, volume: 7500000, avgTime: '35 days' },
    { type: 'Commercial Bridge', count: 8, volume: 6400000, avgTime: '18 days' },
];

const funnelData = [
  { stage: 'Applications', value: 100 },
  { stage: 'Prequalified', value: 75 },
  { stage: 'Underwriting', value: 60 },
  { stage: 'Approved', value: 45 },
  { stage: 'Funded', value: 38 },
];


export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Reporting Suite</h1>
                    <p className="text-muted-foreground">
                        Analyze pipeline data, performance metrics, and generate custom reports.
                    </p>
                </div>
                 <div className="flex items-center gap-2">
                    <Select defaultValue="90d">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 90 Days</SelectItem>
                            <SelectItem value="ytd">Year-to-Date</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Funded Volume</CardTitle>
                        <CardDescription>Selected date range</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">$12,290,000</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Average Closing Time</CardTitle>
                        <CardDescription>Selected date range</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">21 Days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Active Loans</CardTitle>
                        <CardDescription>Currently in pipeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">43</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>New Applications</CardTitle>
                        <CardDescription>Selected date range</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">+52</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Loan Volume</CardTitle>
                        <CardDescription>Total loan volume funded per month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={monthlyVolumeData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                    <Tooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                            formatter={(value) =>
                                                `$${Number(value).toLocaleString()}`
                                            }
                                            />
                                        }
                                    />
                                    <Bar dataKey="volume" fill="hsl(var(--primary))" radius={8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Loan Status Distribution</CardTitle>
                        <CardDescription>Current snapshot of the loan pipeline.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={statusChartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={statusDistributionData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} >
                                         {statusDistributionData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Legend content={<ChartTooltipContent nameKey="name" />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance by Loan Type</CardTitle>
                    <CardDescription>Key metrics broken down by each loan product.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Loan Type</TableHead>
                                <TableHead># of Loans</TableHead>
                                <TableHead>Total Volume</TableHead>
                                <TableHead>Avg. Time to Fund</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {performanceByTypeData.map((row) => (
                                <TableRow key={row.type}>
                                    <TableCell className="font-medium">{row.type}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>${row.volume.toLocaleString()}</TableCell>
                                    <TableCell>{row.avgTime}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Loan Funnel Conversion</CardTitle>
                    <CardDescription>Conversion rates through the key stages of the loan process.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <LineChart data={funnelData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="stage" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} name="Count" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

        </div>
    )
}
