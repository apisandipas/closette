import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupForm } from "@/components/auth/signup-form";
import { isSignupOpen } from "@/lib/auth/functions";

export const Route = createFileRoute("/signup")({
  // Mirrors the sign-up guard in `src/lib/auth`: the form is reachable only
  // when the endpoint behind it would accept the submission, so a stranger
  // gets sent to /login instead of a form that will refuse them.
  beforeLoad: async () => {
    if (!(await isSignupOpen())) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
