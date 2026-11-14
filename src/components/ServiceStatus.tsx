import { useCarsStatus } from "@/lib/store";

/** Shows a red bar when the Java API cannot be reached, so it is obvious during a demo. */
export function ServiceStatus() {
  const { error } = useCarsStatus();
  if (!error) return null;
  return (
    <div className="border-b border-line bg-destructive/10 px-4 py-2 text-center text-sm font-semibold text-destructive">
      Could not load cars: {error} Start it with the steps in README.md and refresh.
    </div>
  );
}
