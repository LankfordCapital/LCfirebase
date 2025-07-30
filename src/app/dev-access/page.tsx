
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function DevAccessPage() {
  return (
    <div className="flex min-h-screen items-stretch justify-center bg-primary/5 p-0">
      <Card className="w-full shadow-2xl rounded-none flex flex-col justify-center">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Developer Access Panel</CardTitle>
          <CardDescription>Direct dashboard links for development purposes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md mx-auto w-full">
            <div className="flex flex-col gap-4">
                <Button asChild size="lg">
                    <Link href="/workforce-office">Workforce Dashboard</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/broker-office">Broker Dashboard</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/dashboard">Borrower Dashboard</Link>
                </Button>
            </div>
            <div className="mt-6 flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <ShieldAlert className="h-6 w-6 flex-shrink-0" />
                <div className="flex-1">
                    <p className="font-bold">Security Warning</p>
                    <p className="text-sm">
                        This page provides unauthenticated access to all dashboards. It must be deleted before publishing the site.
                    </p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
