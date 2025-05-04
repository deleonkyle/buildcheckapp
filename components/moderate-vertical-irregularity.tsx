"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface ModerateVerticalIrregularityProps {
  checked: boolean
  onChange: (checked: boolean) => void
  onNext: () => void
  onBack: () => void
}

export default function ModerateVerticalIrregularity({
  checked,
  onChange,
  onNext,
  onBack,
}: ModerateVerticalIrregularityProps) {
  const [selectedIrregularities, setSelectedIrregularities] = useState<string[]>([])

  const irregularities = [
    {
      id: "sloped-site",
      title: "Sloped Site",
      image: "/images/moderate-split-level.png?height=100&width=200",
      description:
        "Apply if there is more than a one-story slope from one side of the building to the other. Evaluate as Severe for W1 buildings as shown in Figure (a); evaluate as Moderate for all other building types as shown in Figure (b).",
    },
    {
      id: "out-of-plane",
      title: "Out-of-Plane Offsets",
      image: "/images/severe and moderate-sloping site.png?height=100&width=200",
      description: "Apply if the floors of the building do not align or if there is a step in the roof level.",
    },
    {
      id: "in-plane",
      title: "In-Plane Offsets",
      image: "/images/moderate-inplane-setback.png?height=100&width=200",
      description:
        "Apply if there is an in-plane offset of the lateral system. Usually, these are observable in braced frame (Figure (a)) and shear wall buildings (Figure (b)).",
    },
    {
      id: "cripple-wall",
      title: "Cripple Wall",
      image: "/images/moderate-cripple-wall.png?height=100&width=200",
      description:
        "Apply if unbraced cripple walls are observed in the crawlspace of the building. This applies to W1 buildings. If the basement is occupied, consider this condition as a soft story.",
    },
  ]

  const handleIrregularityChange = (id: string, checked: boolean) => {
    setSelectedIrregularities((prev) => {
      const newSelection = checked ? [...prev, id] : prev.filter((item) => item !== id)

      // Update the parent component's state based on whether any irregularities are selected
      onChange(newSelection.length > 0)

      return newSelection
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-center">Moderate Vertical Irregularity</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-red-500 text-sm">
            Check any type of Moderate Vertical Irregularity that is applicable to the building.
          </p>

          <ScrollArea className="h-64 border rounded-md p-4">
            {irregularities.map((item) => (
              <div key={item.id} className="mb-6 pb-6 border-b last:border-0">
                <div className="flex items-start gap-2 mb-2">
                  <Checkbox
                    id={item.id}
                    checked={selectedIrregularities.includes(item.id)}
                    onCheckedChange={(checked) => handleIrregularityChange(item.id, checked === true)}
                  />
                  <label htmlFor={item.id} className="font-medium cursor-pointer">
                    {item.title}
                  </label>
                </div>
                <div className="flex flex-col md:flex-row gap-4 ml-6">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full md:w-32 h-auto object-cover rounded"
                  />
                  <div>
                    <p className="text-sm italic text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </CardFooter>
    </Card>
  )
}
