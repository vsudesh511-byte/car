import { createFileRoute, Link } from "@tanstack/react-router";
import { CarCard } from "@/components/CarCard";
import { Notice } from "@/components/Notice";
import { useNotice } from "@/hooks/useNotice";
import { useCars } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarVerse — Browse & Compare Cars" },
      {
        name: "description",
        content:
          "CarVerse is a simple car showcase where you can browse cars, read specifications and compare up to three cars side by side.",
      },
      { property: "og:title", content: "CarVerse — Browse & Compare Cars" },
      {
        property: "og:description",
        content: "Browse cars, read full specs and compare up to three cars side by side.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const cars = useCars();
  const { message, notify } = useNotice();
  const featured = cars.slice(0, 6);

  return (
    <div>
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="label-mono">Car showcase &amp; comparison</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
            Find the car that fits, then put it head to head.
          </h1>
          <p className="mt-4 max-w-xl text-base text-body">
            Browse a curated list of cars, check the full specification sheet and compare up to
            three cars side by side — all in one place.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/cars" className="btn-accent">
              Browse cars
            </Link>
            <Link to="/compare" className="btn-ghost">
              Compare cars
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            <div>
              <dt className="label-mono">Cars listed</dt>
              <dd className="mt-1 text-2xl font-extrabold text-ink">{cars.length}</dd>
            </div>
            <div>
              <dt className="label-mono">Brands</dt>
              <dd className="mt-1 text-2xl font-extrabold text-ink">
                {new Set(cars.map((c) => c.brand)).size}
              </dd>
            </div>
            <div>
              <dt className="label-mono">Compare slots</dt>
              <dd className="mt-1 text-2xl font-extrabold text-ink">3</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">Featured cars</h2>
            <p className="mt-1 text-sm text-body">A quick look at some popular picks.</p>
          </div>
          <Link to="/cars" className="btn-ghost">
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} onMessage={notify} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { t: "Search & filter", d: "Find cars by name, brand, fuel type, transmission or price." },
            { t: "Full specs", d: "Engine, mileage, power, seating and key features for every car." },
            { t: "Side-by-side", d: "Compare up to three cars in one clear table." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-line bg-panel p-5">
              <h3 className="text-base font-extrabold tracking-tight text-ink">{f.t}</h3>
              <p className="mt-2 text-sm text-body">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <Notice message={message} />
    </div>
  );
}
