# PremiumStays — Frontend

React 19 + Vite 8 SPA for the PremiumStays hotel booking platform.

See the [repository README](../README.md) for full setup, environment variables, and scripts.

```bash
npm install
cp .env.example .env   # set VITE_API_URL if needed
npm run dev            # http://localhost:5173
```

- **Design system** — brass/ink palette and component classes live in `src/index.css` with Tailwind tokens in `tailwind.config.js`.
- **Pages** — `src/pages` (Home, HotelDetails, Login, Register, MyBookings, HostDashboard, EditHotel, Profile, PaymentSuccess).
- **Routing** — `src/App.jsx`; SPA rewrites for Vercel are in `vercel.json`.