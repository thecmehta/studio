"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function EmployerSignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    cid: "",
    name: "",
    email: "",
    password: "",
    role: "mngr" 
     // Changed to match your schema
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/manager/login");
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(
      user.cid.length > 0 && 
      user.name.length > 0 && 
      user.email.length > 0 && 
      user.password.length > 0
    ));
  }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Create Manager Account</CardTitle>
          <CardDescription>Enter your details to create your manager account.</CardDescription>
        </CardHeader>
        <form onSubmit={onSignup}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cid">Company ID</Label>
              <Input 
                id="cid"
                type="text"
                placeholder="Your company ID"
                value={user.cid}
                onChange={(e) => setUser({ ...user, cid: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                type="text"
                placeholder="John Doe"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="m@example.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={buttonDisabled}>
              {buttonDisabled ? "Fill All Fields" : "Create Account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/manager/login" className="underline text-primary">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}