
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function CommunicationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Communications Hub</h1>
                <p className="text-muted-foreground">
                    Chat with workforce members, brokers, and borrowers in real-time.
                </p>
            </div>
            <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
                <CardHeader>
                    <div className="mx-auto bg-muted p-4 rounded-full">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">Coming Soon</CardTitle>
                    <CardDescription>
                        Our internal and external chat features are currently under development. <br />
                        Soon you will be able to communicate seamlessly with all parties involved in a loan.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
