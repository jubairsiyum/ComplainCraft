# ComplainCraft (দাবী)

A modern, professional single-page React application that helps users in Bangladesh file formal consumer complaints. The app transforms user input into structured complaint analyses and formal complaint drafts with a beautiful, accessible UI.

## ✨ Features

### Core Functionality
- 🇧🇩 **Full Bengali Language Support** - Noto Sans Bengali font for authentic typography
- 📋 **15 Issue Types** - Comprehensive coverage of consumer complaints
- 🔄 **Dynamic Form Fields** - Smart fields that appear based on selected issue types
- 📊 **Professional Analysis** - Structured complaint breakdown with legal references
- 📝 **Editable Drafts** - Edit, print, download, or copy complaint letters
- ⚡ **Real-time Generation** - 2-second simulated processing

### Professional Design
- 🎨 **Modern UI** - Clean, professional interface with shadcn/ui components
- 🌓 **Dark/Light Mode** - Theme switcher with system preference detection
- 📱 **Fully Responsive** - Seamless experience on mobile, tablet, and desktop
- 🎯 **Sticky Header** - Always-accessible navigation
- ↑ **Scroll to Top** - Quick navigation for long pages
- 🦶 **Rich Footer** - Resources, contact info, and social links

### User Experience
- ♿ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- 🎭 **Smooth Transitions** - Elegant theme switching and animations
- 💾 **Local Storage** - Theme preference persistence
- 🖨️ **Print Optimized** - Professional printing support
- 📥 **Download Support** - Save complaints as text files

## 🎨 Design System

### Components
- **Header**: Sticky navigation with logo, theme toggle, and action buttons
- **Hero**: Eye-catching introduction with feature highlights
- **Form**: Dynamic, context-aware input fields with validation
- **Analysis Card**: Professional summary with gradient header and grid layout
- **Draft Card**: Editable complaint letter with multiple action buttons
- **Footer**: Comprehensive footer with links and contact information
- **Scroll to Top**: Floating action button for easy navigation

### Theme Support
- Light mode (default)
- Dark mode
- System preference detection
- Smooth color transitions
- Persistent storage

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Noto Sans Bengali

## Project Structure

```
ComplainCraft/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx       # Reusable button component
│   │   │   ├── card.tsx         # Card component with variants
│   │   │   └── textarea.tsx     # Textarea component
│   │   ├── AnalysisCard.tsx     # Displays complaint analysis
│   │   ├── ComplaintForm.tsx    # Input form for complaints
│   │   ├── DraftCard.tsx        # Shows and copies formal draft
│   │   ├── Header.tsx           # App header with title
│   │   └── Spinner.tsx          # Loading spinner
│   ├── lib/
│   │   └── utils.ts             # Utility functions (cn helper)
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles with Tailwind
├── public/
├── index.html                   # HTML template with Bengali font
├── package.json
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration
```

## How It Works

1. **User Input**: Users enter their complaint in simple Bangla in the textarea
2. **Submission**: Click "Submit Complaint (অভিযোগ জমা দিন)" button
3. **Processing**: A 2-second simulated API call analyzes the complaint
4. **Results**: Two cards are displayed:
   - **Analysis Card**: Shows identified issue, details, violated law, and potential penalty
   - **Draft Card**: Contains the formal complaint letter in Bengali with copy functionality

## Mock Data

The app currently uses mock data that simulates an overpricing complaint:

```typescript
{
  analysis: {
    identifiedIssue: "Overpricing (অতিমূল্য)",
    extractedDetails: "Company: 'Amana Big Bazar', Price Paid: '50 taka', Advertised Price: '45 taka'",
    violatedLaw: "Section 40, Consumer Rights Protection Act, 2009",
    potentialPenalty: "Imprisonment for up to one year, or a fine of up to 50,000 Taka, or both."
  },
  draft: "বরাবর,\nমহাপরিচালক,\nজাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর..."
}
```

## Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd "d:\8th Semester\Research & Innovation\ComplainCraft"
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5174/
   ```
   (Port may vary if 5174 is in use)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Acceptance Criteria ✅

- ✅ The page shows header, textarea, and submit button
- ✅ Clicking submit shows loading for ~2 seconds, then displays two result cards
- ✅ Analysis card displays the 4 required items (issue, details, law, penalty)
- ✅ Draft card shows Bengali formal complaint and a working "Copy Complaint Text" button with feedback
- ✅ Responsive layout with cards side-by-side on desktop and stacked on mobile
- ✅ Uses shadcn/ui components + Tailwind and the specified Bengali font (Noto Sans Bengali)
- ✅ Accessible (aria labels, keyboard navigation, proper contrast)

## Future Enhancements

Some optional features that could be added:

- 🔍 Auto-detect and highlight monetary values and company names
- ✏️ Allow users to edit the generated draft before copying
- 💾 Save complaint history in localStorage (with consent)
- 📄 "Download as PDF" option for the final draft
- ℹ️ Explanation modal about consumer rights and Section 40

## Components Overview

### Header
Displays the app title and subtitle.

### ComplaintForm
- Large textarea for user input
- Submit button (disabled when empty or loading)
- Controlled component pattern

### AnalysisCard
Shows structured analysis with:
- Identified Issue
- Extracted Details
- Violated Law
- Potential Penalty

### DraftCard
- Read-only textarea with the formal complaint
- Copy button with visual feedback
- Success message on copy

### Spinner
Loading indicator shown during the simulated API call.

## Accessibility Features

- ARIA labels on interactive elements
- ARIA live regions for dynamic content updates
- Keyboard-accessible controls with visible focus states
- High contrast text for readability
- Semantic HTML structure
- Screen reader friendly announcements

## License

This project is for educational/research purposes.

## Contact

Created for Research & Innovation - 8th Semester Project
