import { Scale, Info, FileText } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scale className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-tight">
              ComplainCraft
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">দাবী - Consumer Rights Helper</p>
          </div>
        </div>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
            <Info className="h-4 w-4" />
            About
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
            <FileText className="h-4 w-4" />
            Guide
          </Button>
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
