"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface IntroductionProps {
  onNext: () => void
}

export default function Introduction({ onNext }: IntroductionProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-blue-600 text-white py-6">
        <CardTitle className="text-center text-lg sm:text-xl font-bold">
          Welcome to BUILDCHECK!
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 px-4 sm:px-6">
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
            <img
              src="/images/logo.webp"
              alt="BuildCheck Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            />
          </div>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-gray-700">
          <p className="text-justify leading-relaxed">
            <strong>BUILDCHECK</strong> is a user-friendly tool designed to help engineers, building inspectors, and
            owners assess structural integrity using FEMA P-154 guidelines. It determines if a building passes Level 1
            screening or needs further evaluation.
          </p>

          <div>
            <p className="font-semibold">Reminders:</p>
            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li>Double-check all inputs before proceeding to the next step.</li>
              <li>This tool is not a substitute for professional structural analysis.</li>
              <li>BUILDCHECK only provides preliminary screening.</li>
              <li>It does not assess material deterioration or seismic performance in detail.</li>
              <li>Based on the FEMA P-154 High Seismicity Screening Form.</li>
            </ol>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end px-4 sm:px-6 pb-4 sm:pb-6">
        <Button className="w-full sm:w-auto" onClick={onNext}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
