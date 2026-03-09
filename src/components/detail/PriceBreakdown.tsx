import { formatPrice } from "@/lib/utils";

interface PriceBreakdownProps {
  pricePerNight: number;
  nights: number;
}

export default function PriceBreakdown({ pricePerNight, nights }: PriceBreakdownProps) {
  const subtotal = pricePerNight * nights;
  const cleaningFee = 30000;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + cleaningFee + serviceFee;

  return (
    <div className="border-t border-gray-100 pt-4 mb-4 space-y-2.5 animate-fade-in">
      <div className="flex justify-between text-[14px]">
        <span className="text-text-secondary underline decoration-dotted cursor-help" title="1박 요금 x 숙박 일수">
          {formatPrice(pricePerNight)} x {nights}박
        </span>
        <span className="text-primary">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-[14px]">
        <span className="text-text-secondary underline decoration-dotted cursor-help" title="숙소 청소 및 관리 비용">
          청소비
        </span>
        <span className="text-primary">{formatPrice(cleaningFee)}</span>
      </div>
      <div className="flex justify-between text-[14px]">
        <span className="text-text-secondary underline decoration-dotted cursor-help" title="STAYLOG 서비스 이용 수수료 (5%)">
          서비스 수수료
        </span>
        <span className="text-primary">{formatPrice(serviceFee)}</span>
      </div>
      <div className="flex justify-between text-[16px] font-semibold pt-3 border-t border-gray-100">
        <span>총 금액</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
