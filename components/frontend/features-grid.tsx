import SectionHeader from "./section-header";
import { features } from "@/components/frontend/features";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function FeatureGrids() {
  return (
    <section className="px-6 py-20 bg-muted/20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeader 
            title="Features"
            heading="Everything Your School Needs, In One Place"
            description="School Pro unifies academics, operations, and communication so teams can work faster and parents stay informed."
          />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <Link
              key={item.title}
              href={item.href || "/how-it-works"}
              className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 relative w-full h-44 overflow-hidden rounded-xl bg-muted/50 border">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
