import {
  BookOpen,
  Bus,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import SectionHeader from "./section-header";

const featureItems = [
  {
    title: "Academic Management",
    description:
      "Create timetables, manage exams, and publish report cards from one dashboard.",
    icon: BookOpen,
    image: "/images/feature1.png"
  },
  {
    title: "Attendance Tracking",
    description:
      "Track student and staff attendance in real time with instant parent alerts.",
    icon: CalendarCheck,
    image: "/images/feature1.png"
  },
  {
    title: "Communication Hub",
    description:
      "Send notices through in-app messages, email, and SMS from a single panel.",
    icon: MessageSquare,
    image: "/images/feature1.png"
  },
  {
    title: "Fees and Payments",
    description:
      "Collect fees online, automate receipts, and monitor outstanding balances.",
    icon: CreditCard,
    image: "/images/feature1.png"
  },
  {
    title: "Transport Control",
    description:
      "Manage routes, vehicles, and pickup updates with GPS-assisted visibility.",
    icon: Bus,
    image: "/images/feature1.png"
  },
  {
    title: "Security and Access",
    description:
      "Protect school data with role-based permissions and detailed audit history.",
    icon: ShieldCheck,
    image: "/images/feature1.png"
  },
];

export default function FeatureGrids() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          
            <SectionHeader 
              title="Features"
              heading="Everything Your School Needs, In One Place"
              description="School Pro unifies academics, operations, and communication so teams can work faster and parents stay informed."
            />
          
          
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featureItems.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <img src={item.image} alt={item.title} width={400} height={300} className="mt-4 rounded-lg" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
