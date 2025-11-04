# UK Timber Span Calculator

A mobile-first Progressive Web App (PWA) that provides quick, accurate timber span lookups for UK construction professionals. Designed for floor joists with reference to UK Building Regulations Approved Document A.

## Features

- **Quick Lookup**: Instant span calculations for common timber sizes
- **Mobile-First**: Responsive design that works perfectly on phones and tablets
- **Offline Capable**: Works without internet connection once loaded
- **Building Regs Compliant**: Data based on UK Building Regulations Approved Document A
- **Visual Feedback**: Color-coded results showing span capability

## Tech Stack

- React 19 with Vite
- Tailwind CSS for styling
- PWA with Service Worker for offline capability
- JSON data storage for span tables

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

### Deployment

The built files in the `dist` directory can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Any web server

## Data Sources

Span data is based on:
- Building Regulations Approved Document A (Structure)
- Standard domestic loading (0.25 kN/m² dead load + 1.5 kN/m² imposed load)
- Timber grade: C16 softwood
- Deflection limit: span/333

## Features Included

### MVP (Current)
- Floor joists calculator
- 4 common timber sizes (47x100mm to 47x225mm)
- 3 standard spacings (400mm, 450mm, 600mm centers)
- C16 timber grade
- Mobile-responsive design
- PWA with offline support

## Disclaimer

This tool is for guidance only and is not a substitute for professional structural engineering advice. Always consult a qualified structural engineer for definitive calculations.

## License

ISC

## Version

1.0.0 - November 2025