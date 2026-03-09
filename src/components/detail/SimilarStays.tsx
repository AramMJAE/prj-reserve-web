import Link from "next/link";
import Image from "next/image";
import { mockStays } from "@/data/mock-stays";
import { formatPrice } from "@/lib/utils";
import type { Stay } from "@/types";

interface SimilarStaysProps {
  currentStay: Stay;
}

export default function SimilarStays({ currentStay }: SimilarStaysProps) {
  // Find similar stays: same region or category, excluding current
  const similar = mockStays
    .filter(
      (s) =>
        s.id !== currentStay.id &&
        (s.region === currentStay.region || s.category === currentStay.category)
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  if (similar.length === 0) return null;

  return (
    <section className="border-t border-gray-100 mt-12 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-[20px] font-serif font-bold text-primary mb-6">
          비슷한 숙소 추천
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {similar.map((stay) => (
            <Link key={stay.id} href={`/stays/${stay.id}`} className="group">
              <div className="relative aspect-[4/3] rounded-card overflow-hidden mb-2.5">
                <Image
                  src={stay.images[0]}
                  alt={stay.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-medium text-primary">
                  {stay.category}
                </div>
              </div>
              <h3 className="text-[14px] font-semibold text-primary group-hover:text-accent transition-colors truncate">
                {stay.name}
              </h3>
              <p className="text-[12px] text-text-secondary mt-0.5">
                {stay.region}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[14px] font-semibold text-primary">
                  {formatPrice(stay.price)}
                  <span className="text-[11px] text-text-secondary font-normal"> /박</span>
                </span>
                <span className="text-[12px] text-text-secondary flex items-center gap-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="#C8A882">
                    <path d="M6 1l1.2 2.5 2.8.4-2 2 .5 2.8L6 7.2 3.5 8.7l.5-2.8-2-2 2.8-.4L6 1z" />
                  </svg>
                  {stay.rating}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
