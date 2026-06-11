import Image from "next/image";

export default function CatalogDownload() {
  return (
    <section className="py-24">
      <div className="max-w-[1400px] mx-auto px-6 relative">
        
        {/* MAIN BLUE SECTION */}
        <div
          className="relative rounded-[28px]"
          style={{
            backgroundImage:
              "url('/images/home/download-section-bg-image.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#1e7fc8]/70 rounded-[28px]" />

          {/* CONTENT (defines height naturally) */}
          <div className="relative px-16 py-20 max-w-[820px]">
            <h2 className="text-[36px] font-semibold text-white mb-6 leading-[1.2]">
              Download our 2026 <br /> Product Catalog
            </h2>

            <p className="text-[16px] text-white/90 max-w-[520px] mb-10 leading-[1.6]">
              Fill out the form below to get instant access to our full product
              catalog of high-quality laboratory supplies.
            </p>

            {/* FORM */}
            <form className="space-y-6 max-w-[560px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  className="h-[52px] px-4 rounded-md bg-white text-[16px] text-[#0b2e59] placeholder:text-gray-500 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="h-[52px] px-4 rounded-md bg-white text-[16px] text-[#0b2e59] placeholder:text-gray-500 outline-none"
                  required
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="h-[52px] px-4 rounded-md bg-white text-[16px] text-[#0b2e59] placeholder:text-gray-500 outline-none w-full"
                required
              />

              <button
                type="submit"
                className="inline-flex items-center gap-3 bg-[#062a4d] text-white text-[14px] font-medium px-6 py-3 rounded-md hover:bg-[#041d36] transition"
              >
                Download the Catalog ⬇
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT CATALOG IMAGE (OUTSIDE SECTION FLOW) */}
        <div className="hidden lg:block absolute top-[-60px] right-[40px]">
          <Image
            src="/images/home/updated-2026-biopathogenix-product-catalog-cover-for-website.png"
            alt="2026 Product Catalog"
            width={460}
            height={620}
            className="drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
