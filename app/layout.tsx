import { Geist, Geist_Mono, Raleway, Nunito_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { cn } from "@/lib/utils";

const nunitoSansHeading = Nunito_Sans({subsets:['latin'],variable:'--font-heading'});

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", raleway.variable, nunitoSansHeading.variable)}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <div className="flex-1">
                  {children}
                </div>
              </div>
              <Toaster position="bottom-center" />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
