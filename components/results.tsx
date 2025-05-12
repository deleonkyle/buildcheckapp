"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { CheckCircle, AlertTriangle, ArrowLeft, CheckSquare, Calendar, User, Building, MapPin } from "lucide-react"

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
  const scorePercent = Math.min(100, (score / 4) * 100) // Assuming 4 is max score for visualization

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
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-5 px-6">
        <CardTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Assessment Results
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-5 px-5 space-y-5">
        {score === 0 ? (
          <Button
            onClick={onCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg flex items-center justify-center gap-2"
          >
            Calculate Results
          </Button>
        ) : (
          <div className="flex justify-center mb-2">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              } border-4 ${isPassed ? "border-green-500" : "border-red-500"}`}
            >
              {isPassed ? <CheckCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
            </div>
          </div>
        )}

        {score > 0 && (
          <Tabs defaultValue="result" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="result">Result</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="result" className="space-y-5">
              <div className="text-center">
                <h2 className={`text-xl font-bold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                  {isPassed ? "LEVEL 1 PASSED" : "LEVEL 1 FAILED"}
                </h2>

                <div className="mt-4 mb-2">
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${isPassed ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${scorePercent}%` }}
                    ></div>
                  </div>
                  <p className="text-2xl font-bold mt-3">Score: {score.toFixed(1)}</p>
                  <p className="text-sm text-gray-500 mt-1">(Passing score: &gt; 2.0)</p>
                </div>
              </div>

              {!isPassed && recommendation && (
                <div className="space-y-2 bg-red-50 p-4 rounded-lg border border-red-100">
                  <Label htmlFor="recommendation" className="text-red-700 font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Recommendation
                  </Label>
                  <Textarea
                    id="recommendation"
                    value={recommendation}
                    readOnly
                    className="h-24 bg-white border-red-200"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="summary">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Building Name</p>
                      <p className="font-medium">{buildingInfo.buildingName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{buildingInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Screener</p>
                      <p className="font-medium">{buildingInfo.screenerName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Assessment Date</p>
                      <p className="font-medium">{format(buildingInfo.assessmentDate, "PP")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p className="font-medium text-gray-700">Building Details</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Building Type:</span> {selectedBuildingType}
                    </p>
                    <p>
                      <span className="text-gray-500">Year Constructed:</span> {yearConstructed}
                    </p>
                    <p>
                      <span className="text-gray-500">Soil Type:</span> {soilType}
                      {soilType === "Soil Type E" ? ` (${soilTypeEStories})` : ""}
                    </p>

                    {(irregularities.severeVertical ||
                      irregularities.moderateVertical ||
                      irregularities.planIrregularity) && (
                      <div className="mt-2">
                        <p className="text-gray-500">Irregularities:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          {irregularities.severeVertical && <li>Severe Vertical</li>}
                          {irregularities.moderateVertical && <li>Moderate Vertical</li>}
                          {irregularities.planIrregularity && <li>Plan Irregularity</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${isPassed ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Final Score</p>
                    <p className={`font-bold text-lg ${isPassed ? "text-green-600" : "text-red-600"}`}>
                      {score.toFixed(1)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium">Result</p>
                    <p className={`font-bold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                      {isPassed ? "PASSED" : "FAILED"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(generateSummary())
                      alert("Summary copied to clipboard")
                    }}
                  >
                    Copy Full Summary
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      <CardFooter className="flex justify-between px-5 pb-5 pt-2">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={score === 0}
          className={`${isPassed ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        >
          Finish
        </Button>
      </CardFooter>
    </Card>
  )
}
