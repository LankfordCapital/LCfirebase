import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BrokerOfficePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">Broker Back Office</h1>
        <p className="text-muted-foreground">Manage your clients and loan submissions.</p>
      </div>

      <Card className="text-center p-12">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>The broker back office is currently under construction. Check back soon for updates!</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
