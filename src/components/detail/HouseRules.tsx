const rules = [
  { icon: "🕐", label: "체크인", value: "15:00 이후" },
  { icon: "🕐", label: "체크아웃", value: "11:00 이전" },
  { icon: "🚭", label: "금연", value: "실내 금연" },
  { icon: "🐾", label: "반려동물", value: "불가" },
  { icon: "🎉", label: "파티/이벤트", value: "불가" },
  { icon: "🔇", label: "소음", value: "22:00 이후 정숙" },
];

export default function HouseRules() {
  return (
    <div>
      <h2 className="text-[18px] font-semibold text-primary mb-4">숙소 이용 규칙</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {rules.map((rule) => (
          <div key={rule.label} className="flex items-start gap-3 p-3 bg-bg-off rounded-card">
            <span className="text-[20px] shrink-0">{rule.icon}</span>
            <div>
              <p className="text-[13px] font-medium text-primary">{rule.label}</p>
              <p className="text-[12px] text-text-secondary">{rule.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
