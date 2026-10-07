export function Notice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground shadow-lg"
    >
      {message}
    </div>
  );
}
