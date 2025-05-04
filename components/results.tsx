"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

interface ResultsProps {
  onCalculate: () => void
  score: number
  recommendation: string
  onNext: () => void
  onBack: () => void
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
}

export default function Results({
  onCalculate,
  score,
  recommendation,
  onNext,
  onBack,
  buildingInfo,
  selectedBuildingType,
  irregularities,
  yearConstructed,
  soilType,
  soilTypeEStories,
}: ResultsProps) {
  const isPassed = score > 2

  const generateSummary = () => {
    let summary = `Building Name: ${buildingInfo.buildingName}\n`
    summary += `Address: ${buildingInfo.address}\n`
    summary += `Screener: ${buildingInfo.screenerName}\n`
    summary += `Assessment Date: ${format(buildingInfo.assessmentDate, "PP")}\n`
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
        <CardTitle className="text-center">Results</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <Button onClick={onCalculate} className="w-full">
            Calculate Results
          </Button>

          {score > 0 && (
            <Tabs defaultValue="result" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="result">Result</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="result" className="space-y-4">
                <div className="text-center mt-4">
                  <h2 className={`text-xl font-bold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                    {isPassed ? "LEVEL 1 PASSED" : "LEVEL 1 FAILED"}
                  </h2>
                  <p className="text-2xl font-bold mt-2">Score: {score.toFixed(1)}</p>
                </div>

                {!isPassed && recommendation && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="recommendation">Recommendation</Label>
                    <Textarea id="recommendation" value={recommendation} readOnly className="h-24" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="summary">
                <div className="space-y-2 mt-4">
                  <Textarea value={generateSummary()} readOnly className="h-64 font-mono text-sm" />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={score === 0}>
          Finish
        </Button>
      </CardFooter>
    </Card>
  )
}
