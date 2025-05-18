"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BuildingInfoProps {
  buildingInfo: {
    buildingName: string
    address: string
    screenerName: string
    assessmentDate: Date
  }
  setBuildingInfo: (info: any) => void
  onNext: () => void
}

export default function BuildingInfo({ buildingInfo, setBuildingInfo, onNext }: BuildingInfoProps) {
  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-center">Building Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="buildingName">Building Name</Label>
          <Input
            id="buildingName"
            value={buildingInfo.buildingName}
            onChange={(e) => setBuildingInfo({ ...buildingInfo, buildingName: e.target.value })}
            placeholder="Enter building name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={buildingInfo.address}
            onChange={(e) => setBuildingInfo({ ...buildingInfo, address: e.target.value })}
            placeholder="Enter address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenerName">Name of Screener</Label>
          <Input
            id="screenerName"
            value={buildingInfo.screenerName}
            onChange={(e) => setBuildingInfo({ ...buildingInfo, screenerName: e.target.value })}
            placeholder="Enter screener name"
          />
        </div>

        <div className="space-y-2">
          <Label>Date of Assessment</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !buildingInfo.assessmentDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {buildingInfo.assessmentDate ? format(buildingInfo.assessmentDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={buildingInfo.assessmentDate}
                onSelect={(date) => setBuildingInfo({ ...buildingInfo, assessmentDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onNext}>Next</Button>
      </CardFooter>
    </Card>
  )
}
