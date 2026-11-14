import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ApiError, PHP_API, errorMessage, request } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CarVerse — Send a Message" },
      {
        name: "description",
        content:
          "Send a message to the CarVerse team with your questions or feedback about the car showcase and comparison project.",
      },
      { property: "og:title", content: "Contact CarVerse — Send a Message" },
      {
        property: "og:description",
        content: "Questions or feedback about CarVerse? Send a message here.",
      },
    ],
  }),
  component: ContactPage,
});

type Errors = { name?: string; email?: string; subject?: string; message?: string };

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!form.subject.trim()) next.subject = "Please enter a subject.";
    if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    setServerError(null);
    try {
      await request(`${PHP_API}/contact.php`, { method: "POST", body: form });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const fields = err instanceof ApiError ? (err.data as { fields?: Errors } | null)?.fields : null;
      if (fields) setErrors(fields);
      setServerError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Contact us</h1>
      <p className="mt-2 text-sm text-body">
        Have a question about a car or the project? Send a message below.
      </p>

      {sent && (
        <div className="mt-6 rounded-xl border border-line bg-panel p-4">
          <p className="text-sm font-extrabold text-ink">
            Thank you! Your message has been submitted successfully.
          </p>
          <p className="mt-1 text-sm text-body">
            It has been saved by the PHP service and the admin can read it on the dashboard.
          </p>
        </div>
      )}

      {serverError && (
        <p className="mt-6 rounded-xl border border-line bg-panel p-4 text-sm font-semibold text-destructive">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-xl border border-line bg-panel p-5">
        <div>
          <label className="label-mono" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="field mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
          />
          {errors.name && <p className="mt-1 text-xs font-semibold text-destructive">{errors.name}</p>}
        </div>

        <div>
          <label className="label-mono" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="field mt-1"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs font-semibold text-destructive">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="label-mono" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            className="field mt-1"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="What is this about?"
          />
          {errors.subject && (
            <p className="mt-1 text-xs font-semibold text-destructive">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="label-mono" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="field mt-1"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Write your message here"
          />
          {errors.message && (
            <p className="mt-1 text-xs font-semibold text-destructive">{errors.message}</p>
          )}
        </div>

        <div>
          <button type="submit" className="btn-accent" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["Email", "hello@carverse.demo"],
          ["Phone", "+91 90000 00000"],
          ["Address", "Campus Road, Pune, India"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-panel p-4">
            <p className="label-mono">{k}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-body">
        The contact details above are placeholders — send me the real ones and I&apos;ll swap them in.
      </p>
    </div>
  );
}
