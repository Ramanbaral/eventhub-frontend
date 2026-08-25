import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(255),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        values,
        { withCredentials: true }
      );
      login(res.data);
      toast.success("Login successful!");
      form.reset();
      navigate({ to: "/upcoming" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to log in.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="gap-2 text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Log in to continue to EventHub.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={form.formState.errors.email ? true : undefined}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm" role="alert">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={form.formState.errors.password ? true : undefined}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-destructive text-sm" role="alert">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-background flex-col gap-4 border-0">
          <div className="flex w-full items-center gap-3">
            <Separator className="bg-foreground/20 flex-1" />
            <span className="text-muted-foreground text-xs">OR</span>
            <Separator className="bg-foreground/20 flex-1" />
          </div>
          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <a
              className="font-medium text-blue-500 underline-offset-4 hover:underline"
              href="/register"
            >
              Register here
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
