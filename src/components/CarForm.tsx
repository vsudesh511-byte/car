import { useState } from "react";
import { FUEL_TYPES, TRANSMISSIONS, defaultCars, type Car } from "@/lib/cars";

export type CarFormValues = Omit<Car, "id">;

const fallbackImage = defaultCars[0]?.image ?? "";

const empty: CarFormValues = {
  name: "",
  brand: "",
  price: 0,
  mileage: "",
  fuel: "Petrol",
  transmission: "Manual",
  engine: "",
  seating: 5,
  horsepower: "",
  description: "",
  features: [],
  image: fallbackImage,
};

export function CarForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: CarFormValues;
  submitLabel: string;
  onSubmit: (values: CarFormValues) => void;
}) {
  const [values, setValues] = useState<CarFormValues>(initial ?? empty);
  const [featureText, setFeatureText] = useState((initial?.features ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof CarFormValues>(key: K, value: CarFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim() || !values.brand.trim()) {
      setError("Car name and brand are required.");
      return;
    }
    if (!values.price || values.price <= 0) {
      setError("Enter a price greater than 0 (in lakh).");
      return;
    }
    setError(null);
    onSubmit({
      ...values,
      name: values.name.trim(),
      brand: values.brand.trim(),
      image: values.image.trim() || fallbackImage,
      features: featureText
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border border-line bg-panel p-5">
      {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Car name" id="name">
          <input
            id="name"
            className="field"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Honda City VX"
          />
        </Field>

        <Field label="Brand" id="brand">
          <input
            id="brand"
            className="field"
            value={values.brand}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="e.g. Honda"
          />
        </Field>

        <Field label="Price (₹ lakh)" id="price">
          <input
            id="price"
            type="number"
            step="0.1"
            min="0"
            className="field"
            value={values.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </Field>

        <Field label="Mileage" id="mileage">
          <input
            id="mileage"
            className="field"
            value={values.mileage}
            onChange={(e) => set("mileage", e.target.value)}
            placeholder="e.g. 18.5 kmpl"
          />
        </Field>

        <Field label="Fuel type" id="fuel">
          <select
            id="fuel"
            className="field"
            value={values.fuel}
            onChange={(e) => set("fuel", e.target.value)}
          >
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Transmission" id="transmission">
          <select
            id="transmission"
            className="field"
            value={values.transmission}
            onChange={(e) => set("transmission", e.target.value)}
          >
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Engine" id="engine">
          <input
            id="engine"
            className="field"
            value={values.engine}
            onChange={(e) => set("engine", e.target.value)}
            placeholder="e.g. 1498 cc"
          />
        </Field>

        <Field label="Power" id="horsepower">
          <input
            id="horsepower"
            className="field"
            value={values.horsepower}
            onChange={(e) => set("horsepower", e.target.value)}
            placeholder="e.g. 121 hp"
          />
        </Field>

        <Field label="Seating" id="seating">
          <input
            id="seating"
            type="number"
            min="2"
            max="9"
            className="field"
            value={values.seating}
            onChange={(e) => set("seating", Number(e.target.value))}
          />
        </Field>

        <Field label="Image (pick one)" id="image">
          <select
            id="image"
            className="field"
            value={values.image}
            onChange={(e) => set("image", e.target.value)}
          >
            {defaultCars.map((c) => (
              <option key={c.id} value={c.image}>
                {c.name}
              </option>
            ))}
            {!defaultCars.some((c) => c.image === values.image) && (
              <option value={values.image}>Current image</option>
            )}
          </select>
        </Field>

        <Field label="Or image URL / path" id="imageUrl">
          <input
            id="imageUrl"
            className="field"
            value={defaultCars.some((c) => c.image === values.image) ? "" : values.image}
            onChange={(e) => {
              const v = e.target.value;
              if (v.trim()) set("image", v.trim());
            }}
            placeholder="https://example.com/car.jpg"
          />
        </Field>
      </div>

      <Field label="Description" id="description">
        <textarea
          id="description"
          rows={3}
          className="field"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short summary of the car"
        />
      </Field>

      <Field label="Features (comma separated)" id="features">
        <input
          id="features"
          className="field"
          value={featureText}
          onChange={(e) => setFeatureText(e.target.value)}
          placeholder="Sunroof, 6 airbags, Cruise control"
        />
      </Field>

      {values.image && (
        <img
          src={values.image}
          alt="Selected car preview"
          className="h-40 w-full rounded-md border border-line object-cover sm:w-72"
        />
      )}

      <div>
        <button type="submit" className="btn-accent">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label-mono" htmlFor={id}>
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
