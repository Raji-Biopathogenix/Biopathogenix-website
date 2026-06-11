import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* ================= FORM ================= */}
        <div>
          <h1 className="text-5xl font-semibold text-[#003B5C] mb-10">
            Contact Us
          </h1>

          <form className="space-y-6">

            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="First Name" required />
              <Field label="Last Name" required />
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Email" required type="email" />
              <Field label="Phone" />
            </div>

            {/* Subject */}
            <Field label="Subject" required />

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-[#003B5C] mb-2">
                Message <span className="text-blue-600">*</span>
              </label>
              <textarea
                rows={6}
                className="w-full rounded-md border border-gray-200 bg-[#f4f9fc] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#0b84d8] hover:bg-[#086fb6] text-white px-6 py-3 rounded-md font-medium transition"
            >
              Send Message <ArrowRight size={18} />
            </button>

          </form>
        </div>

        {/* ================= INFO CARD ================= */}
        <div className="relative rounded-2xl overflow-hidden">

          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b5fa5] via-[#0b84d8] to-[#6fb7e9]" />

          {/* Subtle pattern overlay without external asset dependency */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Content */}
          <div className="relative p-10 text-white">

            <h2 className="text-3xl font-semibold mb-10">
              Our Information
            </h2>

            <InfoRow
              icon={<Mail size={22} />}
              label="Email"
              value="order@biopathogenix.com"
            />

            <InfoRow
              icon={<Phone size={22} />}
              label="Phone"
              value="(859) 444-5660"
            />

            <InfoRow
              icon={<MapPin size={22} />}
              label="Location"
              value={`120 Dewey Drive STE 126,\nNicholasville, KY 40356`}
            />

            <InfoRow
              icon={<Clock size={22} />}
              label="Hours"
              value={`Monday - Friday: 9am–5pm\nSaturday: Closed\nSunday: Closed`}
            />

          </div>
        </div>

      </div>
    </section>
  );
}

/* ---------------- Field Component ---------------- */

function Field({
  label,
  required,
  type = "text",
}: {
  label: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#003B5C] mb-2">
        {label} {required && <span className="text-blue-600">*</span>}
      </label>
      <input
        type={type}
        className="w-full rounded-md border border-gray-200 bg-[#f4f9fc] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

/* ---------------- Info Row Component ---------------- */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 mb-8">
      <div className="mt-1 text-white/90">{icon}</div>

      <div>
        <p className="text-xs uppercase tracking-wide text-white/70 mb-1">
          {label}
        </p>
        <p className="whitespace-pre-line font-medium leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );
}
