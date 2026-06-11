import CatalogDownload from "@/components/home/CatalogDownload";
import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    title: "Respiratory viruses are climbing in U.S. schools",
    date: "January 6, 2026",
    excerpt:
      "As we enter December 2025, multiple respiratory viruses are surfacing simultaneously...",
    image:
      "https://biopathogenix.com/wp-content/uploads/2025/10/flu-season-cover-article-300x225.jpg",
    link: "#",
  },
  {
    title: "Exploring Influenza’s Turbulent History",
    date: "November 26, 2025",
    excerpt:
      "Discover influenza’s turbulent history, trends and treatment breakthroughs...",
    image:
      "https://biopathogenix.com/wp-content/uploads/2024/03/sick-day-2024-11-26-06-11-09-utc-300x200.jpg",
    link: "#",
  },
  {
    title: "🎃 Community Moments: Trunk or Treat Fun! 🍬",
    date: "November 3, 2025",
    excerpt:
      "This past week, the BioPathogenix team joined in the local Trunk or Treat celebration...",
    image:
      "https://biopathogenix.com/wp-content/uploads/2025/11/bpx-trunk-or-treat-optimized_4-225x300.jpg",
    link: "#",
  },
  {
    title:
      "BioPathogenix Launches the “qPCR & Pathogen Detection Circle”",
    date: "October 15, 2025",
    excerpt:
      "An open forum for knowledge exchange and technical refinement...",
    image:
      "https://biopathogenix.com/wp-content/uploads/2025/09/lab-pics_9-300x200.jpg",
    link: "#",
  },
];

export default function LearningCenterPage() {
  return (
    <main className="bg-white">

      {/* ================= HEADER ================= */}
      <section className="bg-[url('/images/learn/Hero-BG-1-scaled-1.webp')] bg-cover bg-center py-20 rounded-b-[30px]">
        <h1 className="text-center text-4xl font-semibold text-[#003B5C]">
          BioPathogenix Learning Center
        </h1>
      </section>

      {/* ================= INTRO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 text-[#1f2f3d]">

        <p className="leading-relaxed text-sm">
          Whether you’re exploring best practices for qPCR, learning about custom
          assay development, or seeking expert insights into antimicrobial resistance —
          our BPX™ curated articles and resources are designed to empower researchers
          and labs with actionable knowledge.
        </p>

        <div className="text-sm">
          <p className="font-semibold italic mb-2">
            Explore a diverse collection of articles covering:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Optimizing PCR protocols for accuracy and speed.</li>
            <li>Innovations in collection and sample prep.</li>
            <li>Advances in PCR and custom assay design.</li>
            <li>Strategies to enhance lab workflows.</li>
            <li>Pioneers of PCR technology and pivotal pathogens.</li>
          </ul>
        </div>

      </section>

      {/* ================= POSTS GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {posts.map((post, index) => (
            <article key={index} className="text-sm">
              <div className="relative h-[170px] mb-4">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <h3 className="font-semibold text-[#003B5C] leading-snug mb-2">
                {post.title}
              </h3>

              <p className="text-xs text-gray-500 mb-2">{post.date}</p>

              <p className="text-gray-700 mb-3">{post.excerpt}</p>

              <Link href={post.link} className="text-blue-600 text-xs font-medium">
                Read More →
              </Link>
            </article>
          ))}

        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Load More
          </button>
        </div>
      </section>

      {/* ================= DOWNLOAD CTA ================= */}
      <CatalogDownload/>

      {/* ================= FOOTER NOTE ================= */}
      <p className="text-center text-sm text-gray-600 pb-16 max-w-4xl mx-auto px-6">
        Our Learning Center is updated regularly with new articles and insights from
        industry leaders. Bookmark this page to stay informed about the evolving world
        of molecular diagnostics and laboratory technology.
      </p>

    </main>
  );
}
