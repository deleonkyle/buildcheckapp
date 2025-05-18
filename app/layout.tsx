import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { BuildingAssessmentsProvider } from "@/contexts/BuildingAssessmentsContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BUILDCHECK",
  description: "Building Structural Assessment Tool",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} overscroll-none`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <BuildingAssessmentsProvider>
            {children}
          </BuildingAssessmentsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
