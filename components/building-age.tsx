"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BuildingAgeProps {
  yearConstructed: string
  setYearConstructed: (year: string) => void
  onNext: () => void
  onBack: () => void
}

export default function BuildingAge({ yearConstructed, setYearConstructed, onNext, onBack }: BuildingAgeProps) {
  const getAlertStyle = () => {
    if (yearConstructed === "Before 1972") {
      return { bg: "bg-red-100", text: "PRE-CODE" }
    } else if (yearConstructed === "1972 - 1992") {
      return { bg: "bg-blue-100", text: "TRANSITION" }
    } else if (yearConstructed === "After 1992") {
      return { bg: "bg-green-100", text: "POST-BENCHMARK" }
    }
    return { bg: "", text: "" }
  }

  const alertStyle = getAlertStyle()

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-center">Building Age</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="yearConstructed">Year Constructed</Label>
            <Select value={yearConstructed} onValueChange={setYearConstructed}>
              <SelectTrigger>
                <SelectValue placeholder="Select year range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Before 1972">Before 1972</SelectItem>
                <SelectItem value="1972 - 1992">1972 - 1992</SelectItem>
                <SelectItem value="After 1992">After 1992</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {yearConstructed && (
            <Alert className={`${alertStyle.bg} border-0`}>
              <AlertDescription className="text-center font-bold">{alertStyle.text}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!yearConstructed}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
