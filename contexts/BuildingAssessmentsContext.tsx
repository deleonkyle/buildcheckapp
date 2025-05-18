"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import * as XLSX from "xlsx"
import { format } from "date-fns"

// Define the structure for a single building assessment
export interface BuildingAssessment {
  id: string
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
  usedParameters: Record<string, number>
  recommendation: string
  completed: boolean
}

// Define the context interface
interface BuildingAssessmentsContextType {
  assessments: BuildingAssessment[]
  currentAssessmentId: string | null
  addAssessment: () => string
  updateAssessment: (id: string, data: Partial<BuildingAssessment>) => void
  deleteAssessment: (id: string) => void
  setCurrentAssessment: (id: string | null) => void
  getCurrentAssessment: () => BuildingAssessment | null
  exportToExcel: () => void
}

// Create the context with default values
const BuildingAssessmentsContext = createContext<BuildingAssessmentsContextType | undefined>(undefined)

// Create a provider component
export const BuildingAssessmentsProvider = ({ children }: { children: ReactNode }) => {
  const [assessments, setAssessments] = useState<BuildingAssessment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buildingAssessments');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('buildingAssessments', JSON.stringify(assessments));
  }, [assessments]);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null)

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Add a new assessment
  const addAssessment = () => {
    const id = generateId()
    const newAssessment: BuildingAssessment = {
      id,
      buildingInfo: {
        buildingName: "",
        address: "",
        screenerName: "",
        assessmentDate: new Date(),
      },
      selectedBuildingType: "",
      irregularities: {
        severeVertical: false,
        moderateVertical: false,
        planIrregularity: false,
      },
      yearConstructed: "",
      soilType: "",
      soilTypeEStories: "",
      score: 0,
      usedParameters: {},
      recommendation: "",
      completed: false,
    }

    setAssessments((prev) => [...prev, newAssessment])
    setCurrentAssessmentId(id)
    return id
  }

  // Update an existing assessment
  const updateAssessment = (id: string, data: Partial<BuildingAssessment>) => {
    setAssessments((prev) =>
      prev.map((assessment) => (assessment.id === id ? { ...assessment, ...data } : assessment))
    )
  }

  // Delete an assessment
  const deleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((assessment) => assessment.id !== id))
    if (currentAssessmentId === id) {
      const remaining = assessments.filter((assessment) => assessment.id !== id)
      setCurrentAssessmentId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  // Set the current assessment
  const setCurrentAssessment = (id: string | null) => {
    setCurrentAssessmentId(id)
  }

  // Get the current assessment
  const getCurrentAssessment = () => {
    if (!currentAssessmentId) return null
    return assessments.find((assessment) => assessment.id === currentAssessmentId) || null
  }

  // Export all assessments to Excel
  const exportToExcel = () => {
    if (assessments.length === 0) return;
    
    const requiredFields = ['buildingName', 'address', 'screenerName'];
    const incomplete = assessments.some(a => 
      !a.completed || 
      requiredFields.some(field => !a.buildingInfo[field as keyof typeof a.buildingInfo])
    );
    if (incomplete) {
      toast({
        title: "Incomplete Assessments",
        description: "All buildings must be completed before exporting.",
        variant: "destructive"
      });
      return;
    }
    if (assessments.length === 0) return

    // Create a workbook
    const wb = XLSX.utils.book_new()

    // Create a worksheet for summary of all buildings
    const summaryData = assessments.map((assessment) => ({
      "Building Name": assessment.buildingInfo.buildingName,
      "Address": assessment.buildingInfo.address,
      "Screener": assessment.buildingInfo.screenerName,
      "Assessment Date": format(assessment.buildingInfo.assessmentDate, "PP"),
      "Building Type": assessment.selectedBuildingType,
      "Year Constructed": assessment.yearConstructed,
      "Soil Type": assessment.soilType + (assessment.soilType === "Soil Type E" ? ` (${assessment.soilTypeEStories})` : ""),
      "Severe Vertical Irregularity": assessment.irregularities.severeVertical ? "Yes" : "No",
      "Moderate Vertical Irregularity": assessment.irregularities.moderateVertical ? "Yes" : "No",
      "Plan Irregularity": assessment.irregularities.planIrregularity ? "Yes" : "No",
      "Final Score": assessment.score.toFixed(1),
      "Result": assessment.score > 2 ? "PASSED" : "FAILED",
      "Recommendation": assessment.recommendation,
    }))

    const summaryWs = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWs, "All Buildings Summary")

    // Create individual worksheets for each building
    assessments.forEach((assessment) => {
      const buildingName = assessment.buildingInfo.buildingName || `Building ${assessment.id.substring(0, 4)}`
      
      // Create detailed data for this building
      const detailedData = [
        ["Building Information", ""],
        ["Building Name", assessment.buildingInfo.buildingName],
        ["Address", assessment.buildingInfo.address],
        ["Screener", assessment.buildingInfo.screenerName],
        ["Assessment Date", format(assessment.buildingInfo.assessmentDate, "PP")],
        ["", ""],
        ["Building Details", ""],
        ["Building Type", assessment.selectedBuildingType],
        ["Year Constructed", assessment.yearConstructed],
        ["Soil Type", assessment.soilType + (assessment.soilType === "Soil Type E" ? ` (${assessment.soilTypeEStories})` : "")],
        ["", ""],
        ["Irregularities", ""],
        ["Severe Vertical", assessment.irregularities.severeVertical ? "Yes" : "No"],
        ["Moderate Vertical", assessment.irregularities.moderateVertical ? "Yes" : "No"],
        ["Plan Irregularity", assessment.irregularities.planIrregularity ? "Yes" : "No"],
        ["", ""],
        ["Assessment Result", ""],
        ["Final Score", assessment.score.toFixed(1)],
        ["Result", assessment.score > 2 ? "PASSED" : "FAILED"],
        ["Recommendation", assessment.recommendation],
      ]

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(detailedData)
      XLSX.utils.book_append_sheet(wb, ws, buildingName.substring(0, 30)) // Excel sheet names limited to 31 chars
    })

    // Add copyright footer to each worksheet
    const copyrightText = `© ${new Date().getFullYear()} BUILDCHECK - Generated on ${format(new Date(), "PP")}`
    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName]
      const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
      const lastRow = range.e.r + 2 // Add some space after the last row
      const cell = XLSX.utils.encode_cell({ r: lastRow, c: 0 })
      ws[cell] = { t: "s", v: copyrightText }
      
      // Update the worksheet range to include the copyright
      const newRange = XLSX.utils.encode_range({
        s: { r: range.s.r, c: range.s.c },
        e: { r: lastRow, c: range.e.c }
      })
      ws["!ref"] = newRange
    }

    // Generate filename
    const filename = `BUILDCHECK_Assessment_${format(new Date(), "yyyyMMdd")}.xlsx`
    
    // Export the workbook
    XLSX.writeFile(wb, filename)
  }

  return (
    <BuildingAssessmentsContext.Provider
      value={{
        assessments,
        currentAssessmentId,
        addAssessment,
        updateAssessment,
        deleteAssessment,
        setCurrentAssessment,
        getCurrentAssessment,
        exportToExcel,
      }}
    >
      {children}
    </BuildingAssessmentsContext.Provider>
  )
}

// Create a hook to use the context
export function useBuildingAssessments() {
  const context = useContext(BuildingAssessmentsContext)
  if (context === undefined) {
    throw new Error("useBuildingAssessments must be used within a BuildingAssessmentsProvider")
  }
  return context
}