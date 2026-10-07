import { Link } from "@tanstack/react-router";
import { formatPrice, type Car } from "@/lib/cars";
import { toggleCompare, useCompare } from "@/lib/store";

export function CarCard({ car, onMessage }: { car: Car; onMessage?: (m: string) => void }) {
  const compare = useCompare();
  const inCompare = compare.includes(car.id);

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-panel">
      <Link to="/cars/$carId" params={{ carId: car.id }} className="block">
        <img
          src={car.image}
          alt={`${car.name} car photo`}
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      </Link>
      <div className="p-4">
        <p className="label-mono">{car.brand}</p>
        <h3 className="mt-1 text-base font-extrabold tracking-tight text-ink">{car.name}</h3>
        <p className="mt-1 text-sm text-body">
          {car.fuel} · {car.transmission} · {car.mileage}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-semibold text-accent">
            {formatPrice(car.price)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onMessage?.(toggleCompare(car.id))}
              className="btn-ghost !px-3 !py-1.5 !text-xs"
            >
              {inCompare ? "Remove" : "Compare"}
            </button>
            <Link
              to="/cars/$carId"
              params={{ carId: car.id }}
              className="btn-solid !px-3 !py-1.5 !text-xs"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
