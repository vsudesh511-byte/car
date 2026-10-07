import { createFileRoute, Link } from "@tanstack/react-router";
import { Notice } from "@/components/Notice";
import { useNotice } from "@/hooks/useNotice";
import { formatPrice } from "@/lib/cars";
import { toggleCompare, useCars, useCompare } from "@/lib/store";

export const Route = createFileRoute("/cars/$carId")({
  head: () => ({
    meta: [
      { title: "Car Details & Specifications | CarVerse" },
      {
        name: "description",
        content:
          "Full specifications for this car — engine, power, mileage, transmission, seating and key features.",
      },
      { property: "og:title", content: "Car Details & Specifications | CarVerse" },
      {
        property: "og:description",
        content: "Engine, power, mileage, transmission, seating and features for this car.",
      },
    ],
  }),
  component: CarDetail,
});

function CarDetail() {
  const { carId } = Route.useParams();
  const cars = useCars();
  const compare = useCompare();
  const { message, notify } = useNotice();

  const car = cars.find((c) => c.id === carId);

  if (!car) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Car not found</h1>
        <p className="mt-2 text-sm text-body">This car may have been removed by the admin.</p>
        <Link to="/cars" className="btn-solid mt-6">
          Back to all cars
        </Link>
      </div>
    );
  }

  const specs = [
    ["Brand", car.brand],
    ["Price", formatPrice(car.price)],
    ["Engine", car.engine],
    ["Power", car.horsepower],
    ["Mileage", car.mileage],
    ["Fuel", car.fuel],
    ["Transmission", car.transmission],
    ["Seating", `${car.seating} seats`],
  ];

  const similar = cars.filter((c) => c.id !== car.id && c.brand === car.brand).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/cars" className="label-mono hover:text-ink">
        ← Back to cars
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <img
          src={car.image}
          alt={`${car.name} car photo`}
          className="w-full rounded-xl border border-line object-cover"
        />

        <div>
          <p className="label-mono">{car.brand}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{car.name}</h1>
          <p className="mt-2 font-mono text-lg font-semibold text-accent">
            {formatPrice(car.price)}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-body">{car.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => notify(toggleCompare(car.id))} className="btn-accent">
              {compare.includes(car.id) ? "Remove from compare" : "Add to compare"}
            </button>
            <Link to="/compare" className="btn-ghost">
              Go to compare ({compare.length})
            </Link>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
            {specs.map(([k, v]) => (
              <div key={k} className="border-b border-line pb-2">
                <dt className="label-mono">{k}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-base font-extrabold tracking-tight text-ink">Key features</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {car.features.map((f) => (
              <li
                key={f}
                className="rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-body"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">
            More from {car.brand}
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => (
              <Link
                key={c.id}
                to="/cars/$carId"
                params={{ carId: c.id }}
                className="overflow-hidden rounded-xl border border-line bg-panel"
              >
                <img
                  src={c.image}
                  alt={`${c.name} car photo`}
                  loading="lazy"
                  className="h-36 w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-sm font-extrabold text-ink">{c.name}</p>
                  <p className="mt-1 font-mono text-xs text-accent">{formatPrice(c.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Notice message={message} />
    </div>
  );
}
