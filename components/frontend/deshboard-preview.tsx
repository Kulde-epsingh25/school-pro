import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function DeskboardPreview() {
  return (
    <div className="">
    <Card className="w-full rounded-lg border bg-background/80 p-4 shadow-sm backdrop-blur py-12 md:py-16">
     
      <CardContent>
        <Image src="/Images/Deskboard-preview.jpg" alt="Dashboard Preview" width={2016} height={1210} className="" />
      </CardContent>
    </Card>
    </div>
  )
}
