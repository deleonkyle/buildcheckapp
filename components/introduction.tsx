"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Shield, CheckCircle, Smartphone, PlusCircle, Building, FileDown } from "lucide-react"

interface IntroductionProps {
  onNext: () => void
}

export default function Introduction({ onNext }: IntroductionProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-6 px-6">
        <CardTitle className="text-center text-xl font-bold flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-md">
            <img src="/images/logo.webp" alt="BuildCheck Logo" className="w-10 h-10 object-contain" />
          </div>
          Welcome to BUILDCHECK
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-5 px-5 space-y-5">
        <p className="text-sm leading-relaxed text-gray-700">
          <span className="font-semibold text-blue-700">BUILDCHECK</span> is a user-friendly tool designed to help
          engineers, building inspectors, and owners assess structural integrity using FEMA P-154 guidelines. It
          determines if a building passes Level 1 screening or needs further evaluation.
        </p>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-700 flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4" />
            Important Reminders
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-700">
            {[
              "Double-check all inputs before proceeding to the next step.",
              "This tool is not a substitute for professional structural analysis.",
              "BUILDCHECK only provides preliminary screening.",
              "It does not assess material deterioration or seismic performance in detail.",
              "Based on the FEMA P-154 High Seismicity Screening Form.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4" />
            How to Use on Mobile
          </h3>
          <ul className="space-y-3.5 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <PlusCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Adding Buildings</p>
                <p className="text-gray-600 text-xs mt-0.5">Tap the "Add Building" button in the Buildings tab to create a new assessment.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Building className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Building Selection</p>
                <p className="text-gray-600 text-xs mt-0.5">Tap on any existing building in the list to select and continue working on it.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <FileDown className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Export & Sharing</p>
                <p className="text-gray-600 text-xs mt-0.5">Switch to the Export tab to download all assessment data in Excel format. In the Results screen, you can also download PDF reports or share via email.</p>
              </div>
            </li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-2">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-5 rounded-lg flex items-center justify-center gap-2 transition-all"
          onClick={onNext}
        >
          Get Started
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
