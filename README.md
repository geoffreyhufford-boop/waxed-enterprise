# Waxed Enterprise

Landing page for Waxed Enterprise—the operating system for independent vinyl record stores.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Custom, minimal, no external UI kits

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
waxed-enterprise/
├── app/
│   ├── globals.css      # Tailwind directives + custom styles
│   ├── layout.tsx       # Root layout with metadata/SEO
│   └── page.tsx         # Main landing page
├── components/
│   ├── Navigation.tsx   # Fixed nav with mobile menu
│   ├── Hero.tsx         # Hero section with CTAs
│   ├── ProblemSolution.tsx
│   ├── Features.tsx     # 6-card feature grid
│   ├── Onboarding.tsx   # 5-step onboarding flow
│   ├── Trust.tsx        # Trust & safety section
│   ├── Pricing.tsx      # Pricing tiers
│   ├── FAQ.tsx          # Accordion FAQ
│   ├── Footer.tsx
│   ├── EarlyAccessModal.tsx  # Form modal with validation
│   └── index.ts         # Barrel exports
├── public/
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Features

- Responsive design (mobile-first)
- Accessible modal with focus trap and ESC to close
- Client-side form validation
- localStorage submission storage (ready for Supabase swap)
- Smooth scroll navigation
- SEO meta tags and OpenGraph

## Early Access Form

Form submissions are stored in `localStorage` under `waxed_submissions` and logged to console. To integrate with Supabase:

1. Add Supabase client
2. Replace localStorage calls in `EarlyAccessModal.tsx`
3. Create `early_access_submissions` table

## Customization

Colors are defined in `tailwind.config.ts` under `theme.extend.colors.waxed`. The palette follows a minimal, industrial aesthetic.

## License

Private—not for redistribution.
