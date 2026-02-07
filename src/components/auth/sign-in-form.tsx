"use client";

import {
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    GoogleLogo,
    GoogleLogoIcon,
    LockIcon,
    SpinnerGapIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";





export function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/slides";

    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (mode === "signup") {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Failed to create account. Please try again.");
                    setIsLoading(false);
                    return;
                }

                toast.success("Account created successfully!", {
                    description: "Logging you in...",
                });
            }

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setError(
                    mode === "signin"
                        ? "Invalid email or password. Please try again."
                        : "Registration successful, but sign-in failed. Please try signing in manually."
                );
                setIsLoading(false);
            } else {
                if (mode === "signin") {
                    toast.success("Welcome back!", {
                        description: "Redirecting to Slidish...",
                    });
                }

                setTimeout(() => {
                    router.push(callbackUrl);
                    router.refresh();
                }, 500);
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        await signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className="flex min-h-screen bg-[#faf9f6]">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                <div className="absolute inset-0">
                    <Image
                        src="/auth.png"
                        alt="Slidish Authentication"
                        fill
                        className="object-cover object-left"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10" />
                </div>

                <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full" />
            </div>

            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="bg-white rounded-lg w-10 h-10 flex items-center justify-center overflow-hidden border border-zinc-200 p-1 shadow-lg relative">
                            <Image
                                src="/logo.png"
                                alt="Slidish"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-[#d97706] font-bold text-xl">Slidish</span>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                            {mode === "signin" ? "Sign in to continue" : "Create an account"}
                        </h1>
                        <p className="text-zinc-500">
                            {mode === "signin"
                                ? "Enter your credentials to access Slidish"
                                : "Start your journey with Slidish today"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-zinc-700"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                    <EnvelopeIcon weight="bold" className="size-5" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="pl-10 h-12 rounded-xl border-zinc-200 bg-white focus:border-[#d97706] focus:ring-[#d97706]/20 transition-all"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-zinc-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                    <LockIcon weight="bold" className="size-5" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={
                                        mode === "signin"
                                            ? "Enter your password"
                                            : "Create a strong password"
                                    }
                                    className="pl-10 pr-10 h-12 rounded-xl border-zinc-200 bg-white focus:border-[#d97706] focus:ring-[#d97706]/20 transition-all"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon weight="bold" className="size-5" />
                                    ) : (
                                        <EyeIcon weight="bold" className="size-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !email || !password}
                            className="w-full h-12 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <SpinnerGapIcon className="size-5 animate-spin" />
                                    <span>
                                        {mode === "signin" ? "Signing in..." : "Creating account..."}
                                    </span>
                                </div>
                            ) : mode === "signin" ? (
                                "Sign in"
                            ) : (
                                "Create account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === "signin" ? "signup" : "signin");
                                setError("");
                            }}
                            className="text-sm font-medium text-[#d97706] hover:text-[#b45309] transition-colors"
                        >
                            {mode === "signin"
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </button>
                    </div>

                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#faf9f6] px-2 text-zinc-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={handleGoogleSignIn}
                        className="relative flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#e5e5e5] bg-white text-lg font-medium text-[#1a1a1a] shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md mt-6"
                        variant="ghost"
                    >
                        <GoogleLogoIcon weight="bold" className="h-6 w-6" />
                        Continue with Google
                    </Button>
                    <div className="mt-8 text-center">
                        <p className="text-xs text-zinc-400">
                            By signing in, you agree to our Terms of Service and Privacy
                            Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
