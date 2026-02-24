# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Magic Portfolio is a Next.js-based portfolio template built with React 19, TypeScript, and MDX for content. It uses the Once UI design system for components and styling. The template is highly configurable through TypeScript configuration files rather than traditional config files.

## Quick Start

### Common Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Format and lint code (using Biome)
npm run biome-write
npm run lint

# Export static HTML (for static deployment)
npm run export
```

### Development Workflow

1. **Configuration Changes**: Edit `src/resources/once-ui.config.ts` (styles, themes, effects) or `src/resources/content.tsx` (site content)
2. **Create Blog Posts**: Add `.mdx` files to `src/app/blog/posts/`
3. **Create Work Projects**: Add `.mdx` files to `src/app/work/projects/`
4. **Add Components**: Create `.tsx` files in `src/components/` (often with `.module.scss` for styling)
5. **Format Code**: Code is automatically formatted on commit via lint-staged + Biome

## Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with theme/font setup
│   ├── page.tsx                 # Home page
│   ├── api/                     # API routes (authenticate, RSS feed)
│   ├── blog/
│   │   ├── page.tsx            # Blog list
│   │   ├── [slug]/page.tsx      # Individual blog post
│   │   └── posts/              # MDX blog post files
│   ├── work/
│   │   ├── page.tsx            # Work/projects list
│   │   ├── [slug]/page.tsx      # Individual project detail
│   │   └── projects/           # MDX project files
│   ├── about/                   # About/CV page
│   └── gallery/                 # Gallery page
├── components/                   # Reusable React components
│   ├── Header.tsx               # Main navigation
│   ├── Footer.tsx               # Footer with social links
│   ├── ThemeToggle.tsx          # Light/dark theme switcher
│   ├── RouteGuard.tsx           # Password protection for routes
│   ├── Providers.tsx            # Context providers (theme, etc)
│   ├── blog/                    # Blog-specific components
│   ├── work/                    # Work/project components
│   ├── about/                   # About page components
│   └── gallery/                 # Gallery components
├── resources/                    # Configuration and content
│   ├── once-ui.config.ts        # Style, theme, display, effects config
│   ├── content.tsx              # All site content (person, home, about, work, etc.)
│   ├── icons.ts                 # Icon imports from react-icons
│   ├── index.ts                 # Exports content.tsx
│   └── custom.css               # Custom CSS overrides
├── types/                        # TypeScript type definitions
├── utils/                        # Utility functions
│   ├── formatDate.ts            # Date formatting with relative/absolute
│   └── utils.ts                 # MDX file reading, slug generation
└── public/                       # Static assets
    └── images/
```

### Content System (MDX)

- **Blog Posts**: `src/app/blog/posts/*.mdx` - Rendered at `/blog/[slug]`
- **Work Projects**: `src/app/work/projects/*.mdx` - Rendered at `/work/[slug]`
- **MDX Frontmatter**: Each `.mdx` file includes YAML frontmatter with metadata:
  ```yaml
  ---
  title: "Post Title"
  publishedAt: "2024-01-15"
  summary: "Brief summary"
  image: "path/to/image"
  images: ["image1", "image2"]  # Gallery of images
  tag: "category"
  team: [{ name: "...", role: "...", avatar: "...", linkedIn: "..." }]
  link: "external-url"  # For project links
  ---
  ```
- **Automatic Slug Generation**: Slugs are derived from filename (without `.mdx`)
- Files are read at build time via utility functions in `src/utils/utils.ts`

### Configuration

**`src/resources/once-ui.config.ts`** - Controls appearance and behavior:
- `routes` - Enable/disable pages (home, about, work, blog, gallery)
- `display` - Show/hide location, time, theme switcher
- `protectedRoutes` - Password-protected URLs
- `style` - Theme, colors (brand, accent, neutral), borders, surfaces, transitions
- `effects` - Visual effects (mask, gradient, dots, grid, lines)
- `fonts` - Typefaces for heading, body, label, code
- `schema` - SEO schema data
- `sameAs` - Social links for schema
- `socialSharing` - Blog post sharing options

**`src/resources/content.tsx`** - All dynamic content:
- `person` - Name, role, email, location, languages
- `social` - Social media links
- `home` - Home page content
- `about` - About page content and CV
- `work` - Work/projects sections
- `blog` - Blog page description
- `gallery` - Gallery sections

### Key Components

- **Providers.tsx** - Sets up theme context and client-side effects
- **RouteGuard.tsx** - Protects routes with password (from `protectedRoutes` config)
- **ThemeToggle.tsx** - Light/dark theme switcher
- **HeadingLink.tsx** - Copyable heading links for blog posts
- **ScrollToHash.tsx** - Scrolls to anchor on page load

### Utilities

- **`formatDate(date: string, includeRelative?: boolean)`** - Formats dates as "Month Day, Year" with optional relative time ("3d ago")
- **`getMDXFiles(dir: string)`** - Returns array of `.mdx` filenames from directory
- **`readMDXFile(filePath: string)`** - Reads MDX file and parses frontmatter using gray-matter
- **`getMDXData(dir: string)`** - Combines above to return all MDX files with metadata and content
- **`getPosts(customPath?: string[])`** - Convenience wrapper for getting posts from standard paths

### Styling

- **CSS Framework**: Once UI components (from `@once-ui-system/core`)
- **Preprocessor**: SASS (modern compiler, no legacy JS API)
- **Component Scoping**: Most components have `.module.scss` for scoped styles
- **Global Styles**: `src/resources/custom.css` for overrides
- **Breakpoints**: Defined in `src/components/breakpoints.scss`
- **CSS Variables**: Once UI provides design tokens as CSS custom properties (colors, spacing, etc.)

## Important Notes

### MDX and Next.js App Router

- MDX files are treated as pages via `next.config.mjs` `pageExtensions` configuration
- Dynamic routes use `[slug]` pattern to match filenames
- Content is read and parsed at build time, not runtime
- The `readMDXFile` function uses `notFound()` from `next/navigation` - don't suppress this

### Password Protection

- Configure protected routes in `once-ui.config.ts` `protectedRoutes` object
- Password is set in `.env` file via `NEXT_PUBLIC_PROTECTION_PASSWORD` (set in `.env.example`)
- RouteGuard component checks password and redirects if missing

### SEO and Metadata

- Automatic OG image generation via `next/og`
- Schema markup auto-generated based on content
- Metadata generated from MDX frontmatter
- Use `Meta.generate()` from Once UI core in layout files

### Type Safety

- All configuration types are defined in `src/types/` - check these before modifying config files
- Component props should be properly typed
- TypeScript strict mode is enabled in `tsconfig.json`

### Formatting and Linting

- **Tool**: Biome (not ESLint - ESLint is a dev dependency but Biome is the actual formatter)
- **Config**: `biome.json` defines formatting rules (2-space indent, 100 char line width, double quotes)
- **Pre-commit**: Lint-staged hooks run Biome check and format on staged files (`.lintstagedrc.js`)
- **Manual Format**: Run `npm run biome-write` to format entire codebase

### Environment

- Node.js v18.17+ required (specified in README)
- `.env.example` shows required environment variables

## Testing

Currently no tests exist. Recommended areas to add tests:
- Utility functions (`formatDate`, MDX file reading)
- API routes (authentication, RSS generation)
- Date formatting edge cases (timezone handling, month boundaries)
- MDX parsing and metadata extraction
