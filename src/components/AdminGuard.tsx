import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/store";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { loggedIn, ready } = useAuth();

  if (!ready) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-body">Loading…</div>;
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Admin only</h1>
        <p className="mt-2 text-sm text-body">Please log in to open this page.</p>
        <Link to="/admin" className="btn-solid mt-6">
          Go to login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
