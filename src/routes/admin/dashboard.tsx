import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { Notice } from "@/components/Notice";
import { useNotice } from "@/hooks/useNotice";
import { PHP_API, PYTHON_API, errorMessage, request } from "@/lib/api";
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

type Stats = {
  total: number;
  brands: number;
  average_price: number;
  cheapest: string | null;
  most_expensive: string | null;
  by_fuel: Record<string, number>;
};

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

/** Dashboard numbers come from the Python service; they reload whenever the car list changes. */
function useStats(cars: unknown[]) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    request<Stats>(`${PYTHON_API}/stats`)
      .then((s) => {
        setStats(s);
        setError(null);
      })
      .catch((e) => setError(errorMessage(e)));
  }, [cars]);
  return { stats, error };
}

/** Contact form messages are stored and served by the PHP service. */
function useMessages() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = () =>
    request<Message[]>(`${PHP_API}/contact.php`, { admin: true })
      .then((m) => {
        setMessages(m);
        setError(null);
      })
      .catch((e) => setError(errorMessage(e)));
  useEffect(() => {
    void reload();
  }, []);
  return { messages, error, reload };
}

function Dashboard() {
  const cars = useCars();
  const { message, notify } = useNotice();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { stats, error: statsError } = useStats(cars);
  const inbox = useMessages();

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      notify(success);
    } catch (e) {
      notify(errorMessage(e));
    }
  }

  async function deleteMessage(id: number) {
    await run(
      () => request(`${PHP_API}/contact.php?id=${id}`, { method: "DELETE", admin: true }),
      "Message deleted",
    );
    void inbox.reload();
  }

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
            onClick={() => run(resetCars, "Car list reset to sample data")}
            className="btn-ghost"
          >
            Reset to sample data
          </button>
        </div>
      </div>

      <p className="label-mono mt-8">Statistics · Python service</p>
      {statsError ? (
        <p className="mt-2 text-sm font-semibold text-destructive">{statsError}</p>
      ) : (
        <>
          <dl className="mt-2 grid gap-4 sm:grid-cols-3">
            {[
              ["Total cars", stats ? String(stats.total) : "…"],
              ["Brands", stats ? String(stats.brands) : "…"],
              ["Average price", stats ? `₹${stats.average_price}L` : "…"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-panel p-5">
                <dt className="label-mono">{k}</dt>
                <dd className="mt-1 text-2xl font-extrabold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          {stats && stats.total > 0 && (
            <p className="mt-3 text-sm text-body">
              Cheapest: <span className="font-semibold text-ink">{stats.cheapest}</span> · Most
              expensive: <span className="font-semibold text-ink">{stats.most_expensive}</span> · By
              fuel:{" "}
              <span className="font-semibold text-ink">
                {Object.entries(stats.by_fuel)
                  .map(([fuel, n]) => `${fuel} ${n}`)
                  .join(", ")}
              </span>
            </p>
          )}
        </>
      )}

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
                            setConfirmId(null);
                            void run(() => deleteCar(c.id), "Car deleted");
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

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <p className="label-mono">Inbox · PHP service</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">Contact messages</h2>
        </div>
        <button onClick={() => void inbox.reload()} className="btn-ghost">
          Refresh
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {inbox.error && <p className="text-sm font-semibold text-destructive">{inbox.error}</p>}
        {!inbox.error && !inbox.messages && <p className="text-sm text-body">Loading messages…</p>}
        {inbox.messages?.length === 0 && (
          <p className="rounded-xl border border-line bg-panel p-5 text-sm text-body">
            No messages yet. They appear here when someone uses the contact form.
          </p>
        )}
        {inbox.messages?.map((m) => (
          <article key={m.id} className="rounded-xl border border-line bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-extrabold text-ink">{m.subject}</p>
                <p className="text-xs text-body">
                  {m.name} · {m.email} · {m.created_at} UTC
                </p>
              </div>
              <button
                onClick={() => void deleteMessage(m.id)}
                className="btn-ghost !px-3 !py-1.5 !text-xs"
              >
                Delete
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-body">{m.message}</p>
          </article>
        ))}
      </div>

      <Notice message={message} />
    </div>
  );
}
