
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartHorizontal } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Reporting Suite</h1>
                <p className="text-muted-foreground">
                    Analyze pipeline data, performance metrics, and generate custom reports.
                </p>
            </div>
            <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
                <CardHeader>
                    <div className="mx-auto bg-muted p-4 rounded-full">
                        <BarChartHorizontal className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">Coming Soon</CardTitle>
                    <CardDescription>
                        Our advanced reporting features are currently under construction. <br />
                        You'll soon be able to generate detailed reports on loan volume, closing times, and more.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
