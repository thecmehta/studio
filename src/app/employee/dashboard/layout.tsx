import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { LogOut } from "lucide-react";

export default function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Logo />
            <span className="sr-only">TaskMaster</span>
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
             <h1 className="text-lg font-semibold md:text-2xl">My Tasks</h1>
          </div>
           <Button asChild variant="ghost" className="gap-2">
            <Link href="/employee/login">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture" alt="Alice Johnson" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
