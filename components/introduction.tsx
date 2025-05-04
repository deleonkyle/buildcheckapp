"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface IntroductionProps {
  onNext: () => void
}

export default function Introduction({ onNext }: IntroductionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-center">Welcome to BUILDCHECK!</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M3 21h18"></path>
              <path d="M5 21V7l8-4v18"></path>
              <path d="M19 21V11l-6-4"></path>
              <path d="M9 9h1"></path>
              <path d="M9 12h1"></path>
              <path d="M9 15h1"></path>
              <path d="M9 18h1"></path>
            </svg>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <p>
            BUILDCHECK is a user-friendly tool designed to help engineers, building inspectors, and building owners
            assess the structural integrity of buildings using FEMA P-154 guidelines. By selecting a building type and
            checking relevant parameters, the tool will determine whether the structure passes Level 1 screening or
            requires further assessment.
          </p>

          <p className="font-semibold">Reminders:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Double-check all inputs before proceeding to the next step. Incomplete or incorrect data may lead to
              inaccurate results.
            </li>
            <li>This tool is not a substitute for professional structural analysis.</li>
            <li>BUILDCHECK provides preliminary screening and does not replace detailed structural analysis.</li>
            <li>It does not consider material deterioration, construction quality, or detailed seismic performance.</li>
            <li>BUILDCHECK is based on the FEMA P-154 High Seismicity Screening Form.</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onNext}>Next</Button>
      </CardFooter>
    </Card>
  )
}
