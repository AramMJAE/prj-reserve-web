"use client";

interface MapViewProps {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

export default function MapView({ latitude, longitude, name, address }: MapViewProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${latitude},${longitude}`;

  // OpenStreetMap embed (API 키 불필요)
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.007},${longitude + 0.01},${latitude + 0.007}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-primary mb-4">위치</h2>

      <div className="rounded-card overflow-hidden border border-gray-100">
        <iframe
          src={osmEmbedUrl}
          className="w-full h-[300px] sm:h-[400px] border-0"
          loading="lazy"
          title={`${name} 위치 지도`}
        />
      </div>

      <div className="flex items-start gap-3 mt-4 px-1">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#C8A882" strokeWidth="1.5" className="shrink-0 mt-0.5">
          <path d="M10 18s-6-5.34-6-9a6 6 0 1112 0c0 3.66-6 9-6 9z" />
          <circle cx="10" cy="9" r="2" />
        </svg>
        <div>
          <p className="text-[14px] text-text-primary font-medium">{address}</p>
          <div className="flex gap-2 mt-2">
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-accent hover:underline"
            >
              카카오맵에서 보기
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-accent hover:underline"
            >
              구글맵에서 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
