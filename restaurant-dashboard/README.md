# Restaurant Admin Dashboard

Production-ready React admin panel for restaurant operations: POS sales, orders, menu/products, inventory, customers, staff, reports, and settings.

## Stack

- React 19 + Vite 8
- React Router 7
- Tailwind CSS 4
- Lucide React icons
- react-hot-toast

Data is stored in the browser (`localStorage`) for demo/offline use. No backend API is required.

## Requirements

- Node.js `>= 20.19.0`

## Scripts

```bash
cd restaurant-dashboard
npm install
npm run dev      # local development
npm run build    # production build → dist/
npm run preview  # preview production build
npm run lint     # ESLint
```

## Demo login

| Role    | Email                 | Password    |
|---------|-----------------------|-------------|
| Admin   | admin@restaurant.com  | admin123    |
| Manager | ali@restaurant.com    | manager123  |

Cashier/waiter accounts cannot access the admin panel.

## Deploy (Vercel)

Repository root (`Food-print`) already includes `vercel.json` that builds `restaurant-dashboard` and serves `restaurant-dashboard/dist` with SPA rewrites.

```bash
vercel --prod
```

## Project structure

```
restaurant-dashboard/
  src/
    components/   # UI, layout, feature modals
    context/      # Auth + app data providers
    data/         # Seed / demo data
    lib/          # format + storage helpers
    pages/        # Route screens
    routes/       # App routing
```
