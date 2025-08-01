
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { Clock } from "lucide-react";

export default function PendingApprovalPage() {
    const { logOut } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary/5 p-4">
            <Card className="w-full max-w-md text-center shadow-xl">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-2xl">Account Pending Approval</CardTitle>
                    <CardDescription>
                        Thank you for signing up! Your account is currently under review by our team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        You will receive an email notification once your account has been approved. This usually takes 1-2 business days. If you have any questions, please contact support.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={logOut}>
                        Sign Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
