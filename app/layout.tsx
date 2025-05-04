import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Builcheck App',
  description: 'BUILDCHECK is a user-friendly tool designed to help engineers, building inspectors, and building owners assess the structural integrity of buildings using FEMA P-154 guidelines.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
