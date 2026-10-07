import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CarCard } from "@/components/CarCard";
import { Notice } from "@/components/Notice";
import { useNotice } from "@/hooks/useNotice";
import { FUEL_TYPES, TRANSMISSIONS } from "@/lib/cars";
import { useCars } from "@/lib/store";

export const Route = createFileRoute("/cars/")({
  head: () => ({
    meta: [
      { title: "All Cars — Search & Filter | CarVerse" },
      {
        name: "description",
        content:
          "Search the CarVerse car list and filter by brand, fuel type, transmission and price to find your next car.",
      },
      { property: "og:title", content: "All Cars — Search & Filter | CarVerse" },
      {
        property: "og:description",
        content: "Search and filter cars by brand, fuel, transmission and price.",
      },
    ],
  }),
  component: CarsPage,
});

function CarsPage() {
  const cars = useCars();
  const { message, notify } = useNotice();

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [maxPrice, setMaxPrice] = useState(100);
  const [sort, setSort] = useState("default");

  const brands = useMemo(
    () => Array.from(new Set(cars.map((c) => c.brand))).sort(),
    [cars],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = cars.filter((c) => {
      const matchesQuery =
        !q || c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q);
      return (
        matchesQuery &&
        (brand === "all" || c.brand === brand) &&
        (fuel === "all" || c.fuel === fuel) &&
        (transmission === "all" || c.transmission === transmission) &&
        c.price <= maxPrice
      );
    });
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cars, query, brand, fuel, transmission, maxPrice, sort]);

  function resetFilters() {
    setQuery("");
    setBrand("all");
    setFuel("all");
    setTransmission("all");
    setMaxPrice(100);
    setSort("default");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">All cars</h1>
      <p className="mt-2 text-sm text-body">
        {results.length} of {cars.length} cars shown.
      </p>

      <div className="mt-6 grid gap-3 rounded-xl border border-line bg-panel p-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="md:col-span-3 lg:col-span-2">
          <label className="label-mono" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            className="field mt-1"
            placeholder="Search by name or brand"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div>
          <label className="label-mono" htmlFor="brand">
            Brand
          </label>
          <select
            id="brand"
            className="field mt-1"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-mono" htmlFor="fuel">
            Fuel
          </label>
          <select
            id="fuel"
            className="field mt-1"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
          >
            <option value="all">All fuels</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-mono" htmlFor="transmission">
            Transmission
          </label>
          <select
            id="transmission"
            className="field mt-1"
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
          >
            <option value="all">All types</option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-mono" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            className="field mt-1"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-5">
          <label className="label-mono" htmlFor="price">
            Max price: ₹{maxPrice}L
          </label>
          <input
            id="price"
            type="range"
            min={5}
            max={100}
            step={1}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-3 w-full accent-accent"
          />
        </div>

        <div className="flex items-end">
          <button onClick={resetFilters} className="btn-ghost w-full">
            Reset
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-xl border border-line bg-panel p-10 text-center">
          <p className="font-extrabold text-ink">No cars match your filters</p>
          <p className="mt-2 text-sm text-body">Try clearing the search or raising the price.</p>
          <button onClick={resetFilters} className="btn-solid mt-5">
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((car) => (
            <CarCard key={car.id} car={car} onMessage={notify} />
          ))}
        </div>
      )}

      <Notice message={message} />
    </div>
  );
}
