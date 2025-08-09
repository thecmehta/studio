import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, UserCheck } from "lucide-react";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-center text-4xl font-bold tracking-tight text-foreground font-headline">
            Welcome to TaskMaster
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Streamline your workflow and manage your team effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <Link href="/manager/login" className="h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <Briefcase className="h-10 w-10 text-primary" />
                <CardTitle className="font-headline">Employer Portal</CardTitle>
                <CardDescription>Manage employees & assign tasks.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end justify-center">
                <Button className="w-full" variant="outline">Go to Portal</Button>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <Link href="/employee/login" className="h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <UserCheck className="h-10 w-10 text-accent" />
                <CardTitle className="font-headline">Employee Login</CardTitle>
                <CardDescription>View your assigned tasks.</CardDescription>
              </CardHeader>
               <CardContent className="flex-grow flex items-end justify-center">
                <Button className="w-full" variant="outline">Login</Button>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
