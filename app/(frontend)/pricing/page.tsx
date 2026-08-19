import PricingV1 from "@/components/frontend/pricing";

export const metadata = {
  title: "Pricing Plans - School Pro",
  description: "Simple, transparent school management software pricing for institutions of all sizes."
};

export default function PricingPage() {
  return (
    <div className="pt-6">
      <PricingV1 />
    </div>
  );
}
