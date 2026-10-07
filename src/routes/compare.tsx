import { createFileRoute, Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/cars";
import { MAX_COMPARE, useCars, useCompare, writeCompare } from "@/lib/store";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Cars Side by Side | CarVerse" },
      {
        name: "description",
        content:
          "Compare up to three cars side by side on price, engine, power, mileage, transmission, seating and features.",
      },
      { property: "og:title", content: "Compare Cars Side by Side | CarVerse" },
      {
        property: "og:description",
        content: "Put up to three cars head to head on price, engine, mileage and features.",
      },
    ],
  }),
  component: ComparePage,
});

const rows = [
  ["Price", (c: any) => formatPrice(c.price)],
  ["Brand", (c: any) => c.brand],
  ["Engine", (c: any) => c.engine],
  ["Power", (c: any) => c.horsepower],
  ["Mileage", (c: any) => c.mileage],
  ["Fuel", (c: any) => c.fuel],
  ["Transmission", (c: any) => c.transmission],
  ["Seating", (c: any) => `${c.seating} seats`],
  ["Features", (c: any) => c.features.join(", ")],
] as const;

function ComparePage() {
  const cars = useCars();
  const compare = useCompare();
  const selected = compare
    .map((id) => cars.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Compare cars</h1>
      <p className="mt-2 text-sm text-body">
        Add up to {MAX_COMPARE} cars from the car list, then check them side by side.
      </p>

      {selected.length === 0 ? (
        <div className="mt-10 rounded-xl border border-line bg-panel p-10 text-center">
          <p className="font-extrabold text-ink">Nothing to compare yet</p>
          <p className="mt-2 text-sm text-body">
            Pick cars using the &quot;Compare&quot; button on any car card.
          </p>
          <Link to="/cars" className="btn-solid mt-5">
            Browse cars
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex justify-end">
            <button onClick={() => writeCompare([])} className="btn-ghost">
              Clear all
            </button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-panel">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="label-mono p-4">Specification</th>
                  {selected.map((c) => (
                    <th key={c.id} className="p-4 align-top">
                      <img
                        src={c.image}
                        alt={`${c.name} car photo`}
                        className="mb-2 h-24 w-full rounded-md object-cover"
                      />
                      <span className="block font-extrabold text-ink">{c.name}</span>
                      <button
                        onClick={() => writeCompare(compare.filter((id) => id !== c.id))}
                        className="mt-2 text-xs font-semibold text-accent hover:underline"
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, get]) => (
                  <tr key={label} className="border-b border-line last:border-0">
                    <td className="label-mono p-4">{label}</td>
                    {selected.map((c) => (
                      <td key={c.id} className="p-4 font-semibold text-ink">
                        {get(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected.length < MAX_COMPARE && (
            <div className="mt-6">
              <Link to="/cars" className="btn-ghost">
                Add another car
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
