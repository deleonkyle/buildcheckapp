"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface SummaryProps {
  buildingInfo: {
    buildingName: string
    address: string
    screenerName: string
    assessmentDate: Date
  }
  selectedBuildingType: string
  irregularities: {
    severeVertical: boolean
    moderateVertical: boolean
    planIrregularity: boolean
  }
  yearConstructed: string
  soilType: string
  soilTypeEStories: string
  score: number
  onBack: () => void
  onStartOver: () => void
}

export default function Summary({
  buildingInfo,
  selectedBuildingType,
  irregularities,
  yearConstructed,
  soilType,
  soilTypeEStories,
  score,
  onBack,
  onStartOver,
}: SummaryProps) {
  const generateSummary = () => {
    let summary = `Building Name: ${buildingInfo.buildingName}\n`
    summary += `Address: ${buildingInfo.address}\n`
    summary += `Building Type: ${selectedBuildingType}\n`

    if (irregularities.severeVertical) {
      summary += "• Severe Vertical Irregularity\n"
    }
    if (irregularities.moderateVertical) {
      summary += "• Moderate Vertical Irregularity\n"
    }
    if (irregularities.planIrregularity) {
      summary += "• Plan Irregularity\n"
    }

    summary += `Year Constructed: ${yearConstructed}\n`
    summary += `Soil Type: ${soilType}`

    if (soilType === "Soil Type E") {
      summary += ` (${soilTypeEStories})\n`
    } else {
      summary += "\n"
    }

    summary += "\n------------------------\n"
    summary += `FINAL SCORE: ${score.toFixed(1)}\n\n`

    if (score > 2) {
      summary += "RESULT: LEVEL 1 PASSED"
    } else {
      summary += "RESULT: LEVEL 1 FAILED"
    }

    return summary
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-center">Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-center">Summary</h3>
            <Textarea value={generateSummary()} readOnly className="h-64 font-mono text-sm" />
          </div>

          <div className="flex justify-center">
            <Button onClick={onStartOver} variant="outline">
              Start Over
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="destructive">Finish</Button>
      </CardFooter>
    </Card>
  )
}
