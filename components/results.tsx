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
  Printer,
  Mail,
  Copy,
  Loader2,
  FileText,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

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
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("result")

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

  const downloadPDF = async () => {
    if (score === 0) return

    setIsGeneratingPdf(true)

    try {
      // Make sure we're showing the summary tab for the PDF
      setActiveTab("summary")

      // Wait a bit for the tab to update in the UI
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Get the element to capture
      const reportElement = document.getElementById("report-container")
      if (!reportElement) {
        throw new Error("Report container not found")
      }

      // Create a canvas from the element
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Calculate the ratio to fit the image in the PDF
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

      // Add image to PDF
      const imgX = (pdfWidth - imgWidth * ratio) / 2 // Center horizontally
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        10, // Some top margin
        imgWidth * ratio,
        imgHeight * ratio,
      )

      // Add footer
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      const footerText = `(c) 2025 BUILDCHECK. KNDA/MJGF/SMBF - Generated on ${format(new Date(), "PP")}`
      pdf.text(footerText, pdfWidth / 2, pdfHeight - 10, { align: "center" })

      // Save PDF
      const filename = `BUILDCHECK_${buildingInfo.buildingName.replace(/\s+/g, "_")}_${format(new Date(), "yyyyMMdd")}.pdf`
      pdf.save(filename)

      // Success notification
      toast({
        title: "PDF Downloaded",
        description: "Your assessment report has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPdf(false)
      // Switch back to previous tab
      setActiveTab("result")
    }
  }

  const shareViaEmail = () => {
    if (score === 0) return

    const subject = `BUILDCHECK Assessment: ${buildingInfo.buildingName}`
    const body = `
BUILDCHECK Assessment Report

${generateSummary()}

This assessment was generated using BUILDCHECK, a tool designed to help engineers, building inspectors, and owners assess structural integrity using FEMA P-154 guidelines.
    `

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    toast({
      title: "Email Client Opened",
      description: "Your email client has been opened with the assessment details.",
    })
  }

  const copyToClipboard = () => {
    if (score === 0) return

    const textToCopy = generateSummary()
    navigator.clipboard.writeText(textToCopy)

    toast({
      title: "Copied to Clipboard",
      description: "Assessment summary has been copied to clipboard.",
    })
  }

  const printReport = () => {
    if (score === 0) return

    // Switch to summary tab first
    setActiveTab("summary")

    // Wait a bit for the UI to update
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-5 px-6">
        <CardTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Assessment Results
        </CardTitle>
      </CardHeader>

      {score === 0 ? (
        <CardContent className="pt-5 px-5 space-y-5">
          <div className="text-center text-gray-600 mb-4">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Click the button below to calculate your building assessment results</p>
          </div>

          <Button
            onClick={onCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            Calculate Results
          </Button>
        </CardContent>
      ) : (
        <>
          {/* Print-friendly container that will be captured for PDF */}
          <div id="report-container" className="print:p-8">
            <CardContent className="pt-5 px-5 space-y-5">
              <div className="flex justify-center mb-4">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  } border-4 ${isPassed ? "border-green-500" : "border-red-500"}`}
                >
                  {isPassed ? <CheckCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  <div className="space-y-4 print:space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg space-y-3 print:bg-white print:border print:border-blue-200">
                      <h3 className="font-medium text-blue-700 print:text-black">Building Information</h3>

                      <div className="flex items-start gap-3">
                        <Building className="w-4 h-4 text-blue-600 mt-1 shrink-0 print:text-gray-700" />
                        <div>
                          <p className="text-sm text-gray-500">Building Name</p>
                          <p className="font-medium">{buildingInfo.buildingName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-blue-600 mt-1 shrink-0 print:text-gray-700" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{buildingInfo.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-blue-600 mt-1 shrink-0 print:text-gray-700" />
                        <div>
                          <p className="text-sm text-gray-500">Screener</p>
                          <p className="font-medium">{buildingInfo.screenerName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-blue-600 mt-1 shrink-0 print:text-gray-700" />
                        <div>
                          <p className="text-sm text-gray-500">Assessment Date</p>
                          <p className="font-medium">{format(buildingInfo.assessmentDate, "PP")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 print:bg-white print:border print:border-gray-200">
                      <h3 className="font-medium text-gray-700">Building Details</h3>
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
                      className={cn(
                        "p-4 rounded-lg print:border",
                        isPassed
                          ? "bg-green-50 border border-green-100 print:border-green-300"
                          : "bg-red-50 border border-red-100 print:border-red-300",
                      )}
                    >
                      <h3
                        className={cn(
                          "font-medium mb-3",
                          isPassed ? "text-green-700 print:text-green-800" : "text-red-700 print:text-red-800",
                        )}
                      >
                        Assessment Result
                      </h3>

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

                      {!isPassed && recommendation && (
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <p className="text-sm font-medium text-red-700 mb-1">Recommendation:</p>
                          <p className="text-sm text-red-600">{recommendation}</p>
                        </div>
                      )}
                    </div>

                    <div className="text-center text-xs text-gray-400 pt-2 print:pt-6 print:text-gray-500">
                      Generated by BUILDCHECK on {format(new Date(), "PPpp")}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 print:hidden">
            <p className="text-xs text-gray-500 mb-2">Share your assessment or save it for later reference</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 text-blue-700"
                onClick={downloadPDF}
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={shareViaEmail} className="flex items-center gap-2 cursor-pointer">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyToClipboard} className="flex items-center gap-2 cursor-pointer">
                    <Copy className="w-4 h-4" />
                    <span>Copy to Clipboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={printReport} className="flex items-center gap-2 cursor-pointer">
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </>
      )}

      <CardFooter className="flex justify-between px-5 pb-5 pt-3 print:hidden">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={score === 0}
          className={`${isPassed ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white flex items-center gap-1`}
        >
          Complete & Save <CheckCircle className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
