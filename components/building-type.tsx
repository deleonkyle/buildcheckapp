"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BuildingTypeProps {
  selectedBuildingType: string
  setSelectedBuildingType: (type: string) => void
  onNext: () => void
  onBack: () => void
}

export default function BuildingType({
  selectedBuildingType,
  setSelectedBuildingType,
  onNext,
  onBack,
}: BuildingTypeProps) {
  const buildingTypes = [
    {
      value: "W1",
      label: "W1 - Light wood frame single- or multiple- family dwellings of one or more stories in height",
    },
    {
      value: "W1A",
      label:
        "W1A - Light wood frame multi-unit, multi-story residential buildings with plan areas on each floor of greater than 3,000 square feet",
    },
    {
      value: "W2",
      label: "W2 - Wood frame commercial and industrial buildings with a floor area larger than 5,000 square feet",
    },
    { value: "S1_MRF", label: "S1 - Steel moment-resisting frame" },
    { value: "S2_BR", label: "S2 - Braced steel frame" },
    { value: "S3_LM", label: "S3 - Light metal building" },
    { value: "S4_RCSW", label: "S4 - Steel frames with cast-in-place concrete shear walls" },
    { value: "S5_URMINF", label: "S5 - Steel frames with unreinforced masonry infill walls" },
    { value: "C1_MRF", label: "C1 - Concrete moment-resisting frames" },
    { value: "C2_SW", label: "C2 - Concrete shear wall buildings" },
    { value: "C3_URMINF", label: "C3 - Concrete frames with unreinforced masonry infill walls" },
    { value: "PC1_TU", label: "PC1 - Tilt-up buildings" },
    { value: "PC2", label: "PC2 - Precast concrete frame buildings" },
    { value: "RM1_FC", label: "RM1 - Reinforced masonry buildings with flexible diaphragms" },
    { value: "RM2_RD", label: "RM2 - Reinforced masonry buildings with rigid diaphragms" },
    { value: "URM", label: "URM - Unreinforced masonry buildings" },
    { value: "MH", label: "MH - Manufactured housing" },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-center">Select the Building Type</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buildingType">Building Type</Label>
            <Select value={selectedBuildingType} onValueChange={setSelectedBuildingType}>
              <SelectTrigger>
                <SelectValue placeholder="Select building type" />
              </SelectTrigger>
              <SelectContent>
                {buildingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-64 border rounded-md p-4">
            {buildingTypes.map((type) => (
              <div key={type.value} className="py-2 border-b last:border-0">
                <p className="text-sm">{type.label}</p>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!selectedBuildingType}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
