"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useBuildingAssessments, BuildingAssessment } from "@/contexts/BuildingAssessmentsContext"
import { format } from "date-fns"
import { PlusCircle, Building, FileDown, Trash2, Edit, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function BuildingAssessmentManager() {
  const {
    assessments,
    currentAssessmentId,
    addAssessment,
    deleteAssessment,
    setCurrentAssessment,
    exportToExcel,
  } = useBuildingAssessments()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAddAssessment = () => {
    const id = addAssessment()
    toast({
      title: "New Assessment Created",
      description: "You can now start filling in the details for this building.",
    })
  }

  const handleSelectAssessment = (id: string) => {
    setCurrentAssessment(id)
  }

  const confirmDeleteAssessment = (id: string) => {
    setAssessmentToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteAssessment = () => {
    if (assessmentToDelete) {
      deleteAssessment(assessmentToDelete)
      setAssessmentToDelete(null)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Assessment Deleted",
        description: "The building assessment has been removed.",
      })
    }
  }

  const handleExportToExcel = () => {
    if (assessments.length === 0) {
      toast({
        title: "No Assessments to Export",
        description: "Please create at least one building assessment first.",
        variant: "destructive",
      })
      return
    }

    exportToExcel()
    toast({
      title: "Export Successful",
      description: `Exported ${assessments.length} building assessment${assessments.length > 1 ? 's' : ''} to Excel.`,
    })
  }

  const getBuildingStatusIcon = (assessment: BuildingAssessment) => {
    if (!assessment.completed) return null
    return assessment.score > 2 ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-amber-500" />
    )
  }

  return (
    <Card className="w-full shadow-md border-0">
      <CardHeader className="py-3 px-4 sm:py-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          <span>Building Assessments</span>
          <Badge variant="outline" className="text-white border-white ml-2">
            {assessments.length} Building{assessments.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <Tabs defaultValue="buildings" className="w-full">
          <TabsList className="w-full mb-3 grid grid-cols-2 gap-1">
            <TabsTrigger value="buildings" className="text-sm py-1.5">Buildings</TabsTrigger>
            <TabsTrigger value="export" className="text-sm py-1.5">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="buildings" className="space-y-3 sm:space-y-4">
            <div className="flex justify-center sm:justify-end">
              <Button
                onClick={handleAddAssessment}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto text-sm px-4 py-2 h-10"
                size="sm"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Building
              </Button>
            </div>

            {assessments.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Building className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-30" />
                <p>No building assessments yet</p>
                <p className="text-xs sm:text-sm mt-1">Click "Add Building" to start a new assessment</p>
              </div>
            ) : (
              <ScrollArea className="h-[250px] sm:h-[300px] pr-2 sm:pr-4">
                <div className="space-y-2 sm:space-y-3">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className={`p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        assessment.id === currentAssessmentId
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                      }`}
                      onClick={() => handleSelectAssessment(assessment.id)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <Building className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-600" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {assessment.buildingInfo.buildingName || "Unnamed Building"}
                            {getBuildingStatusIcon(assessment) && (
                              <span className="ml-1 sm:ml-2 inline-flex items-center">
                                {getBuildingStatusIcon(assessment)}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {assessment.buildingInfo.address
                              ? assessment.buildingInfo.address
                              : "No address provided"}
                          </p>
                          {assessment.completed && (
                            <p className="text-xs mt-0.5 sm:mt-1">
                              <Badge
                                variant={assessment.score > 2 ? "success" : "destructive"}
                                className="text-[10px] py-0 h-4"
                              >
                                Score: {assessment.score.toFixed(1)}
                              </Badge>
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600 ml-1 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          confirmDeleteAssessment(assessment.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-3 sm:space-y-4">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center text-sm sm:text-base gap-1.5 sm:gap-2">
                <FileDown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                Export All Assessments
              </h3>
              <p className="text-xs sm:text-sm text-blue-700 mb-3 sm:mb-4">
                Export all your building assessments into a single Excel file
              </p>
              <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2 text-gray-700 mb-3 sm:mb-4">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="text-blue-500">•</span> Summary sheet with all buildings
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="text-blue-500">•</span> Individual detailed sheet for each building
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="text-blue-500">•</span> Copyright watermark on each sheet
                </li>
              </ul>
              <Button
                onClick={handleExportToExcel}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={assessments.length === 0}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
              {assessments.length === 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You need at least one completed assessment to export
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Delete Building Assessment</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Are you sure you want to delete this building assessment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="text-sm h-9">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAssessment} className="text-sm h-9">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}