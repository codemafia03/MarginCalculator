export default function GuideSection() {
    return (
        <section className="w-full max-w-2xl mx-auto mt-12 mb-20 bg-white rounded-xl shadow-lg p-8 sm:p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
                해외구매대행 셀러 가이드
            </h2>

            <div className="space-y-10 text-gray-700 leading-relaxed">
                <article className="prose prose-blue max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        해외구매대행 마진, 왜 계산기가 필수일까요?
                    </h3>
                    <p className="text-gray-600 mb-4">
                        초보 셀러들이 가장 많이 실수하는 부분이 바로 <strong>'가짜 마진'</strong>에 속는 것입니다.
                        단순히 (판매가 - 원가)로 계산하면 큰일 납니다.
                        수시로 변하는 <strong>환율(TTS)</strong>, 카드 수수료, 배송대행지 비용, 그리고 놓치기 쉬운
                        플랫폼 수수료까지 모두 고려해야 <strong>'진짜 순수익'</strong>을 알 수 있습니다.
                    </p>
                    <p className="text-gray-600">
                        이 계산기는 이러한 숨은 비용들을 모두 포함하여, 셀러분들이 손해 보지 않는 장사를 할 수 있도록 돕습니다.
                    </p>
                </article>

                <article className="prose prose-blue max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        2026년 관부가세 면세 기준 (150달러의 진실)
                    </h3>
                    <p className="text-gray-600 mb-4">
                        중국(타오바오, 알리바바 등)에서 소싱할 때 가장 중요한 것은 <strong>목록통관 기준 미화 150달러</strong>입니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
                        <li><strong>150불 이하:</strong> 관세와 부가세가 면제됩니다 (Duty Free).</li>
                        <li><strong>150불 초과:</strong> 초과분이 아닌, <strong>전체 금액</strong>에 대해 과세됩니다.</li>
                    </ul>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-blue-800">
                            <strong>💡 주의사항:</strong> 과세표준 가격에는 상품 가격뿐만 아니라 현지 배송비와 선편 요금까지 포함될 수 있으므로,
                            150달러에 딱 맞추기보다는 여유를 두는 것이 안전합니다. 보통 <strong>약 18~20%</strong>의 세금이 추가 부과됩니다.
                        </p>
                    </div>
                </article>

                <article className="prose prose-blue max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        플랫폼별 수수료 비교 (스마트스토어 vs 쿠팡)
                    </h3>
                    <p className="text-gray-600 mb-4">
                        입점하려는 마켓에 따라 마진율 전략을 다르게 가져가야 합니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>
                            <strong>네이버 스마트스토어:</strong> 약 3.63% ~ 5.85% (결제 수수료 + 연동비).
                            초기 진입 장벽이 낮고 수수료가 저렴한 편입니다.
                        </li>
                        <li>
                            <strong>쿠팡 (윙/로켓):</strong> 약 10% ~ 12% 이상 (카테고리별 상이).
                            노출 효과는 좋지만 수수료가 높으므로 반드시 마진을 넉넉하게 잡아야 정산 시 손해를 보지 않습니다.
                        </li>
                    </ul>
                </article>
            </div>
        </section>
    );
}
