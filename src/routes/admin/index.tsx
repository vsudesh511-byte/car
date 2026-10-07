import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ADMIN_PASSWORD, ADMIN_USERNAME, login, useAuth } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Login | CarVerse" },
      {
        name: "description",
        content: "Sign in to the CarVerse admin area to add, edit or delete cars in the showcase.",
      },
      { property: "og:title", content: "Admin Login | CarVerse" },
      { property: "og:description", content: "Sign in to manage the CarVerse car list." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { loggedIn, ready } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && loggedIn) navigate({ to: "/admin/dashboard" });
  }, [ready, loggedIn, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(username, password)) {
      setError(null);
      navigate({ to: "/admin/dashboard" });
    } else {
      setError("Wrong username or password.");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Admin login</h1>
      <p className="mt-2 text-sm text-body">Sign in to manage the car list.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-xl border border-line bg-panel p-5">
        {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
        <div>
          <label className="label-mono" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="field mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={ADMIN_USERNAME}
          />
        </div>
        <div>
          <label className="label-mono" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="field mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn-accent">
          Login
        </button>
      </form>

      <p className="mt-4 text-xs text-body">
        Demo credentials: <span className="font-mono text-ink">{ADMIN_USERNAME}</span> /{" "}
        <span className="font-mono text-ink">{ADMIN_PASSWORD}</span>
      </p>
    </div>
  );
}
