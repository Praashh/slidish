import { Suspense } from "react";
import { SignInForm } from "@/components/auth";


function SignInLoadingFallback() {
  return (
    <div className="flex min-h-screen bg-[#faf9f6] items-center justify-center">
      <div className="w-full max-w-md p-8 animate-pulse">
        <div className="h-8 bg-zinc-200 rounded-lg w-48 mx-auto mb-4" />
        <div className="h-4 bg-zinc-200 rounded w-64 mx-auto mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-zinc-200 rounded-xl" />
          <div className="h-12 bg-zinc-200 rounded-xl" />
          <div className="h-12 bg-zinc-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}


export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoadingFallback />}>
      <SignInForm />
    </Suspense>
  );
}
