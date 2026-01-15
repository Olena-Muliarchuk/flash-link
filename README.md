# Flash Link

## Prerequisites

- Node.js 20+
- Docker & Docker Compose

## Installation

```bash
npm install
```

## Development

```bash
# Start Redis
npm run docker:up

# Start dev server
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run type-check` - Check TypeScript types
- `npm run validate` - Run all checks

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```
