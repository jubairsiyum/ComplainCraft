export function Hero() {
  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          Bangladesh Consumer Rights Protection
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
          ComplainCraft (দাবী)
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          File formal consumer complaints in Bangladesh with ease. Just fill in the details, 
          and we'll help you create a professional complaint draft.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
            ✓ Consumer Rights Act 2009
          </span>
          <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
            ✓ Professional Format
          </span>
          <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
            ✓ Bengali Language
          </span>
        </div>
      </div>
    </section>
  )
}
