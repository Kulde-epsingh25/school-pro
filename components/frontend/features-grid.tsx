
import SectionHeader from "./section-header";
import { features } from "@/components/frontend/features";


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
          {features.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="inline-flex rounded-lg  p-2 text-primary">
                <item.icon className="h-7 w-7 text-blue-500 " aria-hidden="true" />
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
