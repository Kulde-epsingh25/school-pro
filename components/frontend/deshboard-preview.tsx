import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function DeskboardPreview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card className="w-full max-w-sm">
     
      <CardContent>
        <Image src="D:\New folder (2)\ALL\PRO\Project\New folder\school-pro\public\Images\Deskboard-preview.avif" alt="Dashboard Preview" width={400} height={300} />
      </CardContent>
    </Card>
    </div>
  )
}
