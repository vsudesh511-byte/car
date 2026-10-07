import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCompare, useAuth, logout } from "@/lib/store";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Cars" },
  { to: "/compare", label: "Compare" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const compare = useCompare();
  const { loggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-panel/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-base font-extrabold text-ink-foreground">
            Veer
          </span>
          <span className="text-base font-extrabold tracking-tight text-ink">CarVerse</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-secondary text-ink" }}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-body hover:text-ink"
            >
              {l.label}
              {l.to === "/compare" && compare.length > 0 ? ` (${compare.length})` : ""}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loggedIn ? (
            <>
              <Link to="/admin/dashboard" className="hidden btn-ghost md:inline-flex">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="btn-solid"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin" className="btn-solid">
              Admin
            </Link>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="btn-ghost md:hidden"
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-panel px-4 py-2 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2 text-sm font-semibold text-body hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
