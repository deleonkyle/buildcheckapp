"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface SevereVerticalIrregularityProps {
  checked: boolean
  onChange: (checked: boolean) => void
  onNext: () => void
  onBack: () => void
}

export default function SevereVerticalIrregularity({
  checked,
  onChange,
  onNext,
  onBack,
}: SevereVerticalIrregularityProps) {
  const [selectedIrregularities, setSelectedIrregularities] = useState<string[]>([])

  const irregularities = [
    {
      id: "soft-story",
      title: "Soft Story",
      image: "/images/severe-soft-story.png?height=100&width=200",
      description:
        "Apply: Soft Story (c) (d) Figure (a): For a W1 house with occupied space over a garage with limited or short wall lengths on both sides of the garage opening. Figure (b): For a W1A building with an open front at the ground story (such as for parking). Figure (c): When one of the stories has less wall or fewer columns than the others (usually the bottom story). Figure (d): When one of the stories is taller than the others (usually the bottom story).",
    },
    {
      id: "setback",
      title: "Setback",
      image: "/images/severe-setback.png?height=100&width=200",
      description:
        "Apply if the walls of the building do not stack vertically in plan. This irregularity is most severe when the vertical elements of the lateral system at the upper levels are outboard of those at the lower levels. If nonstacking walls are known to be non-structural, this irregularity does not apply. Apply the setback if greater than or equal to 2 feet.",
    },
    {
      id: "short-column",
      title: "Short Column/Pier",
      image: "/images/severe-short-column.png?height=100&width=200",
      description:
        "Apply if: Figure (a): Some columns/piers are much shorter than the typical columns/piers in the same line. Figure (b): The columns/piers are narrow compared to the depth of the beams. Figure (c): There are infill walls that shorten the clear height of the column. Note this deficiency is typically seen in older concrete and steel building types.",
    },
    {
      id: "split-level",
      title: "Sloping Site",
      image: "/images/severe and moderate-sloping site.png?height=100&width=200",
      description:
        "Apply if there is more than a one-story slope from one side of the building to the other. Evaluate as Severe for W1 buildings as shown in Figure (a); evaluate as Moderate for all other building types as shown in Figure (b).",
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
        <CardTitle className="text-center">Severe Vertical Irregularity</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-red-500 text-sm">
            Check any type of Severe Vertical Irregularity that is applicable to the building.
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
