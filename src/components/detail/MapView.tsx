"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";

interface MapViewProps {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

export default function MapView({ latitude, longitude, name, address }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const initMap = useCallback(() => {
    if (!mapRef.current) return;
    try {
      const kakao = (window as any).kakao;
      const position = new kakao.maps.LatLng(latitude, longitude);
      const map = new kakao.maps.Map(mapRef.current, {
        center: position,
        level: 5,
      });

      const marker = new kakao.maps.Marker({ position, map });
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-size:13px;font-weight:600;white-space:nowrap;">${name}</div>`,
      });
      infowindow.open(map, marker);
      setMapLoaded(true);
    } catch {
      setMapError(true);
    }
  }, [latitude, longitude, name]);

  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!kakaoKey) {
      setMapError(true);
      return;
    }

    if ((window as any).kakao?.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      (window as any).kakao.maps.load(() => {
        initMap();
      });
    };
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [initMap]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${latitude},${longitude}`;

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-primary mb-4">위치</h2>

      {!mapError ? (
        <div className="rounded-card overflow-hidden border border-gray-100">
          <div
            ref={mapRef}
            className="w-full h-[300px] sm:h-[400px] bg-bg-off"
          >
            {!mapLoaded && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-[13px] text-text-secondary">지도를 불러오는 중...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-bg-off rounded-card border border-gray-100 overflow-hidden">
          <div className="h-[200px] bg-gradient-to-br from-secondary to-bg-off flex items-center justify-center">
            <div className="text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C8A882" strokeWidth="1.5" className="mx-auto mb-3">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-[13px] text-text-secondary mb-3">지도로 위치를 확인하세요</p>
              <div className="flex gap-2 justify-center">
                <a
                  href={kakaoMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#FEE500] text-[#3C1E1E] text-[12px] font-medium rounded-button hover:bg-[#FDD835] transition-colors"
                >
                  카카오맵
                </a>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white text-primary text-[12px] font-medium rounded-button border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  구글맵
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
