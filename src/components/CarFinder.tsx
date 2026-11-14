import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PYTHON_API, errorMessage, request } from "@/lib/api";
import { FUEL_TYPES, imageUrl, type Car } from "@/lib/cars";

type Recommendation = { car: Car; score: number; reason: string };
type Response = { results: Recommendation[]; message: string };

/** "Find my car" form. The Python service scores the cars and returns the top 3. */
export function CarFinder() {
  const [budget, setBudget] = useState("30");
  const [fuel, setFuel] = useState("any");
  const [seating, setSeating] = useState("5");
  const [priority, setPriority] = useState("value");
  const [result, setResult] = useState<Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ budget, fuel, seating, priority });
      setResult(await request<Response>(`${PYTHON_API}/recommend?${params}`));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-xl border border-line bg-panel p-5">
        <p className="label-mono">Find my car · Python service</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
          Not sure which car? Get a recommendation.
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-5">
          <label className="grid gap-1">
            <span className="label-mono">Budget (₹ lakh)</span>
            <select className="field" value={budget} onChange={(e) => setBudget(e.target.value)}>
              {["10", "15", "20", "30", "50", "100"].map((b) => (
                <option key={b} value={b}>
                  Up to ₹{b}L
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="label-mono">Fuel</span>
            <select className="field" value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="any">Any</option>
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="label-mono">Seats</span>
            <select className="field" value={seating} onChange={(e) => setSeating(e.target.value)}>
              <option value="5">5 or more</option>
              <option value="7">7 or more</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="label-mono">Most important</span>
            <select
              className="field"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="value">Low price</option>
              <option value="mileage">Mileage</option>
              <option value="power">Power</option>
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="btn-accent w-full" disabled={loading}>
              {loading ? "Finding…" : "Find my car"}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-sm font-semibold text-destructive">{error}</p>}

        {result && (
          <div className="mt-5">
            <p className="text-sm text-body">{result.message}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {result.results.map(({ car, score, reason }, i) => (
                <Link
                  key={car.id}
                  to="/cars/$carId"
                  params={{ carId: car.id }}
                  className="flex gap-3 rounded-lg border border-line p-3 hover:border-ink"
                >
                  <img
                    src={imageUrl(car.image)}
                    alt={`${car.name} car photo`}
                    className="h-16 w-24 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="label-mono">
                      #{i + 1} · Match {score}%
                    </p>
                    <p className="truncate font-extrabold text-ink">{car.name}</p>
                    <p className="text-xs text-body">{reason}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
