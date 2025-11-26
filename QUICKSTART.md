# Quick Start Guide

## Running the Application

The npm scripts have been fixed to work with paths containing spaces. Simply run:

```powershell
cd "d:\8th Semester\Research & Innovation\ComplainCraft"
npm run dev
```

The application will be available at: **http://localhost:5174/** (or another port if 5174 is in use)

## Testing the Application

1. Open http://localhost:5174/ in your browser
2. Enter a complaint in Bengali in the textarea (or any text to test)
3. Click "Submit Complaint (অভিযোগ জমা দিন)"
4. Wait 2 seconds for the loading animation
5. View the two result cards:
   - **Analysis Card** on the left
   - **Draft Card** on the right
6. Click "Copy Complaint Text" to copy the draft to clipboard
7. Verify the "Copied!" success message appears

## Responsive Testing

- **Desktop**: Cards appear side-by-side
- **Tablet/Mobile**: Cards stack vertically
- Resize your browser window to see the responsive behavior

## Accessibility Testing

- Tab through elements to test keyboard navigation
- Focus states should be visible
- Screen reader should announce loading states and results

## Building for Production

```powershell
Set-Location "d:\8th Semester\Research & Innovation\ComplainCraft"; npm run build
```

## Files Created

- `src/components/Header.tsx` - App header
- `src/components/ComplaintForm.tsx` - Input form
- `src/components/AnalysisCard.tsx` - Analysis display
- `src/components/DraftCard.tsx` - Draft display with copy
- `src/components/Spinner.tsx` - Loading indicator
- `src/components/ui/button.tsx` - shadcn button
- `src/components/ui/card.tsx` - shadcn card
- `src/components/ui/textarea.tsx` - shadcn textarea
- `src/lib/utils.ts` - Utility functions
- `src/App.tsx` - Main application
- `src/index.css` - Tailwind styles
- `index.html` - HTML with Bengali font
- `tailwind.config.js` - Tailwind config
- `vite.config.ts` - Vite config with path alias

## All Requirements Met ✅

✅ Clean, modern, readable UI with centered content column  
✅ Full Bengali UI with Noto Sans Bengali font  
✅ Responsive across mobile/tablet/desktop  
✅ shadcn/ui components with Tailwind CSS  
✅ Header with title and subtitle  
✅ Complaint input form with large textarea  
✅ Submit button (disabled when empty or loading)  
✅ Mock API with 2-second setTimeout  
✅ Loading spinner with "Analyzing..." text  
✅ Two-card results layout (side-by-side on desktop, stacked on mobile)  
✅ Analysis card with 4 required fields  
✅ Draft card with Bengali formal complaint  
✅ Copy button with success feedback  
✅ Accessible (ARIA labels, keyboard navigation, contrast)  
✅ TypeScript for type safety
