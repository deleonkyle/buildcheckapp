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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <BuildingAssessmentsProvider>
            {children}
          </BuildingAssessmentsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
