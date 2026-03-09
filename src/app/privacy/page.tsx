import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const sections = [
  {
    title: "1. 개인정보의 수집 및 이용 목적",
    content: "STAYLOG(이하 \"회사\")는 다음의 목적을 위해 개인정보를 수집·이용합니다.\n\n① 회원 가입 및 관리: 회원 식별, 본인 확인, 서비스 부정 이용 방지\n② 숙소 예약 서비스 제공: 예약 처리, 결제, 예약 확인 안내\n③ 고객 상담 및 불만 처리: 민원인 확인, 처리 결과 통보\n④ 서비스 개선: 서비스 이용 통계, 맞춤형 서비스 제공",
  },
  {
    title: "2. 수집하는 개인정보 항목",
    content: "① 필수 항목: 이메일 주소, 비밀번호, 이름\n② 선택 항목: 프로필 이미지, 전화번호\n③ 자동 수집 항목: 접속 IP, 브라우저 종류, 접속 일시, 서비스 이용 기록",
  },
  {
    title: "3. 개인정보의 보유 및 이용 기간",
    content: "① 회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다.\n② 단, 관련 법령에 의해 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.\n  - 계약 또는 청약 철회에 관한 기록: 5년\n  - 대금결제 및 재화 공급에 관한 기록: 5년\n  - 소비자 불만 또는 분쟁 처리에 관한 기록: 3년\n  - 접속에 관한 기록: 3개월",
  },
  {
    title: "4. 개인정보의 제3자 제공",
    content: "회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다.\n\n① 숙소 예약 처리를 위해 호스트에게 예약자 정보(이름, 연락처) 제공\n② 법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차에 따라 요청이 있는 경우",
  },
  {
    title: "5. 개인정보의 파기 절차 및 방법",
    content: "① 파기 절차: 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.\n② 파기 방법\n  - 전자적 파일: 복구 불가능한 방법으로 영구 삭제\n  - 종이 문서: 분쇄기로 분쇄 또는 소각",
  },
  {
    title: "6. 이용자의 권리와 행사 방법",
    content: "① 이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있습니다.\n② 이용자는 회원 탈퇴를 통해 개인정보 처리 정지를 요청할 수 있습니다.\n③ 개인정보 관련 문의: help@staylog.kr",
  },
  {
    title: "7. 개인정보 보호책임자",
    content: "성명: 김스테이\n직위: 개인정보 보호책임자\n이메일: privacy@staylog.kr\n전화: 1588-0000",
  },
  {
    title: "8. 시행일",
    content: "이 개인정보처리방침은 2026년 1월 1일부터 시행합니다.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-bg-white">
        <div className="bg-primary py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-accent text-[13px] tracking-[0.2em] uppercase mb-3 font-inter">Privacy Policy</p>
            <h1 className="text-[28px] sm:text-[36px] font-serif font-bold text-white">개인정보처리방침</h1>
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
