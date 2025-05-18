"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SoilTypeProps {
  soilType: string
  setSoilType: (type: string) => void
  soilTypeEStories: string
  setSoilTypeEStories: (stories: string) => void
  onNext: () => void
  onBack: () => void
}

export default function SoilType({
  soilType,
  setSoilType,
  soilTypeEStories,
  setSoilTypeEStories,
  onNext,
  onBack,
}: SoilTypeProps) {
  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-center">Soil Type</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <Select value={soilType} onValueChange={setSoilType}>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Soil Type A">Soil Type A</SelectItem>
                <SelectItem value="Soil Type B">Soil Type B</SelectItem>
                <SelectItem value="Soil Type C">Soil Type C</SelectItem>
                <SelectItem value="Soil Type D">Soil Type D</SelectItem>
                <SelectItem value="Soil Type E">Soil Type E</SelectItem>
                <SelectItem value="Soil Type F">Soil Type F</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {soilType === "Soil Type E" && (
            <div className="space-y-2">
              <Label htmlFor="soilTypeEStories">For Soil Type E</Label>
              <Select value={soilTypeEStories} onValueChange={setSoilTypeEStories}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of stories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3 stories">1-3 stories</SelectItem>
                  <SelectItem value=">3 stories">&gt;3 stories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription>
              Reminder: If there is no basis for classifying the soil type, Soil Type D should be assumed.
            </AlertDescription>
          </Alert>

          <div className="border rounded-md p-4">
            <img
              src="/images/soil-type.png?height=120&width=400"
              alt="Soil type diagram"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!soilType || (soilType === "Soil Type E" && !soilTypeEStories)}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
