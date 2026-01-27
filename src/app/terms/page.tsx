export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto py-16 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">이용약관</h1>
            <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제1조 (목적)</h2>
                    <p>본 약관은 Seller Note(이하 "회사")가 제공하는 해외구매대행 마진 계산기 서비스(이하 "서비스")의 이용조건 및 절차, 이용자와 회사의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.</p>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제2조 (서비스의 내용 및 책임의 한계)</h2>
                    <p>1. 본 서비스는 이용자가 입력한 정보를 바탕으로 예상 비용을 단순 계산하여 제공하는 시뮬레이션 도구입니다.</p>
                    <p>2. 제공되는 결과값(관부가세, 배송비, 마진 등)은 참고용 자료이며, 실제 통관 시점의 환율이나 과세관청의 판단에 따라 법적 효력이 있는 결과와 다를 수 있습니다.</p>
                    <p>3. 회사는 본 서비스의 이용 결과로 인해 이용자에게 발생한 어떠한 손해에 대해서도 책임을 지지 않습니다. 최종적인 가격 결정 및 세금 신고의 책임은 이용자 본인에게 있습니다.</p>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제3조 (개인정보 보호)</h2>
                    <p>회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력하며, 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.</p>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">부칙</h2>
                    <p>본 약관은 2026년 1월 1일부터 시행됩니다.</p>
                </section>
            </div>
            <div className="mt-10">
                <a href="/" className="text-blue-600 hover:underline">← 홈으로 돌아가기</a>
            </div>
        </div>
    );
}
