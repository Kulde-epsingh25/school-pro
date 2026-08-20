import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function DeskboardPreview() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Card className="w-full overflow-hidden rounded-2xl border bg-background/80 p-2 sm:p-4 shadow-xl backdrop-blur">
        <CardContent className="p-0">
          <Image 
            src="/images/deskboard-preview.jpg" 
            alt="Dashboard Preview" 
            width={2016} 
            height={1210} 
            className="w-full h-auto rounded-xl object-cover shadow-sm"
            priority
          />
        </CardContent>
      </Card>
    </div>
  );
}
