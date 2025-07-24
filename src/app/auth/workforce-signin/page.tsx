import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function WorkforceSignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-primary/5 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Workforce Sign In</CardTitle>
          <CardDescription>Access the workforce back office.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="employee@example.com" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild><Link href="/workforce-office">Sign in</Link></Button>
           <div className="text-center text-sm">
            <Link href="/auth/signin" className="underline">
              Borrower Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
