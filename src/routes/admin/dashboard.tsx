import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { Notice } from "@/components/Notice";
import { useNotice } from "@/hooks/useNotice";
import { formatPrice } from "@/lib/cars";
import { deleteCar, resetCars, useCars } from "@/lib/store";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Manage Cars | CarVerse" },
      {
        name: "description",
        content: "CarVerse admin dashboard: add new cars, edit existing details and remove cars.",
      },
      { property: "og:title", content: "Admin Dashboard — Manage Cars | CarVerse" },
      { property: "og:description", content: "Add, edit and remove cars in the CarVerse list." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <Dashboard />
    </AdminGuard>
  ),
});

function Dashboard() {
  const cars = useCars();
  const { message, notify } = useNotice();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const brands = new Set(cars.map((c) => c.brand)).size;
  const avg = cars.length
    ? (cars.reduce((s, c) => s + c.price, 0) / cars.length).toFixed(1)
    : "0";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono">Admin</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-2 text-sm text-body">Manage the cars shown on the website.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/add" className="btn-accent">
            Add car
          </Link>
          <button
            onClick={() => {
              resetCars();
              notify("Car list reset to sample data");
            }}
            className="btn-ghost"
          >
            Reset to sample data
          </button>
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Total cars", String(cars.length)],
          ["Brands", String(brands)],
          ["Average price", `₹${avg}L`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-panel p-5">
            <dt className="label-mono">{k}</dt>
            <dd className="mt-1 text-2xl font-extrabold text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-panel">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="label-mono p-4">Car</th>
              <th className="label-mono p-4">Brand</th>
              <th className="label-mono p-4">Price</th>
              <th className="label-mono p-4">Fuel</th>
              <th className="label-mono p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.image}
                      alt={`${c.name} car photo`}
                      className="h-10 w-16 rounded object-cover"
                    />
                    <span className="font-semibold text-ink">{c.name}</span>
                  </div>
                </td>
                <td className="p-4 text-body">{c.brand}</td>
                <td className="p-4 font-mono text-body">{formatPrice(c.price)}</td>
                <td className="p-4 text-body">{c.fuel}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/admin/edit/$carId"
                      params={{ carId: c.id }}
                      className="btn-ghost !px-3 !py-1.5 !text-xs"
                    >
                      Edit
                    </Link>
                    {confirmId === c.id ? (
                      <>
                        <button
                          onClick={() => {
                            deleteCar(c.id);
                            setConfirmId(null);
                            notify("Car deleted");
                          }}
                          className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="btn-ghost !px-3 !py-1.5 !text-xs"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmId(c.id)}
                        className="btn-ghost !px-3 !py-1.5 !text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-body">
                  No cars left. Add one or reset to sample data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Notice message={message} />
    </div>
  );
}
