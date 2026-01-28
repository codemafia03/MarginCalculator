"use client";
import { useState } from "react";
import { Truck, Plane, Ship, ChevronDown, Info } from "lucide-react";

interface ShippingRate {
    minKg: number;
    maxKg: number;
    air: number;      // 항공 (per kg)
    sea: number;      // 해운 (per kg)
    express: number;  // 특송 (per kg)
}

// 2026년 기준 대략적인 중국-한국 배송비 (kg당)
const SHIPPING_RATES: ShippingRate[] = [
    { minKg: 0, maxKg: 0.5, air: 8000, sea: 5000, express: 15000 },
    { minKg: 0.5, maxKg: 1, air: 7500, sea: 4500, express: 12000 },
    { minKg: 1, maxKg: 2, air: 7000, sea: 4000, express: 10000 },
    { minKg: 2, maxKg: 5, air: 6500, sea: 3500, express: 9000 },
    { minKg: 5, maxKg: 10, air: 6000, sea: 3000, express: 8000 },
    { minKg: 10, maxKg: 20, air: 5500, sea: 2500, express: 7500 },
    { minKg: 20, maxKg: 50, air: 5000, sea: 2000, express: 7000 },
    { minKg: 50, maxKg: 100, air: 4500, sea: 1800, express: 6500 },
];

export default function ShippingRateTable() {
    const [isOpen, setIsOpen] = useState(false);
    const [weight, setWeight] = useState<number>(1);

    const formatCurrency = (val: number) => new Intl.NumberFormat("ko-KR").format(val);

    // Calculate estimated costs based on weight
    const calculateCost = (rate: number) => Math.round(weight * rate);

    // Find applicable rate tier
    const applicableRate = SHIPPING_RATES.find(r => weight > r.minKg && weight <= r.maxKg) || SHIPPING_RATES[SHIPPING_RATES.length - 1];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header - Collapsible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Truck className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                        <h2 className="font-bold text-gray-800">배송비 참조 테이블</h2>
                        <p className="text-xs text-gray-500">중국 → 한국 배송 방법별 예상 비용</p>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-5 border-t border-gray-100">
                    {/* Quick Calculator */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-5">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">빠른 계산: 무게 입력 (kg)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(Math.max(0.1, Number(e.target.value) || 0.1))}
                                className="flex-1 p-2.5 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 outline-none"
                                min="0.1"
                                step="0.1"
                            />
                            <span className="text-gray-500 text-sm">kg</span>
                        </div>

                        {/* Quick Results */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="bg-white rounded-lg p-3 border border-blue-100 text-center">
                                <Plane className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                                <div className="text-xs text-gray-500">항공</div>
                                <div className="font-bold text-blue-600">{formatCurrency(calculateCost(applicableRate.air))}원</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-emerald-100 text-center">
                                <Ship className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                                <div className="text-xs text-gray-500">해운</div>
                                <div className="font-bold text-emerald-600">{formatCurrency(calculateCost(applicableRate.sea))}원</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                                <Truck className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                                <div className="text-xs text-gray-500">특송</div>
                                <div className="font-bold text-purple-600">{formatCurrency(calculateCost(applicableRate.express))}원</div>
                            </div>
                        </div>
                    </div>

                    {/* Rate Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">무게 구간</th>
                                    <th className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Plane className="w-3 h-3" /> 항공
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Ship className="w-3 h-3" /> 해운
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Truck className="w-3 h-3" /> 특송
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {SHIPPING_RATES.map((rate, idx) => {
                                    const isActive = weight > rate.minKg && weight <= rate.maxKg;
                                    return (
                                        <tr key={idx} className={`transition ${isActive ? 'bg-orange-50 font-medium' : 'hover:bg-gray-50'}`}>
                                            <td className="px-4 py-3 text-gray-700">
                                                {rate.minKg}kg ~ {rate.maxKg}kg
                                                {isActive && <span className="ml-2 text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded">현재</span>}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-blue-600">{formatCurrency(rate.air)}원/kg</td>
                                            <td className="px-4 py-3 text-right font-mono text-emerald-600">{formatCurrency(rate.sea)}원/kg</td>
                                            <td className="px-4 py-3 text-right font-mono text-purple-600">{formatCurrency(rate.express)}원/kg</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2 mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">
                            위 요금은 2026년 기준 대략적인 참고 자료입니다. 실제 배송비는 배대지, 부피무게, 품목에 따라 달라질 수 있습니다.
                            정확한 요금은 이용하시는 배송대행지에 문의하세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
