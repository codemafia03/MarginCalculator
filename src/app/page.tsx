import MarginCalculator from "@/components/calculator/MarginCalculator";
import GuideSection from "@/components/GuideSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <MarginCalculator />
        <GuideSection />
      </div>
    </div>
  );
}
