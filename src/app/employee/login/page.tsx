import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";

export default function EmployeeLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Employee Login</CardTitle>
          <CardDescription>Enter your employee ID and password.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="employee-id">Employee ID</Label>
            <Input id="employee-id" placeholder="emp-001" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/employee/dashboard">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
