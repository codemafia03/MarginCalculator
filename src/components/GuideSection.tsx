"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Reusable Accordion Component
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors text-left"
            >
                <span className="font-bold text-gray-800">{title}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {/* Content always in DOM for SEO, hidden with CSS */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-5 bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Reusable FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left group"
            >
                <h3 className="font-bold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                    <span className="text-blue-500">Q.</span> {question}
                </h3>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {/* Content always in DOM for SEO */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"}`}>
                <p className="text-gray-600 text-sm pl-6">
                    <span className="font-bold text-gray-400 mr-2">A.</span>
                    {answer}
                </p>
            </div>
        </div>
    );
}

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
                        초보 셀러들이 가장 많이 실수하는 부분이 바로 <strong>&apos;가짜 마진&apos;</strong>에 속는 것입니다.
                        단순히 (판매가 - 원가)로 계산하면 큰일 납니다.
                        수시로 변하는 <strong>환율(TTS)</strong>, 카드 수수료, 배송대행지 비용, 그리고 놓치기 쉬운
                        플랫폼 수수료까지 모두 고려해야 <strong>&apos;진짜 순수익&apos;</strong>을 알 수 있습니다.
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

                {/* --- Accordion Section: How to Use --- */}
                <div className="pt-8 border-t border-gray-100">
                    <Accordion title="계산기 사용 방법 (How to Use)">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm mt-0.5">1</span>
                                <span className="text-gray-600">
                                    <strong>상품 원가 입력:</strong> 타오바오나 1688 알리바바의 위안화(CNY) 가격을 입력하세요. 현재 환율이 자동 적용됩니다.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm mt-0.5">2</span>
                                <span className="text-gray-600">
                                    <strong>배송비 설정:</strong> 예상되는 배송대행지(배대지) 요금을 입력하세요. 부피가 큰 제품은 경동택배 이관비가 발생할 수 있습니다.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm mt-0.5">3</span>
                                <span className="text-gray-600">
                                    <strong>마켓 수수료 선택:</strong> 판매할 플랫폼(스마트스토어, 쿠팡, 11번가 등)을 선택하면 수수료가 자동으로 계산됩니다.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm mt-0.5">4</span>
                                <span className="text-gray-600">
                                    <strong>최종 마진 확인:</strong> 순수익과 마진율을 확인하고 판매가를 결정하세요.
                                </span>
                            </li>
                        </ul>
                    </Accordion>
                </div>

                {/* --- Accordion Section: FAQ --- */}
                <div className="pt-8 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        자주 묻는 질문 (FAQ)
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <FAQItem
                            question="마진율은 어떻게 계산되나요?"
                            answer="마진율은 (판매가 - 매입원가 - 배송비 - 마켓수수료) / 판매가 × 100 공식으로 계산됩니다. 역마진이 나지 않도록 꼼꼼히 확인하세요."
                        />
                        <FAQItem
                            question="관부가세 부과 기준은 무엇인가요?"
                            answer="목록통관 기준 미화 150달러(미국은 200달러)를 초과하면 관세와 부가세가 발생합니다. 이 계산기는 관부가세를 제외한 마진을 보여줍니다."
                        />
                        <FAQItem
                            question="CBM이 무엇인가요?"
                            answer="CBM(Cubic Meter)은 화물의 가로, 세로, 높이를 미터(m) 단위로 곱한 부피 단위입니다. 해운 배송 시 배송비 책정의 기준이 됩니다."
                        />
                        <FAQItem
                            question="일반통관과 목록통관의 차이는?"
                            answer="의약품, 건강기능식품 등 특정 품목은 금액과 상관없이 일반통관으로 진행되며 수수료가 발생할 수 있습니다."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
