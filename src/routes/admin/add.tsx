import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminGuard } from "@/components/AdminGuard";
import { CarForm } from "@/components/CarForm";
import { addCar } from "@/lib/store";

export const Route = createFileRoute("/admin/add")({
  head: () => ({
    meta: [
      { title: "Add a New Car | CarVerse Admin" },
      {
        name: "description",
        content: "Add a new car with price, engine, mileage, transmission and features to CarVerse.",
      },
      { property: "og:title", content: "Add a New Car | CarVerse Admin" },
      { property: "og:description", content: "Add a new car to the CarVerse showcase." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <AddCar />
    </AdminGuard>
  ),
});

function AddCar() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/admin/dashboard" className="label-mono hover:text-ink">
        ← Back to dashboard
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Add a car</h1>
      <p className="mt-2 text-sm text-body">The new car appears on the website right away.</p>

      <div className="mt-6">
        <CarForm
          submitLabel="Add car"
          onSubmit={(values) => {
            addCar(values);
            navigate({ to: "/admin/dashboard" });
          }}
        />
      </div>
    </div>
  );
}
