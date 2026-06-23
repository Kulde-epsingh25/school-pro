import SmallTitle from "./small-title";

export default function SectionHeader({title , heading, description}: {title: string, heading: string, description: string}) {
    return (
        <div className="flex flex-col items-center justify-content space-y-4 text-center">
            <SmallTitle title={title} />
            <h2 className=" text-3xl font-bold tracking-tight sm:text-5xl">
                {heading}
            </h2>
            <p className=" max-w-[900px]  text-lg sm:text-xl text-muted-foreground">
                {description}
            </p>
        </div>
    );
}