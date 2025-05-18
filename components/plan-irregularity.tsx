"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface PlanIrregularityProps {
  checked: boolean
  onChange: (checked: boolean) => void
  onNext: () => void
  onBack: () => void
}

export default function PlanIrregularity({ checked, onChange, onNext, onBack }: PlanIrregularityProps) {
  const [selectedIrregularities, setSelectedIrregularities] = useState<string[]>([])

  const irregularities = [
    {
      id: "torsion",
      title: "Torsion",
      image: "/images/plan-torsion.png?height=100&width=200",
      description:
        "Apply if there is good lateral resistance in one direction, but not the other, or if there is eccentric stiffness in plan (as shown in Figures (a) and (b); solid walls on two or three sides with walls with lots of openings on the remaining sides).",
    },
    {
      id: "non-orthogonal",
      title: "Non-Parallel Systems",
      image: "/images/plan-non-parallel.png?height=100&width=200",
      description: "Apply if the sides of the building do not form 90-degree angles.",
    },
    {
      id: "reentrant-corners",
      title: "Reentrant Corners",
      image: "/images/plan-reentrant.png?height=100&width=200",
      description:
        "Apply if there is a reentrant corner, i.e., the building is L, U, T, or + shaped, with projections of more than 20 feet. Where possible, check to see if there are seismic separations where the wings meet. If so, evaluate for pounding.",
    },
    {
      id: "diaphragm-opening",
      title: "Diaphragm Opening",
      image: "/images/plan-diaphragm.png?height=100&width=200",
      description:
        "Apply if there is an opening that has a width of over 50% of the width of the diaphragm at any level.",
    },
    {
      id: "beams-not-aligned",
      title: "Beams Not Aligned with Columns",
      image: "/images/plan-beams-do-not-align-with-columns.png?height=100&width=200",
      description:
        "Apply if the exterior beams do not align with the columns in plan. Typically, this applies to concrete buildings, where the perimeter columns are outboard of the perimeter beams.",
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
        <CardTitle className="text-center">Plan Irregularity</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-red-500 text-sm">
            Check any type of Plan Irregularity that is applicable to the building.
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
