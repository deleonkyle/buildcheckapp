"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  CheckSquare,
  Calendar,
  User,
  Building,
  MapPin,
  Download,
  Share2,
  Mail,
  Copy,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

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

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true)

    try {
      // Dynamically import jspdf to reduce initial bundle size
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Add logo/header
      doc.setFillColor(41, 98, 255)
      doc.rect(0, 0, 210, 20, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.text("BUILDCHECK Assessment Report", 105, 12, { align: "center" })

      // Reset text color for body
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)

      // Add building info
      doc.text("Building Information", 20, 30)
      doc.setFontSize(10)
      doc.text(`Building Name: ${buildingInfo.buildingName}`, 20, 40)
      doc.text(`Address: ${buildingInfo.address}`, 20, 45)
      doc.text(`Screener: ${buildingInfo.screenerName}`, 20, 50)
      doc.text(`Assessment Date: ${format(buildingInfo.assessmentDate, "PP")}`, 20, 55)

      // Add building details
      doc.setFontSize(12)
      doc.text("Building Details", 20, 65)
      doc.setFontSize(10)
      doc.text(`Building Type: ${selectedBuildingType}`, 20, 75)
      doc.text(`Year Constructed: ${yearConstructed}`, 20, 80)
      doc.text(`Soil Type: ${soilType}${soilType === "Soil Type E" ? ` (${soilTypeEStories})` : ""}`, 20, 85)

      // Add irregularities if any
      let yPos = 90
      if (irregularities.severeVertical || irregularities.moderateVertical || irregularities.planIrregularity) {
        doc.text("Irregularities:", 20, yPos)
        yPos += 5
        if (irregularities.severeVertical) {
          doc.text("• Severe Vertical Irregularity", 25, yPos)
          yPos += 5
        }
        if (irregularities.moderateVertical) {
          doc.text("• Moderate Vertical Irregularity", 25, yPos)
          yPos += 5
        }
        if (irregularities.planIrregularity) {
          doc.text("• Plan Irregularity", 25, yPos)
          yPos += 5
        }
      }

      // Add result section
      yPos += 10
      doc.setFontSize(14)
      doc.text("Assessment Result", 20, yPos)
      yPos += 10

      // Add score and pass/fail status
      doc.setFontSize(12)
      doc.text(`Final Score: ${score.toFixed(1)}`, 20, yPos)
      yPos += 8

      if (isPassed) {
        doc.setTextColor(0, 128, 0) // Green for pass
        doc.text("RESULT: LEVEL 1 PASSED", 20, yPos)
      } else {
        doc.setTextColor(255, 0, 0) // Red for fail
        doc.text("RESULT: LEVEL 1 FAILED", 20, yPos)
        yPos += 15

        // Add recommendation for failed assessments
        doc.setTextColor(0, 0, 0)
        doc.text("Recommendation:", 20, yPos)
        yPos += 8

        // Split recommendation into multiple lines if needed
        const splitRecommendation = doc.splitTextToSize(recommendation, 170)
        doc.text(splitRecommendation, 20, yPos)
      }

      // Add footer
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text("Generated by BUILDCHECK - FEMA P-154 Assessment Tool", 105, 280, { align: "center" })
      doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 105, 285, { align: "center" })

      // Save the PDF
      doc.save(`BUILDCHECK-${buildingInfo.buildingName.replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`)

      toast({
        title: "PDF Downloaded",
        description: "Your assessment report has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(`BUILDCHECK Assessment: ${buildingInfo.buildingName}`)
    const body = encodeURIComponent(
      `BUILDCHECK Assessment Report\n\n${generateSummary()}\n\nGenerated on: ${format(new Date(), "PPpp")}`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`

    toast({
      title: "Email Client Opened",
      description: "Your email client has been opened with the assessment details.",
    })
  }

  const handleCopyToClipboard = () => {
    const summary = generateSummary()
    navigator.clipboard.writeText(summary)

    toast({
      title: "Copied to Clipboard",
      description: "Assessment summary has been copied to clipboard.",
    })
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
          <>
            <div className="flex justify-center mb-2">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                } border-4 ${isPassed ? "border-green-500" : "border-red-500"}`}
              >
                {isPassed ? <CheckCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
              </div>
            </div>

            {/* Action buttons for download and share */}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                className="flex items-center gap-2 flex-1"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShareViaEmail} className="cursor-pointer">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyToClipboard} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        {score > 0 && (
          <Tabs defaultValue="result" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="result">Result</TabsTrigger>
              <TabsTrigger value="summary">Details</TabsTrigger>
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
