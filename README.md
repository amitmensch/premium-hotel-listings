# PremiumStays

A full-stack **premium hotel booking platform**. Guests browse a curated collection of luxury
properties, filter by destination and nightly rate, explore location maps, read guest reviews,
and pay securely with Stripe. Hosts publish listings with Cloudinary-hosted photo galleries, and
every user manages trips and their profile from a single account.

> Frontend · [`./frontend`](./frontend) · Backend · [`./backend`](./backend)

---

## Features

- **Curated hotel directory** — server-side pagination (6 per page) with filters for destination
  and maximum nightly price
- **Rich property pages** — photo gallery, amenity list, interactive **Leaflet** map, and guest
  reviews with 1–5 star ratings
- **Secure authentication** — JWT stored in an HTTP-only cookie, with role-based access control
  (`guest`, `host`, `admin`)
- **Stripe Checkout payments** — server-side price calculation (never trusts the client), with a
  guarded double-submit booking confirmation page
- **Host dashboard** — create and edit listings; upload **3–5 images** via Multer → Cloudinary
- **My Trips** — view reservations, cancel trips, and review property links
- **Profile management** — update name/email; delete account with cascading cleanup of bookings,
  reviews, and hosted properties
- **Premium minimal UI** — brass + warm-ink palette, Cormorant Garamond / Inter typography,
  restrained motion system with `prefers-reduced-motion` support

---

## Tech Stack

| Layer     | Technology |
| --------- | ---------- |
| Frontend  | React 19 · Vite 8 · React Router 7 · Tailwind CSS 3.4 · Axios · Leaflet + react-leaflet · react-icons |
| Backend   | Node.js · Express 5 · Mongoose 9 (MongoDB) · JSON Web Tokens · bcryptjs |
| Storage   | MongoDB (via Mongoose) · Cloudinary (property images) |
| Payments  | Stripe Checkout |
| Linting   | oxlint (frontend) |

---

## Project Structure

```
premium-hotel-listings/
├── backend/                     # Express REST API
│   ├── src/
│   │   ├── app.js               # App setup, CORS, middleware, route mounting
│   │   ├── server.js            # Server entry, DB connection, graceful shutdown
│   │   ├── config/db.js         # Mongoose connection
│   │   ├── controllers/         # auth, booking, hotel, review, user handlers
│   │   ├── middlewares/         # auth (JWT), error handler, Cloudinary upload
│   │   ├── models/              # Booking, Hotel, Review, User schemas
│   │   ├── routes/              # REST route definitions
│   │   └── utils/               # AppError, catchAsync
│   └── .env.example             # Backend environment template
└── frontend/                    # React SPA
    ├── src/
    │   ├── components/          # Navbar, HotelCard, Map, Reviews, ProtectedRoute
    │   ├── context/             # AuthContext (session state)
    │   ├── pages/               # Home, HotelDetails, Login, Register, MyBookings,
    │   │                        # HostDashboard, EditHotel, Profile, PaymentSuccess
    │   ├── services/api.js      # Axios instance (VITE_API_URL)
    │   ├── App.jsx              # Routes, layout, transitions, footer
    │   └── index.css            # Tailwind + design-system component layer
    ├── index.html
    └── vercel.json              # SPA rewrites for Vercel
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.19 (or ≥ 22.12) and **npm**
- **MongoDB** — local instance, Docker container, or an [Atlas](https://www.mongodb.com/atlas) cluster
- A **Stripe** account (test keys are fine for local development)
- A **Cloudinary** account (for hotel image uploads)

### 1. Clone & install

```bash
git clone https://github.com/amitmensch/premium-hotel-listings.git
cd premium-hotel-listings
```

### 2. Run the backend (API)

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev            # http://localhost:5000
```

### 3. Run the frontend (web app)

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # defaults to the local API; adjust if needed
npm run dev            # http://localhost:5173
```

Both servers must be running together. The API health check is available at
`http://localhost:5000/api/health`.

### Creating your first listing

Register as a **Host** (`I want to… List my properties`), open **Host Dashboard** from the
navbar, and publish a listing with 3–5 images.

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Description |
| -------- | ----------- |
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` or `production` (controls cookie security + error detail) |
| `FRONTEND_URL` | Allowed CORS origin + Stripe redirect base, e.g. `http://localhost:5173` |
| `BACKEND_URL` | Deployed API URL, e.g. `http://localhost:5000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` in development) |

> The scaffolded `.env` may also contain Google OAuth and Firebase keys — these are **not yet
> referenced** by the current codebase and can be safely removed.

### Frontend — `frontend/.env`

| Variable | Description |
| -------- | ----------- |
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

---

## Available Scripts

| Directory | Command | Description |
| --------- | ------- | ----------- |
| `backend` | `npm run dev` | Start API with nodemon hot-reload |
| `backend` | `npm start` | Start API in production mode |
| `frontend` | `npm run dev` | Start Vite dev server with HMR |
| `frontend` | `npm run build` | Production build into `dist/` |
| `frontend` | `npm run preview` | Preview the production build locally |
| `frontend` | `npm run lint` | Run oxlint |

---

## API Reference

All responses use a JSend-style envelope, e.g. `{ status: "success", data: { … } }`.
Cookies carry the JWT; protected endpoints require authentication.

### Health

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/health` | Liveness check |

### Auth

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/api/auth/register` | Create a user (`name`, `email`, `password`, `role`) |
| POST | `/api/auth/login` | Sign in and set JWT cookie |
| POST | `/api/auth/logout` | Clear JWT cookie |
| GET  | `/api/auth/me` | Returns the current user (protected) |

### Users

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| PATCH | `/api/users/profile` | Update name/email (protected) |
| DELETE | `/api/users/account` | Delete account + cascade bookings/reviews/hotels (protected) |

### Hotels

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/hotels` | List hotels — query: `destination`, `minPrice`, `maxPrice`, `page`, `limit` (public) |
| GET | `/api/hotels/:id` | Hotel details (public) |
| POST | `/api/hotels` | Create listing — multipart with 3–5 `images` (host/admin) |
| PATCH | `/api/hotels/:id` | Update listing (host owner/admin) |
| DELETE | `/api/hotels/:id` | Delete listing (host owner/admin) |

### Bookings

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/api/bookings/checkout-session` | Create a Stripe Checkout session (protected) |
| POST | `/api/bookings` | Create a booking (protected; checks overlapping reservations) |
| GET | `/api/bookings/my-bookings` | Current user's bookings (protected) |
| DELETE | `/api/bookings/:id` | Cancel a booking (owner only) |

### Reviews

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/hotels/:hotelId/reviews` | Reviews for a hotel (public) |
| POST | `/api/hotels/:hotelId/reviews` | Leave a 1–5 star review (protected) |
| DELETE | `/api/reviews/:id` | Delete a review (author or admin) |

---

## Booking & Payment Flow

1. A guest selects check-in/check-out dates on a property page.
2. The frontend requests a **Stripe Checkout session** from `/api/bookings/checkout-session`.
3. The backend recomputes the total price server-side (never trusting the client), creates the
   Stripe session, and redirects the guest to Stripe's hosted checkout.
4. On success, Stripe redirects to `/success` with the booking details in the query string.
5. The **PaymentSuccess** page confirms the booking via `POST /api/bookings` (guarded against
   React StrictMode double-submits) and forwards to **My Trips**.
6. Overlapping confirmed reservations are rejected server-side to prevent double-booking.

## Design System

The frontend follows a **quiet-luxury, functional-minimalist** aesthetic:

- **Palette** — a brass `brand` accent scale over warm bone neutrals and a deep warm-ink
  `ink` scale (configured in `tailwind.config.js`), replacing a louder default blue.
- **Typography** — Cormorant Garamond (serif) for display headings, Inter for UI and body text.
- **Motion** — restrained by design: `fade-up` route entrance, subtle hover lift, slow image
  zoom, shimmer skeleton loaders, and a shared `cubic-bezier(0.22, 1, 0.36, 1)` ease. All
  animation is disabled under `prefers-reduced-motion`.
- **Component layer** — reusable utility-composite classes (`card`, `input`, `label`,
  `btn-primary`, `btn-ghost`, `eyebrow`, `skeleton`, `container-page`) keep spacing, focus
  rings, and button states consistent across every page.

---

## Deployment

### Frontend (Vercel)

`frontend/vercel.json` rewrites every route to `index.html`, so SPA navigation works on any
path. Set `VITE_API_URL` to the deployed backend URL as an environment variable, then deploy:

```bash
cd frontend
npm run build
npx vercel --prod        # or import the repo in the Vercel dashboard
```

### Backend (any Node host)

Deploy `backend/` to Render, Railway, Fly.io, or similar, and set the production variables:

```bash
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url
MONGODB_URI=…
JWT_SECRET=…
STRIPE_SECRET_KEY=…
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
```

In production the JWT cookie is served with `Secure` + `SameSite=None`, and the error handler
stops leaking stack traces.

---

## Roadmap Notes

- Google OAuth and Firebase keys already exist in the environment scaffold but are not wired
  into the app — natural next integrations.
- Review ratings are stored per review; an aggregated average on hotel cards/details is a
  straightforward follow-up.
- Permission checks exist for host-owned hotel edits; an admin surface is not yet built.

---

## License

No license file is included in this repository. This project was built for demonstration and
portfolio purposes — reach out before reusing commercially.