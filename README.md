# iMovies --- Movie Ticket Booking Platform

iMovies is a full-stack movie discovery and cinema ticket-booking web
application built with React, Vite, Node.js, Express, and MongoDB. It
lets users browse movies, explore theatres and showtimes, select seats,
manage bookings, and proceed through Razorpay payment checkout.

> **Project status:** The repository contains the main application and
> payment integration. Run the tests and verify the complete payment
> flow in Razorpay Test Mode before using it in production.

## Features

-   **Movie discovery:** Browse movie listings and view movie details.
-   **Theatres and showtimes:** Backend APIs for theatres, screens, and
    showtimes.
-   **Authentication:** Register and log in; API requests support bearer
    tokens and cookies.
-   **Seat booking:** Create bookings and reserve seats through the
    backend.
-   **Payment integration:** Razorpay order creation, payment
    verification, and webhook handling.
-   **My Bookings:** View booking information from the application.
-   **Database seeding:** Scripts to insert sample movies, theatres,
    screens, and showtimes.
-   **Health endpoint:** Check API and MongoDB connectivity.

## Technology stack

### Frontend

-   React
-   Vite
-   React Router
-   Lucide React icons

### Backend

-   Node.js
-   Express
-   MongoDB with Mongoose
-   JWT authentication and bcrypt password hashing
-   Helmet, CORS, and cookie-parser
-   Razorpay SDK

## Project structure

``` text
iMovies-main/
├── src/                         # React frontend
│   ├── pages/                   # Application pages
│   ├── services/api.js           # Frontend API client
│   └── context/                 # Shared application state
├── public/                      # Static frontend assets (if present)
├── server/
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── models/               # Mongoose models
│   │   ├── routes/               # Express routes
│   │   ├── seeds/                # Sample data scripts
│   │   ├── services/             # Services, including Razorpay
│   │   ├── db.js                 # MongoDB connection
│   │   └── server.js             # API entry point
│   ├── tests/                    # Backend test scripts
│   └── .env.example              # Backend environment template
├── package.json                  # Frontend scripts/dependencies
└── README.md
```

## Prerequisites

Install the following before starting:

-   Node.js (use a current LTS version compatible with the installed
    Vite version)
-   npm (included with Node.js)
-   MongoDB locally, or a MongoDB Atlas database
-   Razorpay account and **Test Mode** API keys to test checkout

Check the installed versions:

``` bash
node --version
npm --version
```

## Environment variables

There are two environment files: one for the backend and one for the
frontend. Never commit real secrets to Git.

### 1. Backend environment

From the project root, copy the example file:

**Windows PowerShell**

``` powershell
Copy-Item server/.env.example server/.env
```

**macOS / Linux**

``` bash
cp server/.env.example server/.env
```

Edit `server/.env`:

``` dotenv
# Server
PORT=5000
NODE_ENV=development

# Frontend origin used by CORS
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/imovies

# JWT authentication — replace with a long, random secret
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

# Razorpay Test Mode credentials
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection
string. Make sure your database user and network access settings are
configured.

  ------------------------------------------------------------------------------
  Variable                    Required                Purpose
  --------------------------- ----------------------- --------------------------
  `PORT`                      No                      API server port; defaults
                                                      to `5000`.

  `NODE_ENV`                  No                      Environment such as
                                                      `development`, `test`, or
                                                      `production`.

  `CLIENT_URL`                No                      Allowed frontend origin
                                                      for CORS; defaults to
                                                      `http://localhost:5173`.

  `MONGODB_URI`               **Yes**                 MongoDB connection string.

  `LOCAL_MONGODB_URI`         No                      Optional local fallback URI
                                                      if Atlas is unreachable;
                                                      defaults to local MongoDB.

  `JWT_SECRET`                Yes for authenticated   Secret used to sign/verify
                              features                JWTs. Use a strong, unique
                                                      value.

  `JWT_EXPIRES_IN`            No                      JWT lifetime; example
                                                      `7d`.

  `RAZORPAY_KEY_ID`           For Razorpay checkout   Razorpay API key ID. Use a
                                                      Test Mode key while
                                                      developing.

  `RAZORPAY_KEY_SECRET`       For Razorpay checkout   Secret paired with the
                                                      Razorpay key ID. Keep it
                                                      server-side only.

  `RAZORPAY_WEBHOOK_SECRET`   For webhook             Secret configured for the
                              verification            Razorpay webhook endpoint.
  ------------------------------------------------------------------------------

### 2. Frontend environment

Create `.env` in the project root (next to the frontend `package.json`):

``` dotenv
VITE_API_URL=http://localhost:5000/api
```

The frontend API client uses this value and falls back to
`http://localhost:5000/api` if it is not set.

**Important:** Vite exposes `VITE_*` variables to browser code. Never
put MongoDB credentials, JWT signing secrets, Razorpay secrets, or other
private keys in the frontend `.env`.

After changing environment variables, restart the relevant development
server.

## Installation and running locally

Open a terminal in the project root (`iMovies-main`).

### 1. Install frontend dependencies

``` bash
npm install
```

### 2. Install backend dependencies

``` bash
cd server
npm install
```

Create and configure `server/.env` as described above, then return to
the project root:

``` bash
cd ..
```

Make sure MongoDB is running and `MONGODB_URI` points to the correct
database.

### 3. Start the backend

Open **Terminal 1** in the project root:

``` bash
cd server
npm run dev
```

The API should start on `http://localhost:5000` unless you configured a
different `PORT`. The server waits for a successful MongoDB connection
before listening.

Check the health endpoint in a browser:

``` text
http://localhost:5000/api/health
```

A healthy response should indicate that the API is running and the
database is connected.

### 4. Start the frontend

Open **Terminal 2** in the project root:

``` bash
npm run dev
```

Open the local URL printed by Vite, normally:

``` text
http://localhost:5173
```

The frontend and backend run in separate terminals because the root
`package.json` starts Vite, while `server/package.json` starts the
Express API.

## Seed sample data

Seed scripts are available in the backend package. Ensure `server/.env`
contains the correct `MONGODB_URI` first.

From the project root:

``` bash
cd server
npm run seed
```

This runs the movie and theatre/showtime seed scripts. The scripts are
intended to add sample data; review their behavior before running them
against any important database.

To seed only one category:

``` bash
npm run seed:movies
npm run seed:theatres
```

## Tests and production build

### Backend tests

From the project root:

``` bash
cd server
npm test
```

The test script runs the authentication, movie, theatre/showtime,
booking, and payment test files in sequence. Configure any required test
database/environment variables before running tests. Confirm the output
rather than assuming the suite passes.

### Frontend production build

From the project root:

``` bash
npm run build
```

### Frontend lint

From the project root:

``` bash
npm run lint
```

### Preview a production build locally

After a successful build:

``` bash
npm run preview
```

Use the local URL printed by Vite.

## API overview

The backend mounts these route groups under `/api`:

  -----------------------------------------------------------------------
  Route                               Purpose
  ----------------------------------- -----------------------------------
  `/api/health`                       API and database health status

  `/api/auth`                         Registration, login, current-user,
                                      and logout endpoints

  `/api/movies`                       Movie listing, details, and movie
                                      management

  `/api/theatres`                     Theatre and screen-related
                                      endpoints

  `/api/showtimes`                    Showtime endpoints

  `/api/bookings`                     Booking, seat reservation, and
                                      payment-related endpoints
  -----------------------------------------------------------------------

Check the files in `server/src/routes/` for the exact HTTP methods,
route parameters, and authorization requirements.

## Razorpay setup

1.  Sign in to the Razorpay Dashboard.
2.  Enable **Test Mode** and create or copy the test API key pair.
3.  Put the key ID and secret in `server/.env`.
4.  Configure the webhook URL to point to your publicly reachable
    backend endpoint. For local development, use a secure tunnelling
    tool if you need Razorpay to reach your machine.
5.  Set the same webhook signing secret in `RAZORPAY_WEBHOOK_SECRET`.
6.  Test successful, failed, repeated, and delayed payment events before
    enabling live payments.

Never expose `RAZORPAY_KEY_SECRET` or `RAZORPAY_WEBHOOK_SECRET` to the
frontend. Do not use live credentials until server-side verification,
seat reservation consistency, webhook idempotency, and refund/recovery
behavior have been tested.

## Troubleshooting

### MongoDB connection fails

-   Confirm MongoDB is running or Atlas is reachable.
-   Check `MONGODB_URI` in `server/.env`.
-   For Atlas, check the database user, password encoding, and
    IP/network access rules.

### Frontend cannot reach the API

-   Confirm the backend is running.
-   Check `VITE_API_URL` in the root `.env`.
-   Check `CLIENT_URL` in `server/.env` matches the frontend origin.
-   Restart Vite after editing `.env`.

### Login or authenticated requests fail

-   Check `JWT_SECRET` and `JWT_EXPIRES_IN`.
-   Inspect the browser Network tab and backend terminal for the
    response/error.
-   Verify cookies and CORS settings if using cookie-based
    authentication.

### Razorpay checkout or webhook fails

-   Confirm all Razorpay variables are in `server/.env`, not the
    frontend `.env`.
-   Verify the webhook URL and signing secret in the Razorpay Dashboard.
-   Inspect backend logs and the payment response. A frontend success
    screen alone is not proof of a verified payment.

### Port already in use

-   Change `PORT` in `server/.env` for the backend.
-   If Vite selects a different frontend port, update `CLIENT_URL`
    accordingly.

## Security notes

-   Do not commit `.env` files or secrets.
-   Use strong, unique secrets in production.
-   Use HTTPS in production.
-   Restrict CORS to the real frontend origin.
-   Keep Razorpay secrets on the server.
-   Test booking concurrency, seat-hold expiry, cancellation, payment
    verification, and webhook retries.
-   Back up production data and use a separate database for tests.
-   Review authentication, authorization, rate limiting, logging, and
    deployment configuration before public release.

## Deployment checklist

-   [ ] Configure production MongoDB and restrict database access.
-   [ ] Set production environment variables in the hosting provider's
    secret manager.
-   [ ] Set `CLIENT_URL` to the deployed frontend origin.
-   [ ] Set `VITE_API_URL` to the deployed backend API URL and rebuild
    the frontend.
-   [ ] Configure HTTPS and the Razorpay webhook endpoint.
-   [ ] Run backend tests and frontend build.
-   [ ] Verify registration, login, movie browsing, showtimes, seat
    booking, payment verification, and booking history.
-   [ ] Check logs and health endpoint after deployment.

## Contributing

1.  Create a branch for your change.
2.  Keep changes focused and avoid committing secrets or generated
    files.
3.  Run the relevant tests and frontend build.
4.  Describe what changed and how it was tested in your pull request.

## License

No license is specified in this repository yet. Add a `LICENSE` file
before distributing the project if you intend to publish it for reuse.
