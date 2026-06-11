"use client";

export default function QualityControlValidationKits() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#0B3C5D] mb-10">
          Quality Control and Validation Kits
        </h1>

        {/* Top Divider */}
        <div className="h-px w-full bg-blue-200 mb-14" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-[#0B3C5D]">

          {/* Column 1 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-medium leading-tight">
              qPCR Quality
              <br />
              Control <span className="font-semibold">NEW!</span>
            </h3>

            <a
              href="#"
              className="inline-block text-blue-600 underline underline-offset-4 hover:text-blue-700"
            >
              BPX™ External Positive Control
            </a>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-medium leading-tight">
              Semi-Quant
              <br />
              Verification
              <br />
              Kits <span className="font-light">Coming Soon!</span>
            </h3>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-medium leading-tight">
              Validation
              <br />
              Sets <span className="font-light">Coming Soon!</span>
            </h3>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-medium leading-tight">
              Inclusivity
              <br />
              Sets <span className="font-light">Coming Soon!</span>
            </h3>
          </div>

        </div>

        {/* Bottom Divider */}
        <div className="h-px w-full bg-blue-200 mt-16" />

      </div>
    </section>
  );
}
