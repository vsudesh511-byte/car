import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CarVerse — Project Overview" },
      {
        name: "description",
        content:
          "About CarVerse: a final-year college project built with React, Vite, TypeScript and Tailwind CSS using static car data and browser storage.",
      },
      { property: "og:title", content: "About CarVerse — Project Overview" },
      {
        property: "og:description",
        content: "A simple car showcase and comparison project built with React and Tailwind CSS.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">About CarVerse</h1>
      <p className="mt-4 text-sm leading-relaxed text-body">
        CarVerse is a simple car showcase and comparison website. Visitors can browse a list of
        cars, search and filter them, open a full specification page for any car, and compare up to
        three cars side by side in one table.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-body">
        It was built as a final-year college project, so the focus is on a clean interface and
        features that are easy to demonstrate and explain.
      </p>

      <h2 className="mt-10 text-xl font-extrabold tracking-tight text-ink">What it does</h2>
      <ul className="mt-4 space-y-2 text-sm text-body">
        {[
          "Home page with featured cars and quick highlights",
          "Car list with search, brand / fuel / transmission filters, price range and sorting",
          "Car detail page with full specifications and key features",
          "Comparison table for up to three cars",
          "Contact form with validation",
          "Admin area to add, edit and delete cars",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-accent">▪</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-extrabold tracking-tight text-ink">How it is built</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["React + TypeScript", "Component-based interface with type safety."],
          ["Tailwind CSS", "Styling through a small set of design tokens."],
          ["Static sample data", "Car details are stored in the project, no server needed."],
          ["Browser storage", "Admin changes are saved in the browser and stay after refresh."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-line bg-panel p-4">
            <p className="text-sm font-extrabold text-ink">{t}</p>
            <p className="mt-1 text-sm text-body">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-line bg-panel p-5">
        <p className="label-mono">Demo admin login</p>
        <p className="mt-2 text-sm text-body">
          Username <span className="font-mono font-semibold text-ink">admin</span> · Password{" "}
          <span className="font-mono font-semibold text-ink">admin123</span>
        </p>
      </div>
    </div>
  );
}
