import Link from "next/link";
import Image from "next/image";
import { getFeaturedStays } from "@/lib/stays-api";
import { formatPrice } from "@/lib/utils";

export default async function Curation() {
  const curated = await getFeaturedStays(4);

  if (curated.length === 0) return null;

  return (
    <section className="py-section bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-accent text-[13px] tracking-[0.2em] uppercase mb-3 font-inter">
            Editor&apos;s Pick
          </p>
          <h2 className="text-title-md font-serif font-bold text-primary">
            이번 주 추천 스테이
          </h2>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Large Card */}
          {curated[0] && (
            <Link
              href={`/stays/${curated[0].id}`}
              className="md:col-span-2 md:row-span-2 group relative rounded-card overflow-hidden aspect-[4/3] md:aspect-auto"
            >
              <Image
                src={curated[0].images[0]}
                alt={curated[0].name}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-white/70 text-[12px] tracking-wider uppercase">
                  {curated[0].category} · {curated[0].region}
                </span>
                <h3 className="text-white text-[28px] font-serif font-bold mt-2">
                  {curated[0].name}
                </h3>
                <p className="text-white/70 text-[14px] mt-2 line-clamp-2">
                  {curated[0].description}
                </p>
                <p className="text-accent text-[16px] font-semibold mt-3">
                  {formatPrice(curated[0].price)}
                  <span className="text-white/50 text-[13px] font-normal">
                    {" "}
                    / 1박
                  </span>
                </p>
              </div>
            </Link>
          )}

          {/* Small Cards */}
          {curated.slice(1, 4).map((stay) => (
            <Link
              key={stay.id}
              href={`/stays/${stay.id}`}
              className="group relative rounded-card overflow-hidden aspect-[4/3]"
            >
              <Image
                src={stay.images[0]}
                alt={stay.name}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-white/70 text-[11px] tracking-wider uppercase">
                  {stay.category} · {stay.region}
                </span>
                <h3 className="text-white text-[18px] font-serif font-bold mt-1">
                  {stay.name}
                </h3>
                <p className="text-accent text-[14px] font-semibold mt-1">
                  {formatPrice(stay.price)}
                  <span className="text-white/50 text-[12px] font-normal">
                    {" "}
                    / 1박
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
