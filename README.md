# web-and-store

Evol's landing page and web store built with Next.js 16, React 19, and Tailwind CSS 4.

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS 4, shadcn/ui, Base UI
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with tw-animate-css
- **Animations**: Embla Carousel, Radix UI, Vaul
- **Charts**: Recharts
- **Linting**: Biome

## Scripts

```bash
pnpm dev       # Start dev server
pnpm build     # Build for production
pnpm start     # Start production server
pnpm check     # Run Biome linter
pnpm format    # Auto-format with Biome
```

## Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions (e.g., `cn` helper)

## Setup

The setup is straightforward as with any other next.js app.

```bash
# Clone the repo first
git clone https://github.com/Evol-Jewels/web-and-store.git
cd web-and-store

pnpm install
pnpm dev
```

## Notes

- Use pnpm for package management (installs, builds)
- Keep code simple with proper type definitions and a production-first mindset
- Keep structure modular; limit file sizes, reuse utils/helpers
- Use shadcn/ui components; do not recreate unless required
- Run `pnpm check` before committing to catch lint issues
- Run `pnpm format` to auto-format code
