"use client"

import { useState } from "react"
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
  const [usedParameters, setUsedParameters] = useState({})
  const [recommendation, setRecommendation] = useState("")

  const calculateScore = () => {
    if (!selectedBuildingType || !buildingData[selectedBuildingType]) {
      return 0
    }

    const currentBuilding = buildingData[selectedBuildingType]
    let calculatedScore = currentBuilding.BasicScore
    const parameters = { BasicScore: calculatedScore }

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

    const currentIndex = panelOrder.indexOf(currentPanel)
    if (currentIndex < panelOrder.length - 1) {
      setCurrentPanel(panelOrder[currentIndex + 1])
    }
  }

  const handleBack = () => {
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

    const currentIndex = panelOrder.indexOf(currentPanel)
    if (currentIndex > 0) {
      setCurrentPanel(panelOrder[currentIndex - 1])
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
    setUsedParameters({})
    setRecommendation("")
    setCurrentPanel("introduction")
  }

  const handleCalculateResults = () => {
    calculateScore()
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
        return <Introduction onNext={handleNext} />
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">{renderPanel()}</div>
    </main>
  )
}
