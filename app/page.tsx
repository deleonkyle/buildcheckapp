"use client"

import { useState, useEffect } from "react"
import BuildingInfo from "@/components/building-info"
import BuildingType from "@/components/building-type"
import SevereVerticalIrregularity from "@/components/severe-vertical-irregularity"
import ModerateVerticalIrregularity from "@/components/moderate-vertical-irregularity"
import PlanIrregularity from "@/components/plan-irregularity"
import BuildingAge from "@/components/building-age"
import SoilType from "@/components/soil-type"
import Results from "@/components/results"
import Summary from "@/components/summary"
import Introduction from "@/components/introduction"
import { buildingData } from "@/lib/building-data"
import { Progress } from "@/components/ui/progress"
import { Toaster } from "@/components/ui/toaster"
import { useBuildingAssessments } from "@/contexts/BuildingAssessmentsContext"
import BuildingAssessmentManager from "@/components/building-assessment-manager"
import { Info } from "lucide-react"

export default function Home() {
  const [currentPanel, setCurrentPanel] = useState("introduction")
  const [buildingInfo, setBuildingInfo] = useState({
    buildingName: "",
    address: "",
    screenerName: "",
    assessmentDate: new Date(),
  })
  const [selectedBuildingType, setSelectedBuildingType] = useState("")
  const [irregularities, setIrregularities] = useState({
    severeVertical: false,
    moderateVertical: false,
    planIrregularity: false,
  })
  const [yearConstructed, setYearConstructed] = useState("")
  const [soilType, setSoilType] = useState("")
  const [soilTypeEStories, setSoilTypeEStories] = useState("")
  const [score, setScore] = useState(0)
  interface BuildingParameters {
    BasicScore: number;
    SevereVertical?: number;
    ModerateVertical?: number;
    PlanIrregularity?: number;
    Precode?: number;
    PostBenchmark?: number;
    SoilAB?: number;
    SoilE_1to3?: number;
    SoilE_Over3?: number;
  }

  const [usedParameters, setUsedParameters] = useState<BuildingParameters>({BasicScore: 0})
  const [recommendation, setRecommendation] = useState("")

  const panelOrder = [
    "introduction",
    "buildingInfo",
    "buildingType",
    "severeVertical",
    "moderateVertical",
    "planIrregularity",
    "buildingAge",
    "soilType",
    "results",
  ]

  const currentStep = panelOrder.indexOf(currentPanel) + 1
  const totalSteps = panelOrder.length
  const progressPercentage = (currentStep / totalSteps) * 100

  const calculateScore = () => {
    if (!selectedBuildingType || !buildingData[selectedBuildingType as keyof typeof buildingData]) {
      return 0
    }

    const currentBuilding = buildingData[selectedBuildingType as keyof typeof buildingData]
    let calculatedScore = currentBuilding.BasicScore
    const parameters: BuildingParameters = { BasicScore: calculatedScore }

    if (irregularities.severeVertical) {
      calculatedScore += currentBuilding.SevereVertical
      parameters.SevereVertical = currentBuilding.SevereVertical
    }

    if (irregularities.moderateVertical) {
      calculatedScore += currentBuilding.ModerateVertical
      parameters.ModerateVertical = currentBuilding.ModerateVertical
    }

    if (irregularities.planIrregularity) {
      calculatedScore += currentBuilding.PlanIrregularity
      parameters.PlanIrregularity = currentBuilding.PlanIrregularity
    }

    if (yearConstructed === "Before 1972" && currentBuilding.Precode) {
      calculatedScore += currentBuilding.Precode
      parameters.Precode = currentBuilding.Precode
    } else if (yearConstructed === "After 1992" && currentBuilding.PostBenchmark) {
      calculatedScore += currentBuilding.PostBenchmark
      parameters.PostBenchmark = currentBuilding.PostBenchmark
    }

    if ((soilType === "Soil Type A" || soilType === "Soil Type B") && currentBuilding.SoilAB) {
      calculatedScore += currentBuilding.SoilAB
      parameters.SoilAB = currentBuilding.SoilAB
    } else if (soilType === "Soil Type E") {
      if (soilTypeEStories === "1-3 stories" && currentBuilding.SoilE_1to3) {
        calculatedScore += currentBuilding.SoilE_1to3
        parameters.SoilE_1to3 = currentBuilding.SoilE_1to3
      } else if (soilTypeEStories === ">3 stories" && currentBuilding.SoilE_Over3) {
        calculatedScore += currentBuilding.SoilE_Over3
        parameters.SoilE_Over3 = currentBuilding.SoilE_Over3
      }
    }

    calculatedScore = Math.max(calculatedScore, currentBuilding.MinScore)

    setScore(calculatedScore)
    setUsedParameters(parameters)

    if (calculatedScore > 2) {
      setRecommendation("")
    } else {
      setRecommendation(
        "Proceed to Level 2 Assessment and consult a licensed structural engineer for detailed evaluation.",
      )
    }

    return calculatedScore
  }

  const handleNext = () => {
    const currentIndex = panelOrder.indexOf(currentPanel)
    if (currentIndex < panelOrder.length - 1) {
      setCurrentPanel(panelOrder[currentIndex + 1])
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    const currentIndex = panelOrder.indexOf(currentPanel)
    if (currentIndex > 0) {
      setCurrentPanel(panelOrder[currentIndex - 1])
      window.scrollTo(0, 0)
    }
  }

  const handleStartOver = () => {
    setBuildingInfo({
      buildingName: "",
      address: "",
      screenerName: "",
      assessmentDate: new Date(),
    })
    setSelectedBuildingType("")
    setIrregularities({
      severeVertical: false,
      moderateVertical: false,
      planIrregularity: false,
    })
    setYearConstructed("")
    setSoilType("")
    setSoilTypeEStories("")
    setScore(0)
    setUsedParameters({ BasicScore: 0 })
    setRecommendation("")
    setCurrentPanel("introduction")
    window.scrollTo(0, 0)
  }

  const { getCurrentAssessment, updateAssessment } = useBuildingAssessments();

  // Load the selected building's data into the form when currentAssessmentId changes
  useEffect(() => {
    const assessment = getCurrentAssessment();
    if (assessment) {
      setBuildingInfo(assessment.buildingInfo);
      setSelectedBuildingType(assessment.selectedBuildingType);
      setIrregularities(assessment.irregularities);
      setYearConstructed(assessment.yearConstructed);
      setSoilType(assessment.soilType);
      setSoilTypeEStories(assessment.soilTypeEStories);
      setScore(assessment.score);
      setUsedParameters(assessment.usedParameters as unknown as BuildingParameters);
      setRecommendation(assessment.recommendation);
    }
  }, [getCurrentAssessment]);

  const handleCalculateResults = () => {
    const calculatedScore = calculateScore();
    const assessment = getCurrentAssessment();
    if (assessment) {
      updateAssessment(assessment.id, {
        buildingInfo,
        selectedBuildingType,
        irregularities,
        yearConstructed,
        soilType,
        soilTypeEStories,
        score: calculatedScore,
        usedParameters: usedParameters as unknown as Record<string, number>,
        recommendation,
        completed: true
      });
    }
  }

  const renderPanel = () => {
    switch (currentPanel) {
      case "introduction":
        return <Introduction onNext={handleNext} />
      case "buildingInfo":
        return <BuildingInfo buildingInfo={buildingInfo} setBuildingInfo={setBuildingInfo} onNext={handleNext} />
      case "buildingType":
        return (
          <BuildingType
            selectedBuildingType={selectedBuildingType}
            setSelectedBuildingType={setSelectedBuildingType}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case "severeVertical":
        return (
          <SevereVerticalIrregularity
            checked={irregularities.severeVertical}
            onChange={(checked) => setIrregularities({ ...irregularities, severeVertical: checked })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case "moderateVertical":
        return (
          <ModerateVerticalIrregularity
            checked={irregularities.moderateVertical}
            onChange={(checked) => setIrregularities({ ...irregularities, moderateVertical: checked })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case "planIrregularity":
        return (
          <PlanIrregularity
            checked={irregularities.planIrregularity}
            onChange={(checked) => setIrregularities({ ...irregularities, planIrregularity: checked })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case "buildingAge":
        return (
          <BuildingAge
            yearConstructed={yearConstructed}
            setYearConstructed={setYearConstructed}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case "soilType":
        return (
          <SoilType
            soilType={soilType}
            setSoilType={setSoilType}
            soilTypeEStories={soilTypeEStories}
            setSoilTypeEStories={setSoilTypeEStories}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case "results":
        return (
          <Results
            onCalculate={handleCalculateResults}
            score={score}
            recommendation={recommendation}
            onNext={handleStartOver}
            onBack={handleBack}
            buildingInfo={buildingInfo}
            selectedBuildingType={selectedBuildingType}
            irregularities={irregularities}
            yearConstructed={yearConstructed}
            soilType={soilType}
            soilTypeEStories={soilTypeEStories}
          />
        )
      case "summary":
        return (
          <Summary
            buildingInfo={buildingInfo}
            selectedBuildingType={selectedBuildingType}
            irregularities={irregularities}
            yearConstructed={yearConstructed}
            soilType={soilType}
            soilTypeEStories={soilTypeEStories}
            score={score}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">BUILDCHECK</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Building Structural Assessment Tool based on FEMA P-154 Rapid Visual Screening
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex items-start">
            <Info className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-blue-700 ml-2">
              Create multiple building assessments and export them all to Excel. Select a building to edit or create a new one.
            </p>
          </div>
          <BuildingAssessmentManager />
        </div>

        {currentPanel !== "introduction" && (
          <div className="mb-5">
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-1">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 space-touch">
          {renderPanel()}
        </div>
      </div>
      <Toaster />
    </main>
  )
}
