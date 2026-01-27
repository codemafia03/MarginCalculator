export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto py-16 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>
            <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">1. 개인정보의 처리 목적</h2>
                    <p>Seller Note(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>서비스 제공 및 콘텐츠 이용</li>
                        <li>서비스 개선 및 통계 분석 (Google Analytics 등)</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">2. 수집하는 개인정보의 항목 및 수집방법</h2>
                    <p>회사는 회원가입 기능을 제공하지 않으므로, 이용자의 성명, 전화번호 등 직접적인 개인정보를 수집하지 않습니다. 단, 서비스 이용 과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>IP 주소, 쿠키(Cookie), 방문 일시, 서비스 이용 기록, 기기 정보</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">3. 쿠키(Cookie)의 운용 및 거부</h2>
                    <p>회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
                    <p>이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저 옵션 설정을 통해 모든 쿠키를 허용하거나, 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.</p>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">4. 개인정보 보호책임자</h2>
                    <p>이메일: contact@sellernote.com</p>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">5. 정책 변경에 따른 공지의무</h2>
                    <p>본 개인정보처리방침은 2026년 1월 1일부터 적용됩니다.</p>
                </section>
            </div>
            <div className="mt-10">
                <a href="/" className="text-blue-600 hover:underline">← 홈으로 돌아가기</a>
            </div>
        </div>
    );
}
