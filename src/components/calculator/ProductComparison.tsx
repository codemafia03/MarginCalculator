"use client";
import { useState, useMemo } from "react";
import { Plus, Trash2, Package, TrendingUp, TrendingDown, Scale } from "lucide-react";

interface ComparisonProduct {
    id: number;
    name: string;
    sourcingPrice: number;
    weight: number;
    sellingPrice: number;
}

// Constants (shared with main calculator)
const SHIPPING_RATE_PER_KG = 7000;
const PLATFORM_FEE_RATE = 0.0563; // Default: Naver General

export default function ProductComparison({ exchangeRate }: { exchangeRate: number }) {
    const [products, setProducts] = useState<ComparisonProduct[]>([
        { id: 1, name: "상품 A", sourcingPrice: 0, weight: 0, sellingPrice: 0 },
        { id: 2, name: "상품 B", sourcingPrice: 0, weight: 0, sellingPrice: 0 },
    ]);

    const addProduct = () => {
        if (products.length >= 5) return; // Max 5 products
        const newId = Date.now();
        const letter = String.fromCharCode(65 + products.length); // A, B, C...
        setProducts([...products, { id: newId, name: `상품 ${letter}`, sourcingPrice: 0, weight: 0, sellingPrice: 0 }]);
    };

    const removeProduct = (id: number) => {
        if (products.length <= 2) return; // Min 2 products
        setProducts(products.filter(p => p.id !== id));
    };

    const updateProduct = (id: number, field: keyof ComparisonProduct, value: string | number) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, [field]: typeof value === 'string' && field !== 'name' ? Number(value) || 0 : value } : p
        ));
    };

    const calculations = useMemo(() => {
        return products.map(p => {
            const costKRW = p.sourcingPrice * exchangeRate;
            const shippingKRW = p.weight * SHIPPING_RATE_PER_KG;
            const totalCost = costKRW + shippingKRW;
            const revenue = p.sellingPrice;
            const platformFee = revenue * PLATFORM_FEE_RATE;
            const netProfit = revenue - totalCost - platformFee;
            const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

            return {
                ...p,
                costKRW,
                shippingKRW,
                totalCost,
                platformFee,
                netProfit,
                margin,
            };
        });
    }, [products, exchangeRate]);

    const bestProduct = useMemo(() => {
        if (calculations.length === 0) return null;
        return calculations.reduce((best, curr) =>
            curr.margin > best.margin ? curr : best
        );
    }, [calculations]);

    const formatCurrency = (val: number) => new Intl.NumberFormat("ko-KR").format(Math.round(val));

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-500" />
                    <h2 className="font-bold text-gray-800">다중 상품 비교</h2>
                </div>
                {products.length < 5 && (
                    <button
                        onClick={addProduct}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        상품 추가
                    </button>
                )}
            </div>

            {/* Input Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                {products.map((product, idx) => (
                    <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
                        {products.length > 2 && (
                            <button
                                onClick={() => removeProduct(product.id)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                            <Package className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={product.name}
                                onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                                className="text-sm font-bold text-gray-700 bg-transparent border-none outline-none w-full"
                                placeholder="상품명"
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="number"
                                placeholder="소싱가 (CNY)"
                                value={product.sourcingPrice || ""}
                                onChange={(e) => updateProduct(product.id, 'sourcingPrice', e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="무게 (kg)"
                                value={product.weight || ""}
                                onChange={(e) => updateProduct(product.id, 'weight', e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="판매가 (KRW)"
                                value={product.sellingPrice || ""}
                                onChange={(e) => updateProduct(product.id, 'sellingPrice', e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">상품</th>
                            <th className="px-4 py-3 text-right">원가 (KRW)</th>
                            <th className="px-4 py-3 text-right">배송비</th>
                            <th className="px-4 py-3 text-right">수수료</th>
                            <th className="px-4 py-3 text-right">순수익</th>
                            <th className="px-4 py-3 text-right">마진율</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {calculations.map((calc) => {
                            const isBest = bestProduct && calc.id === bestProduct.id && calc.margin > 0;
                            const isLoss = calc.netProfit < 0;

                            return (
                                <tr
                                    key={calc.id}
                                    className={`transition ${isBest ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                                        {isBest && <TrendingUp className="w-4 h-4 text-indigo-500" />}
                                        {isLoss && <TrendingDown className="w-4 h-4 text-red-500" />}
                                        {calc.name}
                                        {isBest && <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">BEST</span>}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-600">{formatCurrency(calc.costKRW)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-600">{formatCurrency(calc.shippingKRW)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-600">{formatCurrency(calc.platformFee)}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold ${isLoss ? 'text-red-500' : 'text-blue-600'}`}>
                                        {formatCurrency(calc.netProfit)}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-bold ${isLoss ? 'text-red-500' : calc.margin >= 20 ? 'text-emerald-500' : 'text-gray-700'}`}>
                                        {calc.margin.toFixed(1)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
                * 비교는 기본 네이버 수수료(5.63%) 기준입니다. 상세 계산은 위 메인 계산기를 이용하세요.
            </p>
        </div>
    );
}
