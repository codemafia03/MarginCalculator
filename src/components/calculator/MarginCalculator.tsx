"use client";

import { useState, useMemo, useEffect } from "react";
import {
    Calculator,
    Package,
    RefreshCw,
    Settings,
    Truck,
    CreditCard,
    DollarSign,
    Receipt,
    History,
    Save,
    Trash2,
    CheckCircle2,
    Sparkles,
    Wifi,
    Download
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ProductComparison from './ProductComparison';

// Types
type MarketPlatform = "naver_general" | "naver_small" | "naver_link" | "coupang_general" | "coupang_digital" | "others" | "custom";
type VatType = "general" | "simplified";

interface HistoryItem {
    id: number;
    date: string;
    productPrice: number;
    sellingPrice: number;
    margin: number;
    netProfit: number;
}

// Constants
const SHIPPING_RATE_PER_KG = 7000;
const USD_CNY_RATE = 7.25;
const TAX_THRESHOLD_USD = 150;
const DUTY_TAX_RATE = 0.18;

const PLATFORM_FEES = {
    naver_general: 0.0563,
    naver_small: 0.0398,
    naver_link: 0.0363,
    coupang_general: 0.1199,
    coupang_digital: 0.066,
    others: 0.13,
    custom: 0,
};

// Chart Colors
const COLORS = ['#3B82F6', '#9CA3AF', '#EF4444', '#10B981']; // Product, Logistics, Fees, Profit

export default function MarginCalculator() {
    // --- Column 1: Basic Settings ---
    const [platform, setPlatform] = useState<MarketPlatform>("naver_general");
    const [customFeeRate, setCustomFeeRate] = useState<number | "">("");
    const [exchangeRate, setExchangeRate] = useState<number>(200);
    const [isRateLive, setIsRateLive] = useState(false);
    const [vatType, setVatType] = useState<VatType>("general");
    const [targetMargin, setTargetMargin] = useState<number>(30); // Default 30%

    // --- Column 2: Inputs ---
    const [sourcingPrice, setSourcingPrice] = useState<number | "">("");
    const [localShipping, setLocalShipping] = useState<number | "">("");

    // Shipping & CBM
    const [weight, setWeight] = useState<number | "">("");
    const [useCBM, setUseCBM] = useState(false);
    const [dimWidth, setDimWidth] = useState<number | "">("");
    const [dimDepth, setDimDepth] = useState<number | "">("");
    const [dimHeight, setDimHeight] = useState<number | "">("");

    // Hidden Costs
    const [packingCost, setPackingCost] = useState<number | "">("");
    const [adCost, setAdCost] = useState<number | "">("");
    const [domesticShipCost, setDomesticShipCost] = useState<number | "">("");
    const [customerShipFee, setCustomerShipFee] = useState<number | "">("");

    // Target
    const [sellingPrice, setSellingPrice] = useState<number | "">("");

    // History State
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isClient, setIsClient] = useState(false);

    // Live Exchange Rate API
    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem("calcHistory");
        if (saved) {
            setHistory(JSON.parse(saved));
        }

        // Fetch Rate
        const fetchRate = async () => {
            try {
                const res = await fetch("https://open.er-api.com/v6/latest/CNY");
                const data = await res.json();
                if (data && data.rates && data.rates.KRW) {
                    const rate = data.rates.KRW;
                    setExchangeRate(parseFloat(rate.toFixed(2)));
                    setIsRateLive(true);
                }
            } catch (error) {
                console.error("Failed to fetch exchange rate", error);
            }
        };
        fetchRate();
    }, []);

    // --- Business Logic ---
    const {
        totalRevenue,
        costOfGoods,
        finalWeight,
        intlShippingCost,
        logisticsCost,
        platformFee,
        dutyTax,
        estimatedVat,
        totalExpenses,
        netProfit,
        profitMargin,
        isLoss,
        isHighProfit,
        chartData,
        recommendedPrice
    } = useMemo(() => {
        const priceCNY = Number(sourcingPrice) || 0;
        const localShipCNY = Number(localShipping) || 0;
        const weightKG = Number(weight) || 0;
        const sellPriceKRW = Number(sellingPrice) || 0;
        const custShipKRW = Number(customerShipFee) || 0;
        const packKRW = Number(packingCost) || 0;
        const adKRW = Number(adCost) || 0;
        const domShipKRW = Number(domesticShipCost) || 0;
        const tgtMargin = Number(targetMargin) || 0;

        // CBM Logic
        let calcWeight = weightKG;
        if (useCBM) {
            const w = Number(dimWidth) || 0;
            const d = Number(dimDepth) || 0;
            const h = Number(dimHeight) || 0;
            const volWeight = (w * d * h) / 6000;
            calcWeight = Math.max(weightKG, volWeight);
        }

        const revenue = sellPriceKRW + custShipKRW;
        const goodsCostKRW = (priceCNY + localShipCNY) * exchangeRate;
        const intlShipKRW = calcWeight * SHIPPING_RATE_PER_KG;
        const logisticsKRW = intlShipKRW + domShipKRW + packKRW;

        let feeRate = PLATFORM_FEES[platform];
        if (platform === "custom") {
            feeRate = (Number(customFeeRate) || 0) / 100;
        }
        let feeKRW = revenue * feeRate;

        // --- Coupang Logic: 3.3% Commission on Shipping Fee ---
        if (platform.includes("coupang")) {
            feeKRW += custShipKRW * 0.033;
        }

        const totalSourcingUSD = (priceCNY + localShipCNY) / USD_CNY_RATE;
        let dutyKRW = 0;
        if (totalSourcingUSD > TAX_THRESHOLD_USD) {
            dutyKRW = (goodsCostKRW + intlShipKRW) * DUTY_TAX_RATE;
        }

        const vatRate = vatType === "general" ? 0.1 : 0.015;
        const vatKRW = revenue * vatRate;

        const expenses = goodsCostKRW + logisticsKRW + feeKRW + dutyKRW + vatKRW + adKRW;
        const profit = revenue - expenses;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

        // Smart Recommendation Logic
        // Formula: RecPrice = (Expenses_No_Fee) / (1 - FeeRate - TargetMargin%)
        // Note: Expenses usually include VAT which is also often % of Revenue, but here VAT is calculated on Revenue.
        // Let's check VAT: General (10% of Revenue), Simplified (1.5% of Revenue).
        // So Revenue-dependent costs are: Fee (feeRate * R) + VAT (vatRate * R).
        // Profit = R - FixedCosts - (feeRate * R) - (vatRate * R)
        // Profit = R * (1 - feeRate - vatRate) - FixedCosts
        // Target Margin = Profit / R = (R * (1 - feeRate - vatRate) - FixedCosts) / R
        // Target Margin = (1 - feeRate - vatRate) - (FixedCosts / R)
        // R = FixedCosts / (1 - feeRate - vatRate - TargetMargin)

        const extraCoupangFee = platform.includes("coupang") ? custShipKRW * 0.033 : 0;
        const fixedCosts = goodsCostKRW + logisticsKRW + adKRW + dutyKRW + extraCoupangFee;
        const taxAndFeeRate = feeRate + vatRate;
        const requiredMarginRate = tgtMargin / 100;

        let recPrice = 0;
        const divisor = 1 - taxAndFeeRate - requiredMarginRate;

        if (divisor > 0 && fixedCosts > 0) {
            const calculatedTotalRevenue = fixedCosts / divisor;
            // Subtract Customer Shipping Fee to get "Item Selling Price"
            recPrice = calculatedTotalRevenue - custShipKRW;
        }

        // Chart Data
        const chartData = [
            { name: '상품 원가', value: goodsCostKRW },
            { name: '물류/포장', value: logisticsKRW },
            { name: '수수료/세금', value: feeKRW + dutyKRW + vatKRW + adKRW },
            { name: '순수익', value: profit > 0 ? profit : 0 },
        ];

        return {
            totalRevenue: revenue,
            costOfGoods: goodsCostKRW,
            finalWeight: calcWeight,
            intlShippingCost: intlShipKRW,
            logisticsCost: logisticsKRW,
            platformFee: feeKRW,
            dutyTax: dutyKRW,
            estimatedVat: vatKRW,
            totalExpenses: expenses,
            netProfit: profit,
            profitMargin: margin,
            isLoss: profit < 0,
            isHighProfit: margin >= 20,
            chartData,
            recommendedPrice: Math.max(0, Math.ceil(recPrice / 100) * 100) // Round to nearest 100
        };

    }, [
        sourcingPrice, localShipping, exchangeRate,
        weight, packingCost, domesticShipCost,
        platform, customFeeRate, sellingPrice, customerShipFee,
        vatType, adCost, useCBM, dimWidth, dimDepth, dimHeight,
        targetMargin
    ]);

    // Helpers
    const formatCurrency = (val: number) => new Intl.NumberFormat("ko-KR").format(Math.round(val));
    const handleNumChange = (setter: any) => (e: any) => {
        const val = e.target.value;
        setter(val === "" ? "" : Number(val));
    };

    // History Handlers
    const saveHistory = () => {
        const newItem: HistoryItem = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            productPrice: Number(sourcingPrice) || 0,
            sellingPrice: Number(sellingPrice) || 0,
            margin: profitMargin,
            netProfit: netProfit
        };
        const updated = [newItem, ...history];
        setHistory(updated);
        localStorage.setItem("calcHistory", JSON.stringify(updated));
    };

    const deleteHistory = (id: number) => {
        const updated = history.filter(item => item.id !== id);
        setHistory(updated);
        localStorage.setItem("calcHistory", JSON.stringify(updated));
    };

    // CSV Export Function
    const exportToCSV = () => {
        if (history.length === 0) {
            alert("내보낼 데이터가 없습니다.");
            return;
        }

        const headers = ["날짜", "소싱가(CNY)", "판매가(KRW)", "마진율(%)", "순수익(KRW)"];
        const rows = history.map(item => [
            item.date,
            item.productPrice,
            item.sellingPrice,
            item.margin.toFixed(1),
            Math.round(item.netProfit)
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Add BOM for Korean character support in Excel
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `margin_history_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!isClient) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="w-full space-y-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calculator className="w-6 h-6 text-blue-400" />
                        <h1 className="text-xl font-bold tracking-tight">Global Seller Calculator</h1>
                    </div>
                    {isRateLive && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                            <Wifi className="w-3 h-3" />
                            <span>Live Rates Active</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-gray-100">

                    {/* --- Column 1: Settings --- */}
                    <div className="lg:col-span-3 p-6 bg-slate-50">
                        <div className="flex items-center gap-2 mb-6 text-slate-700">
                            <Settings className="w-5 h-5" />
                            <h2 className="font-bold">기본 설정</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">판매 플랫폼</label>
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value as MarketPlatform)}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <optgroup label="네이버 스마트스토어">
                                        <option value="naver_general">네이버 (일반/검색연동) - 5.63%</option>
                                        <option value="naver_small">네이버 (영세/초기) - 3.98%</option>
                                        <option value="naver_link">네이버 (링크결제/SNS) - 3.63%</option>
                                    </optgroup>
                                    <optgroup label="쿠팡 (배송비 수수료 포함)">
                                        <option value="coupang_general">쿠팡 (의류/잡화/생활) - 11.99%</option>
                                        <option value="coupang_digital">쿠팡 (디지털/가전) - 6.6%</option>
                                    </optgroup>
                                    <optgroup label="기타 / 직접입력">
                                        <option value="others">11번가/G마켓 - 13%</option>
                                        <option value="custom">직접 입력</option>
                                    </optgroup>
                                </select>
                                {platform === "custom" && (
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="number"
                                            placeholder="%"
                                            value={customFeeRate}
                                            onChange={handleNumChange(setCustomFeeRate)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">적용 환율 (CNY)</label>
                                    {isRateLive && <span className="text-[10px] text-green-600 font-medium animate-pulse">● 실시간 연동됨</span>}
                                </div>

                                <div className="relative">
                                    <input
                                        type="number"
                                        value={exchangeRate}
                                        onChange={handleNumChange(setExchangeRate)}
                                        className={`w-full p-2.5 pl-9 border rounded-lg text-sm font-medium outline-none transition-all ${isRateLive ? 'border-green-300 ring-2 ring-green-100' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                                    />
                                    <RefreshCw className={`w-4 h-4 absolute left-3 top-3 ${isRateLive ? 'text-green-500' : 'text-slate-400'}`} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">목표 마진율 (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={targetMargin}
                                        onChange={handleNumChange(setTargetMargin)}
                                        className="w-full p-2.5 pl-9 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <Sparkles className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-500 uppercase">사업자 유형</label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:border-blue-300">
                                        <input type="radio" name="vat" checked={vatType === "general"} onChange={() => setVatType("general")} className="text-blue-600" />
                                        <div className="text-xs"><span className="font-bold">일반과세자</span> (10%)</div>
                                    </label>
                                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:border-blue-300">
                                        <input type="radio" name="vat" checked={vatType === "simplified"} onChange={() => setVatType("simplified")} className="text-blue-600" />
                                        <div className="text-xs"><span className="font-bold">간이과세자</span> (1.5%)</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Column 2: Inputs --- */}
                    <div className="lg:col-span-6 p-6 bg-white overflow-y-auto max-h-[800px]">
                        <div className="flex items-center gap-2 mb-6 text-slate-700">
                            <CreditCard className="w-5 h-5" />
                            <h2 className="font-bold">비용 및 매출 입력</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Sourcing */}
                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-blue-500" /> 상품 소싱 (CNY)
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="상품 단가 (¥)" value={sourcingPrice} onChange={handleNumChange(setSourcingPrice)} className="input-field" />
                                    <input type="number" placeholder="현지 배송비 (¥)" value={localShipping} onChange={handleNumChange(setLocalShipping)} className="input-field" />
                                </div>
                            </div>

                            {/* Shipping with CBM */}
                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-green-500" /> 배송 / 물류비 (KRW)
                                    </h3>
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                        <input type="checkbox" checked={useCBM} onChange={(e) => setUseCBM(e.target.checked)} className="rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                                        <span className="font-medium text-slate-600">부피무게 체크 (CBM)</span>
                                    </label>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="실무게 (kg)" value={weight} onChange={handleNumChange(setWeight)} className="input-field flex-1" />
                                        {useCBM && finalWeight > Number(weight) && (
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold whitespace-nowrap">
                                                CBM {finalWeight.toFixed(1)}kg 적용
                                            </span>
                                        )}
                                    </div>

                                    {useCBM && (
                                        <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-dashed border-gray-300">
                                            <input type="number" placeholder="가로(cm)" value={dimWidth} onChange={handleNumChange(setDimWidth)} className="text-center text-xs p-1 border rounded" />
                                            <input type="number" placeholder="세로(cm)" value={dimDepth} onChange={handleNumChange(setDimDepth)} className="text-center text-xs p-1 border rounded" />
                                            <input type="number" placeholder="높이(cm)" value={dimHeight} onChange={handleNumChange(setDimHeight)} className="text-center text-xs p-1 border rounded" />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="창고 포장비" value={packingCost} onChange={handleNumChange(setPackingCost)} className="input-field" />
                                        <input type="number" placeholder="국내 택배비" value={domesticShipCost} onChange={handleNumChange(setDomesticShipCost)} className="input-field" />
                                    </div>
                                </div>
                            </div>

                            {/* Revenue */}
                            <div className="p-4 bg-blue-50 rounded-xl space-y-4 border border-blue-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-8 -mt-8"></div>

                                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 relative z-10">
                                    <DollarSign className="w-4 h-4" /> 매출 및 마케팅
                                </h3>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="판매 가격"
                                            value={sellingPrice}
                                            onChange={handleNumChange(setSellingPrice)}
                                            className="input-field font-bold text-blue-900 border-blue-200"
                                        />

                                        {/* Smart Recommendation Helper */}
                                        {recommendedPrice > 0 && (
                                            <button
                                                onClick={() => setSellingPrice(recommendedPrice)}
                                                className="mt-2 text-xs text-left w-full group flex items-start gap-1 p-2 bg-white/80 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 border-dashed"
                                            >
                                                <Sparkles className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-slate-600 group-hover:text-blue-700">
                                                    마진 <span className="font-bold text-blue-700">{targetMargin}%</span> 기준 권장가:
                                                    <span className="block font-bold text-blue-600">{formatCurrency(recommendedPrice)}원 (클릭 시 적용)</span>
                                                </span>
                                            </button>
                                        )}
                                    </div>

                                    <input type="number" placeholder="고객부담 배송비" value={customerShipFee} onChange={handleNumChange(setCustomerShipFee)} className="input-field border-blue-200" />
                                    <input type="number" placeholder="광고비" value={adCost} onChange={handleNumChange(setAdCost)} className="input-field col-span-2 border-blue-200" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Column 3: Analysis --- */}
                    <div className="lg:col-span-3 p-6 bg-slate-50 flex flex-col">
                        <div className="flex items-center gap-2 mb-4 text-slate-700">
                            <Receipt className="w-5 h-5" />
                            <h2 className="font-bold">분석 결과</h2>
                        </div>

                        {/* Chart */}
                        <div className="h-48 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-3 mb-6 text-[10px] text-gray-500">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-blue-500"></div>원가</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-gray-400"></div>물류</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-red-500"></div>비용</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500"></div>이익</div>
                        </div>

                        {/* Summary */}
                        <div className="flex-grow bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
                            <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-200">
                                <div className={`text-3xl font-black ${isLoss ? 'text-red-500' : 'text-blue-600'}`}>
                                    {formatCurrency(netProfit)}
                                    <span className="text-sm font-medium text-gray-400 ml-1">원</span>
                                </div>
                                <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${isLoss ? 'bg-red-100 text-red-600' : isHighProfit ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                    마진율 {profitMargin.toFixed(1)}%
                                </div>
                            </div>

                            <div className="space-y-2 text-xs flex-grow">
                                <Row label="(+) 총 매출" val={totalRevenue} />
                                <Row label="(-) 상품 원가" val={costOfGoods} />
                                <Row label="(-) 물류비" val={logisticsCost} />
                                <Row label="(-) 수수료 (마켓)" val={platformFee} />
                                <Row label="(-) 세금 (관/부가세)" val={dutyTax + estimatedVat} />
                                <Row label="(-) 광고비" val={Number(adCost) || 0} />
                            </div>

                            <button
                                onClick={saveHistory}
                                className="mt-4 w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> 기록 저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- History Section --- */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-gray-500" />
                        <h2 className="font-bold text-gray-700">최근 계산 기록</h2>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm"
                        >
                            <Download className="w-3.5 h-3.5" />
                            CSV 내보내기
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">소싱가 (CNY)</th>
                                <th className="px-4 py-3">판매가 (KRW)</th>
                                <th className="px-4 py-3">마진율</th>
                                <th className="px-4 py-3">순수익</th>
                                <th className="px-4 py-3 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">저장된 기록이 없습니다.</td>
                                </tr>
                            ) : (
                                history.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-gray-600">{item.date}</td>
                                        <td className="px-4 py-3 font-mono text-gray-600">¥{item.productPrice}</td>
                                        <td className="px-4 py-3 font-mono font-medium">{formatCurrency(item.sellingPrice)}</td>
                                        <td className={`px-4 py-3 font-bold ${item.margin < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                            {item.margin.toFixed(1)}%
                                        </td>
                                        <td className={`px-4 py-3 font-mono font-bold ${item.netProfit < 0 ? 'text-red-500' : 'text-blue-600'}`}>
                                            {formatCurrency(item.netProfit)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => deleteHistory(item.id)} className="text-gray-400 hover:text-red-500 transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Multi-Product Comparison Section --- */}
            <ProductComparison exchangeRate={exchangeRate} />

            <style jsx>{`
                .input-field {
                    @apply w-full p-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-right text-sm;
                }
            `}</style>
        </div >
    );
}

function Row({ label, val }: { label: string, val: number }) {
    return (
        <div className="flex justify-between items-center text-gray-600">
            <span>{label}</span>
            <span>{new Intl.NumberFormat("ko-KR").format(Math.round(val))}</span>
        </div>
    );
}
