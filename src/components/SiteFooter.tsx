import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-body md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-ink">CarVerse — Car Showcase &amp; Comparison</p>
        <div className="flex gap-4">
          <Link to="/cars" className="hover:text-ink">
            Cars
          </Link>
          <Link to="/compare" className="hover:text-ink">
            Compare
          </Link>
          <Link to="/about" className="hover:text-ink">
            About
          </Link>
          <Link to="/contact" className="hover:text-ink">
            Contact
          </Link>
        </div>
        <p className="label-mono">College project · Static demo data</p>
      </div>
    </footer>
  );
}
