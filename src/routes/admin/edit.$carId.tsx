import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminGuard } from "@/components/AdminGuard";
import { CarForm } from "@/components/CarForm";
import { updateCar, useCars } from "@/lib/store";

export const Route = createFileRoute("/admin/edit/$carId")({
  head: () => ({
    meta: [
      { title: "Edit Car Details | CarVerse Admin" },
      {
        name: "description",
        content: "Update a car's price, engine, mileage, transmission, features and photo.",
      },
      { property: "og:title", content: "Edit Car Details | CarVerse Admin" },
      { property: "og:description", content: "Update the details of a car in the CarVerse list." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <EditCar />
    </AdminGuard>
  ),
});

function EditCar() {
  const { carId } = Route.useParams();
  const navigate = useNavigate();
  const cars = useCars();
  const car = cars.find((c) => c.id === carId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/admin/dashboard" className="label-mono hover:text-ink">
        ← Back to dashboard
      </Link>

      {!car ? (
        <div className="mt-8 rounded-xl border border-line bg-panel p-8 text-center">
          <p className="font-extrabold text-ink">Car not found</p>
          <p className="mt-2 text-sm text-body">It may have been deleted already.</p>
        </div>
      ) : (
        <>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Edit car</h1>
          <p className="mt-2 text-sm text-body">Editing {car.name}.</p>
          <div className="mt-6">
            <CarForm
              key={car.id}
              initial={{ ...car }}
              submitLabel="Save changes"
              onSubmit={(values) => {
                updateCar(car.id, values);
                navigate({ to: "/admin/dashboard" });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
