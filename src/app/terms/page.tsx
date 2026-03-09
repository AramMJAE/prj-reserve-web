import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const sections = [
  {
    title: "제1조 (목적)",
    content: "이 약관은 STAYLOG(이하 \"회사\")가 제공하는 숙소 예약 서비스(이하 \"서비스\")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.",
  },
  {
    title: "제2조 (정의)",
    content: "① \"서비스\"란 회사가 제공하는 숙소 검색, 예약, 결제 등 관련 제반 서비스를 의미합니다.\n② \"이용자\"란 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.\n③ \"회원\"이란 서비스에 회원등록을 한 자로서, 지속적으로 서비스를 이용할 수 있는 자를 말합니다.\n④ \"호스트\"란 서비스를 통해 숙소를 등록하고 운영하는 자를 말합니다.",
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    content: "① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.\n② 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정 사유를 명시하여 현행 약관과 함께 서비스 내에 7일 전부터 공지합니다.",
  },
  {
    title: "제4조 (서비스의 제공)",
    content: "① 회사는 다음과 같은 서비스를 제공합니다.\n  1. 숙소 정보 검색 및 예약 서비스\n  2. 숙소 리뷰 및 평점 서비스\n  3. 찜(위시리스트) 서비스\n  4. 기타 회사가 정하는 서비스\n② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.",
  },
  {
    title: "제5조 (예약 및 결제)",
    content: "① 이용자는 서비스 내에서 숙소를 선택하고 날짜, 인원을 지정하여 예약할 수 있습니다.\n② 예약 확정 시 결제가 진행되며, 결제 완료 후 예약 확인 안내가 제공됩니다.\n③ 결제 수단은 신용카드, 체크카드, 간편결제 등 회사가 지정하는 방법으로 할 수 있습니다.",
  },
  {
    title: "제6조 (취소 및 환불)",
    content: "① 체크인 7일 전까지: 전액 환불\n② 체크인 3~7일 전: 숙박 요금의 50% 환불\n③ 체크인 3일 이내: 환불 불가\n④ 천재지변 등 불가항력적 사유 발생 시 별도 협의가 가능합니다.",
  },
  {
    title: "제7조 (이용자의 의무)",
    content: "① 이용자는 서비스 이용 시 관련 법령, 이 약관의 규정, 이용안내 등을 준수하여야 합니다.\n② 이용자는 타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.\n③ 이용자는 숙소 이용 시 호스트가 정한 이용 규칙을 준수하여야 합니다.",
  },
  {
    title: "제8조 (면책 조항)",
    content: "① 회사는 천재지변, 전쟁 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.\n② 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.\n③ 숙소의 시설, 서비스 품질 등에 관한 책임은 해당 호스트에게 있습니다.",
  },
  {
    title: "부칙",
    content: "이 약관은 2026년 1월 1일부터 시행합니다.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-white">
        <div className="bg-primary py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-accent text-[13px] tracking-[0.2em] uppercase mb-3 font-inter">Terms of Service</p>
            <h1 className="text-[28px] sm:text-[36px] font-serif font-bold text-white">이용약관</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-[16px] font-semibold text-primary mb-3">{section.title}</h2>
                <p className="text-[14px] text-text-secondary leading-[1.9] whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
