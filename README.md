<div align="center">

# অঙ্গশ্রী · Onggoshree

**A full-stack skincare e-commerce app** — React Native (Expo) mobile client, Node.js/Express/MongoDB backend, real Skin AI analysis, and a Glow Club loyalty program.

![React Native](https://img.shields.io/badge/React%20Native-Expo-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

</div>

---

## ✨ Overview

Onggoshree is a complete, production-shaped e-commerce experience for a Bangladesh-based skincare brand — built from the ground up with a custom Expo development client, a real Express/MongoDB backend, and native device features like camera capture and secure token storage.

Every feature below is fully wired end-to-end — no mocked screens, no dead buttons.

## 📱 Features

### Shopping
- Browse products by category, with debounced live search
- Home feed with a swipeable promotional banner carousel, tap-to-play video reels, and a bestsellers strip
- Product detail pages with quantity selection and stock awareness
- Cart with live subtotal/delivery/discount calculation
- Checkout with saved, labeled delivery addresses (Home / Work / custom) or one-off manual entry

### Accounts & Auth
- Email/password registration and login (bcrypt-hashed passwords, JWT sessions)
- **Google Sign-In** (native), with automatic account linking if an email/password account already exists
- Guest browsing mode — explore the whole catalog without an account, prompted to sign in only at checkout
- Secure on-device token storage (`expo-secure-store`)

### Skin AI
- Real camera capture flow with a live preview and face-alignment guide
- Personalized routine recommendations pulled from the live product catalog

### Glow Club (loyalty)
- Earn points automatically on every order (1 point per ৳10 spent)
- Tier progression (Bronze → Silver → Radiant → Gold), computed live from points
- Real reward redemption — points are spent atomically and applied as a genuine discount at checkout

### Orders
- Server-verified pricing and stock on every order (never trusts client-submitted prices)
- Order history with live status tracking
- Transactional emails: welcome email on signup, order confirmation to the customer, new-order alert to the admin inbox

### Admin
- Role-gated admin panel (server-enforced, not just hidden UI)
- View all orders across every customer, update status, delete orders

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native, Expo (custom EAS dev client), React Navigation |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt, Google Sign-In (`@react-native-google-signin/google-signin`) |
| Media | Native camera (`expo-camera`), video playback (`expo-video`) |
| Email | Nodemailer (Gmail SMTP) |
| Hosting | Render (backend), MongoDB Atlas (database) |

## 📂 Project Structure

```
onggoshree/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route logic (products, orders, auth, admin, rewards, addresses)
│   ├── middleware/      # JWT auth guard, admin guard, error handler
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Email sender + templates
│   ├── public/          # Statically served product images & reel videos
│   └── server.js
│
└── onggoshree-app/       # Expo mobile app
    ├── src/
    │   ├── api/          # Axios client + endpoint wrappers
    │   ├── components/   # Reusable UI (ProductCard, HeroCarousel, ReelsStrip, ...)
    │   ├── constants/     # Theme tokens, banners/reels data, API config
    │   ├── context/      # Auth & Cart global state
    │   ├── navigation/   # Stack/tab navigators
    │   └── screens/      # All app screens
    └── App.js
```

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own values
npm run dev
```

**Environment variables:**

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for signing auth tokens |
| `GOOGLE_WEB_CLIENT_ID` | Google OAuth Web client ID (for ID token verification) |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail address + App Password for SMTP |
| `PORT` | Defaults to `5000` |

Seed sample products:

```bash
node seed.js
```

Promote an existing account to admin:

```bash
node makeAdmin.js someone@example.com
```

### Mobile app

```bash
cd onggoshree-app
npm install
npx expo start --dev-client
```

Update `src/constants/config.js` with your backend's URL and your Google OAuth client IDs before running.

This app uses a **custom EAS development client** (not Expo Go), since it relies on native modules (camera, secure storage, video, Google Sign-In):

```bash
eas build --profile development --platform android
```

## 🔒 Security notes

- Prices and stock are always recalculated server-side at checkout — client-submitted values are never trusted
- Passwords are hashed with bcrypt and never returned in any API response
- Admin routes are protected by server-side role middleware, not just hidden UI
- Google ID tokens are cryptographically verified against Google's servers, scoped to this app's client ID

## 📄 License

MIT
